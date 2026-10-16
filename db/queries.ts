import { env } from 'cloudflare:workers';
import { curatedOpportunities } from '../app/catalog';

export type Application = { id:number; company:string; role:string; location:string; url:string; status:string; priority:string; contact:string; nextAction:string; followUpDate:string; notes:string; createdAt:string; updatedAt:string; };
const schemaSql = `CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT NOT NULL,company TEXT NOT NULL,role TEXT NOT NULL,location TEXT NOT NULL DEFAULT '',url TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT '待跟进',priority TEXT NOT NULL DEFAULT 'A',contact TEXT NOT NULL DEFAULT '',next_action TEXT NOT NULL DEFAULT '核验具体 JD',follow_up_date TEXT NOT NULL DEFAULT '',notes TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL,updated_at TEXT NOT NULL)`;

export async function ensureDatabase(){await env.DB.prepare(schemaSql).run();await env.DB.batch([env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications(user_id,status)'),env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_applications_user_follow_up ON applications(user_id,follow_up_date)')]);}

export type Goal={id:number;cadence:string;title:string;details:string;done:number};
const defaultGoals:[string,string,string][]=[
  ['每日','处理求职事项','记录投递、联系与后续行动。'],
  ['每周','复盘求职进度','检查本周进展并调整下周目标。'],
];

function chicagoDay(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=(type:string)=>parts.find(p=>p.type===type)?.value??'';return `${get('year')}-${get('month')}-${get('day')}`;}
export function currentGoalPeriod(cadence:string){const day=chicagoDay();if(cadence==='每日')return day;const date=new Date(`${day}T12:00:00Z`);date.setUTCDate(date.getUTCDate()-((date.getUTCDay()+6)%7));return date.toISOString().slice(0,10);}
async function ensureGoalColumns(){const info=await env.DB.prepare('PRAGMA table_info(action_goals)').all<{name:string}>();if(!info.results.some(c=>c.name==='completed_period'))await env.DB.prepare(`ALTER TABLE action_goals ADD COLUMN completed_period TEXT NOT NULL DEFAULT ''`).run();}

export async function ensureGoals(userId:string){
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS action_goals (id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT NOT NULL,cadence TEXT NOT NULL,title TEXT NOT NULL,details TEXT NOT NULL DEFAULT '',done INTEGER NOT NULL DEFAULT 0,completed_period TEXT NOT NULL DEFAULT '')`).run();
  await ensureGoalColumns();
  const existing=await env.DB.prepare('SELECT id FROM action_goals WHERE user_id=? ORDER BY id').bind(userId).all<{id:number}>();
  if(!existing.results.length) await env.DB.batch(defaultGoals.map(g=>env.DB.prepare('INSERT INTO action_goals (user_id,cadence,title,details) VALUES (?,?,?,?)').bind(userId,...g)));
}

export async function listGoals(userId:string){const rows=await env.DB.prepare('SELECT id,cadence,title,details,done,completed_period AS completedPeriod FROM action_goals WHERE user_id=? ORDER BY id').bind(userId).all<Goal&{completedPeriod:string}>();return rows.results.map(g=>({...g,done:g.done&&g.completedPeriod===currentGoalPeriod(g.cadence)?1:0}));}

export type CalendarDay={date:string;completed:number;total:number};
export async function ensureGoalCalendar(){await env.DB.prepare(`CREATE TABLE IF NOT EXISTS goal_completions (user_id TEXT NOT NULL,goal_id INTEGER NOT NULL,period TEXT NOT NULL,PRIMARY KEY (user_id,goal_id,period))`).run();}
export async function listGoalCalendar(userId:string,goals:Goal[]):Promise<CalendarDay[]>{
  await ensureGoalCalendar();
  const daily=goals.filter(g=>g.cadence==='每日');
  const today=chicagoDay(); const [year,month]=today.split('-').map(Number); const last=new Date(Date.UTC(year,month,0)).getUTCDate();
  const start=`${year}-${String(month).padStart(2,'0')}-01`,end=`${year}-${String(month).padStart(2,'0')}-${String(last).padStart(2,'0')}`;
  const result=await env.DB.prepare('SELECT period,COUNT(*) AS completed FROM goal_completions WHERE user_id=? AND period>=? AND period<=? GROUP BY period').bind(userId,start,end).all<{period:string;completed:number}>();
  const counts=new Map(result.results.map(row=>[row.period,Number(row.completed)]));
  if(daily.length && goals.filter(g=>g.cadence==='每日'&&g.done).length) counts.set(today,goals.filter(g=>g.cadence==='每日'&&g.done).length);
  return Array.from({length:last},(_,i)=>{const date=`${year}-${String(month).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`;return {date,completed:counts.get(date)??0,total:daily.length};});
}

export async function listApplications(userId:string):Promise<Application[]>{const result=await env.DB.prepare(`SELECT id,company,role,location,url,status,priority,contact,next_action AS nextAction,follow_up_date AS followUpDate,notes,created_at AS createdAt,updated_at AS updatedAt FROM applications WHERE user_id=? ORDER BY CASE priority WHEN 'A' THEN 1 WHEN 'B' THEN 2 ELSE 3 END,updated_at DESC`).bind(userId).all<Application>();return result.results;}
