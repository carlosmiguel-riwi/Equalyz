(function(){var k='equalyz-tema',r=document.documentElement,t='dark';
try{t=localStorage.getItem(k)||'dark'}catch(e){}
r.setAttribute('data-bs-theme',t);
document.addEventListener('DOMContentLoaded',function(){
var b=document.getElementById('tema');if(!b)return;
function p(){var d=r.getAttribute('data-bs-theme')==='dark';
b.textContent=d?'☀ Modo claro':'🌙 Modo oscuro';
b.setAttribute('aria-label',d?'Cambiar a modo claro':'Cambiar a modo oscuro')}
p();
b.addEventListener('click',function(){
var n=r.getAttribute('data-bs-theme')==='dark'?'light':'dark';
r.setAttribute('data-bs-theme',n);
try{localStorage.setItem(k,n)}catch(e){}
p()})})})();
