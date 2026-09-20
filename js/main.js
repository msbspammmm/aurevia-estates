/* ==========================================================================
   AUREVIA ESTATES — Portfolio Demo
   Interactions: header state, mobile menu, reveal, parallax, search filter,
   modal system (contact + articles), demo contact form.
   ========================================================================== */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     Tiny helpers
     ------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  /* ------------------------------------------------------------
     Demo data
     ------------------------------------------------------------ */
  var RESIDENCES = [
    {
      name: 'The Maris Residence', city: 'Dubai', location: 'Dubai, UAE', position: 'dubai',
      typeLabel: 'Contemporary Villa', type: 'villa', price: 'AED 8.4M', priceKey: 'mid',
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Villa Celeste', city: 'Abu Dhabi', location: 'Abu Dhabi, UAE', position: 'abu-dhabi',
      typeLabel: 'Private Estate', type: 'estate', price: 'AED 12.8M', priceKey: 'high',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'The Meridian', city: 'Dubai', location: 'Dubai, UAE', position: 'dubai',
      typeLabel: 'Sky Penthouse', type: 'penthouse', price: 'AED 6.9M', priceKey: 'mid',
      img: 'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Maison Lumière', city: 'Dubai', location: 'Dubai, UAE', position: 'dubai',
      typeLabel: 'Waterfront Penthouse', type: 'penthouse', price: 'AED 7.5M', priceKey: 'mid',
      img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Casa Azzurra', city: 'Abu Dhabi', location: 'Abu Dhabi, UAE', position: 'abu-dhabi',
      typeLabel: 'Contemporary Villa', type: 'villa', price: 'AED 9.6M', priceKey: 'mid',
      img: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'The Observatory', city: 'Dubai', location: 'Dubai, UAE', position: 'dubai',
      typeLabel: 'City Apartment', type: 'apartment', price: 'AED 4.2M', priceKey: 'low',
      img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    }
  ];

  var ARTICLES = {
    design: {
      category: 'Design',
      title: 'The New Language of Modern Luxury',
      img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      alt: 'A minimalist living room with tailored furniture',
      lede: 'Luxury is no longer measured in ornament. It is measured in restraint, proportion, and the quality of silence in a room.',
      paragraphs: [
        'The most compelling residences today feel quiet before they feel grand. Light is the first material; space the second. Materials do the talking — stone, timber, bronze, linen — without raising their voice.',
        'Proportion does the heavy lifting of ornament in a modern home. A room resolved in two dimensions and finished in soft daylight needs nothing more. The difference between decorated and designed is the difference between accumulation and intention.',
        'For the buyer, this means reading a home differently: asking how it will feel on a Tuesday afternoon, how its rooms hold evening light, and whether the architecture makes daily life feel considered. That is the new language of modern luxury — and it is spoken softly.'
      ]
    },
    architecture: {
      category: 'Architecture',
      title: 'Inside the Rise of Architectural Residences',
      img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80',
      alt: 'A sculptural white concrete building against a clear sky',
      lede: 'Buyers are increasingly drawn to homes conceived by architects — spaces designed from first principles rather than added up from a floor plan.',
      paragraphs: [
        'There is a widening gap between a house built from a catalogue of rooms and a residence designed from a single idea. In the architectural home, the idea organises everything: the plan, the openings, the heights, even where the afternoon shadow will fall.',
        'This shift is most visible where land is scarce and expectations are high. The residences being commissioned now are quieter on their facades and more precise within. The signature is not a logo — it is a building that thinks.',
        'For a considered portfolio, architecture becomes the first filter. A home cannot be re-engineered later; it is either conceived well at the outset or it forever compensates. That is why architecture matters more in a curated collection than anywhere else.'
      ]
    },
    address: {
      category: 'Address',
      title: 'What Makes an Address Truly Exceptional?',
      img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80',
      alt: 'A serene bedroom with soft morning light',
      lede: 'A great address is not a symbol. It is a daily experience of place — of light, distance, quiet, and belonging.',
      paragraphs: [
        'Names of neighbourhoods come and go in their glamour. What persists is the texture of daily life: the length of a commute, the quality of air near the water, the sense that you belong to the street and the street to you.',
        'The exceptional address is also a matter of outlook — literally. Orientation, elevation, and the view beyond the window become part of the property itself, as valuable as square footage and far harder to change.',
        'Advisers talk about location first because location never compromises. A residence can be perfected; a setting can only be chosen. Get the setting right, and the home does the rest.'
      ]
    }
  };

  /* ------------------------------------------------------------
     Header state
     ------------------------------------------------------------ */
  var header = $('#site-header');
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------
     Hero load order
     ------------------------------------------------------------ */
  $$('.hero .anim-item').forEach(function (el) {
    el.style.setProperty('--o', el.getAttribute('data-order') || '0');
  });

  /* ------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------ */
  var toggle = $('#nav-toggle');
  var menu = $('#mobile-menu');
  var mobileLinks = $$('.mobile-links a', menu);
  var lastMenuTrigger = null;

  function openMenu() {
    menu.hidden = false;
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('no-scroll');
    lastMenuTrigger = toggle;
    if (mobileLinks.length) {
      window.setTimeout(function () { mobileLinks[0].focus(); }, 350);
    }
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('no-scroll');
    window.setTimeout(function () { menu.hidden = true; }, 450);
    if (lastMenuTrigger) {
      lastMenuTrigger.focus();
      lastMenuTrigger = null;
    }
  }

  toggle.addEventListener('click', function () {
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  $$('.mobile-menu').forEach(function (m) {
    m.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  });

  /* ------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------ */
  var revealEls = $$('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          if (delay) el.style.setProperty('--d', delay + 'ms');
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------
     Parallax (hero + cinematic) — disabled under reduced motion
     ------------------------------------------------------------ */
  var heroMedia = $('.hero-media');
  var cinematicMedia = $('#cinematic-media');
  var hasHero = !!heroMedia;
  var hasCine = !!cinematicMedia;

  function parallaxTicks() {
    var y = window.scrollY;

    if (hasHero && !reducedMotion && y < window.innerHeight * 1.4) {
      heroMedia.style.transform = 'translate3d(0, ' + clamp(y * 0.14, 0, 90) + 'px, 0)';
    }

    if (hasCine && !reducedMotion) {
      var rect = cinematicMedia.parentElement.getBoundingClientRect();
      var offset = ((rect.top + rect.height / 2) - window.innerHeight / 2) * -0.12;
      cinematicMedia.style.transform = 'translate3d(0, ' + clamp(offset, -75, 75) + 'px, 0)';
    }
  }

  function parallaxLoop() {
    parallaxTicks();
    window.requestAnimationFrame(parallaxLoop);
  }

  if ((hasHero || hasCine) && !reducedMotion) {
    window.requestAnimationFrame(parallaxLoop);
  }

  /* ------------------------------------------------------------
     Explore / search — demo filter
     ------------------------------------------------------------ */
  var grid = $('#results-grid');
  var countLabel = $('#results-count');
  var emptyState = $('#empty-state');
  var form = $('#explore-form');
  var locationSel = $('#filter-location');
  var typeSel = $('#filter-type');
  var priceSel = $('#filter-price');

  function renderResidences() {
    RESIDENCES.forEach(function (r) {
      var card = document.createElement('article');
      card.className = 'result-card';
      card.setAttribute('data-position', r.position);
      card.setAttribute('data-type', r.type);
      card.setAttribute('data-price', r.priceKey);

      card.innerHTML =
        '<button class="result-media" type="button" data-residence="' + r.name + '" aria-label="Enquire about ' + r.name + '">' +
        '  <img src="' + r.img + '" alt="' + r.name + ' — ' + r.typeLabel.toLowerCase() + ' (illustrative demo)" loading="lazy">' +
        '</button>' +
        '<div class="result-body">' +
        '  <div class="result-name-wrap">' +
        '    <p class="result-location">' + r.location + '</p>' +
        '    <h3 class="result-name">' + r.name + '</h3>' +
        '    <p class="result-type">' + r.typeLabel + '</p>' +
        '  </div>' +
        '  <div class="result-price-enquire">' +
        '    <p class="result-price">' + r.price + '</p>' +
        '    <button class="result-enquire" type="button" data-residence="' + r.name + '">Enquire</button>' +
        '  </div>' +
        '</div>';

      grid.appendChild(card);
    });
  }

  function applyFilters() {
    var loc = locationSel.value;
    var typ = typeSel.value;
    var prc = priceSel.value;

    var visible = 0;
    var cards = $$('.result-card', grid);

    cards.forEach(function (card, i) {
      var match =
        (loc === 'all' || card.getAttribute('data-position') === loc) &&
        (typ === 'all' || card.getAttribute('data-type') === typ) &&
        (prc === 'all' || card.getAttribute('data-price') === prc);

      card.style.display = match ? '' : 'none';
      card.style.animationDelay = (match ? i * 0.06 : 0) + 's';
      if (match) {
        visible += 1;
        /* restart the entrance animation for matched cards */
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = '';
      }
    });

    countLabel.textContent = visible + ' ' + (visible === 1 ? 'residence' : 'residences') + ' in the demo portfolio';
    emptyState.hidden = visible > 0;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    applyFilters();
  });

  $('#reset-filters').addEventListener('click', function () {
    locationSel.value = 'all';
    typeSel.value = 'all';
    priceSel.value = 'all';
    applyFilters();
  });

  $$('.explore-select').forEach(function (sel) {
    sel.addEventListener('change', applyFilters);
  });

  renderResidences();
  applyFilters();

  /* ------------------------------------------------------------
     Modal system
     ------------------------------------------------------------ */
  var modal = $('#modal');
  var modalBody = $('#modal-body');
  var lastFocus = null;
  var closingTimer = null;

  function openModal(html) {
    if (closingTimer) {
      window.clearTimeout(closingTimer);
      closingTimer = null;
    }
    modalBody.innerHTML = html;
    modal.hidden = false;
    lastFocus = document.activeElement;
    document.body.classList.add('no-scroll');

    var first = modal.querySelector('input, select, textarea, button, a[href]');
    if (first) window.setTimeout(function () { first.focus(); }, 60);
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.add('is-closing');

    closingTimer = window.setTimeout(function () {
      modal.hidden = true;
      modal.classList.remove('is-closing');
      document.body.classList.remove('no-scroll');
      if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
        lastFocus = null;
      }
      modalBody.innerHTML = '';
      closingTimer = null;
    }, 240);
  }

  /* focus trap inside the modal */
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;

    var focusables = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])', modal);
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  $$('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  /* ------------------------------------------------------------
     Contact form modal
     ------------------------------------------------------------ */
  var contactTemplate = $('#tpl-contact');

  function getContactTemplate() {
    return contactTemplate.innerHTML;
  }

  function setInterest(name) {
    var select = $('#cf-interest');
    if (!select) return;
    var hasOption = Array.prototype.some.call(select.options, function (o) {
      return o.value === name;
    });
    select.value = hasOption ? name : 'General enquiry';
  }

  function openContact(name) {
    openModal(getContactTemplate());
    setInterest(name || 'General enquiry');
  }

  $$('[data-open-contact]').forEach(function (el) {
    el.addEventListener('click', function () { openContact(); });
  });

  /* featured cards + result cards open the contact dialog */
  function bindResidenceTriggers(scope) {
    $$('[data-residence]', scope).forEach(function (el) {
      el.addEventListener('click', function (e) {
        if (el.tagName === 'A') e.preventDefault();
        openContact(el.getAttribute('data-residence'));
      });
    });
  }

  bindResidenceTriggers(document);

  /* form submit (demo) */
  modal.addEventListener('submit', function (e) {
    var formEl = e.target;
    if (formEl.id !== 'contact-form') return;
    e.preventDefault();

    var name = $('#cf-name');
    var email = $('#cf-email');
    if (!name.value.trim() || !email.value.trim()) {
      [name, email].forEach(function (field) {
        if (!field.value.trim()) field.style.borderBottomColor = '#B45B4B';
      });
      return;
    }

    var success = $('.form-success');
    var formWrap = $('#contact-form');
    if (success) success.hidden = false;
    if (formWrap) formWrap.hidden = true;
  });

  /* reset form fields and colours whenever the contact dialog reopens */
  function resetFormState() {
    var success = $('.form-success');
    var formWrap = $('#contact-form');
    if (success) success.hidden = true;
    if (formWrap) {
      formWrap.hidden = false;
      formWrap.reset();
      $$('.form-input', formWrap).forEach(function (i) {
        i.style.borderBottomColor = '';
      });
    }
  }

  var baseOpenModal = openModal;
  openModal = function (html) {
    resetFormState();
    baseOpenModal(html);
  };

  /* ------------------------------------------------------------
     Article modal
     ------------------------------------------------------------ */
  function articleTemplate(key) {
    var a = ARTICLES[key];
    if (!a) return '<p>Article not found.</p>';

    var paragraphs = a.paragraphs.map(function (p) {
      return '<p>' + p + '</p>';
    }).join('');

    return (
      '<figure class="article-media">' +
      '  <img src="' + a.img + '" alt="' + a.alt + '">' +
      '</figure>' +
      '<p class="article-category">Journal — ' + a.category + '</p>' +
      '<h2 class="article-title">' + a.title + '</h2>' +
      '<p class="article-lede">' + a.lede + '</p>' +
      '<div class="article-paragraphs">' + paragraphs + '</div>' +
      '<p class="article-note">Demo editorial content written for this portfolio project, not published journalism.</p>'
    );
  }

  function bindArticleTriggers() {
    $$('[data-article]').forEach(function (el) {
      el.addEventListener('click', function () {
        openModal(articleTemplate(el.getAttribute('data-article')));
      });
    });
  }

  bindArticleTriggers();
})();