> Historical text snapshot. The current runnable files, PDF and screenshots are now stored directly in this repository. Follow README.md for setup and CRITERIA_CHECKLIST.md for the submission map.

# Practice 12 source export

Verified and published from Bolt project https://bolt.new/~/sb1-rc7hzhwx

Live Bolt demo https://smart-campus-room-av-k08l.bolt.host/practice12.html

Recreate each file at its heading path. Download the full offline HTML from the demo Source tab for a self-contained copy with the licensed runtime bundles.

## app/atlas-form.json

```text
{
  "display": "form",
  "type": "form",
  "title": "Atlas 204 room checker",
  "name": "atlas204",
  "path": "atlas204",
  "components": [
    {
      "type": "columns",
      "key": "request",
      "label": "Request",
      "input": false,
      "columns": [
        {
          "width": 6,
          "currentWidth": 6,
          "size": "md",
          "components": [
            {
              "label": "Start time",
              "placeholder": "HH:MM",
              "applyMaskOn": "change",
              "autocomplete": "off",
              "tableView": false,
              "defaultValue": "12:00",
              "validateWhenHidden": false,
              "key": "start",
              "type": "textfield",
              "input": true,
              "inputType": "time"
            }
          ],
          "offset": 0,
          "push": 0,
          "pull": 0
        },
        {
          "width": 6,
          "currentWidth": 6,
          "size": "md",
          "components": [
            {
              "type": "number",
              "key": "duration",
              "label": "Duration (min)",
              "input": true,
              "tableView": false,
              "defaultValue": 45,
              "delimiter": false,
              "decimalLimit": 4,
              "allowNegative": true
            }
          ],
          "offset": 0,
          "push": 0,
          "pull": 0
        }
      ],
      "tableView": false
    },
    {
      "type": "checkbox",
      "key": "roomBlocked",
      "label": "Room blocked for maintenance",
      "input": true,
      "tableView": false,
      "defaultValue": false
    },
    {
      "type": "hidden",
      "key": "demoClock",
      "label": "demoClock",
      "input": true,
      "tableView": false,
      "persistent": false,
      "defaultValue": 540
    },
    {
      "type": "hidden",
      "key": "firstStart",
      "label": "firstStart",
      "input": true,
      "tableView": false,
      "persistent": false,
      "defaultValue": 600
    },
    {
      "type": "hidden",
      "key": "firstEnd",
      "label": "firstEnd",
      "input": true,
      "tableView": false,
      "persistent": false,
      "defaultValue": 660
    },
    {
      "type": "hidden",
      "key": "secondStart",
      "label": "secondStart",
      "input": true,
      "tableView": false,
      "persistent": false,
      "defaultValue": 870
    },
    {
      "type": "hidden",
      "key": "secondEnd",
      "label": "secondEnd",
      "input": true,
      "tableView": false,
      "persistent": false,
      "defaultValue": 930
    },
    {
      "type": "hidden",
      "key": "startMinute",
      "label": "startMinute",
      "input": true,
      "tableView": false,
      "persistent": false,
      "calculateValue": "const m = /^(\\d{2}):(\\d{2})$/.exec(String(data.start || '').trim());\nvalue = m && Number(m[1]) < 24 && Number(m[2]) < 60 ? Number(m[1]) * 60 + Number(m[2]) : -1;"
    },
    {
      "type": "hidden",
      "key": "reasonCode",
      "label": "reasonCode",
      "input": true,
      "tableView": false,
      "persistent": false,
      "calculateValue": {
        "if": [
          {
            "or": [
              {
                "<": [
                  {
                    "var": "data.startMinute"
                  },
                  0
                ]
              },
              {
                "<=": [
                  {
                    "var": "data.duration"
                  },
                  0
                ]
              },
              {
                "!=": [
                  {
                    "%": [
                      {
                        "var": "data.duration"
                      },
                      1
                    ]
                  },
                  0
                ]
              },
              {
                ">": [
                  {
                    "+": [
                      {
                        "var": "data.startMinute"
                      },
                      {
                        "var": "data.duration"
                      }
                    ]
                  },
                  1440
                ]
              }
            ]
          },
          "INVALID_INTERVAL",
          {
            "<=": [
              {
                "var": "data.startMinute"
              },
              {
                "var": "data.demoClock"
              }
            ]
          },
          "NOT_FUTURE",
          {
            ">": [
              {
                "var": "data.duration"
              },
              120
            ]
          },
          "TOO_LONG",
          {
            "var": "data.roomBlocked"
          },
          "BLOCKED",
          {
            "or": [
              {
                "and": [
                  {
                    "<": [
                      {
                        "var": "data.startMinute"
                      },
                      {
                        "var": "data.firstEnd"
                      }
                    ]
                  },
                  {
                    ">": [
                      {
                        "+": [
                          {
                            "var": "data.startMinute"
                          },
                          {
                            "var": "data.duration"
                          }
                        ]
                      },
                      {
                        "var": "data.firstStart"
                      }
                    ]
                  }
                ]
              },
              {
                "and": [
                  {
                    "<": [
                      {
                        "var": "data.startMinute"
                      },
                      {
                        "var": "data.secondEnd"
                      }
                    ]
                  },
                  {
                    ">": [
                      {
                        "+": [
                          {
                            "var": "data.startMinute"
                          },
                          {
                            "var": "data.duration"
                          }
                        ]
                      },
                      {
                        "var": "data.secondStart"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          "OVERLAP",
          "AVAILABLE"
        ]
      }
    },
    {
      "type": "hidden",
      "key": "available",
      "label": "available",
      "input": true,
      "tableView": false,
      "persistent": false,
      "calculateValue": {
        "===": [
          {
            "var": "data.reasonCode"
          },
          "AVAILABLE"
        ]
      }
    },
    {
      "type": "textfield",
      "key": "message",
      "label": "Decision message",
      "input": true,
      "tableView": false,
      "disabled": true,
      "calculateValue": {
        "if": [
          {
            "===": [
              {
                "var": "data.reasonCode"
              },
              "AVAILABLE"
            ]
          },
          "The room is free for this interval.",
          {
            "===": [
              {
                "var": "data.reasonCode"
              },
              "OVERLAP"
            ]
          },
          "This interval overlaps an existing booking.",
          {
            "===": [
              {
                "var": "data.reasonCode"
              },
              "BLOCKED"
            ]
          },
          "The room is blocked for maintenance.",
          {
            "===": [
              {
                "var": "data.reasonCode"
              },
              "TOO_LONG"
            ]
          },
          "Use a duration of 120 minutes or less.",
          {
            "===": [
              {
                "var": "data.reasonCode"
              },
              "NOT_FUTURE"
            ]
          },
          "Choose a start time after the 09:00 demo clock.",
          "Enter a valid time and a positive whole number of minutes. Finish by 24:00."
        ]
      }
    }
  ]
}
```

## app/booking-rules.js

```text
(function () {
  'use strict';

  const CURRENT_TIME = 540;

  function parseTime(value) {
    if (typeof value !== 'string') return NaN;
    const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
    if (!match) return NaN;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (minutes > 59 || hours > 24 || (hours === 24 && minutes !== 0)) return NaN;
    return hours * 60 + minutes;
  }

  function formatTime(minutes) {
    return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
  }

  function checkAvailability({ start, end, now = CURRENT_TIME, room }) {
    const unavailable = (code, reason) => ({ available: false, decision: 'Unavailable', code, reason });
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end > 1440 || start >= end) {
      return unavailable('INVALID_INTERVAL', 'Enter a valid time range: 00:00 to 24:00, with the end after the start.');
    }
    if (!Number.isInteger(now) || now < 0 || now > 1440) {
      return unavailable('INVALID_NOW', 'The supplied current time must be within the same day.');
    }
    if (start <= now) return unavailable('NOT_FUTURE', 'Start time must be later than the demo clock (' + formatTime(now) + ').');
    if (end - start > 120) return unavailable('TOO_LONG', 'The maximum duration is 120 minutes. This request is ' + (end - start) + ' minutes.');
    if (!room || !Array.isArray(room.bookings)) return unavailable('NO_ROOM', 'Select a valid room.');
    if (room.blocked) return unavailable('BLOCKED', 'This room is blocked for maintenance. Choose another room.');
    const conflict = room.bookings.find(booking => start < booking.end && end > booking.start);
    if (conflict) return unavailable('OVERLAP', 'This time overlaps an existing booking (' + formatTime(conflict.start) + ' to ' + formatTime(conflict.end) + ').');
    return { available: true, decision: 'Available', code: 'AVAILABLE', reason: 'The room is free for this ' + (end - start) + '-minute interval. No booking has been created.' };
  }

  const api = { CURRENT_TIME, parseTime, formatTime, checkAvailability };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.CampusBookingRules = api;
})();

```

## app/cases.json

```text
{
  "clock": "09:00",
  "room": "Atlas 204",
  "bookings": [
    [
      600,
      660
    ],
    [
      870,
      930
    ]
  ],
  "cases": [
    {
      "id": "T1",
      "label": "Free interval",
      "start": "12:00",
      "duration": 45,
      "blocked": false,
      "expect": "AVAILABLE"
    },
    {
      "id": "T2",
      "label": "Partial overlap",
      "start": "10:30",
      "duration": 45,
      "blocked": false,
      "expect": "OVERLAP"
    },
    {
      "id": "T3",
      "label": "Blocked room",
      "start": "12:00",
      "duration": 45,
      "blocked": true,
      "expect": "BLOCKED"
    },
    {
      "id": "T4",
      "label": "Zero minutes",
      "start": "12:00",
      "duration": 0,
      "blocked": false,
      "expect": "INVALID_INTERVAL"
    },
    {
      "id": "T5",
      "label": "Over the limit",
      "start": "12:00",
      "duration": 121,
      "blocked": false,
      "expect": "TOO_LONG"
    },
    {
      "id": "T6",
      "label": "Before the clock",
      "start": "08:45",
      "duration": 30,
      "blocked": false,
      "expect": "NOT_FUTURE"
    },
    {
      "id": "T7",
      "label": "Touches 11:00 end",
      "start": "11:00",
      "duration": 30,
      "blocked": false,
      "expect": "AVAILABLE"
    },
    {
      "id": "T8",
      "label": "Read-only bookings",
      "action": "repeat T1\u2013T7 and compare both booking intervals, all values and their order before/after",
      "expect": "UNCHANGED"
    }
  ]
}

```

## app/checker.js

```text
(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const rules = node ? require('./booking-rules.js') : root.CampusBookingRules;
  const fixtures = node ? require('./fixtures.js') : root.CampusFixtures;
  const room = fixtures.ROOMS.find(item => item.id === 'atlas');
  const messages = {
    AVAILABLE: 'The room is free for this interval.',
    OVERLAP: 'This interval overlaps an existing booking.',
    BLOCKED: 'The room is blocked for maintenance.',
    INVALID_INTERVAL: 'Enter a valid time and a positive whole number of minutes. Finish by 24:00.',
    TOO_LONG: 'Use a duration of 120 minutes or less.',
    NOT_FUTURE: 'Choose a start time after the 09:00 demo clock.'
  };
  function validate(start, duration) {
    const from = rules.parseTime(start);
    const length = typeof duration === 'number' ? duration : (typeof duration === 'string' && /^[-+]?\d+(?:\.\d+)?$/.test(duration.trim()) ? Number(duration) : NaN);
    if (!Number.isInteger(from) || !Number.isInteger(length) || length <= 0 || from + length > 1440) return null;
    return { start: from, end: from + length };
  }
  function check(input) {
    const interval = validate(input.start,input.duration);
    const code = interval ? rules.checkAvailability({...interval, room:{...room, blocked:input.blocked === true}}).code : 'INVALID_INTERVAL';
    return {available:code === 'AVAILABLE', code, message:messages[code]};
  }
  const api = {check, validate, bookings: () => room.bookings.map(slot => [slot.start,slot.end])};
  if (node) module.exports=api; else root.CampusChecker=api;
})(typeof window === 'undefined' ? null : window);

```

## app/fixtures.js

```text
(function () {
  'use strict';

  const ROOMS = Object.freeze([
    Object.freeze({ id: 'atlas', name: 'Atlas 204', type: 'Seminar room', capacity: 32, blocked: false,
      bookings: Object.freeze([Object.freeze({ start: 600, end: 660 }), Object.freeze({ start: 870, end: 930 })]) }),
    Object.freeze({ id: 'nova', name: 'Nova 108', type: 'Study room', capacity: 12, blocked: false,
      bookings: Object.freeze([]) }),
    Object.freeze({ id: 'studio', name: 'Studio 310', type: 'Project room', capacity: 20, blocked: true,
      bookings: Object.freeze([]) })
  ]);

  const api = { ROOMS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.CampusFixtures = api;
})();

```

## app/styles.css

```text
:root{--ink:#17372e;--green:#16533e;--dim:#52665e;--line:#d8dfd6;--canvas:#f5f7f2;--paper:#fff;--light:#e9f3e8;--mono:ui-monospace,'SFMono-Regular',Consolas,monospace}*{box-sizing:border-box}body{margin:0;background:var(--canvas);color:var(--ink);font:16px/1.45 Inter,'Segoe UI',Arial,sans-serif}.top{background:#153e32;color:white}.topin,main,footer{width:min(1040px,calc(100% - 64px));margin:auto}.topin{display:flex;align-items:center;justify-content:space-between;min-height:64px;gap:18px}.brand{display:flex;align-items:center;gap:10px;color:#fff!important;font-weight:700;font-size:19px;letter-spacing:-.5px;text-decoration:none}.brandicon{color:#bddbb7;font-size:29px;line-height:1}nav{display:flex;gap:24px}nav a{font-size:14px;color:#d5e7d9;text-decoration:none;padding:21px 0 17px;border-bottom:3px solid transparent}nav a[aria-current=page]{color:#fff;border-color:#bee0b1}main{min-height:calc(100vh - 145px);padding-bottom:36px}.intro,.section-head{margin:38px 0 25px}.intro{display:flex;justify-content:space-between;align-items:center;gap:15px}.eyebrow,.result-kicker{font:700 11px/1.4 var(--mono);color:#3d6652;letter-spacing:1.35px;margin:0 0 8px}h1{font-size:clamp(38px,5vw,58px);line-height:1.03;letter-spacing:-2.5px;font-weight:650;margin:0 0 8px;color:var(--ink)}h2{font-size:23px;line-height:1.2;letter-spacing:-.65px;font-weight:650;margin:0}h3{font-size:24px;line-height:1.2;font-weight:650;letter-spacing:-.6px;margin:3px 0}.sub,.muted{color:var(--dim);margin:0}.sub span{margin:0 4px}.clock,.today{display:inline-flex;align-items:center;gap:8px;background:#e6eee3;border:1px solid #d4dfd2;border-radius:50px;color:#345544;font-size:13px;padding:7px 12px}.clock span{font-size:20px;line-height:1}.clock strong{font-family:var(--mono)}.columns{display:grid;grid-template-columns:1.14fr .86fr;gap:21px;align-items:start}.cardbox{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:25px}.muted{font-size:14px;margin-top:5px}.segments{display:flex;gap:3px;background:#eff2ed;border:1px solid #dce3da;padding:3px;border-radius:9px;margin:21px 0 19px}.segments a{padding:7px 11px;flex:1;text-align:center;color:#415c50;text-decoration:none;font-size:14px;font-weight:600;border:1px solid transparent;border-radius:6px}.segments a[aria-current=page]{background:white;color:var(--green);border-color:#d4ddd2;box-shadow:0 1px 2px #142d2314}.inputs,.formio-form .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0}.inputs label,.formio-form .form-label,.formio-form .col-form-label{font-size:14px;font-weight:600;color:var(--ink)}.inputs input,.formio-form input.form-control{width:100%;font:16px var(--mono);padding:11px 12px;margin:6px 0 0;min-height:45px;border:1px solid #b8c9bd;border-radius:7px;color:var(--ink);background:white}.toggle,.formio-component-roomBlocked label{display:flex;align-items:center;gap:8px;margin:16px 0;font-size:14px;color:var(--ink)}input[type=checkbox]{accent-color:var(--green);height:17px;width:17px}.action{display:inline-flex;align-items:center;justify-content:space-between;gap:16px;background:var(--green);color:#fff;border:0;border-radius:8px;min-height:43px;padding:10px 16px;font-size:15px;font-weight:600;cursor:pointer}.action:hover{background:#0f422f}.action:disabled{opacity:.55}#check{width:100%}.compact{min-height:38px;font-size:14px}.result{margin-top:17px;border:1px solid #d2ded0;border-left:4px solid #899d8d;border-radius:6px 9px 9px 6px;background:#f4f6f2;padding:12px 15px}.result-kicker{font-size:10px;margin:0}.result p{font-size:14px;margin:3px 0;color:#3a4d42}.result code{display:block;font:11px var(--mono);margin-top:5px;color:#425b4a}.result[data-state=available]{background:#edf6e8;border-left-color:#4f843d}.result[data-state=unavailable]{background:#fff1e6;border-left-color:#b87731}.result[data-state=invalid]{background:#fff4eb;border-left-color:#b36832}.schedule-title,.test-actions{display:flex;align-items:center;justify-content:space-between;gap:10px}.today{font-size:11px;padding:3px 8px}.bookings{list-style:none;padding:0;margin:18px 0 20px}.bookings li{display:flex;align-items:center;gap:13px;padding:16px 0;border-top:1px solid var(--line)}.bookings li:last-child{border-bottom:1px solid var(--line)}.bookings i{display:block;width:7px;height:32px;border-radius:3px;background:#729d7a}.bookings li+li i{background:#ba9c5e}.bookings b{font:600 16px var(--mono)}.bookings small{display:block;font-size:13px;color:var(--dim);margin-top:3px}.note{background:#f3f6ef;border-radius:7px;padding:12px 14px;font-size:14px}.note p{margin:3px 0;color:var(--dim)}footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--line);padding:16px 0 20px;font-size:12px;color:var(--dim)}.tablewrap{overflow-x:auto}table{width:100%;font-size:14px}th,td{border-bottom:1px solid var(--line);padding:10px 9px;text-align:left}th{color:var(--dim);font-size:12px}td:nth-child(n+2){font-family:var(--mono);font-size:12px}#test-status{margin:10px 0 12px;color:var(--dim);font-size:14px}.ok{color:#286235}.bad{color:#94361e}.source-list{display:grid}.source-list a{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:15px 0;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line)}.source-list a:last-child{border:0}.source-list span{color:var(--green);font-size:13px}.section-head .action{margin-top:12px}.section-head h1{font-size:clamp(35px,4.5vw,50px)}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #6887ac;outline-offset:3px}[hidden]{display:none!important}#low-form .formio-form .row>*{width:100%;padding:0}#low-form .formio-component-columns,#low-form .form-group{margin-bottom:0}#low-form .formio-component-message{display:none}#low-form .formio-form .form-group{padding:0}#low-form .form-check{padding-left:1.55em}#low-form .form-check-input{margin-top:0}#designer .formio-form .row{display:flex}.testhost{position:absolute;left:-10000px;width:450px;top:0}.formio-errors{font-size:13px}
@media(max-width:730px){.topin,main,footer{width:calc(100% - 32px)}.columns{grid-template-columns:1fr}.intro,.section-head{margin:25px 0 20px}.cardbox{padding:19px}nav{gap:14px}nav a{font-size:12px}.topin{min-height:56px}.schedule{margin-top:0}.clock{padding:5px 8px;font-size:11px}.top .brand{font-size:16px}footer{font-size:11px}.source-list a{align-items:flex-start;flex-direction:column;gap:3px}}
@media(max-width:430px){.topin{flex-wrap:wrap;align-items:center;gap:0;padding-top:9px}.top nav{width:100%;justify-content:space-between}.top nav a{padding:7px 0}.intro{align-items:flex-start}.clock{margin-top:5px}.inputs,.formio-form .row{gap:8px}.cardbox{padding:16px}.test-actions{align-items:flex-start;flex-direction:column}.brandicon{font-size:23px}}

.link-button{border:0;background:transparent;color:var(--green);padding:0 0 6px;text-decoration:underline;font-size:13px}

```

## app/ui.js

```text
'use strict';
const byId = id => document.getElementById(id);
const loadJson = path => window.embeddedRoomFiles && Object.hasOwn(window.embeddedRoomFiles,path) ? Promise.resolve(JSON.parse(window.embeddedRoomFiles[path])) : fetch(path).then(response => {if (!response.ok) throw new Error('Could not load '+path); return response.json();});
const schema = loadJson('app/atlas-form.json');
const contract = loadJson('app/cases.json');
let library, liveForm, scratchDesigner, checkedLowInput, track='code';
const inputSignature = form => JSON.stringify([form.data.start,form.data.duration,form.data.roomBlocked]);
function loadFormio() {
  if (window.Formio) return Promise.resolve(window.Formio);
  if (!library) library = new Promise((resolve,reject) => {
    const script=document.createElement('script'); script.src='vendor/formio.full.min.js';
    script.onload=()=>resolve(window.Formio); script.onerror=()=>reject(new Error('Could not load Form.io.')); document.head.append(script);
  });
  return library;
}
async function createNativeForm(element) {
  const [api, definition]=await Promise.all([loadFormio(),schema]);
  return api.createForm(element,structuredClone(definition),{noAlerts:true,readOnly:false,disableAlerts:true});
}
function output(form) {
  const data=form.data;
  return {available:data.available,code:data.reasonCode,message:data.message};
}
function lowBookings(form) {const data=form.data;return [[data.firstStart,data.firstEnd],[data.secondStart,data.secondEnd]];}
function resultView(result) {
  const card=byId('result'); const validDecision=result && ['AVAILABLE','OVERLAP','BLOCKED'].includes(result.code);
  card.dataset.state=!result?'ready':result.available?'available':validDecision?'unavailable':'invalid';
  byId('decision').textContent=!result?'Ready to check':result.available?'Available':validDecision?'Unavailable':'Check input';
  byId('message').textContent=result?result.message:'The check leaves both bookings in place.';
  byId('reason').textContent=result?result.code:'';
}
function readCodeForm() {return {start:byId('start').value,duration:byId('duration').value,blocked:byId('blocked').checked};}
async function showRoom(mode) {
  track=mode; const low=mode==='low'; byId('code-form').hidden=low; byId('low-form').hidden=!low;
  for(const key of ['code','low']) byId('tab-'+key).setAttribute('aria-current',key===mode?'page':'false');
  resultView(null); byId('check').disabled=low && !liveForm;
  if (low && !liveForm) {
    const target=byId('low-form');target.replaceChildren();
    liveForm=await createNativeForm(target); liveForm.on('change',event=>{if (track==='low' && event?.changed && checkedLowInput !== inputSignature(liveForm)) resultView(null);});
  }
  byId('check').disabled=false;
}
byId('code-form').addEventListener('input',()=>resultView(null));
byId('code-form').addEventListener('submit',event=>{event.preventDefault();byId('check').click();});
byId('check').addEventListener('click',()=>{ if(track==='low') {if(liveForm){liveForm.checkData(null,{noEmit:true}); checkedLowInput=inputSignature(liveForm); resultView(output(liveForm));}} else resultView(CampusChecker.check(readCodeForm())); });
function testRow(row) {const tr=document.createElement('tr');for(const v of [row.id+' · '+row.label,row.expect,row.code.result,row.low.result]){const td=document.createElement('td');td.textContent=v;tr.append(td);}tr.children[2].className=row.code.ok?'ok':'bad';tr.children[3].className=row.low.ok?'ok':'bad';return tr;}
async function checkSuite() {
  const cases=await contract, host=document.createElement('div'); host.className='testhost';host.setAttribute('aria-hidden','true');document.body.append(host);
  const form=await createNativeForm(host); const rows=[]; const startCode=JSON.stringify(CampusChecker.bookings()), startLow=JSON.stringify(lowBookings(form));
  async function sample(c) {
    form.getComponent('start').setValue(c.start);
    form.getComponent('duration').setValue(c.duration);
    form.getComponent('roomBlocked').setValue(c.blocked);
    form.checkData(null,{noEmit:true}); return output(form);
  }
  try {
    for (const c of cases.cases) {
      const obs={id:c.id,label:c.label,expect:c.expect};
      if(c.id==='T8') {
        for(const again of cases.cases.slice(0,7)){CampusChecker.check(again); await sample(again);}
        for(const [name,before,after] of [['code',startCode,CampusChecker.bookings()],['low',startLow,lowBookings(form)]]) {
          const ok=before===JSON.stringify(cases.bookings) && JSON.stringify(after)===before;
          obs[name]={result:ok?'UNCHANGED':'CHANGED',ok,before:JSON.parse(before),after};
        }
      } else {
        for(const [name,res] of [['code',CampusChecker.check(c)],['low',await sample(c)]]) {
          obs[name]={result:res.code||'NO_RESULT',ok:res.code===c.expect && res.available===(c.expect==='AVAILABLE') && typeof res.message==='string' && res.message.length>0,available:res.available,message:res.message};
        }
      } rows.push(obs);
    }
    return rows;
  }finally{form.destroy(true);host.remove();}
}
byId('run-tests').addEventListener('click',async()=>{
  const b=byId('run-tests');b.disabled=true;byId('test-status').textContent='Running both implementations…';
  try{const rows=await checkSuite();const n=key=>rows.filter(row=>row[key].ok).length;byId('test-rows').replaceChildren(...rows.map(testRow));byId('score').textContent=`JavaScript ${n('code')}/8 · Form.io ${n('low')}/8`;byId('test-status').textContent='Latest run in this browser. T8 compares both stored intervals before and after repeated checks.';window.lastObservedRun=rows;byId('download-tests').hidden=false;}catch(error){byId('test-status').textContent='The suite could not finish: '+error.message;}finally{b.disabled=false;}
});
async function openDesigner(){if(scratchDesigner)return;const [api,definition]=await Promise.all([loadFormio(),schema]);scratchDesigner=await api.builder(byId('designer'),structuredClone(definition),{noDefaultSubmitButton:true});}
byId('export-form').addEventListener('click',()=>{if(!scratchDesigner)return;const url=URL.createObjectURL(new Blob([JSON.stringify(scratchDesigner.schema,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='Atlas_204_Form.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);});
async function route(){const name=location.hash.slice(1);const which=['tests','source','designer'].includes(name)?name:'room';for(const id of ['room','tests','source','designer'])byId(id+'-view').hidden=which!==id;document.querySelectorAll('[data-section]').forEach(a=>a.setAttribute('aria-current',a.dataset.section===(which==='designer'?'source':which)?'page':'false'));if(which==='room')await showRoom(name==='low'?'low':'code');if(which==='designer')await openDesigner();}
window.addEventListener('hashchange',route);route();

byId('download-tests').addEventListener('click',()=>{
  if(!window.lastObservedRun)return;
  const a=document.createElement('a');const u=URL.createObjectURL(new Blob([JSON.stringify(window.lastObservedRun,null,2)],{type:'application/json'}));
  a.href=u;a.download='Atlas_204_Observed.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);
});

```

## index.html

```text
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; form-action 'none'; object-src 'none'; base-uri 'none'"><title>Atlas 204 · Campus Rooms</title><link rel="icon" href="data:,"><link rel="stylesheet" href="vendor/bootstrap.min.css"><link rel="stylesheet" href="vendor/formio.full.min.css"><link rel="stylesheet" href="app/styles.css"></head>
<body><header class="top"><div class="topin"><a class="brand" href="#code"><span class="brandicon" aria-hidden="true">▦</span> Campus Rooms</a><nav aria-label="Main navigation"><a data-section="room" href="#code">Room checker</a><a data-section="tests" href="#tests">Test results</a><a data-section="source" href="#source">Source</a></nav></div></header>
<main><section id="room-view"><div class="intro"><div><p class="eyebrow">SMART CAMPUS / ROOM DIRECTORY</p><h1>Atlas 204</h1><p class="sub">Seminar room <span>·</span> 32 seats</p></div><span class="clock"><span aria-hidden="true">◷</span> Demo clock <strong>09:00</strong></span></div>
<div class="columns"><article class="cardbox"><h2>Check availability</h2><p class="muted">Choose a start time and a length for your visit.</p><div class="segments" aria-label="Implementation"><a href="#code" id="tab-code">Code-based</a><a href="#low" id="tab-low">Low-code</a></div>
<form id="code-form" novalidate><div class="inputs"><label for="start">Start time<input id="start" type="time" value="12:00" required></label><label for="duration">Duration (min)<input id="duration" type="number" step="1" value="45" required></label></div><label class="toggle"><input type="checkbox" id="blocked"> Room blocked for maintenance</label></form><div id="low-form" hidden><p>Loading the Form.io form…</p></div><button id="check" class="action" type="button">Check availability <span aria-hidden="true">→</span></button><div class="result" id="result" role="status" aria-live="polite"><div class="result-kicker" id="result-kicker">RESULT</div><h3 id="decision">Ready to check</h3><p id="message">The check leaves both bookings in place.</p><code id="reason"></code></div></article>
<aside class="cardbox schedule"><div class="schedule-title"><h2>Room schedule</h2><span class="today">Fictional day</span></div><p class="muted">Existing bookings for Atlas 204</p><ol class="bookings"><li><i aria-hidden="true"></i><div><b>10:00 – 11:00</b><small>Morning booking</small></div></li><li><i aria-hidden="true"></i><div><b>14:30 – 15:30</b><small>Afternoon booking</small></div></li></ol><div class="note"><b>At the boundary</b><p>A class can start at 11:00, exactly when the morning booking ends.</p></div></aside></div></section>
<section id="tests-view" hidden><div class="section-head"><p class="eyebrow">PRACTICE 12 / EVIDENCE</p><h1>Test results</h1><p class="sub">The same eight checks run against JavaScript and the native Form.io renderer.</p></div><div class="cardbox"><div class="test-actions"><h2 id="score">Acceptance tests</h2><button class="action compact" id="run-tests" type="button">Run both suites</button></div><div id="test-status" role="status">Run the suites to see observed results.</div><button id="download-tests" class="link-button" type="button" hidden>Download observed results</button><div class="tablewrap"><table><thead><tr><th>Case</th><th>Expected</th><th>JavaScript</th><th>Form.io</th></tr></thead><tbody id="test-rows"></tbody></table></div></div></section>
<section id="source-view" hidden><div class="section-head"><p class="eyebrow">PRACTICE 12 / PROJECT</p><h1>Source & export</h1><p class="sub">Open the editable form, read the booking rules or download the source.</p></div><div class="cardbox source-list"><a href="#designer"><strong>Visual form designer</strong><span>Open the native Form.io project →</span></a><a href="app/atlas-form.json" download><strong>Form.io project</strong><span>Download the editable JSON form ↓</span></a><a href="app/checker.js"><strong>JavaScript checker</strong><span>Read the code-based adapter →</span></a><a href="app/booking-rules.js"><strong>Bolt rule engine</strong><span>Read the original rules →</span></a><a href="app/cases.json"><strong>Acceptance cases</strong><span>Open the shared inputs and expectations →</span></a><a href="baseline/index.html"><strong>Frozen baseline</strong><span>Open the previous Bolt checker →</span></a><a href="source.html" download="Campus_Room_Checker.html"><strong>Offline project export</strong><span>Download both working implementations in one HTML file ↓</span></a></div></section>
<section id="designer-view" hidden><div class="section-head"><p class="eyebrow">LOW-CODE / FORM.IO</p><h1>Form designer</h1><p class="sub">Edit a local copy of the form, then export your changes.</p><button class="action compact" id="export-form" type="button">Download form JSON</button></div><div class="cardbox"><div id="designer"></div></div></section></main>
<footer><span>Smart Campus · Software Engineering</span><span>Practice 12</span></footer><script src="app/booking-rules.js"></script><script src="app/fixtures.js"></script><script src="app/checker.js"></script><script src="app/ui.js"></script></body></html>

```

## vendor/LICENSE.txt

```text
The MIT License (MIT)
Copyright (c) 2018 Form.io

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```

## vendor/bootstrap-LICENSE.txt

```text
The MIT License (MIT)

Copyright (c) 2011-2025 The Bootstrap Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

```

## vendor/formio.full.min.js.LICENSE.txt

```text
/*!
 * Signature Pad v4.2.0 | https://github.com/szimek/signature_pad
 * (c) 2024 Szymon Nowak | Released under the MIT license
 */

/*!
 * dist/inputmask
 * https://github.com/RobinHerbots/Inputmask
 * Copyright (c) 2010 - 2024 Robin Herbots
 * Licensed under the MIT license
 * Version: 5.0.9
 */

/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2021 Joachim Wester
 * MIT license
 */

/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * (c) 2017-2022 Joachim Wester
 * MIT licensed
 */

/*! @license DOMPurify 3.4.17 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.17/LICENSE */

/*! choices.js v11.1.0 | © 2025 Josh Johnson | https://github.com/jshjohnson/Choices#readme */

/*! formiojs v5.7.2 | https://unpkg.com/formiojs@5.7.2/LICENSE.txt */

/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */

/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

//! Copyright (c) JS Foundation and other contributors

//! github.com/moment/moment-timezone

//! license : MIT

//! moment-timezone.js

//! moment.js

//! version : 0.5.48

```

## tests/contract.cjs

```text
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

```

## package.json

```text
{
  "name": "atlas-room-checker-practice12",
  "private": true,
  "version": "1.0.0",
  "description": "Compare JavaScript and Form.io for a read-only classroom room checker.",
  "scripts": {"test": "node --test tests/contract.cjs"},
  "dependencies": {"@formio/js": "5.7.2", "bootstrap": "5.3.8"}
}

```

## README.md

```text
# Smart Campus Room Availability Checker

Software Engineering, Practice 12. Compare one feature implemented in JavaScript and in the Form.io visual builder. The project uses one fictional day, the 09:00 demo clock and the Atlas 204 schedule from the earlier Bolt prototype. There is no sign-in or reservation service.

## Run

Open the published demo, or start `python3 -m http.server 8000 --directory dist` in this checkout and open `http://localhost:8000`. The JavaScript page loads without external packages. The Form.io runtime and styles ship in `dist/vendor`. The site does not need an install step. For a completely offline copy, open `dist/source.html` directly. The Source tab in the offline copy also lets you read and download individual files.

## Compare the two implementations

- **Code-based** uses the unmodified Bolt rules in `dist/app/booking-rules.js`. The adapter in `dist/app/checker.js` accepts start time, whole minutes and a maintenance flag.
- **Low-code** opens a real Form.io form. `dist/app/atlas-form.json` is its native export with controls, fixture values, a short time conversion, JSON Logic rules and result fields. Open **Source → Visual form designer** to edit a local copy. Download the form JSON to keep edits. These changes do not update the published page.
- **Test results → Run both suites** executes T1–T8 against the real JavaScript rule engine and a single native Form.io form instance. The result download records the availability flag, reason, message and before/after fixtures. `node --test tests/contract.cjs` runs the code track's eight cases and eleven extra inputs.
- `dist/evidence` contains the classroom report without student identifiers, untouched screenshots, observed outputs and the baseline record. `dist/baseline` contains the restored previous Bolt web app. `tools/export_offline.py` rebuilds the offline HTML after any source changes.

## Fixed contract

Existing bookings are 10:00–11:00 and 14:30–15:30. Start strictly after 09:00, choose 1–120 whole minutes and finish by 24:00. A blocked room or positive overlap returns Unavailable. An adjacent interval can be free. Both implementations return a boolean, a reason code and a visible message. The checker never writes a booking. Invalid input takes priority, then a blocked room, then an overlap.

## Dependencies and review

The delivered browser bundles use `@formio/js` 5.7.2 and Bootstrap 5.3.8. License notices are in `dist/vendor`. Review the form JSON as executable configuration. Update the lockfile and vendor files together, rebuild the offline copy and rerun both suites when changing a dependency. `npm audit --omit=dev` checks the resolved npm tree against current advisories. Local, static classroom use does not require a subscription.

```
