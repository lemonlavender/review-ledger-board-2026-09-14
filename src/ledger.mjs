export const VERDICTS = ['verified-fixed','still-present','needs-evidence','obsolete','false-positive'];
const origins = ['executed','supplied','unavailable'];
function object(v, name) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error(`${name}: expected an object`);
}
function text(v, name, nullable = false) {
  if (nullable && v === null) return;
  if (typeof v !== 'string' || !v.trim() || v.length > 20000) throw new Error(`${name}: expected non-empty text, at most 20000 characters`);
}
export function validateLedger(value) {
  object(value,'ledger');
  if(value.schemaVersion !== 1) throw new Error('schemaVersion must be 1');
  text(value.repository,'repository',true);
  if(value.pullRequest !== null && (!Number.isSafeInteger(value.pullRequest)||value.pullRequest<1)) throw new Error('pullRequest must be a positive integer or null');
  text(value.reviewedHead,'reviewedHead',true);
  if(!['unchanged','changed','unavailable'].includes(value.headRecheck)) throw new Error('headRecheck must be unchanged, changed or unavailable');
  if(value.headRecheck === 'changed') text(value.latestHead,'latestHead');
  if(!Array.isArray(value.items)||value.items.length>500) throw new Error('items must be an array with at most 500 entries');
  const ids=new Set();
  value.items.forEach((i,n)=>{
    const p=`items[${n}]`;object(i,p);text(i.threadId,p+'.threadId');
    if(ids.has(i.threadId)) throw new Error(`Duplicate threadId: ${i.threadId}`);ids.add(i.threadId);
    text(i.threadState,p+'.threadState');
    if(!VERDICTS.includes(i.verdict)) throw new Error(p+': unsupported verdict');
    text(i.reason,p+'.reason');text(i.nextAction,p+'.nextAction');object(i.evidence,p+'.evidence');
    if(!origins.includes(i.evidence.origin)) throw new Error(p+': unsupported evidence origin');
    for(const key of ['commit','command','result']) text(i.evidence[key],p+'.evidence.'+key,true);
    if(i.path !== undefined) text(i.path,p+'.path',true);
    if(i.line !== undefined && i.line !== null && (!Number.isSafeInteger(i.line)||i.line<1)) throw new Error(p+': line must be positive or null');
  });
  return value;
}
export function summarize(v) {
  const counts=Object.fromEntries(VERDICTS.map(x=>[x,0]));
  v.items.forEach(i=>counts[i.verdict]++);
  return {total:v.items.length,attention:counts['still-present']+counts['needs-evidence'],verified:counts['verified-fixed'],independentlyExecuted:v.items.filter(i=>i.evidence.origin==='executed').length,stale:v.headRecheck==='changed',counts};
}
function escapeMarkdown(v) {
  return String(v??'not provided').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replace(/[\\`*_{}\[\]()#+.!|~-]/g,'\\$&').replaceAll('\n',' ');
}
export function toMarkdown(v) {
  const s=summarize(v);const esc=escapeMarkdown;
  const lines=['# Review evidence handoff','',`Repository: ${esc(v.repository)} · PR: ${esc(v.pullRequest)}`,`Reviewed revision: ${esc(v.reviewedHead)} · Head recheck: ${esc(v.headRecheck)}`];
  if(s.stale)lines.push(`STALE: latest head ${esc(v.latestHead)} needs rechecking.`);
  lines.push('',`${s.total} findings · ${s.attention} need attention · ${s.independentlyExecuted} have executed evidence.`, '', '| Thread | UI state | Technical verdict | Evidence origin | Evidence commit | Next action |','| --- | --- | --- | --- | --- | --- |');
  for(const i of v.items)lines.push(`| ${esc(i.threadId)} | ${esc(i.threadState)} | ${esc(i.verdict)} | ${esc(i.evidence.origin)} | ${esc(i.evidence.commit)} | ${esc(i.nextAction)} |`);
  for(const i of v.items)lines.push('',`## ${esc(i.threadId)}`,`${esc(i.reason)}`,`Command: ${esc(i.evidence.command)}`,`Result: ${esc(i.evidence.result)}`);
  return lines.join('\n')+'\n';
}
