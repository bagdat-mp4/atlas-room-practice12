"""Create a portable working HTML version from the checked-in site files."""
from pathlib import Path
import base64
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
site = root / 'dist'
output = Path(sys.argv[1]) if len(sys.argv) > 1 else site / 'source.html'
page = (site / 'index.html').read_text()
page = page.replace("script-src 'self' 'unsafe-eval'", "script-src 'self' data: 'unsafe-eval'").replace("connect-src 'self'", "connect-src 'none'")

def css(match):
    relative = match[1]
    base = site / relative
    source = base.read_text()
    def font(ref):
        filename = ref.group(1)
        data = (base.parent / 'fonts' / filename).read_bytes()
        return 'url(data:font/'+filename.split('.')[-1]+';base64,'+base64.b64encode(data).decode()+')'
    source = re.sub(r'url\(["\']?(?:\./)?fonts/(bootstrap-icons\.woff2?)(?:\?[^)"\']+)?["\']?\)',font,source)
    return '<style>'+source+'</style>'
page = re.sub(r'<link rel="stylesheet" href="([^"]+)">',css,page)

def script(src):
    encoded=base64.b64encode(src.encode('utf-8')).decode('ascii')
    return '<script src="data:text/javascript;base64,'+encoded+'"></script>'

files = {str(p.relative_to(site)):p.read_text() for p in sorted((site/'app').iterdir()) if p.is_file()}
files['index.html'] = (site/'index.html').read_text()
for n in ['LICENSE.txt','bootstrap-LICENSE.txt','formio.full.min.js.LICENSE.txt']:
    files['vendor/'+n]=(site/'vendor'/n).read_text()
files['tests/contract.cjs']=(root/'tests/contract.cjs').read_text()
files['package.json']=(root/'package.json').read_text()
files['README.md']=(root/'README.md').read_text()
blob_js = '''
function downloadRoomFile(name, text) {
 const url=URL.createObjectURL(new Blob([text],{type:'application/octet-stream'}));
 const link=document.createElement('a');link.href=url;link.download=name.split('/').pop();link.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
const select=document.getElementById('source-file');
for(const path of Object.keys(window.embeddedRoomFiles).sort()){const opt=document.createElement('option'); opt.value=path;opt.textContent=path; select.append(opt);}
const updateSource=()=>document.getElementById('source-text').textContent=window.embeddedRoomFiles[select.value];
select.value='app/checker.js';select.addEventListener('change',updateSource);updateSource();
document.getElementById('get-source').onclick=()=>downloadRoomFile(select.value,window.embeddedRoomFiles[select.value]);
for(const a of document.querySelectorAll('#source-view a')){
 const key=a.getAttribute('href');if(Object.hasOwn(window.embeddedRoomFiles,key)){a.addEventListener('click',ev=>{ev.preventDefault();select.value=key;updateSource();if(a.hasAttribute('download'))downloadRoomFile(key,window.embeddedRoomFiles[key]);else document.getElementById('source-text').scrollIntoView();});}
}
'''
panel='<div class="cardbox" style="margin-top:16px"><h2>Source files</h2><label for="source-file">File</label> <select id="source-file"></select> <button id="get-source" type="button" class="link-button">Download file</button><pre id="source-text" style="white-space:pre-wrap;overflow-wrap:anywhere;max-height:400px;font-size:13px;margin-top:15px"></pre></div>'
start=page.index('<section id="source-view"');end=page.index('</section>',start);page=page[:end]+panel+page[end:]
page=re.sub(r'<a href="source.html(?:#source)?"[^>]*>.*?</a>','',page,flags=re.S)
page=re.sub(r'<a href="baseline/index.html"[^>]*>.*?</a>','',page,flags=re.S)
first = '<script src="app/booking-rules.js"></script>'
page=page.replace(first,script('window.embeddedRoomFiles='+json.dumps(files,ensure_ascii=True).replace('<',r'\u003c')+';')+script((site/'vendor/formio.full.min.js').read_text())+first)
page=re.sub(r'<script src="(app/[^"]+)"\s*></script>',lambda m:script((site/m[1]).read_text()),page)
prefix,tail=page.rsplit('</body>',1)
page=prefix+script(blob_js)+'</body>'+tail
output.parent.mkdir(parents=True,exist_ok=True);output.write_text(page)
