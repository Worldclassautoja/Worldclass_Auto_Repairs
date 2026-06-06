/* ============================================================
   WorldClass Auto — app.js
   Handles: navbar scroll, mobile menu, scroll-reveal, booking form
   ============================================================ */

/* ===== SCROLL REVEAL ===== */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* ===== NAVBAR SCROLL BEHAVIOUR ===== */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  if (navbar.classList.contains('transparent')) {
    function onScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('transparent');
      } else {
        navbar.classList.remove('scrolled');
        navbar.classList.add('transparent');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

/* ===== MOBILE MENU ===== */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
})();

/* ===== SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      var offset = 80;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   BOOKING FORM  (only runs on booking.html)
   ============================================================ */
(function () {
  var form = document.getElementById('bookingForm');
  if (!form) return;

  /* ---- Vehicle make → model data ---- */
  var MODELS = {
    'Toyota':     ['Aqua', 'Allion', 'Axio', 'Camry', 'CHR', 'Corolla', 'Fielder', 'Harrier', 'Hilux', 'Land Cruiser', 'Mark X', 'Prado', 'Premio', 'RAV4', 'Vitz', 'Wish', 'Yaris'],
    'Honda':      ['Accord', 'City', 'Civic', 'CR-V', 'Fit / Jazz', 'Freed', 'HR-V', 'Odyssey', 'Stepwagon', 'Stream', 'Vezel'],
    'Nissan':     ['AD Wagon', 'Almera', 'Caravan', 'Frontier', 'Leaf', 'March', 'Micra', 'Note', 'Pathfinder', 'Sentra', 'Tiida', 'X-Trail'],
    'Mitsubishi': ['ASX', 'Colt', 'Eclipse Cross', 'Galant', 'Lancer', 'Mirage', 'Outlander', 'Pajero', 'Space Star'],
    'Mazda':      ['Atenza', 'Axela', 'Biante', 'CX-3', 'CX-5', 'Demio', 'Mazda 2', 'Mazda 3', 'Mazda 6'],
    'Hyundai':    ['Accent', 'Creta', 'Elantra', 'i10', 'i20', 'Santa Fe', 'Sonata', 'Tucson'],
    'Kia':        ['Cerato', 'Optima', 'Picanto', 'Rio', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stinger'],
    'Suzuki':     ['Alto', 'Baleno', 'Cultus', 'Ignis', 'Jimny', 'Swift', 'SX4', 'Vitara'],
    'Ford':       ['Bronco', 'EcoSport', 'Edge', 'Explorer', 'F-150', 'Focus', 'Ranger'],
    'Other':      []
  };

  var makeEl     = document.getElementById('make');
  var modelEl    = document.getElementById('model');
  var modelText  = document.getElementById('model-text');
  var modelWrap  = document.getElementById('model-sel-wrap');

  /* Populate model dropdown when make changes */
  makeEl.addEventListener('change', function () {
    var make = this.value;
    clearErr(makeEl, 'make-err');

    if (make === 'Other') {
      modelWrap.style.display = 'none';
      modelText.style.display = 'block';
      modelText.value = '';
    } else {
      modelWrap.style.display = '';
      modelText.style.display = 'none';
      modelEl.innerHTML = '<option value="">Select model...</option>';

      if (make && MODELS[make]) {
        MODELS[make].forEach(function (m) {
          var opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          modelEl.appendChild(opt);
        });
        modelEl.disabled = false;
      } else {
        modelEl.innerHTML = '<option value="">Select make first...</option>';
        modelEl.disabled = true;
      }
    }
    clearErr(modelEl, 'model-err');
    clearErr(modelText, 'model-err');
  });

  /* ---- Date Picker ---- */
  var dpTrigger   = document.getElementById('dpTrigger');
  var dpCal       = document.getElementById('dpCal');
  var dpPrev      = document.getElementById('dpPrev');
  var dpNext      = document.getElementById('dpNext');
  var dpMonthLbl  = document.getElementById('dpMonthLabel');
  var dpDays      = document.getElementById('dpDays');
  var dpInput     = document.getElementById('preferred_date');

  var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAY_ABBR    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  /* View date: always 1st of the displayed month */
  var viewYear, viewMonth;
  var selectedDate = null;

  function initView() {
    var now = new Date();
    viewYear  = now.getFullYear();
    viewMonth = now.getMonth();
  }
  initView();

  function renderCalendar() {
    dpMonthLbl.textContent = MONTH_NAMES[viewMonth] + ' ' + viewYear;

    var today = new Date();
    today.setHours(0,0,0,0);

    var firstDay     = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();

    var html = '';

    /* Leading empty cells */
    for (var i = 0; i < firstDay; i++) {
      html += '<div class="dp-day dp-off"></div>';
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(viewYear, viewMonth, d);
      date.setHours(0,0,0,0);

      var dow      = date.getDay();
      var isWknd   = (dow === 0 || dow === 6);
      var isPast   = date < today;
      var isToday  = date.getTime() === today.getTime();
      var isSel    = selectedDate && date.getTime() === selectedDate.getTime();

      var cls = ['dp-day'];
      if (isWknd)  cls.push('dp-wknd');
      if (isPast)  cls.push('dp-past');
      if (isToday) cls.push('dp-today');
      if (isSel)   cls.push('dp-sel');

      var dateStr = date.toISOString().split('T')[0];
      var disabled = isWknd || isPast;
      html += '<div class="' + cls.join(' ') + '"' + (disabled ? '' : ' data-date="' + dateStr + '"') + '>' + d + '</div>';
    }

    dpDays.innerHTML = html;

    /* Click handlers on selectable days */
    dpDays.querySelectorAll('[data-date]').forEach(function (cell) {
      cell.addEventListener('click', function () {
        var ds = this.dataset.date;
        selectedDate = new Date(ds + 'T00:00:00');
        dpInput.value = ds;

        /* Update trigger text */
        var formatted = formatDate(selectedDate);
        dpTrigger.innerHTML =
          '<span class="dp-value">' + formatted + '</span>' +
          '<svg class="dp-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

        clearErr(dpTrigger, 'date-err');
        renderCalendar();
        setTimeout(closeCalendar, 160);
      });
    });
  }

  function formatDate(d) {
    return DAY_ABBR[d.getDay()] + ', ' + MONTH_NAMES[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function openCalendar() {
    dpCal.classList.add('open');
    dpTrigger.classList.add('open');
    dpTrigger.setAttribute('aria-expanded', 'true');
    renderCalendar();
  }

  function closeCalendar() {
    dpCal.classList.remove('open');
    dpTrigger.classList.remove('open');
    dpTrigger.setAttribute('aria-expanded', 'false');
  }

  dpTrigger.addEventListener('click', function (e) {
    e.stopPropagation();
    dpCal.classList.contains('open') ? closeCalendar() : openCalendar();
  });

  dpTrigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dpCal.classList.contains('open') ? closeCalendar() : openCalendar(); }
    if (e.key === 'Escape') closeCalendar();
  });

  dpPrev.addEventListener('click', function () {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  dpNext.addEventListener('click', function () {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  document.addEventListener('click', function (e) {
    if (!document.getElementById('datepicker').contains(e.target)) closeCalendar();
  });

  /* Prevent going to past months */
  dpPrev.addEventListener('click', function () {
    var now = new Date();
    var minY = now.getFullYear();
    var minM = now.getMonth();
    /* allow navigating within current year+month forward, but not back past today */
    if (viewYear < minY || (viewYear === minY && viewMonth < minM)) {
      viewYear  = minY;
      viewMonth = minM;
    }
    renderCalendar();
  }, true); /* capture so it fires after the main handler */

  renderCalendar();

  /* ---- Validation helpers ---- */
  function showErr(el, errId, msg) {
    el.classList.add('err');
    var errEl = document.getElementById(errId);
    if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
  }

  function clearErr(el, errId) {
    el.classList.remove('err');
    var errEl = document.getElementById(errId);
    if (errEl) errEl.classList.remove('show');
  }

  /* Clear errors on input */
  ['name','email','phone','make','model','service'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { clearErr(this, id + '-err'); });
  });
  if (modelText) modelText.addEventListener('input', function () { clearErr(this, 'model-err'); });

  /* ---- Full form validation ---- */
  function validateForm() {
    var ok = true;

    /* Name */
    var name = document.getElementById('name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      showErr(name, 'name-err', 'Please enter your full name (at least 2 characters).');
      ok = false;
    } else clearErr(name, 'name-err');

    /* Email */
    var email = document.getElementById('email');
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!email.value.trim() || !emailOk) {
      showErr(email, 'email-err', 'Please enter a valid email address.');
      ok = false;
    } else clearErr(email, 'email-err');

    /* Phone */
    var phone = document.getElementById('phone');
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length < 7) {
      showErr(phone, 'phone-err', 'Please enter a valid phone number.');
      ok = false;
    } else clearErr(phone, 'phone-err');

    /* Make */
    var make = document.getElementById('make');
    if (!make.value) {
      showErr(make, 'make-err', 'Please select your vehicle make.');
      ok = false;
    } else clearErr(make, 'make-err');

    /* Model */
    var model     = document.getElementById('model');
    var modelTxt  = document.getElementById('model-text');
    var makeVal   = make.value;

    if (makeVal === 'Other') {
      if (!modelTxt.value.trim()) {
        showErr(modelTxt, 'model-err', 'Please enter your vehicle model.');
        ok = false;
      } else clearErr(modelTxt, 'model-err');
    } else {
      if (!model.value) {
        showErr(model, 'model-err', 'Please select your vehicle model.');
        ok = false;
      } else clearErr(model, 'model-err');
    }

    /* Service */
    var service = document.getElementById('service');
    if (!service.value) {
      showErr(service, 'service-err', 'Please select a service type.');
      ok = false;
    } else clearErr(service, 'service-err');

    /* Date */
    var dateVal = document.getElementById('preferred_date').value;
    if (!dateVal) {
      dpTrigger.classList.add('err');
      var dateErr = document.getElementById('date-err');
      if (dateErr) { dateErr.textContent = 'Please select a preferred date.'; dateErr.classList.add('show'); }
      ok = false;
    } else {
      dpTrigger.classList.remove('err');
      var dateErr2 = document.getElementById('date-err');
      if (dateErr2) dateErr2.classList.remove('show');
    }

    return ok;
  }

  /* ---- API base — points to the Next.js backend ---- */
  var _h = window.location.hostname;
  var API_BASE = (_h === '' || _h === 'localhost' || _h === '127.0.0.1')
    ? 'http://localhost:3000'
    : '';  /* same origin when static site is served alongside Next.js */

  /* ---- Form submit ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) {
      var firstErr = form.querySelector('.err, .field-err.show');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin .8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>' +
      ' Submitting...';

    var makeVal     = document.getElementById('make').value;
    var modelVal    = makeVal === 'Other'
      ? document.getElementById('model-text').value.trim()
      : document.getElementById('model').value;
    var areaCode    = document.getElementById('areaCode').value;
    var phoneNum    = document.getElementById('phone').value.trim();

    var payload = {
      name:           document.getElementById('name').value.trim(),
      email:          document.getElementById('email').value.trim(),
      phone:          areaCode + phoneNum,
      vehicle_make:   makeVal,
      vehicle_model:  modelVal,
      service_type:   document.getElementById('service').value,
      preferred_date: document.getElementById('preferred_date').value,
      description:    document.getElementById('description').value.trim() || null,
    };

    fetch(API_BASE + '/api/bookings', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (d) { throw new Error(d.error || 'Submission failed.'); });
      return res.json();
    })
    .then(function (data) {
      form.style.display = 'none';
      var success = document.getElementById('formSuccess');
      success.classList.add('show');
      document.getElementById('bookingRef').textContent = data.reference || ('WCA-' + String(data.id).padStart(5, '0'));
      success.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
    .catch(function (err) {
      btn.disabled = false;
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
        ' Submit Booking Request';
      /* Show error below submit button */
      var errBox = document.getElementById('submit-err');
      if (!errBox) {
        errBox = document.createElement('p');
        errBox.id = 'submit-err';
        errBox.style.cssText = 'margin-top:10px;font-size:13px;color:#f87171;text-align:center;';
        btn.parentNode.insertBefore(errBox, btn.nextSibling);
      }
      errBox.textContent = err.message;
    });
  });

  /* Spin keyframe injected once */
  if (!document.getElementById('spin-style')) {
    var style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

})(); /* end booking form IIFE */
