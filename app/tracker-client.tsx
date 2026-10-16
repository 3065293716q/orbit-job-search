'use client';

import { useState } from 'react';
import type { Application, CalendarDay, Goal } from '../db/queries';
import { addApplication, completeGoal, deleteApplication, updateApplication } from './actions';

const S = ['待跟进', '重点关注', '已投递', '笔/面试', '拒绝', 'Offer'];
const US_LOCATION = /\b(USA|US|United States|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming|San Francisco|Houston|Boston|Los Angeles|San Antonio|Boulder|Redlands|Seattle|Austin|Chicago)\b|\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MI|MN|MO|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|VT|WA|WI|WV|WY)\b/i;
const isPending = (a: Application) => a.status === '待跟进';
const statusClass = (status: string) => ({'待跟进':'pending','重点关注':'focus','已投递':'applied','笔/面试':'interview','拒绝':'rejected','Offer':'offer'}[status] ?? 'pending');

export default function TrackerClient({ applications, goals, calendar, displayName }: { applications: Application[]; goals: Goal[]; calendar: CalendarDay[]; displayName: string }) {
  const [m, setM] = useState('总揽');
  const [tab, setTab] = useState('机会');
  const [q, setQ] = useState('');
  const [place, setPlace] = useState('');
  const [kind, setKind] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');
  const country = (a: Application) => a.location.includes('中国') ? '中国' : US_LOCATION.test(a.location) ? '美国' : '其他';
  const matchesStatus = (a: Application) => statusFilter === '全部' || (statusFilter === '面试 / Offer' ? ['笔/面试', 'Offer'].includes(a.status) : a.status === statusFilter);
  const all = applications.filter(a => (m === '总揽' || country(a) === m) && `${a.company} ${a.role}`.toLowerCase().includes(q.toLowerCase()) && (!place || a.location.toLowerCase().includes(place.toLowerCase())) && (kind === '全部' || a.notes.includes(kind)) && matchesStatus(a));
  const inMarket = applications.filter(a => m === '总揽' || country(a) === m);
  const chooseMarket = (market: string) => { setM(market); setStatusFilter('全部'); };

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brandMark">O</span>Orbit</div>
      <nav>
        <button onClick={() => { setTab('机会'); chooseMarket('总揽'); }}>总揽</button>
        <button onClick={() => { setTab('机会'); chooseMarket('美国'); }}>美国求职</button>
        <button onClick={() => { setTab('机会'); chooseMarket('中国'); }}>中国求职</button>
        <button onClick={() => { setTab('机会'); chooseMarket('其他'); }}>其他求职</button>
        <button onClick={() => setTab('进度')}>求职进度</button>
      </nav>
      <details className="account"><summary><strong>{displayName}</strong></summary><a href="/signout-with-chatgpt?return_to=/">退出登录</a></details>
    </aside>
    <section className="content">
      {tab === '机会' ? <>
        <header className="topbar">
          <p className="eyebrow">{m === '总揽' ? '中美机会总览' : m + '求职'}</p>
          <details className="addBox"><summary className="primary">＋ 添加机会</summary><form action={addApplication} className="addForm"><input name="company" placeholder="公司 *" required /><input name="role" placeholder="职位 *" required /><input name="location" placeholder="地点" /><input name="url" placeholder="投递链接" /><textarea name="notes" placeholder="行业、JD 与要求" /><button className="dark">保存</button></form></details>
        </header>
        <div className="metrics">
          <article className={statusFilter === '全部' ? 'metricButton selected' : 'metricButton'} onClick={() => setStatusFilter('全部')}><span>{m === '总揽' ? '机会总数' : m + '机会'}</span><strong>{inMarket.length}</strong></article>
          <article className={statusFilter === '已投递' ? 'metricButton selected' : 'metricButton'} onClick={() => setStatusFilter('已投递')}><span>已投递</span><strong>{inMarket.filter(a => a.status === '已投递').length}</strong></article>
          <article className={statusFilter === '面试 / Offer' ? 'metricButton selected' : 'metricButton'} onClick={() => setStatusFilter('面试 / Offer')}><span>笔/面试 / Offer</span><strong>{inMarket.filter(a => a.status === '笔/面试').length} / {inMarket.filter(a => a.status === 'Offer').length}</strong></article>
          <article className={statusFilter === '待跟进' ? 'metricButton selected' : 'metricButton'} onClick={() => setStatusFilter('待跟进')}><span>待跟进</span><strong>{inMarket.filter(isPending).length}</strong></article>
        </div>
        <section className="panel">
          <div className="panelHead"><div><p className="eyebrow">OPPORTUNITIES</p><h2>求职机会</h2></div><div className="filters"><input placeholder="公司或职位" value={q} onChange={e => setQ(e.target.value)} /><input placeholder="地区" value={place} onChange={e => setPlace(e.target.value)} /><select value={kind} onChange={e => setKind(e.target.value)}><option>全部</option><option>AI</option><option>数据</option><option>航天</option><option>遥感</option><option>能源</option></select><select aria-label="申请状态筛选" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>全部</option><option>待跟进</option>{S.map(s => <option key={s}>{s}</option>)}</select></div></div>
          {all.map(a => <details className="opportunityCard" key={a.id}>
            <summary className="opportunity"><div className="companyIcon">{a.company[0]}</div><div className="opportunityMain"><strong>{a.company}</strong><span>{a.role}</span><small>{a.location} · 下一步：了解 JD</small></div><span className={`pill status-${statusClass(a.status)}`}>{a.status}</span></summary>
            <div className="detailBrief"><p>{a.notes || '待补充公司信息、JD与资格。'}</p>{a.url && <a className="dark inline" href={a.url} target="_blank">打开投递网址</a>}</div>
            <form action={updateApplication} className="editForm"><input type="hidden" name="id" value={a.id} /><select name="status" defaultValue={a.status}>{S.map(s => <option key={s}>{s}</option>)}</select><input name="url" placeholder="投递链接" defaultValue={a.url} /><input name="contact" placeholder="联系人" defaultValue={a.contact} /><input name="followUpDate" type="date" defaultValue={a.followUpDate} /><textarea name="notes" defaultValue={a.notes} /><button className="dark">保存更新</button><button className="delete" formAction={deleteApplication}>删除</button></form>
          </details>)}
          {all.length === 0 && <p className="empty">没有符合当前筛选的机会。</p>}
        </section>
      </> : <section className="panel">
        <p className="eyebrow">SEPTEMBER ACTION PLAN</p>
        <h2>9 月具体任务</h2>
        <p className="panelSub">每日任务在芝加哥时间次日自动刷新。日历会保留本月每天的完成记录。</p>
        <div className="goalList">
          {goals.map(g => <div className={g.done ? 'goal done' : 'goal'} key={g.id}>
            <div><span className="goalCadence">{g.cadence}</span><strong>{g.title}</strong><p>{g.details}</p></div>
            <form action={completeGoal}><input type="hidden" name="id" value={g.id} /><input type="hidden" name="cadence" value={g.cadence} /><button className={g.done ? 'goalComplete' : 'dark'} disabled={!!g.done}>{g.done ? '已完成' : '完成'}</button></form>
          </div>)}
        </div>
        <section className="calendarPanel" aria-label="9 月每日目标完成日历">
          <div className="calendarHead"><div><p className="eyebrow">DAILY PROGRESS</p><h3>本月完成日历</h3></div><span>每天 2 项目标</span></div>
          <div className="weekdays">{['一','二','三','四','五','六','日'].map(day=><span key={day}>{day}</span>)}</div>
          <div className="calendarGrid">{Array.from({length:(new Date(`${calendar[0]?.date ?? '2026-09-01'}T12:00:00`).getDay()+6)%7},(_,i)=><span className="calendarBlank" key={`blank-${i}`}/>)}{calendar.map(day=>{const n=Number(day.date.slice(-2));const complete=day.total>0&&day.completed>=day.total;const partial=day.completed>0&&!complete;return <div key={day.date} className={`calendarDay ${complete?'complete':partial?'partial':''}`}><strong>{n}</strong><small>{day.completed}/{day.total}</small></div>})}</div>
        </section>
      </section>}
    </section>
  </main>;
}
