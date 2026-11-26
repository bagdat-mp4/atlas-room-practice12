'use strict';
const { ROOMS, CURRENT_TIME, parseTime, formatTime, checkAvailability } = window.CampusAvailability;
const roomSelect = document.getElementById('room');
const result = document.getElementById('result');
function selectedRoom() { return ROOMS.find(room => room.id === roomSelect.value); }
function renderRoom() {
  const room = selectedRoom();
  document.getElementById('room-name').textContent = room.name;
  document.getElementById('room-meta').textContent = room.type + ' / ' + room.capacity + ' seats';
  const state = document.getElementById('room-state');
  state.textContent = room.blocked ? 'Blocked for maintenance' : 'Room is open';
  state.className = 'state' + (room.blocked ? ' blocked' : '');
  const list = document.getElementById('bookings');
  list.replaceChildren();
  if (!room.bookings.length) { const li = document.createElement('li'); li.textContent = 'No existing bookings'; list.append(li); }
  room.bookings.forEach(booking => {
    const li = document.createElement('li');
    const time = document.createElement('span'); time.textContent = formatTime(booking.start) + ' - ' + formatTime(booking.end);
    const label = document.createElement('small'); label.textContent = 'Booked';
    li.append(time, label); list.append(li);
  });
}
document.getElementById('availability-form').addEventListener('submit', event => {
  event.preventDefault();
  const answer = checkAvailability({ start: parseTime(document.getElementById('start').value), end: parseTime(document.getElementById('end').value), now: CURRENT_TIME, room: selectedRoom() });
  result.className = 'result ' + (answer.available ? 'available' : 'unavailable');
  result.replaceChildren();
  const title = document.createElement('strong'); title.textContent = answer.decision;
  const context = document.createElement('p'); context.className = 'checked-context';
  context.textContent = selectedRoom().name + ' / ' + document.getElementById('start').value.trim() + ' - ' + document.getElementById('end').value.trim();
  const reason = document.createElement('p'); reason.textContent = answer.reason;
  result.append(title, context, reason);
});
function resetResult() {
  result.className = 'result';
  result.replaceChildren();
  const title = document.createElement('strong'); title.textContent = 'Ready to check';
  const message = document.createElement('p'); message.textContent = 'Your details changed. Press Check availability to check this time range.';
  result.append(title, message);
}
document.getElementById('start').addEventListener('input', resetResult);
document.getElementById('end').addEventListener('input', resetResult);
roomSelect.addEventListener('change', () => { renderRoom(); resetResult(); });
renderRoom();

// Practice 11: optional explanations; the booking result remains authoritative.
const { createMockExplainAdapter, fallbackText } = window.CampusExplainAdapter;
let explanationToken = 0, confirmed = null;
const controls = document.createElement('div'); controls.className = 'explain-controls';
const modeLabel = document.createElement('label'); modeLabel.htmlFor = 'mock-mode'; modeLabel.textContent = 'Mock scenario';
const mockMode = document.createElement('select'); mockMode.id = 'mock-mode';
for (const [value, text] of [['normal','Normal response'],['timeout','Simulated timeout'],['api-failure','Simulated API error'],['missing-key','Simulated missing key'],['malformed','Malformed output'],['contradictory','Contradictory output'],['long','Overlong output']]) { const option = document.createElement('option'); option.value=value; option.textContent=text; mockMode.append(option); }
const explainButton = document.createElement('button'); explainButton.type='button'; explainButton.textContent='Explain availability'; explainButton.disabled=true;
const explainOutput = document.createElement('div'); explainOutput.className='explain-output'; explainOutput.setAttribute('aria-live','polite'); explainOutput.hidden=true;
const note = document.createElement('p'); note.className='explain-note'; note.textContent='Mock only: no real LLM, API key or booking changes. The Node preview uses a server mock; static hosting uses a labeled browser mock.';
controls.append(modeLabel,mockMode,explainButton,explainOutput,note); result.after(controls);
function key() { return JSON.stringify([roomSelect.value,document.getElementById('start').value,document.getElementById('end').value]); }
function invalidateExplanation() { explanationToken++; confirmed=null; explainButton.disabled=true; explainButton.textContent='Explain availability'; explainOutput.hidden=true; }
for (const id of ['start','end']) document.getElementById(id).addEventListener('input',invalidateExplanation);
roomSelect.addEventListener('change',invalidateExplanation);
mockMode.addEventListener('change',()=>{explanationToken++;explainOutput.hidden=true;explainButton.disabled=!confirmed;});
document.getElementById('availability-form').addEventListener('submit',()=>{
  invalidateExplanation();
  const answer=checkAvailability({start:parseTime(document.getElementById('start').value),end:parseTime(document.getElementById('end').value),now:CURRENT_TIME,room:selectedRoom()});
  const authority=document.createElement('small');authority.textContent='Confirmed booking status · deterministic rules';result.append(authority);
  if (!['AVAILABLE','OVERLAP','BLOCKED'].includes(answer.code)) return;
  confirmed={key:key(),answer,context:{roomLabel:selectedRoom().name,start:document.getElementById('start').value.trim(),end:document.getElementById('end').value.trim(),isAvailable:answer.available,reasonCode:answer.code}};
  explainButton.disabled=false;
});
explainButton.addEventListener('click',async()=>{
  if(!confirmed||confirmed.key!==key())return;
  const current=confirmed,token=++explanationToken,controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),2000);explainButton.disabled=true;explainButton.textContent='Explaining…';const started=Date.now();
  let response;
  try{
    const remote=await fetch('/api/explain',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...current.context,mode:mockMode.value}),signal:controller.signal});
    if(remote.ok){response=await remote.json();if(response.result.code!==current.answer.code||response.result.available!==current.answer.available)throw new Error('Status mismatch');}
    else if(remote.status===404||remote.status===405){const value=await createMockExplainAdapter({mode:mockMode.value})(current.context);response={...value,source:'Browser mock explanation · static demo',latencyMs:Date.now()-started};}
    else throw new Error('Explanation unavailable');
  }catch{response={explanation:fallbackText(current.answer),source:'Deterministic fallback',latencyMs:Date.now()-started};}
  finally{clearTimeout(timeout);controller.abort();}
  if(token!==explanationToken||!confirmed||current.key!==key())return;
  explainOutput.replaceChildren();const source=document.createElement('span');source.className='explain-source';source.textContent=response.source;
  const text=document.createElement('p');text.textContent=response.explanation;
  const latency=document.createElement('small');latency.textContent=response.latencyMs+' ms · no external LLM requests · $0 LLM API cost';explainOutput.append(source,text,latency);explainOutput.hidden=false;
  explainButton.textContent='Explain availability';explainButton.disabled=false;
});
