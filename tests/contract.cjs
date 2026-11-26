'use strict';
const assert = require('node:assert/strict');
const {test} = require('node:test');
const checker = require('../dist/app/checker.js');
const contract = require('../dist/app/cases.json');
for (const c of contract.cases) {
  test(`${c.id} ${c.label}`, () => {
    if (c.id === 'T8') {
      const before = checker.bookings();
      assert.deepEqual(before, contract.bookings);
      for (const input of contract.cases.slice(0,7)) checker.check(input);
      assert.deepEqual(checker.bookings(), before);
    } else {
      const result = checker.check(c);
      assert.equal(result.code,c.expect);
      assert.equal(result.available,c.expect === 'AVAILABLE');
      assert.ok(result.message.length>0);
    }
  });
}
for (const [label,start,duration,blocked,expected] of [
  ['exactly 09:00','09:00',1,false,'NOT_FUTURE'],
  ['exactly 120 minutes','11:00',120,false,'AVAILABLE'],
  ['touch before 10:00','09:30',30,false,'AVAILABLE'],
  ['one minute of overlap','09:31',30,false,'OVERLAP'],
  ['fraction','12:00',0.5,false,'INVALID_INTERVAL'],
  ['blank time','',20,false,'INVALID_INTERVAL'],
  ['blank duration','12:00','',false,'INVALID_INTERVAL'],
  ['malformed time','hello',20,false,'INVALID_INTERVAL'],
  ['cannot cross midnight','23:50',11,false,'INVALID_INTERVAL'],
  ['may end at midnight','23:50',10,false,'AVAILABLE'],
  ['blocked overrides overlap','10:01',1,true,'BLOCKED']]) {
  test(label,()=>assert.equal(checker.check({start,duration,blocked}).code,expected));
}
