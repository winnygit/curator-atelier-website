/* Curator Atelier · inner pages: menu, scroll states, reveals, attribution, tracking, quick inquiry */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const ENDPOINT = 'https://formspree.io/f/xblwkzyq';

// attribution: first-touch UTMs and click IDs for this visit
try {
  const q = new URLSearchParams(location.search), got = {};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','li_fat_id'].forEach(k => { if (q.get(k)) got[k] = q.get(k); });
  if (Object.keys(got).length) sessionStorage.setItem('ca-attr', JSON.stringify(got));
  if (!sessionStorage.getItem('ca-landing')) sessionStorage.setItem('ca-landing', location.pathname + location.search);
  if (!sessionStorage.getItem('ca-ref')) sessionStorage.setItem('ca-ref', document.referrer || '');
} catch (e) {}
function attribution() { let a = {}; try { a = JSON.parse(sessionStorage.getItem('ca-attr') || '{}'); a.landing_page = sessionStorage.getItem('ca-landing') || ''; a.referrer = sessionStorage.getItem('ca-ref') || ''; } catch (e) {} return a; }
function send(data) { return fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) }).then(r => { if (!r.ok) throw new Error('send failed'); return r.json(); }); }
function track(fbEvent, gaEvent, extra) {
  try { if (window.fbq) fbq('track', fbEvent, extra || {}); } catch (e) {}
  try { if (window.gtag) gtag('event', gaEvent, extra || {}); } catch (e) {}
  try { if (fbEvent === 'Lead' && window.gtag) gtag('event', 'generate_lead', extra || {}); } catch (e) {}
  try { const id = window.CA && CA.linkedinLeadConversion; if (fbEvent === 'Lead' && id && window.lintrk) lintrk('track', { conversion_id: +id }); } catch (e) {}
}
window.CAtrack = track;
document.addEventListener('click', e => {
  const a = e.target.closest('a'); if (!a) return;
  const h = a.getAttribute('href') || '';
  if (h.startsWith('https://wa.me') || h.startsWith('mailto:') || h.startsWith('tel:') || h.includes('calendly.com')) track('Contact', 'contact_click', { method: h.split(':')[0].replace('https', 'whatsapp') });
});

// menu
const drawer = $('#drawer'), mb = $('#menuBtn');
if (drawer && mb) {
  mb.addEventListener('click', () => { drawer.hidden = false; mb.setAttribute('aria-expanded', 'true'); });
  $('#menuX').addEventListener('click', () => { drawer.hidden = true; mb.setAttribute('aria-expanded', 'false'); });
  drawer.addEventListener('click', e => { if (e.target.closest('a')) drawer.hidden = true; });
  addEventListener('keydown', e => { if (e.key === 'Escape') drawer.hidden = true; });
}

// scroll: nav, dock
const nav = $('#nav'), dock = $('#dock'); let lastY = 0, tk = false;
function frame() {
  const y = scrollY;
  if (nav) nav.classList.toggle('solid', y > 40);
  if (dock) dock.style.setProperty('--hide', (y > lastY + 4 && y > innerHeight) ? 1 : 0);
  lastY = y;
}
addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(() => { frame(); tk = false; }); } }, { passive: true });
frame();

// reveals and ribbons
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); e.target.style.setProperty('--r', 1); io.unobserve(e.target); } }), { threshold: .2 });
$$('.reveal').forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); io.observe(el); } });
$$('.ribbon').forEach(el => { if (el.getBoundingClientRect().top > innerHeight && !reduce) { el.style.setProperty('--r', 0); io.observe(el); } });

// videos play only while visible
$$('video[data-src]').forEach(v => {
  v.src = v.dataset.src;
  new IntersectionObserver(es => es.forEach(e => { if (reduce) return; e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }), { threshold: .25 }).observe(v);
});

// design preview slider
document.querySelectorAll('.ba').forEach(b => { const r = b.querySelector('input'); const set = () => b.style.setProperty('--x', r.value + '%'); r.addEventListener('input', set); set(); });

// quick inquiry forms
$$('form.qform').forEach(form => {
  const err = form.querySelector('.err'), btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (form.dataset.sending) return;
    const f = n => (form.elements[n] ? form.elements[n].value.trim() : '');
    if (!f('name') || !/^\S+@\S+\.\S+$/.test(f('email'))) { err.textContent = 'Add your name and a valid email so we can reply.'; return; }
    err.textContent = '';
    const data = { form: form.dataset.form || 'Website inquiry', page: location.href, ...attribution() };
    [...form.elements].forEach(el => { if (el.name && el.type !== 'submit') data[el.name] = el.value.trim(); });
    data._replyto = data.email;
    data._subject = 'New website inquiry: ' + (data.service_interest || data.form) + ' · ' + data.name;
    form.dataset.sending = '1'; btn.disabled = true; const label = btn.textContent; btn.textContent = 'Sending…';
    send(data).then(() => {
      track('Lead', 'lead_submit', { service: data.service_interest || '' });
      const d = document.createElement('div'); d.className = 'done'; d.setAttribute('role', 'status');
      d.innerHTML = '<p class="kicker">Received</p><h3>Thank you. Your brief is with us.</h3><p>We reply within 24 hours with ideas and next steps. Prefer to talk now? Message us on <a href="https://wa.me/13016367663" target="_blank" rel="noopener">WhatsApp</a> or <a href="https://calendly.com/hello-curatoratelier/30min" target="_blank" rel="noopener">book a call</a>.</p>';
      form.replaceChildren(d); form.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }).catch(() => {
      err.innerHTML = 'We could not send your brief. Please email <a href="mailto:hello@curatoratelier.com" style="color:var(--champagne)">hello@curatoratelier.com</a> or message us on WhatsApp.';
      btn.textContent = label;
    }).finally(() => { delete form.dataset.sending; btn.disabled = false; });
  });
});
})();
