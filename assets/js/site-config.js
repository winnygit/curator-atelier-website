/* Curator Atelier · tracking IDs + GA4 events. Paste each ID between the quotes, commit, done.
   Every page loads this file. Leave an ID blank (or the placeholder in) to keep that tag off. */
window.CA = {
  ga4: 'G-T4WZCEER6M',         // GA4 Measurement ID — Founder-approved 2026-10-26
  linkedinPartner: '9948874',  // LinkedIn Insight Tag Partner ID — Founder greened 2026-10-26
  linkedinLeadConversion: ''   // LinkedIn conversion ID for "Lead" (optional)
};

(function () {
  var c = window.CA;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };

  // page_section from the URL path (/christmas-environments/ and .html both -> christmas-environments)
  var slug = location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/, '') || 'home';
  var MAP = { 'index': 'home', 'home': 'home', 'christmas': 'christmas-environments',
    'christmas-environments': 'christmas-environments', 'appreciation-collection': 'gifting',
    'corporate-gifting': 'gifting', 'holiday-removal': 'holiday-removal', 'dealership': 'dealership',
    'careers': 'careers', 'thank-you': 'thank-you', 'privacy-policy': 'privacy' };
  var section = MAP[slug] || slug;

  var on = !!c.ga4 && !/X{6,}/.test(c.ga4);   // off while the placeholder is in
  if (on) {
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {   // reuse the AW gtag.js where present
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + c.ga4;
      document.head.appendChild(s);
    }
    if (!dataLayer.some(function (a) { return a && a[0] === 'js'; })) gtag('js', new Date());
    var cfg = { allow_google_signals: false, allow_ad_personalization_signals: false, page_section: section };
    if (/[?&]ga_debug=1\b/.test(location.search)) cfg.debug_mode = true;   // QA: add ?ga_debug=1 to any URL
    gtag('config', c.ga4, cfg);
  }

  function ev(name, params) {
    if (!on) return;
    params = params || {};
    params.send_to = c.ga4;          // GA4 only, not the Ads tag
    params.page_section = section;
    try { gtag('event', name, params); } catch (e) {}
  }

  window.CAga = {
    ev: ev,
    // call ONLY in the Formspree success branch
    lead: function (formName, serviceInterest) {
      formName = formName || 'Website inquiry';
      if (/careers/i.test(formName)) { ev('careers_interest_submit', { form_name: formName }); return; }
      var id = formName.toLowerCase().replace(/\s+page$/, '').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      ev('generate_lead', { form_id: id, form_name: formName, service_interest: serviceInterest || '' });
    }
  };

  // contact clicks (capture phase, so they fire before navigation)
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a) return;
    var h = a.getAttribute('href') || '', name = '';
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(h)) name = 'whatsapp_click';
    else if (/^tel:/i.test(h)) name = 'tel_click';
    else if (/^mailto:/i.test(h)) name = 'email_click';
    else if (/calendly\.com/i.test(h)) name = 'calendly_click';
    if (!name) return;
    var where = a.closest('#nav,nav,#drawer') ? 'nav' : a.closest('#dock') ? 'dock'
      : a.closest('footer') ? 'footer' : a.closest('form,.done') ? 'form' : 'body';
    ev(name, { link_url: h.split('?')[0], link_location: where, link_text: (a.textContent || '').trim().slice(0, 60) });
  }, true);

  if (c.linkedinPartner) {
    window._linkedin_partner_id = c.linkedinPartner;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(c.linkedinPartner);
    if (!window.lintrk) { window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); }; window.lintrk.q = []; }
    var l = document.createElement('script');
    l.async = true; l.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    document.head.appendChild(l);
  }
})();
