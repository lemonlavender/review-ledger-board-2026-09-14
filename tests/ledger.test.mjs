import test from 'node:test';
import assert from 'node:assert/strict';
import {validateLedger, summarize, toMarkdown} from '../src/ledger.mjs';

const item = (id, verdict = 'needs-evidence') => ({threadId:id,threadState:'resolved',verdict,reason:'Evidence gap',evidence:{origin:'supplied',commit:'old',command:null,result:'Older test passed'},nextAction:'Check current source'});
const ledger = () => ({schemaVersion:1,repository:null,pullRequest:42,reviewedHead:'head',headRecheck:'unavailable',items:[item('R17','still-present'),item('R18','verified-fixed'),item('R19')]});
test('summarizes technical verdicts without trusting resolved state',()=>{
  const s=summarize(validateLedger(ledger()));
  assert.equal(s.total,3);assert.equal(s.attention,2);assert.equal(s.verified,1);assert.equal(s.independentlyExecuted,0);
});
test('rejects duplicate IDs, invalid verdicts and ambiguous evidence',()=>{
  for(const transform of [v=>v.items.push(item('R17')),v=>v.items[0].verdict='fine',v=>delete v.items[0].evidence.origin,v=>v.items[0].evidence.command=42,v=>v.items[0].nextAction='']){
    const v=ledger();transform(v);assert.throws(()=>validateLedger(v));
  }
});
test('marks changed heads separately and requires latest revision',()=>{
  const v=ledger();v.headRecheck='changed';assert.throws(()=>validateLedger(v));v.latestHead='new';assert.equal(summarize(validateLedger(v)).stale,true);
});
test('does not fabricate missing identity, command or line',()=>{
  const v=validateLedger(ledger());assert.equal(v.repository,null);assert.equal(v.items[0].evidence.command,null);
  const md=toMarkdown(v);assert.match(md,/not provided/);assert.ok(!md.includes('npm test'));assert.match(md,/supplied/);
});
test('exports untrusted text as text, prevents Markdown link injection',()=>{
  const v=ledger();v.items[0].reason='[click](https://example.invalid) <script>alert(1)</script>';
  const md=toMarkdown(validateLedger(v));assert.ok(md.includes('\\[click\\]'));assert.ok(!md.includes('<script>'));
});
test('rejects invalid containers, excessive counts and oversized text',()=>{
  for(const v of [null,[],{}, {...ledger(),items:[...Array(501)].map((_,i)=>item(String(i)))}, {...ledger(),items:[{...item('R1'),reason:'x'.repeat(20001)}]}]) assert.throws(()=>validateLedger(v));
});
