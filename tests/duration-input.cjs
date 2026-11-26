'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const schema = require('../dist/app/atlas-form.json');
const checker = require('../dist/app/checker.js');
const field = schema.components[0].columns[1].components[0];
const parser = schema.components.find(c => c.key === 'durationMinutes');
test('native duration input preserves the raw text for validation',()=>{
  assert.equal(field.type,'textfield');
  assert.equal(field.decimalLimit,undefined);
  assert.ok(JSON.stringify(schema.components.find(c=>c.key==='reasonCode').calculateValue).includes('data.durationMinutes'));
});
for(const [raw,parsed] of [['120.00001',120.00001],['1e2',-1],['120',120],['1.5',1.5],['',-1],['abc',-1]]){
  test('native duration parser preserves or rejects '+JSON.stringify(raw),()=>{
    const context={data:{duration:raw},value:undefined};
    vm.runInNewContext(parser.calculateValue,context);
    assert.equal(context.value,parsed);
    if(['120.00001','1e2'].includes(raw))assert.equal(checker.check({start:'12:00',duration:raw,blocked:false}).code,'INVALID_INTERVAL');
  });
}
