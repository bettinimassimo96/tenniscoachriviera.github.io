/* Tennis Coach Riviera: consenso cookie, Google Analytics, testo WhatsApp */
(function () {
  var GA_ID = 'G-5NF0RS1WSD';
  var KEY = 'tcr_consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // il consenso vale 6 mesi
  var WA = 'https://wa.me/33636047722';

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
  }

  function lang() {
    var l = (document.documentElement.getAttribute('lang') || 'fr').slice(0, 2).toLowerCase();
    return (l === 'en' || l === 'it') ? l : 'fr';
  }

  /* ---------- Consenso ---------- */
  function readChoice() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && (Date.now() - c.t) < MAX_AGE) return c.v;
    } catch (e) {}
    return null;
  }
  function saveChoice(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  var gaLoaded = false;
  function startGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('set', 'user_properties', { lang: lang() });
    gtag('config', GA_ID);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  var TXT = {
    fr: { msg: 'Ce site utilise Google Analytics pour mesurer les visites, uniquement avec votre accord.',
          yes: 'Accepter', no: 'Refuser', more: 'En savoir plus' },
    en: { msg: 'This site uses Google Analytics to measure visits, only with your consent.',
          yes: 'Accept', no: 'Decline', more: 'Learn more' },
    it: { msg: 'Questo sito usa Google Analytics per misurare le visite, solo con il tuo consenso.',
          yes: 'Accetta', no: 'Rifiuta', more: 'Maggiori informazioni' }
  };

  var CSS =
    '#tcr-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
    'background:#142238;color:#E8E0D4;border:1px solid rgba(184,151,58,.35);border-radius:4px;' +
    'padding:18px 20px;font-family:"DM Sans",system-ui,sans-serif;font-size:14px;line-height:1.55;' +
    'box-shadow:0 10px 30px rgba(0,0,0,.35)}' +
    '#tcr-cookie p{margin:0 0 14px}' +
    '#tcr-cookie a{color:#D4B86A;text-decoration:underline;text-underline-offset:3px}' +
    '#tcr-cookie .tcr-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}' +
    '#tcr-cookie button{font:inherit;font-size:13px;letter-spacing:.5px;padding:9px 20px;cursor:pointer;' +
    'border-radius:2px;border:1px solid #B8973A;background:transparent;color:#E8E0D4;min-width:110px}' +
    '#tcr-cookie button:hover{background:rgba(184,151,58,.15)}' +
    '#tcr-cookie button:focus-visible,#tcr-cookie a:focus-visible{outline:2px solid #D4B86A;outline-offset:2px}' +
    '#tcr-cookie .tcr-more{margin-left:auto;font-size:13px}' +
    '@media (max-width:480px){#tcr-cookie{left:10px;right:10px;bottom:10px;padding:16px}' +
    '#tcr-cookie button{flex:1}#tcr-cookie .tcr-more{margin-left:0;width:100%}}';

  var box = null, observer = null;
  function render() {
    if (!box) return;
    var t = TXT[lang()];
    box.setAttribute('aria-label', 'Cookies');
    box.innerHTML =
      '<p>' + t.msg + '</p><div class="tcr-row">' +
      '<button type="button" data-v="granted">' + t.yes + '</button>' +
      '<button type="button" data-v="denied">' + t.no + '</button>' +
      '<a class="tcr-more" href="/mentions-legales.html#cookies">' + t.more + '</a></div>';
    box.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { choose(b.getAttribute('data-v')); });
    });
  }
  function showBanner() {
    if (box) return;
    if (!document.getElementById('tcr-cookie-css')) {
      var st = document.createElement('style');
      st.id = 'tcr-cookie-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    box = document.createElement('div');
    box.id = 'tcr-cookie';
    box.setAttribute('role', 'dialog');
    document.body.appendChild(box);
    render();
  }
  function hideBanner() {
    if (box) { box.remove(); box = null; }
  }
  function clearGaCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
      });
    });
  }
  function choose(v) {
    saveChoice(v);
    hideBanner();
    if (v === 'granted') startGA();
    else {
      clearGaCookies();
      if (!gaLoaded) return;
      gtag('consent', 'update', { analytics_storage: 'denied' });
      location.reload();
    }
  }
  window.tcrCookieSettings = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    hideBanner();
    showBanner();
  };

  /* La lingua può cambiare dal selettore: aggiorna banner e GA */
  function watchLang() {
    if (!window.MutationObserver) return;
    observer = new MutationObserver(function () {
      render();
      if (gaLoaded) gtag('set', 'user_properties', { lang: lang() });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  /* ---------- Testo precompilato WhatsApp ---------- */
  var PAGES = {
    '': { fr: 'accueil', en: 'home', it: 'home' },
    'index': { fr: 'accueil', en: 'home', it: 'home' },
    'about': { fr: 'à propos', en: 'about', it: 'chi sono' },
    'nice': { fr: 'Nice', en: 'Nice', it: 'Nizza' },
    'antibes': { fr: 'Antibes', en: 'Antibes', it: 'Antibes' },
    'biot': { fr: 'Biot', en: 'Biot', it: 'Biot' },
    'cannes': { fr: 'Cannes', en: 'Cannes', it: 'Cannes' },
    'cap-ferrat': { fr: 'Cap Ferrat', en: 'Cap Ferrat', it: 'Cap Ferrat' },
    'monaco': { fr: 'Monaco', en: 'Monaco', it: 'Monaco' },
    'mougins': { fr: 'Mougins', en: 'Mougins', it: 'Mougins' },
    'valbonne': { fr: 'Valbonne', en: 'Valbonne', it: 'Valbonne' }
  };
  function pageName(l) {
    var slug = location.pathname.split('/').pop().replace('.html', '');
    var p = PAGES[slug];
    if (!p && location.pathname.indexOf('/blog/') > -1) return 'blog';
    return p ? p[l] : null;
  }
  function waText(a) {
    var l = lang();
    var oc = a.getAttribute('onclick') || '';
    if (oc.indexOf('cta_quote_villa') > -1) {
      return { fr: 'Bonjour Massimo, je souhaite un devis pour des leçons en villa.',
               en: 'Hello Massimo, I would like a quote for lessons at a villa.',
               it: 'Buongiorno Massimo, vorrei un preventivo per lezioni in villa.' }[l];
    }
    if (oc.indexOf('cta_partnership_hotel') > -1) {
      return { fr: 'Bonjour Massimo, je vous contacte au sujet d\u2019un partenariat avec notre établissement.',
               en: 'Hello Massimo, I am contacting you about a partnership with our hotel.',
               it: 'Buongiorno Massimo, la contatto per una possibile collaborazione con la nostra struttura.' }[l];
    }
    var p = pageName(l);
    if (!p) return null;
    return { fr: 'Bonjour Massimo, je vous écris depuis votre site (page ' + p + ').',
             en: 'Hello Massimo, I am writing from your website (' + p + ' page).',
             it: 'Buongiorno Massimo, le scrivo dal suo sito (pagina ' + p + ').' }[l];
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if (!a) return;
    if (!a.hasAttribute('data-wa-base')) {
      if (a.href.indexOf('text=') > -1) return; // il blog ha già il suo testo
      a.setAttribute('data-wa-base', a.href.split('?')[0]);
    }
    var t = waText(a);
    a.href = a.getAttribute('data-wa-base') + (t ? '?text=' + encodeURIComponent(t) : '');
  }, true);

  /* ---------- Avvio ---------- */
  function init() {
    watchLang();
    var c = readChoice();
    if (c === 'granted') startGA();
    else {
      clearGaCookies();
      if (c === null) showBanner();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
