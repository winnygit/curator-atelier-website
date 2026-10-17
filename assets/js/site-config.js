/* Curator Atelier · tracking IDs. Paste each ID between the quotes, commit, done.
   Every page loads this file, so one edit switches tracking on everywhere. Leave blank to keep it off. */
window.CA = {
  ga4: '',                     // Google Analytics 4 Measurement ID, e.g. 'G-AB12CD34EF'
  linkedinPartner: '',         // LinkedIn Insight Tag Partner ID, e.g. '1234567'
  linkedinLeadConversion: ''   // LinkedIn conversion ID for "Lead" (optional), e.g. '12345678'
};

(function () {
  var c = window.CA;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };
  if (c.ga4) {
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + c.ga4;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', c.ga4);
  }
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
