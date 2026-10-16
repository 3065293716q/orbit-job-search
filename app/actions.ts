'use server';

import { env } from 'cloudflare:workers';
import { revalidatePath } from 'next/cache';
import { getChatGPTUser } from './chatgpt-auth';
import { currentGoalPeriod, ensureDatabase, ensureGoalCalendar, ensureGoals } from '../db/queries';

async function uid(){const user=await getChatGPTUser();if(!user)throw new Error('请先登录。');return user.userId;}
const v=(f:FormData,k:string)=>String(f.get(k)??'').trim();
const statuses=new Set(['待跟进','重点关注','已投递','笔/面试','拒绝','Offer']);
const status=(f:FormData)=>statuses.has(v(f,'status'))?v(f,'status'):'待跟进';

export async function addApplication(f:FormData){const userId=await uid();await ensureDatabase();const company=v(f,'company'),role=v(f,'role');if(!company||!role)return;const now=new Date().toISOString();await env.DB.prepare('INSERT INTO applications (user_id,company,role,location,url,status,priority,contact,next_action,follow_up_date,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(userId,company,role,v(f,'location'),v(f,'url'),'待跟进',v(f,'priority')||'A',v(f,'contact'),v(f,'nextAction')||'核验具体 JD',v(f,'followUpDate'),v(f,'notes'),now,now).run();revalidatePath('/');}
export async function updateApplication(f:FormData){const userId=await uid();await ensureDatabase();const id=Number(f.get('id'));if(!Number.isFinite(id))return;await env.DB.prepare('UPDATE applications SET url=?,status=?,priority=?,contact=?,next_action=?,follow_up_date=?,notes=?,updated_at=? WHERE id=? AND user_id=?').bind(v(f,'url'),status(f),v(f,'priority'),v(f,'contact'),v(f,'nextAction'),v(f,'followUpDate'),v(f,'notes'),new Date().toISOString(),id,userId).run();revalidatePath('/');}
export async function deleteApplication(f:FormData){const userId=await uid();const id=Number(f.get('id'));if(!Number.isFinite(id))return;await env.DB.prepare('DELETE FROM applications WHERE id=? AND user_id=?').bind(id,userId).run();revalidatePath('/');}
export async function completeGoal(f:FormData){const userId=await uid();await ensureGoals(userId);await ensureGoalCalendar();const id=Number(f.get('id')),cadence=v(f,'cadence');if(!Number.isFinite(id)||!cadence)return;const period=currentGoalPeriod(cadence);await env.DB.batch([env.DB.prepare('UPDATE action_goals SET done=1,completed_period=? WHERE id=? AND user_id=?').bind(period,id,userId),env.DB.prepare('INSERT OR IGNORE INTO goal_completions (user_id,goal_id,period) VALUES (?,?,?)').bind(userId,id,period)]);revalidatePath('/');}
