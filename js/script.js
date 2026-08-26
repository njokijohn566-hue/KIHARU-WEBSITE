/* Hero background carousel — rotates the 5 existing hero images
     every 4s with a smooth crossfade. Self-contained; touches only
     the two .hero-bg-layer elements above. Degrades gracefully:
     if this script fails for any reason, .hero's own static
     background-image (home-page.webp) is still shown underneath. */
  (function(){
    var hero = document.querySelector('.hero');
    if(!hero) return;
    var layerA = hero.querySelector('.hero-bg-a');
    var layerB = hero.querySelector('.hero-bg-b');
    if(!layerA || !layerB) return;

    var images = ['home-page.webp','home-1.webp','home-2.webp','home-3.webp','home-4.webp'];
    if(images.length < 2) return;

    // Preload the images so each crossfade is smooth, not a blank flash.
    images.forEach(function(src){ var im = new Image(); im.src = src; });

    var index = 0;
    var current = layerA;
    var next = layerB;

    function showNext(){
      index = (index + 1) % images.length;
      next.style.backgroundImage = "url('" + images[index] + "')";
      next.style.opacity = '1';
      current.style.opacity = '0';
      var swap = current; current = next; next = swap;
    }

    setInterval(showNext, 4000);
  })();

/* ===== LONG COURSES DATA ===== */
const longCourses=[
  {name:"Building & Civil Engineering",slug:"building-civil-engineering",image:"building.webp",icon:"hard-hat"},
  {name:"Business & Liberal Studies",slug:"business-liberal-studies",image:"business.webp",icon:"briefcase"},
  {name:"Mechanical & Automotive Engineering",slug:"mechanical-automotive-engineering",image:"mechanic.webp",icon:"settings-2"},
  {name:"Electrical & Electronics Engineering",slug:"electrical-electronics-engineering",image:"electric.webp",icon:"zap"},
  {name:"Computing & Informatics",slug:"computing-informatics",image:"ict-2.webp",icon:"monitor"},
  {name:"Fashion & Design",slug:"fashion-design",image:"fashion.webp",icon:"scissors"},
  {name:"Cosmetology",slug:"cosmetology",image:"cosmetology.webp",icon:"sparkles"},
  {name:"Hospitality",slug:"hospitality",image:"hopitality.webp",icon:"utensils"},
  {name:"Social Work",slug:"social-work",image:"socialwork.webp",icon:"handshake"},
  {name:"Tourism Management",slug:"tourism-management",image:"tourism.webp",icon:"plane"}
];

const grid=document.getElementById("coursesGrid");
/* Guarded the same way as ugGrid below — cheap insurance against
   this exact class of "one missing element kills the whole script"
   bug happening again. */
if(grid){
  longCourses.forEach(c=>{
    const a=document.createElement("a");
    a.href=`course-detail.html?course=${c.slug}`;
    a.className="course-card";
    a.innerHTML=`<img class="course-image" src="${c.image}" alt="${c.name}"><div class="course-caption"><i data-lucide="${c.icon}"></i> ${c.name}</div>`;
    grid.appendChild(a);
  });
}

/* ===== UNDERGRADUATE GRID ===== */
const ugCourses=[
  {name:"Building & Civil Engineering",duration:"3 yrs Diploma / 2 yrs Certificate",icon:"hard-hat"},
  {name:"Mechanical & Automotive Engineering",duration:"3 yrs Diploma / 2 yrs Certificate",icon:"settings-2"},
  {name:"Electrical & Electronics Engineering",duration:"3 yrs Diploma / 2 yrs Certificate",icon:"zap"},
  {name:"Computing & Informatics",duration:"3 yrs Diploma / 2 yrs Certificate",icon:"monitor"},
  {name:"Business & Liberal Studies",duration:"3 yrs Diploma / 2 yrs Certificate",icon:"briefcase"},
  {name:"Fashion & Design",duration:"2 yrs Certificate",icon:"scissors"},
  {name:"Cosmetology",duration:"2 yrs Certificate",icon:"sparkles"},
  {name:"Hospitality",duration:"3 yrs Diploma / 2 yrs Certificate",icon:"utensils"},
  {name:"Social Work",duration:"3 yrs Diploma",icon:"handshake"},
  {name:"Tourism Management",duration:"3 yrs Diploma / 2 yrs Certificate",icon:"plane"}
];

const ugGrid=document.getElementById("ugGrid");
/* FIX: #ugGrid does not exist anywhere in this HTML file. Calling
   .appendChild on the null result of getElementById used to throw
   here, which is a synchronous top-level error — it killed every
   line of JS that came AFTER it in this <script> block, including
   the join-modal listener, dark-mode init, mobile drawer, gallery,
   carousel speed controls, and — critically — the entire Formspree
   contact-form submit handler further down the file. That is the
   real reason the contact form did not work: its event listener
   was never attached, so clicking "Send Message" fell through to
   the browser's native (page-reloading) form submission instead.
   Guarding with "if(ugGrid)" lets this block run harmlessly when
   the element is present and simply skip it when it is not,
   without touching any markup, layout, or styling. */
if(ugGrid){
  ugCourses.forEach(c=>{
    const d=document.createElement("div");
    d.className="programme-item";
    d.innerHTML=`<div class="prog-icon"><i data-lucide="${c.icon}"></i></div><div><h4>${c.name}</h4><p>${c.duration}</p></div>`;
    ugGrid.appendChild(d);
  });
}

/* ===== PAGE NAVIGATION ===== */
function showPage(id, pushHistory){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const target=document.getElementById("page-"+id);
  if(target){
    target.classList.add("active");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  document.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("active"));
  // Push a history entry so the browser back button navigates between pages
  if(pushHistory !== false){
    history.pushState({page:id}, '', '#'+id);
  }
}

// Handle browser back / forward buttons
window.addEventListener('popstate', function(e){
  const id = (e.state && e.state.page) ? e.state.page : 'home';
  showPage(id, false);
});

/* "Explore Courses" hero button — the Courses Offered / Short Courses
   section lives on the Home page. If we're already on Home, just
   smooth-scroll there; if we're on another page, switch to Home first
   (without its own top-of-page scroll fighting ours) and then smooth-
   scroll to the section once it's visible and laid out. Works the same
   in light and dark mode since it only affects scroll position. */
function goToCourses(){
  const homePage   = document.getElementById('page-home');
  const alreadyHome = homePage && homePage.classList.contains('active');

  function scrollToSection(){
    const target = document.getElementById('courses-section');
    if(target){ target.scrollIntoView({behavior:'smooth', block:'start'}); }
  }

  if(!alreadyHome){
    showPage('home');
    // Wait a beat for the page switch to render before measuring/scrolling
    requestAnimationFrame(function(){ setTimeout(scrollToSection, 60); });
  } else {
    scrollToSection();
  }
}

// On first load, set initial history state so back works from the first page
(function(){
  const hash = location.hash.replace('#','');

  // Deep link from an external page (e.g. course-detail.html's
  // "Back to Courses" button linking to index.html#courses) — land on
  // Home and smooth-scroll straight to the Courses Offered & Short
  // Courses section instead of the top of the page.
  if(hash === 'courses' || hash === 'courses-section'){
    history.replaceState({page:'home'}, '', '#home');
    showPage('home', false);
    requestAnimationFrame(function(){ setTimeout(goToCourses, 60); });
    return;
  }

  const startPage = hash && document.getElementById('page-'+hash) ? hash : 'home';
  history.replaceState({page:startPage}, '', '#'+startPage);
  showPage(startPage, false);
})();

/* ===== MODAL ===== */
function openModal(){const m=document.getElementById("joinModal"); if(m) m.classList.add("open");}
function closeModal(){const m=document.getElementById("joinModal"); if(m) m.classList.remove("open");}
(function(){
  const joinModalEl = document.getElementById("joinModal");
  if(joinModalEl){
    joinModalEl.addEventListener("click",function(e){
      if(e.target===this) closeModal();
    });
  }
})();

/* ===== DARK / LIGHT MODE =====
   The actual first-paint decision (saved choice, else system preference)
   already ran in <head> before the page rendered — this just syncs the
   toggle button's icon/label to whatever data-theme is already set. */
(function(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'dark' : 'light', false);

  // Live-follow the OS theme only for visitors who have never explicitly
  // chosen a theme on this site (no saved preference yet).
  if(window.matchMedia){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e){
      if(localStorage.getItem('kiharuTheme')) return; // user has an explicit choice — don't override it
      applyTheme(e.matches ? 'dark' : 'light', false);
    });
  }
})();

function applyTheme(theme, save){
  const btn = document.getElementById('themeToggle');
  if(theme === 'dark'){
    document.documentElement.setAttribute('data-theme','dark');
    if(btn){
      btn.innerHTML = '<i data-lucide="sun"></i><span class="theme-toggle-label">Light</span>';
      btn.title = 'Switch to light mode';
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    if(btn){
      btn.innerHTML = '<i data-lucide="moon"></i><span class="theme-toggle-label">Dark</span>';
      btn.title = 'Switch to dark mode';
    }
  }
  if(save) localStorage.setItem('kiharuTheme', theme);
  lucide.createIcons();
}

function toggleTheme(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark', true);
}

/* ===== MOBILE DRAWER ===== */
function openDrawer(){
  document.getElementById("mobileDrawer").classList.add("open");
  document.getElementById("mobileOverlay").classList.add("open");
}
function closeDrawer(){
  document.getElementById("mobileDrawer").classList.remove("open");
  document.getElementById("mobileOverlay").classList.remove("open");
}

/* ===== GALLERY FILTER ===== */
function filterGallery(cat, btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  /* filter both filled items and empty placeholders */
  document.querySelectorAll('.gallery-item, .gallery-empty').forEach(item=>{
    item.style.display = (cat==='all' || item.dataset.cat===cat) ? '' : 'none';
  });
}

/* ===== GALLERY LIGHTBOX ===== */
function openLightbox(el){
  const img = el.querySelector('img');
  /* Only open if a real image is present and loaded — never open on placeholders */
  if(!img || !img.src || img.src === window.location.href || img.style.display==='none') return;
  document.getElementById('lightboxImg').src = img.src;
  document.getElementById('lightboxImg').alt = img.alt;
  document.getElementById('lightboxCaption').textContent = img.alt;
  document.getElementById('galleryLightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(e){
  if(!e || e.target===document.getElementById('galleryLightbox') || e.target.closest('.lightbox-close')){
    document.getElementById('galleryLightbox').classList.remove('open');
    document.body.style.overflow='';
  }
}

/* ===== CAROUSEL SPEED ===== */
function setCarouselSpeed(seconds, e){
  var track = document.querySelector('.carousel-track');
  if(track){
    // Read current live position from computed transform matrix
    var matrix   = new DOMMatrix(getComputedStyle(track).transform);
    var currentX = matrix.m41;
    var halfW    = track.scrollWidth / 2;
    var fraction = halfW > 0 ? Math.abs(currentX) / halfW : 0;
    // Negative delay = resume from current visual position, not the beginning
    var delay    = -(fraction * seconds);
    track.style.animation = 'none';
    void track.offsetWidth; // force reflow to flush the 'none'
    track.style.animation  = 'carousel-scroll ' + seconds + 's ' + delay + 's linear infinite';
  }
  document.querySelectorAll('.spd-btn').forEach(function(b){ b.classList.remove('spd-active'); });
  var btn = (e && e.target) ? e.target : null;
  if(btn) btn.classList.add('spd-active');
}

/* ================================================================
   CONTACT FORM — FORMSPREE INTEGRATION
   ================================================================
   Endpoint is live and wired to the college's email address.
   To change the recipient email, log in to https://formspree.io,
   open the form dashboard, and update the email there — no code
   change needed.

   If you ever need to point this to a different Formspree form,
   update FORMSPREE_ENDPOINT below. That is the only line to edit.
   ================================================================ */

/* ── ① THE ONLY LINE TO EDIT if you ever change forms ────────── */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyeggrnw';
/* ─────────────────────────────────────────────────────────────── */

(function () {

  /* ── ② Grab the form and all UI elements by their existing ids ─ */
  var form       = document.getElementById('contactForm');
  if (!form) return; /* bail safely if the form isn't on this page */

  var btn        = document.getElementById('cf-submit');
  var btnText    = document.getElementById('cf-btn-text');
  var msgSuccess = document.getElementById('form-success');
  var msgError   = document.getElementById('form-error');
  var errDetail  = document.getElementById('form-error-detail');

  /* ── ③ Field references (used for validation and error display) ─ */
  var fName    = document.getElementById('cf-name');
  var fEmail   = document.getElementById('cf-email');
  var fSubject = document.getElementById('cf-subject');
  var fMessage = document.getElementById('cf-message');

  /* ── ④ Duplicate-submission guard ──────────────────────────────
     Set to true while a fetch is in flight; reset in finally().
     Prevents double-clicks and rapid re-submissions.            */
  var isSubmitting = false;

  /* ── ⑤ Validation helpers ───────────────────────────────────── */

  /* Shows or hides the inline error below a field */
  function setFieldError(inputEl, errId, hasError) {
    var errEl = document.getElementById(errId);
    if (hasError) {
      inputEl.classList.add('invalid');
      if (errEl) errEl.classList.add('show');
    } else {
      inputEl.classList.remove('invalid');
      if (errEl) errEl.classList.remove('show');
    }
  }

  /* Basic email format check */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /* Validates all required fields; returns true only if all pass */
  function validateForm() {
    var nameEmpty    = !fName.value.trim();
    var emailBad     = !isValidEmail(fEmail.value);
    var subjectEmpty = !fSubject.value;
    var msgShort     = fMessage.value.trim().length < 10;

    setFieldError(fName,    'err-name',    nameEmpty);
    setFieldError(fEmail,   'err-email',   emailBad);
    setFieldError(fSubject, 'err-subject', subjectEmpty);
    setFieldError(fMessage, 'err-message', msgShort);

    return !nameEmpty && !emailBad && !subjectEmpty && !msgShort;
  }

  /* ── ⑥ Live error clearing ──────────────────────────────────────
     Each required field clears its own error the moment the user
     starts typing/changing, giving immediate positive feedback.  */
  var fieldErrMap = {
    'cf-name'   : 'err-name',
    'cf-email'  : 'err-email',
    'cf-subject': 'err-subject',
    'cf-message': 'err-message'
  };

  [fName, fEmail, fSubject, fMessage].forEach(function (el) {
    /* 'input' covers typing; 'change' covers select dropdowns    */
    ['input', 'change'].forEach(function (evt) {
      el.addEventListener(evt, function () {
        el.classList.remove('invalid');
        var errEl = document.getElementById(fieldErrMap[el.id]);
        if (errEl) errEl.classList.remove('show');
      });
    });
  });

  /* ── ⑦ Form submit handler ──────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault(); /* stop the default browser page reload    */

    /* ── Honeypot: bots fill this hidden field; humans leave it blank.
       If it has any value, silently discard the submission.      */
    var hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value.length > 0) {
      /* Pretend success so the bot gets no feedback              */
      return;
    }

    /* ── Duplicate-submission guard ─────────────────────────────── */
    if (isSubmitting) { return; }

    /* ── Client-side validation ─────────────────────────────────── */
    if (!validateForm()) {
      /* Hide any stale feedback banners                          */
      msgSuccess.classList.remove('show');
      msgError.classList.remove('show');
      /* Scroll the first red field into view for the user       */
      var firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    /* ── Lock the form ─────────────────────────────────────────── */
    isSubmitting      = true;
    btn.disabled      = true;
    btnText.textContent = 'Sending\u2026'; /* "Sending…"           */

    /* Hide any previously shown feedback banners                */
    msgSuccess.classList.remove('show');
    msgError.classList.remove('show');

    /* ── Build the payload ──────────────────────────────────────
       FormData automatically collects every named <input>,
       <select>, and <textarea> inside the form, including:
         name, phone, email, subject, message, _gotcha, _subject  */
    var payload = new FormData(form);

    /* ── Send to Formspree via fetch ────────────────────────────
       'Accept: application/json' tells Formspree to reply in
       JSON rather than redirecting, which is required for AJAX. */
    fetch(FORMSPREE_ENDPOINT, {
      method : 'POST',
      body   : payload,
      headers: { 'Accept': 'application/json' }
    })

    /* ── Handle the response ─────────────────────────────────── */
    .then(function (response) {
      if (response.ok) {
        /* ── SUCCESS ─────────────────────────────────────────── */
        form.reset();                          /* clear all fields */
        msgSuccess.classList.add('show');      /* show green banner */
        msgSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        /* ── HTTP-level failure (4xx / 5xx) ─────────────────── */
        return response.json().then(function (body) {
          /* Formspree puts a human-readable reason in body.error */
          var reason = (body && body.error)
            ? body.error
            : 'Server returned status ' + response.status + '.';
          throw new Error(reason);
        });
      }
    })

    /* ── Handle network errors or thrown errors ─────────────── */
    .catch(function (err) {
      errDetail.textContent = err.message
        ? err.message + ' Please try again or contact us by phone.'
        : 'A network error occurred. Please check your connection and try again.';
      msgError.classList.add('show');
      msgError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    })

    /* ── Always unlock the form when done ───────────────────── */
    .finally(function () {
      isSubmitting        = false;
      btn.disabled        = false;
      btnText.textContent = 'Send Message';
      /* Re-run Lucide so the send icon re-renders after reset  */
      if (typeof lucide !== 'undefined') { lucide.createIcons(); }
    });

  }); /* end submit handler */

})(); /* end IIFE */

/* ===== LOCATION PAGE INIT ===== */
(function initLocationPage(){
  try{

    /* ── ① The only two lines to edit once you have the real links ──
       Embed URL: on Google Maps, search the college → Share →
       Embed a map → Copy HTML → take the "src" value out of the
       <iframe> tag and paste it below.
       Directions URL: on Google Maps, search the college → Share →
       copy the plain maps.google.com link and paste it below.     */
    var EMBED_SRC = ''; /* Replace with official Google Maps Embed URL */
    var MAP_LINK  = ''; /* Replace with official Google Maps Directions Link */
    /* ──────────────────────────────────────────────────────────────── */

    var iframe      = document.getElementById('mapIframe');
    var placeholder = document.getElementById('mapEmbedPlaceholder');
    var getBtn      = document.getElementById('getDirectionsBtn');

    /* Wire the Get Directions button once a real link is supplied.
       Left disabled-looking (no href change) until then, so a stray
       click can't send a visitor to a broken "#" URL. */
    if (getBtn) {
      if (MAP_LINK) {
        getBtn.href = MAP_LINK;
      } else {
        getBtn.addEventListener('click', function (e) { e.preventDefault(); });
        getBtn.setAttribute('aria-disabled', 'true');
        getBtn.style.opacity = '.6';
        getBtn.style.cursor = 'not-allowed';
      }
    }

    /* Swap the placeholder card for the live embed once a real
       Maps embed URL is supplied. Until then, the placeholder stays
       visible so the section never looks broken or blank. */
    if (iframe && EMBED_SRC) {
      iframe.src = EMBED_SRC;
      iframe.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    }

  }catch(err){ console.warn('Location init error', err); }
})();

/* ===== WHATSAPP WIDGET TOGGLE =====
   Purely UI (open/close the contact chooser). The links themselves are
   plain <a href="https://wa.me/..."> and work with JS disabled. */
(function(){
  var fabBtn = document.getElementById('waFabBtn');
  var panel = document.getElementById('waPanel');
  if(!fabBtn || !panel){ return; }

  function openPanel(){
    panel.classList.add('open');
    panel.setAttribute('aria-hidden','false');
    fabBtn.setAttribute('aria-expanded','true');
  }
  function closePanel(){
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
    fabBtn.setAttribute('aria-expanded','false');
  }

  fabBtn.addEventListener('click', function(){
    if(panel.classList.contains('open')){ closePanel(); } else { openPanel(); }
  });

  document.addEventListener('click', function(event){
    if(panel.classList.contains('open') && !panel.contains(event.target) && event.target !== fabBtn && !fabBtn.contains(event.target)){
      closePanel();
    }
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && panel.classList.contains('open')){
      closePanel();
      fabBtn.focus();
    }
  });
})();

/* ===== KIHARU AI CHAT WIDGET (local dev/testing) =====
   Frontend-only: opens/closes the panel, sends the typed message to the
   AI backend, and renders the response. Does not touch any backend file.
   Local dev vs production URL detection: */
(function(){
  var panel = document.getElementById('assistantChatPanel');
  var button = document.getElementById('assistantChatButton');
  var closeBtn = document.getElementById('assistantChatClose');
  var form = document.getElementById('assistantChatForm');
  var input = document.getElementById('assistantChatInput');
  var messages = document.getElementById('assistantChatMessages');
  var status = document.getElementById('assistantChatStatus');
  if(!panel || !button || !form || !input || !messages || !status){ return; }

  var isLocalStaticFrontend =
    location.protocol === 'file:' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === 'localhost' ||
    location.hostname === '192.168.0.104';

  var aiChatUrl = isLocalStaticFrontend
  ? 'http://127.0.0.1:5000/api/ai/chat'
  : 'https://kiharu-website.onrender.com/api/ai/chat';

  function scrollMessages(){
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(role, text, attachment){
  var messageEl = document.createElement('div');
  messageEl.className = 'assistant-chat-message ' + role;

  var bubble = document.createElement('div');
  bubble.className = 'assistant-chat-bubble';

  var span = document.createElement('span');
  span.textContent = text;
  bubble.appendChild(span);

  if (role === 'assistant' && attachment && attachment.url) {
    var documentCard = document.createElement('div');
    documentCard.className = 'assistant-chat-document';

    var iconWrap = document.createElement('div');
    iconWrap.className = 'assistant-chat-document-icon';
    var iconEl = document.createElement('i');
    iconEl.setAttribute('data-lucide', 'file-text');
    iconWrap.appendChild(iconEl);

    var infoWrap = document.createElement('div');
    infoWrap.className = 'assistant-chat-document-info';
    var titleEl = document.createElement('strong');
    titleEl.textContent = attachment.title || 'Kiharu TVC Document';
    var captionEl = document.createElement('span');
    captionEl.textContent = 'Official PDF document';
    infoWrap.appendChild(titleEl);
    infoWrap.appendChild(captionEl);

    var linkEl = document.createElement('a');
    linkEl.className = 'assistant-chat-document-btn';
    linkEl.setAttribute('href', attachment.url);
    linkEl.setAttribute('target', '_blank');
    linkEl.setAttribute('rel', 'noopener');
    var linkIcon = document.createElement('i');
    linkIcon.setAttribute('data-lucide', 'download');
    linkEl.appendChild(linkIcon);
    linkEl.appendChild(document.createTextNode(' ' + (attachment.label || 'View PDF')));

    documentCard.appendChild(iconWrap);
    documentCard.appendChild(infoWrap);
    documentCard.appendChild(linkEl);

    bubble.appendChild(documentCard);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  messageEl.appendChild(bubble);
  messages.appendChild(messageEl);
  scrollMessages();
}

  function setStatus(text, error){
    status.textContent = text;
    status.style.color = error ? 'var(--danger)' : 'var(--muted)';
  }

  function openPanel(){
    panel.classList.add('open');
    panel.setAttribute('aria-hidden','false');
    button.setAttribute('aria-expanded','true');
    input.focus();
  }

  function closePanel(){
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
    button.setAttribute('aria-expanded','false');
  }

  button.addEventListener('click', function(){
    if(panel.classList.contains('open')){ closePanel(); } else { openPanel(); }
  });
  button.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      button.click();
    }
  });

  closeBtn.addEventListener('click', closePanel);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var value = input.value.trim();
    if(!value){ return; }
    addMessage('user', value);
    input.value = '';
    setStatus('Sending...', false);

    fetch(aiChatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: value })
    }).then(function(response){
      return response.json().then(function(data){
        if(!response.ok || !data.success){
          throw new Error(data.message || 'AI request failed');
        }
        var hasDocument = data.document && typeof data.document.url === 'string' && data.document.url.length > 0;
        addMessage('assistant', data.message || 'Sorry, I could not find an answer.', hasDocument ? data.document : null);
        setStatus('Ready for another question.', false);
      });
    }).catch(function(err){
      addMessage('assistant', 'Sorry, the AI assistant is unavailable right now. Please try again later.');
      setStatus(err.message || 'Request failed.', true);
    });
  });

  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && panel.classList.contains('open')){
      closePanel();
      button.focus();
    }
  });
})();

/* ===== INIT LUCIDE ===== */
lucide.createIcons();