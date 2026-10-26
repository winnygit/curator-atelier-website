/* Curator Atelier · The arrival (box) + name preview */
(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// ---- arrival
const sec=document.getElementById('arrival');
if(sec){
  const ph=[...sec.querySelectorAll('.arr-ph img')],cap=sec.querySelector('.arr-cap'),rng=sec.querySelector('.arr-ctl input'),rep=sec.querySelector('.arr-ctl button');
  const caps=['01 · Arrival — a presence, before a word.','02 · Unlock — the ribbon gives way.','03 · Open — the lid lifts on light.','04 · The letter — first, the letter.','05 · The words — written only for them.','06 · Discover — then, the gesture.','07 · Keepsake — something to keep, every December.'];
  const cl=x=>Math.max(0,Math.min(1,x)),ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  let auto=null,last=-1;
  function render(p){
    const n=ph.length,seg=1/n;
    ph.forEach((im,i)=>{if(i)im.style.opacity=ease(cl((p-i*seg+.08)/.14)).toFixed(3);im.style.setProperty('--k',cl(p*n-i).toFixed(3))});
    const k=Math.min(n-1,Math.floor(p*n+.0001));if(k!==last){cap.textContent=caps[k];last=k}
    const v=Math.round(p*100);if(+rng.value!==v)rng.value=v;rng.style.setProperty('--pct',v+'%');
  }
  const isStatic=()=>reduce||sec.classList.contains('static');
  function fromScroll(){
    if(auto||isStatic())return;
    const r=sec.getBoundingClientRect(),span=sec.offsetHeight-innerHeight;
    render(cl(-r.top/Math.max(1,span)));
  }
  let tk=false;addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(()=>{fromScroll();tk=false})}},{passive:true});
  addEventListener('resize',fromScroll);
  rng.addEventListener('input',()=>{
    const p=rng.value/100;
    if(isStatic()){render(p);return}
    auto=null;const top=sec.getBoundingClientRect().top+scrollY,span=sec.offsetHeight-innerHeight;
    scrollTo({top:top+p*span,behavior:'instant'});render(p);
  });
  rep.addEventListener('click',()=>{
    const t0=performance.now(),dur=reduce?0:2600;
    if(!dur){render(1);return}
    auto=true;render(0);
    const step=t=>{const p=cl((t-t0)/dur);render(p);if(p<1&&auto)requestAnimationFrame(step);else auto=null};requestAnimationFrame(step);
    if(window.CAtrack)CAtrack('ViewContent','box_replay');
  });
  if(isStatic())render(1);else fromScroll();
}
// ---- name preview
const np=document.getElementById('npv');
if(np){
  const who=np.querySelector('.who'),inp=np.querySelector('input'),lines=np.querySelector('.npv-note em'),head=np.querySelector('.npv-note b');
  const occ={christmas:['With appreciation,','For everything we built together this year, and everything still to come.'],thanks:['With thanks,','For the trust you placed in us, and the work we made together.'],milestone:['In celebration,','For a milestone worth marking, and the people who made it happen.']};
  let cur='christmas';
  const upd=()=>{const v=inp.value.trim();who.textContent=v||'Your company';head.textContent=occ[cur][0];lines.textContent=occ[cur][1]};
  inp.addEventListener('input',upd);
  np.querySelectorAll('.npv-tabs button').forEach(b=>b.addEventListener('click',()=>{cur=b.dataset.k;np.querySelectorAll('.npv-tabs button').forEach(x=>x.setAttribute('aria-pressed',x===b));upd()}));
  const use=np.querySelector('[data-use]');
  if(use)use.addEventListener('click',e=>{
    const f=document.querySelector('form.qform');if(!f)return;
    const v=inp.value.trim();if(v&&f.elements.organization&&!f.elements.organization.value)f.elements.organization.value=v;
    const sel=f.elements.timing;if(sel){const map={christmas:'Holiday 2026',thanks:'Client closing or milestone',milestone:'Client closing or milestone'};[...sel.options].forEach(o=>{if(o.text===map[cur])sel.value=o.value||o.text})}
    if(f.elements.notes&&!f.elements.notes.value)f.elements.notes.value='Card preview: '+head.textContent+' '+(v||'')+' ('+cur+')';
  });
  upd();
}
// ---- christmas pathway
const pw=document.getElementById('pathway');
if(pw){
  const imgs=[...pw.querySelectorAll('.pw-media img')],btns=[...pw.querySelectorAll('.pw-steps button')],cap=pw.querySelector('.pw-cap');
  let cur=0,auto=!reduce,timer=null;
  const go=i=>{cur=i;imgs.forEach((m,j)=>m.classList.toggle('on',j===i));btns.forEach((b,j)=>b.setAttribute('aria-selected',j===i));if(cap)cap.style.visibility=i<3?'visible':'hidden'};
  btns.forEach((b,i)=>b.addEventListener('click',e=>{if(e.target.closest('a'))return;auto=false;clearInterval(timer);go(i)}));
  const start=()=>{if(!auto||timer)return;timer=setInterval(()=>go((cur+1)%btns.length),5200)};
  new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)start();else{clearInterval(timer);timer=null}}),{threshold:.3}).observe(pw);
  go(0);
}
})();
