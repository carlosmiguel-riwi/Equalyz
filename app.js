const M={mercadolibre:{n:'Mercado Libre',s:96,t:1.7,loc:1,fac:1},amazon:{n:'Amazon',s:84,t:7.4,loc:0,fac:0},exito:{n:'Éxito',s:81,t:3.2,loc:1,fac:1},aliexpress:{n:'AliExpress',s:66,t:22,loc:0,fac:0},falabella:{n:'Falabella'},alkosto:{n:'Alkosto'}};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const J=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const S=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function norm(v){v=(v||'').trim();if(!v)return null;if(!/^https?:\/\//i.test(v))v='https://'+v;try{new URL(v);return v}catch(e){return null}}
function tienda(u){const h=new URL(u).hostname;for(const k in M)if(h.includes(k))return M[k];return{n:h.replace('www.','')}}
const sc=(m,p)=>p=='rap'?Math.max(0,100-m.t*4):p=='gar'?(m.loc?100:40):m.s;

/* ---------- CUENTA ---------- */
const CU=()=>J('cuentas',{}),ses=()=>{try{return localStorage.getItem('sesion')}catch(e){return null}};
const user=()=>{const e=ses(),c=CU()[e];return c?{e,...c}:null};
const hash=async s=>{try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent(s)))}};
const av=(u,s)=>u.foto?`<img src="${u.foto}" alt="" width="${s}" height="${s}" class="rounded-circle" style="object-fit:cover">`:`<span class="rounded-circle" style="display:inline-grid;width:${s}px;height:${s}px;place-items:center;background:var(--ac);color:#fff;font-weight:700">${esc((u.nombre||'?')[0].toUpperCase())}</span>`;
{const U=user();
if($('authBox'))$('authBox').innerHTML=U?`<a href="perfil.html" class="d-inline-flex align-items-center gap-2 me-2" title="Mi perfil">${av(U,30)}<span class="small" style="color:var(--tx)">${esc(U.nombre)}</span></a>`:'<button id="loginBtn" class="btn btn-ac btn-sm me-2" type="button">Iniciar sesión</button>';
if($('navEmp')&&U)$('navEmp').classList.remove('d-none');
const g=document.querySelector('main[data-auth]');
if(g&&!U)g.innerHTML='<div class="cta text-center"><h1 class="fs-4 fw-bold">Esta sección es solo para usuarios registrados</h1><p class="mu">Inicia sesión para continuar.</p><button class="btn btn-ac" data-login>Iniciar sesión</button></div>';}
document.body.insertAdjacentHTML('beforeend',`<div class="modal fade" id="mAuth" tabindex="-1"><div class="modal-dialog"><div class="modal-content p-3"><h2 class="fs-5 fw-bold" id="aT"></h2>
<input id="aNom" class="form-control inp mb-2 d-none" placeholder="Nombre" aria-label="Nombre"><input id="aMail" type="email" class="form-control inp mb-2" placeholder="Correo" aria-label="Correo"><input id="aPass" type="password" class="form-control inp mb-2" placeholder="Contraseña (mínimo 6 caracteres)" aria-label="Contraseña">
<p id="aErr" class="er small d-none"></p><button id="aOk" class="btn btn-ac mb-2"></button><button id="aSw" class="btn btn-link btn-sm"></button><p class="mu small mb-0">Demo: la cuenta se guarda solo en este navegador. No uses una contraseña real.</p></div></div></div>`);
let reg=false;
const aSet=r=>{reg=r;$('aT').textContent=r?'Crear cuenta':'Iniciar sesión';$('aNom').classList.toggle('d-none',!r);$('aOk').textContent=r?'Crear cuenta':'Entrar';$('aSw').textContent=r?'¿Ya tienes cuenta? Inicia sesión':'¿No tienes cuenta? Crea una';$('aErr').classList.add('d-none')};
document.addEventListener('click',e=>{if(e.target.id=='loginBtn'||e.target.dataset.login!==undefined){aSet(false);bootstrap.Modal.getOrCreateInstance($('mAuth')).show()}});
$('aSw').onclick=()=>aSet(!reg);
$('aOk').onclick=async()=>{const n=$('aNom').value.trim(),m=$('aMail').value.trim().toLowerCase(),p=$('aPass').value,c=CU(),er=t=>{$('aErr').textContent=t;$('aErr').classList.remove('d-none')};
if(!/^\S+@\S+\.\S+$/.test(m))return er('Escribe un correo válido.');if(p.length<6)return er('La contraseña debe tener al menos 6 caracteres.');
const h=await hash(p);
if(reg){if(n.length<2)return er('Escribe tu nombre.');if(c[m])return er('Ese correo ya tiene cuenta.');c[m]={nombre:n,h};S('cuentas',c)}
else if(!c[m]||c[m].h!==h)return er('Correo o contraseña incorrectos.');
try{localStorage.setItem('sesion',m)}catch(x){}location.reload()};

/* ---------- INICIO ---------- */
if($('buscar')){
let urls=J('urls',[]);
const pinta=()=>{$('lista').innerHTML=urls.map((u,i)=>`<span class="chip">${esc(tienda(u).n)}<small class="mu">${esc(u.slice(0,34))}…</small><button data-i="${i}" aria-label="Quitar">✕</button></span>`).join('');
 $('pregunta').classList.toggle('d-none',!urls.length);S('urls',urls)};
$('buscar').onclick=()=>{const u=norm($('url').value);$('err').classList.toggle('d-none',!!u);if(!u)return;urls.push(u);$('url').value='';pinta()};
$('url').onkeydown=e=>{if(e.key=='Enter')$('buscar').click()};
$('lista').onclick=e=>{const i=e.target.dataset.i;if(i!==undefined){urls.splice(i,1);pinta()}};
$('otra').onclick=()=>$('url').focus();
$('comparar').onclick=()=>location='comparador.html';
const reco=()=>{const p=$('prio').value;let l=(urls.length?urls.map(u=>({u,m:tienda(u)})):Object.values(M).map(m=>({m}))).filter(x=>x.m.s);
 l.sort((a,b)=>sc(b.m,p)-sc(a.m,p));
 $('recoOut').innerHTML=l.length?l.map((x,i)=>`<div class="card-eq mb-2 ${i?'':'best'}"><b>${i?'':'★ '}${esc(x.m.n)}</b> <span class="mu">puntaje ${Math.round(sc(x.m,p))}/100</span>${x.u?` <a class="float-end" href="${esc(x.u)}" target="_blank" rel="noopener">Abrir</a>`:''}</div>`).join(''):'<p class="mu">No tengo datos de confiabilidad de las tiendas que agregaste. Prueba con Mercado Libre, Amazon, Éxito o AliExpress.</p>'};
$('reco').onclick=()=>{reco();new bootstrap.Modal($('mReco')).show()};$('prio').onchange=reco;
const al=()=>{const a=J('alertas',[]);$('alOut').innerHTML=a.length?a.map((x,i)=>`<div class="d-flex justify-content-between small border-top py-1"><span>${esc(x.u.slice(0,40))} · ≤ $${esc(x.p)} COP</span><button class="btn btn-sm er" data-d="${i}">Borrar</button></div>`).join(''):'<p class="mu small mb-0">Aún no tienes alertas.</p>'};
$('alertaBtn').onclick=()=>{al();new bootstrap.Modal($('mAlerta')).show()};
$('alGuardar').onclick=()=>{const u=norm($('alUrl').value),p=parseInt($('alPrecio').value);if(!u||!(p>0)){$('alErr').classList.remove('d-none');return}
 $('alErr').classList.add('d-none');const a=J('alertas',[]);a.push({u,p:p.toLocaleString('es-CO'),e:$('alMail').value});S('alertas',a);$('alUrl').value=$('alPrecio').value='';al()};
$('alOut').onclick=e=>{const i=e.target.dataset.d;if(i!==undefined){const a=J('alertas',[]);a.splice(i,1);S('alertas',a);al()}};
pinta();
}

/* ---------- COMPARADOR ---------- */
if($('u1')){
const u=J('urls',[]);$('u1').value=u[0]||'';$('u2').value=u[1]||'';
async function prev(url){try{const r=await fetch('https://api.microlink.io/?url='+encodeURIComponent(url));const d=(await r.json()).data||{};return{title:d.title,img:d.image&&d.image.url}}catch(e){return{}}}
async function go(){const a=norm($('u1').value),b=norm($('u2').value);if(!a||!b){$('res').innerHTML='<p class="er">Escribe dos URLs válidas.</p>';return}
 $('res').innerHTML='<p class="mu">Cargando productos…</p>';
 const [pa,pb]=await Promise.all([prev(a),prev(b)]);const X=[{u:a,m:tienda(a),...pa},{u:b,m:tienda(b),...pb}];
 const w=(X[0].m.s||0)>=(X[1].m.s||0)?0:1,cmp=X[0].m.s&&X[1].m.s;
 const card=(x,i)=>`<div class="col-lg-6"><div class="card-eq h-100 ${cmp&&i==w?'best':''}"><b>${esc(x.m.n)}</b>${cmp&&i==w?' <span class="tag ok ms-2">Más confiable</span>':''}
 ${x.img?`<img class="img-ph my-3 w-100" style="object-fit:contain" src="${esc(x.img)}" alt="${esc(x.title||'Producto')}">`:'<div class="img-ph my-3 d-grid place-items-center mu" style="place-items:center">Sin imagen disponible</div>'}
 <h2 class="fs-6 fw-bold">${esc(x.title||x.u)}</h2>
 <div class="d-flex align-items-center gap-2 my-3">${x.m.s?`<div class="score ${cmp&&i==w?'win ok':'wa'}">${x.m.s}%</div><span class="tag">Confiabilidad</span>`:'<span class="tag">Sin datos de confiabilidad</span>'}</div>
 <a href="${esc(x.u)}" target="_blank" rel="noopener" class="btn ${i==w?'btn-ac':'btn-out'} w-100">Ver en ${esc(x.m.n)}</a></div></div>`;
 const f=(v,t,n)=>v===undefined?'Sin datos':v?t:n,row=(c,fn)=>`<tr><td>${c}</td><td>${fn(X[0].m)}</td><td>${fn(X[1].m)}</td></tr>`;
 $('res').innerHTML=`<div class="row g-3">${X.map(card).join('')}</div>
 ${cmp?`<div class="cta mt-3"><b>Veredicto:</b> ${esc(X[w].m.n)} es el mercado más confiable (${X[w].m.s}% vs ${X[1-w].m.s}%).</div>`:''}
 <section class="card-eq mt-3"><div class="table-responsive"><table class="table table-eq mb-0"><thead><tr><th>CRITERIO</th><th>${esc(X[0].m.n)}</th><th>${esc(X[1].m.n)}</th></tr></thead><tbody>
 ${row('Entrega promedio',m=>m.t?m.t+' días':'Sin datos')}${row('Garantía local',m=>f(m.loc,'Sí','No'))}${row('Factura DIAN',m=>f(m.fac,'Sí','No'))}</tbody></table></div>
 <p class="mu small mt-2 mb-0">Imagen y título se leen desde la página del producto; si la tienda bloquea la lectura, solo verás el enlace. Los puntajes son datos de demostración.</p></section>`}
$('calc').onclick=go;if(u.length>1)go();
}

/* ---------- EMPRENDEDOR ---------- */
if($('tbody')){
const cop=n=>'$'+Math.round(n).toLocaleString('es-CO');
let P=J('skus',null)||[
{sku:'ANC-9821',nombre:'Auriculares ANC Pro Gen 2',prov:'Shenzhen Direct',origen:'China',costo:180000,venta:390000,rivalNombre:'AudioStore Oficial',rival:379000},
{sku:'OPT-50MM',nombre:'Kit Lente Cámara 50mm f/1.8',prov:'B&H Miami Outlet',origen:'EE. UU.',costo:505000,venta:720000,rivalNombre:'Importador directo',rival:699000},
{sku:'WRT-OLED',nombre:'Smartwatch OLED Resistente',prov:'AliExpress Direct Choice',origen:'China',costo:95000,venta:240000,rivalNombre:'MegaTech Marketplace',rival:269900}];
const mg=p=>p.venta-p.costo,pc=p=>Math.round(mg(p)/p.venta*100),mod=id=>bootstrap.Modal.getOrCreateInstance($(id));
const save=()=>{S('skus',P);draw()};
function draw(){
$('tbody').innerHTML=P.map((p,i)=>`<tr><td><b>${esc(p.nombre)}</b><div class="mu small">SKU: ${esc(p.sku)}</div></td><td>${esc(p.prov)}<div class="mu small">${esc(p.origen)}</div></td><td><b>${cop(p.costo)} COP</b></td><td class="wa fw-bold">${cop(p.venta)} COP</td><td><span class="tag ${pc(p)>=0?'ok':'er'}">${pc(p)}%</span> <b>${cop(mg(p))}</b></td><td><button class="btn btn-out btn-sm" data-ind="${i}">Indagar</button></td></tr>`).join('');
const R=P.filter(p=>p.rival);
$('radar').innerHTML=R.map(p=>{const i=P.indexOf(p),pe=p.rival<p.venta,d=(Math.abs(p.rival-p.venta)/p.venta*100).toFixed(1);
return `<div class="card-eq mb-2 d-flex flex-wrap justify-content-between align-items-center gap-2"><div><b>${esc(p.nombre)}</b><div class="mu small">Rival: ${esc(p.rivalNombre||'—')}</div></div><div class="text-end"><b class="${pe?'er':'ok'}">${cop(p.rival)} COP</b><div class="small ${pe?'er':'ok'}">${pe?'-'+d+'% bajo tu precio':'+'+d+'% tu ventaja'}</div></div>${pe?`<button class="btn btn-ac btn-sm" data-aj="${i}">Ajustar a ${cop(p.rival-1000)}</button>`:'<button class="btn btn-out btn-sm" disabled>Ganando Buy Box</button>'}</div>`}).join('')||'<p class="mu">Sin rivales registrados.</p>';
const bajo=R.filter(p=>p.rival<p.venta).length;
$('stSku').textContent=P.length;$('stAl').textContent=bajo;$('stMg').textContent=cop(P.reduce((s,p)=>s+mg(p),0));
$('stSa').textContent=(R.length?Math.round((R.length-bajo)/R.length*100):100)+'/100'}
document.addEventListener('click',e=>{const t=e.target;
if(t.dataset.aj!==undefined){const p=P[t.dataset.aj];$('ajNom').textContent=p.nombre;$('ajP').value=p.rival-1000;$('ajOk').dataset.i=t.dataset.aj;$('ajErr').classList.add('d-none');mod('mAj').show()}
if(t.dataset.ind!==undefined){const p=P[t.dataset.ind],q=encodeURIComponent(p.nombre);$('indT').textContent=p.nombre;
$('indB').innerHTML=`<div class="card-eq small mb-2"><div class="d-flex justify-content-between"><span class="mu">Costo desembarcado</span>${cop(p.costo)}</div><div class="d-flex justify-content-between"><span class="mu">Venta sugerida</span>${cop(p.venta)}</div><div class="d-flex justify-content-between fw-bold"><span>Margen</span><span class="${mg(p)>=0?'ok':'er'}">${cop(mg(p))} (${pc(p)}%)</span></div>${p.rival?`<div class="d-flex justify-content-between"><span class="mu">Rival (${esc(p.rivalNombre||'')})</span>${cop(p.rival)}</div>`:''}</div><p class="mu small">Proveedor: ${esc(p.prov)} · Origen: ${esc(p.origen)}. Busca este producto en:</p><div class="d-flex gap-2"><a class="btn btn-out btn-sm" target="_blank" rel="noopener" href="https://listado.mercadolibre.com.co/${q}">Mercado Libre</a><a class="btn btn-out btn-sm" target="_blank" rel="noopener" href="https://www.amazon.com/s?k=${q}">Amazon</a></div>`;mod('mInd').show()}});
$('ajOk').onclick=e=>{const v=parseInt($('ajP').value);if(!(v>0)){$('ajErr').classList.remove('d-none');return}P[e.target.dataset.i].venta=v;save();mod('mAj').hide()};
$('addBtn').onclick=()=>{$('fErr').classList.add('d-none');mod('mSku').show()};
$('fOk').onclick=()=>{const g=id=>$(id).value.trim(),n=id=>parseInt($(id).value),er=m=>{$('fErr').textContent=m;$('fErr').classList.remove('d-none')};
if(!g('fSku')||!g('fNom'))return er('Escribe el SKU y el nombre.');if(P.some(p=>p.sku==g('fSku')))return er('Ese SKU ya existe.');
if(!(n('fCos')>0)||!(n('fVen')>0))return er('Costo y venta deben ser mayores que 0.');
P.push({sku:g('fSku'),nombre:g('fNom'),prov:g('fProv')||'—',origen:g('fOri')||'—',costo:n('fCos'),venta:n('fVen'),rivalNombre:'Rival',rival:n('fRiv')||0});
['fSku','fNom','fProv','fOri','fCos','fVen','fRiv'].forEach(i=>$(i).value='');save();mod('mSku').hide()};
$('csv').onclick=()=>{const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
const rows=[['Producto','SKU','Proveedor','Origen','Costo desembarcado (COP)','Venta sugerida (COP)','Margen (COP)','Margen (%)','Precio rival (COP)']].concat(P.map(p=>[p.nombre,p.sku,p.prov,p.origen,p.costo,p.venta,mg(p),pc(p),p.rival||'']));
const b=new Blob(['\ufeff'+rows.map(r=>r.map(q).join(';')).join('\n')],{type:'text/csv;charset=utf-8'});
const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='equalyz-skus-'+new Date().toISOString().slice(0,10)+'.csv';a.click();URL.revokeObjectURL(a.href)};
/* Simulador con datos de datos-dian.js */
const D=DATOS;$('tarifa').value=D.courierUsdLb;
$('simNota').textContent='Datos actualizados hasta el '+D.fechaTexto+'. Se actualizan cada semana. TRM: '+'$'+D.trm.toLocaleString('es-CO',{minimumFractionDigits:2})+'. '+D.fuente;
function sim(){const fob=+$('fob').value||0,kg=+$('kg').value||0,lb=+$('tarifa').value||0,ex=$('orig').value=='tlc'&&fob<=D.umbralUsd;
const conv=fob*D.trm,fl=kg*2.2046*lb*D.trm,ar=ex?0:(conv+fl)*D.arancel,iva=ex?0:(conv+fl+ar)*D.iva,tot=conv+fl+ar+iva,r=(a,b)=>`<div class="d-flex justify-content-between"><span class="mu">${a}</span>${b}</div>`;
$('simOut').innerHTML=r('Conversión FOB',cop(conv)+' COP')+r('Courier (estimado)',cop(fl)+' COP')+r('Arancel '+(ex?'(exento)':D.arancel*100+'%'),cop(ar)+' COP')+r('IVA '+(ex?'(excluido)':D.iva*100+'%'),cop(iva)+' COP')+`<div class="d-flex justify-content-between fw-bold mt-2"><span>Costo desembarcado</span><span class="wa">${cop(tot)} COP</span></div>`+r('Venta con +35%',cop(tot*1.35)+' COP')+`<p class="small mb-0 mt-2 ${ex?'ok':'wa'}">${ex?'Envío exento (hasta USD '+D.umbralUsd+' con TLC).':'Este envío paga arancel e IVA.'}</p>`}
['fob','kg','orig','tarifa'].forEach(i=>$(i).oninput=sim);sim();draw();
}

/* ---------- ALERTAS ---------- */
if($('rTag')){
const rules=()=>J('reglas',[]),obs=()=>J('obs',{}),log=()=>J('disp',[]),dir={baja:'baja',sube:'sube',ambas:'se mueve'};
function draw(){const R=rules(),L=log();
$('rList').innerHTML=R.length?R.map((r,i)=>`<div class="d-flex justify-content-between align-items-center border-top py-2 small"><span><b>${esc(r.tag)}</b> · avisar si ${dir[r.dir]} ≥ ${r.pct}% ${r.on?'':'<span class="tag">en pausa</span>'}</span><span><button class="btn btn-out btn-sm" data-t="${i}">${r.on?'Pausar':'Activar'}</button> <button class="btn btn-sm er" data-x="${i}">Borrar</button></span></div>`).join(''):'<p class="mu small mb-0">Aún no tienes reglas.</p>';
$('dList').innerHTML=L.length?L.map(l=>`<div class="card-eq mb-2 small"><b class="${l.c>0?'er':'ok'}">${l.c>0?'▲ +':'▼ '}${l.c.toFixed(1)}% ${esc(l.nom)}</b> <span class="mu">($${l.prev.toLocaleString('es-CO')} → $${l.p.toLocaleString('es-CO')}) · regla «${esc(l.tag)}» · ${esc(l.ts)}</span></div>`).join(''):'<p class="mu small mb-0">Sin avisos todavía.</p>'}
$('rOk').onclick=()=>{const t=$('rTag').value.trim().toLowerCase(),p=parseFloat($('rPct').value);if(!t||!(p>0)){$('rErr').classList.remove('d-none');return}
$('rErr').classList.add('d-none');const R=rules();R.push({tag:t,dir:$('rDir').value,pct:p,on:true});S('reglas',R);$('rTag').value='';draw()};
$('rList').onclick=e=>{const R=rules(),t=e.target.dataset;if(t.t!==undefined)R[t.t].on=!R[t.t].on;else if(t.x!==undefined)R.splice(t.x,1);else return;S('reglas',R);draw()};
$('oOk').onclick=()=>{const n=$('oNom').value.trim(),p=parseInt($('oPrecio').value);if(!n||!(p>0)){$('oErr').classList.remove('d-none');return}$('oErr').classList.add('d-none');
const O=obs(),k=n.toLowerCase(),prev=(O[k]||[]).slice(-1)[0];(O[k]=O[k]||[]).push(p);S('obs',O);
if(prev){const c=(p-prev)/prev*100,L=log();rules().filter(r=>r.on&&k.includes(r.tag)&&(r.dir=='ambas'||(r.dir=='baja')==(c<0))&&Math.abs(c)>=r.pct).forEach(r=>{L.unshift({nom:n,c,p,prev,tag:r.tag,ts:new Date().toLocaleString('es-CO')});
if(window.Notification&&Notification.permission=='granted')new Notification('Equalyz: '+n+(c>0?' subió ':' bajó ')+Math.abs(c).toFixed(1)+'%')});S('disp',L.slice(0,30))}
$('oNom').value=$('oPrecio').value='';draw()};
$('nOk').onclick=()=>{if(window.Notification)Notification.requestPermission()};
$('dClr').onclick=()=>{S('disp',[]);draw()};draw();}

/* ---------- PERFIL ---------- */
if($('pfNom')){const U=user();let foto=U.foto||'';
$('pfNom').value=U.nombre;$('pfMail').textContent=U.e;const sh=()=>$('pfAv').innerHTML=av({nombre:$('pfNom').value||U.nombre,foto},96);sh();
$('pfNom').oninput=sh;
$('pfFile').onchange=e=>{const f=e.target.files[0];if(!f||!f.type.startsWith('image/'))return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=128;const m=Math.min(im.width,im.height);c.getContext('2d').drawImage(im,(im.width-m)/2,(im.height-m)/2,m,m,0,0,128,128);foto=c.toDataURL('image/jpeg',.8);sh()};im.src=r.result};r.readAsDataURL(f)};
$('pfOk').onclick=()=>{const n=$('pfNom').value.trim();if(n.length<2)return;const c=CU();c[U.e].nombre=n;c[U.e].foto=foto;S('cuentas',c);location.reload()};
$('pfOut').onclick=()=>{try{localStorage.removeItem('sesion')}catch(x){}location='index.html'};
$('pfDel').onclick=()=>{const c=CU();delete c[U.e];S('cuentas',c);const cm=J('coment',{});for(const k in cm)cm[k]=cm[k].filter(x=>x.e!=U.e);S('coment',cm);
['sesion','skus','reglas','obs','disp','alertas','urls'].forEach(k=>{try{localStorage.removeItem(k)}catch(x){}});location='index.html'};}

/* ---------- FORO (Comunidad) ---------- */
if(document.querySelector('article.card-eq')){const U=user(),A=[...document.querySelectorAll('article.card-eq')];
const draw=()=>{const C=J('coment',{});A.forEach((a,i)=>{let b=a.querySelector('.foro');if(!b){b=document.createElement('div');b.className='foro border-top mt-3 pt-2';a.appendChild(b)}
const L=C[i]||[];b.innerHTML=`<b class="small">Foro (${L.length})</b>`+L.map((c,j)=>`<div class="small mt-2"><b>${esc(c.n)}</b> <span class="mu">${esc(c.ts)}</span>${U&&U.e==c.e?` <button class="btn btn-sm er p-0" data-cd="${i}.${j}">Borrar</button>`:''}<div>${esc(c.t)}</div></div>`).join('')
+(U?`<div class="d-flex gap-2 mt-2"><input class="form-control inp form-control-sm" id="cm${i}" placeholder="Escribe tu opinión" aria-label="Comentario"><button class="btn btn-ac btn-sm" data-ca="${i}">Comentar</button></div>`:'<button class="btn btn-out btn-sm mt-2" data-login>Inicia sesión para comentar</button>')})};
document.addEventListener('click',e=>{const d=e.target.dataset,C=J('coment',{});
if(d.ca!==undefined){const t=$('cm'+d.ca).value.trim();if(!t)return;(C[d.ca]=C[d.ca]||[]).push({e:U.e,n:U.nombre,t:t.slice(0,500),ts:new Date().toLocaleString('es-CO')});S('coment',C);draw()}
if(d.cd!==undefined){const[i,j]=d.cd.split('.');C[i].splice(j,1);S('coment',C);draw()}});draw()}
