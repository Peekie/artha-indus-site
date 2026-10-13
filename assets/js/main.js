/* ============================================================
   ARTHA INDUS ATELIER — site chrome + interactions
   Shared nav/footer are injected here so every page stays in
   sync without a build step (works over file:// and on Squarespace).
   ============================================================ */
(function () {
  "use strict";

  var PAGES = [
    { id: "curator",      href: "curators-note.html",   label: "Curator’s Note" },
    { id: "studies",      href: "spatial-studies.html", label: "Spatial Studies" },
    { id: "lineages",     href: "lineages.html",        label: "Lineages" },
    { id: "perspectives", href: "perspectives.html",    label: "Perspectives" },
    { id: "capsule",      href: "jala-dhara.html",      label: "Jala + Dharā" },
    { id: "collaborate",  href: "collaborate.html",     label: "Collaborate" }
  ];

  var current = document.body.getAttribute("data-page") || "home";

  /* ---------- Safe storage (private windows throw on access) ---------- */
  function storeGet(key) {
    try { return JSON.parse(window.localStorage.getItem(key)); } catch (e) { return null; }
  }
  function storeSet(key, val) {
    try { window.localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ }
  }
  // Version tag for fetched resources; bumped on deploys so heuristic
  // browser caching can never pin a visitor to a stale index or essay.
  var VER = "20261012a";
  var MOTION_OK = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches);

  /* ---------- NAV ---------- */
  function buildNav() {
    // "you are here" is announced (aria-current) as well as drawn
    var here = function (p) { return p.id === current ? ' aria-current="page"' : ""; };
    var links = PAGES.map(function (p, i) {
      var active = p.id === current ? " is-active" : "";
      var cta = p.id === "collaborate" ? " nav__cta" : "";
      var named = p.id === "capsule" ? " nav__link--named" : "";
      return '<a class="nav__link' + cta + named + active + '" href="' + p.href + '"' + here(p) + ">" + p.label + "</a>";
    }).join("");

    var mobile = PAGES.map(function (p, i) {
      var n = String(i + 1).padStart(2, "0");
      var kicker = p.id === "capsule" ? '<span class="m-kicker">The inaugural capsule</span>' : "";
      return '<a href="' + p.href + '"' + here(p) + (p.id === current ? ' class="is-current"' : "") + ">" +
        '<span class="m-num" aria-hidden="true">' + n + "</span>" + kicker + '<span class="m-label">' + p.label + "</span></a>";
    }).join("");

    var html =
      '<header class="nav" id="nav">' +
        '<a href="index.html" class="brand" aria-label="Artha Indus Atelier home">' +
          '<img class="brand__logo" src="assets/img/logo.png" srcset="assets/img/logo.png 1x, assets/img/logo@2x.png 2x" alt="" />' +
          '<span class="brand__words">' +
            '<span class="brand__mark">Artha Indus</span>' +
            '<span class="brand__sub">Atelier</span>' +
          '</span>' +
        "</a>" +
        '<nav class="nav__links" aria-label="Primary">' + links + "</nav>" +
        // utilities live together at the right edge. The private Vault, when it
        // exists, joins this group (a discreet entrance, not a menu item).
        '<div class="nav__utils">' +
          '<button class="nav__theme" id="themeToggle" type="button" data-theme-toggle><span class="nav__theme-word">Night</span></button>' +
          '<button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">' +
            '<svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.4"><line x1="0" y1="1" x2="26" y2="1"/><line x1="0" y1="7" x2="26" y2="7"/><line x1="0" y1="13" x2="26" y2="13"/></svg>' +
          "</button>" +
        "</div>" +
      "</header>" +
      '<nav class="mobile-menu" id="mobileMenu" aria-label="Mobile">' + mobile +
        '<div class="mobile-menu__utils">' +
          '<button class="mobile-menu__theme" type="button" data-theme-toggle>Night</button>' +
        "</div>" +
      "</nav>";

    var mount = document.getElementById("site-nav");
    if (mount) mount.outerHTML = html;
  }

  /* ---------- Gold thread: a knot for every study examined ---------- */
  function seenCount() {
    var seen = storeGet("artha-studies-seen");
    return Array.isArray(seen) ? seen.length : 0;
  }
  function goldThread() {
    var n = seenCount();
    if (!n) return "";
    var shown = Math.min(n, 9);
    var knots = "";
    for (var i = 0; i < shown; i++) {
      knots += '<circle cx="' + (8 + i * 12) + '" cy="5" r="2.6" />';
    }
    var w = 8 + (shown - 1) * 12 + 8;
    return '<span class="footer__thread" title="' + n + (n === 1 ? " study" : " studies") + ' examined">' +
      '<svg width="' + w + '" height="10" viewBox="0 0 ' + w + ' 10" aria-hidden="true">' +
        '<line x1="0" y1="5" x2="' + w + '" y2="5" />' + knots +
      "</svg>" +
      n + (n === 1 ? " study" : " studies") + " examined</span>";
  }

  /* ---------- FOOTER ---------- */
  function buildFooter() {
    var nav = PAGES.map(function (p) {
      var cur = p.id === current;
      return "<li><a href=\"" + p.href + "\"" + (cur ? ' class="is-current" aria-current="page"' : "") + ">" + p.label + "</a></li>";
    }).join("");

    var html =
      '<footer class="footer">' +
        '<div class="wrap">' +
          '<div class="footer__top">' +
            "<div>" +
              '<div class="footer__mark">Artha Indus Atelier<span>Ancient Heritage. Modern Resonance.</span></div>' +
              '<p class="footer__note" style="margin-top:1.4rem">A boutique curation house bridging ancient master lineages with modern corporate, hospitality, and healthcare environments, preserving the soul of the artisan’s hand.</p>' +
            "</div>" +
            "<div><h2 class=\"footer__h\">Navigate</h2><ul>" + nav + "</ul></div>" +
            '<div><h2 class="footer__h">Connect</h2><ul>' +
              '<li><a href="mailto:preeti@arthaindus.com">preeti@arthaindus.com</a></li>' +
              '<li><span class="footer__plain">Chicago, IL</span></li>' +
              '<li><a href="assets/downloads/Artha-Indus-Atelier-Lookbook-2026.pdf" download>Download the Lookbook</a></li>' +
            "</ul></div>" +
          "</div>" +
          '<div class="footer__bar">' +
            "<span>© " + new Date().getFullYear() + " Artha Indus Atelier LLC. All rights reserved.</span>" +
            goldThread() +
            "<span>Fair-wage · Direct-from-artisan · Full ESG provenance</span>" +
          "</div>" +
        "</div>" +
      "</footer>";

    var mount = document.getElementById("site-footer");
    if (mount) mount.outerHTML = html;
  }

  /* ---------- The atelier keeps hours: day and night themes ----------
     A head snippet applies the theme before first paint; this wires the
     toggle and keeps the choice. No stored choice means follow the clock. */
  function initHours() {
    var pref = null;
    try { pref = window.localStorage.getItem("artha-theme"); } catch (e) {}
    var h = new Date().getHours();
    var night = pref ? pref === "night" : (h >= 19 || h < 6);
    function setTheme(n) {
      document.documentElement.setAttribute("data-theme", n ? "night" : "day");
      // the label stays "Night" so the accessible name matches the visible
      // text; aria-pressed alone carries the state, on every toggle
      document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(n));
      });
    }
    setTheme(night);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        night = !night;
        setTheme(night);
        try { window.localStorage.setItem("artha-theme", night ? "night" : "day"); } catch (e) {}
      });
    });
  }

  /* ---------- Scroll state on nav ---------- */
  function initNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    // pages that open on bone paper (essays, 404) have no dark hero for the
    // light nav to sit on, so they keep the solid ink state from the top
    var solid = document.body.getAttribute("data-nav") === "ink";
    var onScroll = function () {
      if (solid || window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;
    var open = false, release = null;
    var set = function (state) {
      open = state;
      menu.classList.toggle("is-open", open);
      var navEl = document.getElementById("nav");
      if (navEl) navEl.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      // the open menu covers the page: keep Tab inside the header and menu
      if (open && !release) release = isolate(menu, [document.getElementById("nav")]);
      else if (!open && release) { release(); release = null; }
    };
    toggle.addEventListener("click", function () { set(!open); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { set(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) { set(false); toggle.focus(); }
    });
    // a rotation or resize past the handover hides the menu button, so the
    // menu must close itself rather than leave the page locked behind it
    if (window.matchMedia) {
      var wide = window.matchMedia("(min-width: 1261px)");
      var onWide = function () { if (wide.matches && open) set(false); };
      if (wide.addEventListener) wide.addEventListener("change", onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  /* ---------- Freshness: presentation surfaces reshuffle per visit ----------
     Content order (essays, study index) stays editorial; only imagery and
     ornament rotate, so a returning visitor always sees a slightly new site. */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function initFreshness() {
    // hero: one of three dark built-form plates, both torch layers together
    if (current === "home") {
      var heroes = [
        { src: "assets/img/story-1-warli-lobby.jpg", alt: "A large-scale hand-painted Warli folk-art feature wall anchoring a modern executive lobby of dark marble and fluted oak." },
        { src: "assets/img/story-12-tarpa-mandala.jpg", alt: "Oversized framed Warli Tarpa dance masterwork, white figures spiralling on a charcoal ground, above an oak bench on a travertine threshold wall." },
        { src: "assets/img/story-vanam-resin.jpg", alt: "A backlit translucent resin panel carrying hand-drawn Kalamkari flora in sepia line, glowing behind a steaming vitality pool framed in dark stone." }
      ];
      var h = pick(heroes);
      var under = document.querySelector(".hero__under");
      var photo = document.querySelector(".hero__photo");
      if (under && photo && photo.getAttribute("src") !== h.src) {
        under.src = h.src;
        photo.src = h.src;
        photo.alt = h.alt;
      }
      // the second offering's fabrication image
      var fab = [
        { src: "assets/img/story-vrksa-glass.jpg", alt: "A Pattachitra Vriksha etched in white on a frosted structural glass partition in a thermal spa suite." },
        { src: "assets/img/warli-3-relief.jpg", alt: "A Warli motif CNC-carved into a bas-relief wellness-spa feature wall." },
        { src: "assets/img/story-2-peacock-screen.jpg", alt: "Freestanding solid walnut entryway screen CNC-milled with a multi-peacock Mithila motif." }
      ];
      var offerImg = document.querySelector('.offer__half[href="spatial-studies.html"] .offer__media img');
      if (offerImg) { var f = pick(fab); offerImg.src = f.src; offerImg.alt = f.alt; }
      // the macro interlude alternates its material close-up
      var macros = [
        { src: "assets/img/kurma-felt-macro.jpg", alt: "Macro detail of the Kūrma motif: copper linework and stippling set into charcoal acoustic felt, catching raking light." },
        { src: "assets/img/cta-environment.jpg", alt: "Raw mineral pigments in ochre and terracotta beside crushed shell, handmade paper and worn brushes on a wooden work table." }
      ];
      var macroImg = document.querySelector(".macro__media img");
      var macroDeva = document.getElementById("macroDeva");
      if (macroImg) {
        var m = pick(macros);
        macroImg.src = m.src; macroImg.alt = m.alt;
        // the watermark glyph follows the material shown:
        // kūrma for the turtle felt, varṇa (colour, pigment) for the pigments table
        if (macroDeva) macroDeva.textContent = m.src.indexOf("cta-environment") > -1 ? "वर्ण" : "कूर्म";
      }
    }
    // CTA backdrops rotate on the pages without a pinned choice
    if (current === "home" || current === "perspectives") {
      var pool = ["cta-environment.jpg", "scale-thematic.jpg", "studio-parrot-fish.jpg", "studio-landscape-pattachitra.jpg", "studio-buddha.jpg"];
      var cta = document.querySelector(".cta-band__media img");
      if (cta) cta.src = "assets/img/" + pick(pool);
    }
    // the studies index deals itself in a new order each visit; filters,
    // visited marks and deep links keep every study findable regardless
    var grid = document.getElementById("stories");
    if (grid) {
      var plates = Array.prototype.slice.call(grid.querySelectorAll(".plate"));
      for (var p = plates.length - 1; p > 0; p--) {
        var q = Math.floor(Math.random() * (p + 1));
        var tmp = plates[p]; plates[p] = plates[q]; plates[q] = tmp;
      }
      plates.forEach(function (pl) {
        // filed cards sit slightly askew until touched
        pl.style.setProperty("--tilt", ((Math.random() * 1.2) - 0.6).toFixed(2) + "deg");
        grid.appendChild(pl);
      });
    }
    // the lineage strip reorders itself
    var track = document.querySelector(".lineage-strip__track");
    if (track) {
      var names = Array.prototype.slice.call(track.children);
      for (var i = names.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        track.insertBefore(names[i], names[j]);
        var t = names[i]; names[i] = names[j]; names[j] = t;
      }
    }
  }

  /* ---------- Provenance line: the scribe's rule draws with the reader ----
     A hand-wavering inked line runs down the left margin and draws itself as
     the page is read, slightly differently on every visit. Decoration only:
     hidden from assistive tech, absent on small screens and reduced motion. */
  function initProvenance() {
    if (!MOTION_OK) return;
    if (!(window.matchMedia && window.matchMedia("(min-width: 1000px)").matches)) return;
    var wrap = document.createElement("div");
    wrap.className = "prov";
    wrap.setAttribute("aria-hidden", "true");
    var x = 6, d = "M" + x + " 0";
    for (var y = 8; y <= 100; y += 8) {
      var wob = (Math.random() * 3 - 1.5).toFixed(2);
      d += " C " + (x - wob) + " " + (y - 5.5) + ", " + (+x + +wob) + " " + (y - 2.5) + ", " + x + " " + y;
    }
    wrap.innerHTML = '<svg viewBox="0 0 12 100" preserveAspectRatio="none"><path d="' + d + '" /></svg>';
    document.body.appendChild(wrap);
    var path = wrap.querySelector("path");
    var L = path.getTotalLength();
    path.style.strokeDasharray = L + " " + L;
    path.style.strokeDashoffset = String(L);
    var raf = null, max = 1;
    function measure() {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }
    function draw() {
      raf = null;
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      path.style.strokeDashoffset = String(L * (1 - p));
    }
    var kick = function () { if (!raf) raf = requestAnimationFrame(draw); };
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", function () { measure(); kick(); });
    window.addEventListener("load", function () { measure(); kick(); });
    measure();
    draw();
  }

  /* ---------- Hero hover effect: one of three moods per visit ----------
     torch: the pointer excavates the ink underdrawing beneath the photo.
     inverse: the hero rests as the finished photo; on hover it fades to the
     drawing everywhere except a pool of colour that travels with the cursor.
     lamp: the pointer carries warm lantern light across the photograph.
     Hover-capable fine pointers only; touch devices get the plain photo. */
  function initHeroEffect() {
    var hero = document.querySelector(".hero");
    var media = hero && hero.querySelector(".hero__media");
    var photo = media && media.querySelector(".hero__photo");
    if (!hero || !media || !photo || !MOTION_OK) return;
    if (!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches)) return;
    var pool = ["vignette", "sheen", "parallax"]; // torch, inverse and lamp stay reachable via ?fx=
    var forced = null;
    try { forced = new URLSearchParams(window.location.search).get("fx"); } catch (e) {}
    var fx = ["torch", "inverse", "lamp"].indexOf(forced) > -1 || pool.indexOf(forced) > -1 ? forced : pick(pool);
    hero.setAttribute("data-fx", fx);
    if (fx === "lamp" || fx === "vignette" || fx === "sheen") {
      var overlay = document.createElement("div");
      overlay.className = "hero__" + fx;
      overlay.setAttribute("aria-hidden", "true");
      media.appendChild(overlay);
    }

    var restR = fx === "inverse" ? 2600 : 0;
    var activeR = fx === "inverse" ? 260 : 200;
    var tx = 50, ty = 40, tr = restR, cx = 50, cy = 40, cr = restR, raf = null;
    media.style.setProperty("--tr", Math.max(0.5, restR) + "px");
    function tick() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cr += (tr - cr) * 0.12;
      media.style.setProperty("--mx", cx.toFixed(2) + "%");
      media.style.setProperty("--my", cy.toFixed(2) + "%");
      media.style.setProperty("--tr", Math.max(0.5, cr).toFixed(1) + "px");
      var fxo = Math.min(1, cr / 170);
      media.style.setProperty("--fxo", fxo.toFixed(3));
      media.style.setProperty("--px", ((50 - cx) * 0.028 * fxo).toFixed(3) + "%");
      media.style.setProperty("--py", ((40 - cy) * 0.022 * fxo).toFixed(3) + "%");
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 || Math.abs(tr - cr) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else { raf = null; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var r = media.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      tr = activeR;
      kick();
    });
    hero.addEventListener("pointerleave", function () { tr = restR; kick(); });
  }

  /* ---------- From the index: three random studies per visit ---------- */
  // The static cards in the markup are the fallback (file://, no JS). When we
  // can fetch the studies index, the trio is drawn fresh from the live plates,
  // so it never goes stale as studies are added.
  function initIndexShuffle() {
    var grid = document.querySelector(".index3");
    if (!grid || !window.fetch || !window.DOMParser) return;
    fetch("spatial-studies.html?v=" + VER).then(function (r) {
      if (!r.ok) throw new Error("index");
      return r.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var plates = Array.prototype.slice.call(doc.querySelectorAll("#stories .plate"));
      if (plates.length < 3) return;
      for (var i = plates.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = plates[i]; plates[i] = plates[j]; plates[j] = t;
      }
      grid.innerHTML = plates.slice(0, 3).map(function (p, k) {
        var img = p.querySelector(".plate__media img");
        var eb = p.querySelector(".plate__label .eyebrow");
        var title = p.querySelector(".plate__title");
        var bf = p.querySelector(".plate__bestfor");
        if (!img || !title) return "";
        return '<a class="index3__card reveal is-in" href="spatial-studies.html#' + escapeHtml(p.id) + '">' +
          '<span class="index3__media"><img src="' + escapeHtml(img.getAttribute("src")) + '" alt="' + escapeHtml(img.getAttribute("alt") || "") + '" loading="lazy" /></span>' +
          '<span class="index3__body">' +
            (eb ? '<span class="eyebrow eyebrow--ink">' + escapeHtml(eb.textContent) + "</span>" : "") +
            '<span class="index3__title">' + escapeHtml(title.textContent) + "</span>" +
            (bf ? '<span class="index3__bestfor"><span>Best for</span> ' + escapeHtml(bf.textContent.replace(/^\s*Best for\s*/, "")) + "</span>" : "") +
            '<span class="link-arrow">Open the study <span class="arrow" aria-hidden="true">&rarr;</span></span>' +
          "</span></a>";
      }).join("");
    }).catch(function () { /* the static trio stays */ });
  }

  /* ---------- Kalam trail: the cursor leaves fading ink on the hero ---------- */

  /* ---------- Mobile delight: old-phone-safe, transform and opacity only ---------- */
  // A blot and ring bloom where a finger truly taps the hero. Taps are
  // separated from scroll swipes by time and travel, so scrolling stays calm.
  function initTapInk() {
    var hero = document.querySelector(".hero");
    if (!hero || !MOTION_OK) return;
    if (!(window.matchMedia && window.matchMedia("(hover: none)").matches)) return;
    var sx = 0, sy = 0, st = 0, live = 0;
    hero.addEventListener("touchstart", function (e) {
      var t = e.touches[0]; if (!t) return;
      sx = t.clientX; sy = t.clientY; st = Date.now();
    }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0];
      if (!t || live > 4) return;
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Date.now() - st > 300 || dx * dx + dy * dy > 144) return;
      var r = hero.getBoundingClientRect();
      ["ink-blot", "ink-ring"].forEach(function (cls) {
        var el = document.createElement("span");
        el.className = cls;
        el.style.left = (t.clientX - r.left) + "px";
        el.style.top = (t.clientY - r.top) + "px";
        hero.appendChild(el);
        live++;
        el.addEventListener("animationend", function () {
          live--;
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      });
    }, { passive: true });
  }

  // On touch devices the lineage strip glides instead of sitting still.
  function initStripDrift() {
    if (!MOTION_OK) return;
    if (!(window.matchMedia && window.matchMedia("(hover: none)").matches)) return;
    var track = document.querySelector(".lineage-strip__track");
    if (!track) return;
    var spans = Array.prototype.slice.call(track.children);
    spans.forEach(function (s) {
      var c = s.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      if (c.tagName === "A") c.setAttribute("tabindex", "-1");
      track.appendChild(c);
    });
    track.classList.add("is-drifting");
  }

  /* ---------- First-visit veil: the page unrolls once per session ---------- */
  function initVeil() {
    if (current !== "home" || !MOTION_OK) return;
    try {
      if (window.sessionStorage.getItem("artha-veil")) return;
      window.sessionStorage.setItem("artha-veil", "1");
    } catch (e) { return; }
    document.body.classList.add("has-veil");
    var veil = document.createElement("div");
    veil.id = "loadVeil";
    veil.setAttribute("aria-hidden", "true");
    veil.innerHTML = '<span class="veil__mark">Artha Indus <em>Atelier</em></span>';
    document.body.appendChild(veil);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { veil.classList.add("is-off"); });
    });
    var gone = function () { if (veil.parentNode) veil.parentNode.removeChild(veil); };
    veil.addEventListener("transitionend", gone);
    setTimeout(gone, 2600);
  }

  /* ---------- The scroll hint retires after its first use ---------- */
  function initScrollHint() {
    var hint = document.querySelector(".hero__scroll");
    if (!hint) return;
    window.addEventListener("scroll", function () { hint.classList.add("is-done"); }, { passive: true, once: true });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    // threshold 0, not 0.14: the pre-reveal clip-path leaves only a sliver of
    // the element visible to the observer, so a ratio threshold never fires.
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Inquiry form (no backend: composes an email) ---------- */
  function initForm() {
    var form = document.getElementById("inquiryForm");
    if (!form) return;
    var status = document.getElementById("formStatus");
    var isNetlify = form.hasAttribute("data-netlify");

    // "Specify this study" carries its dossier into the form: the enquiry
    // arrives already knowing which study it is about.
    var q = new URLSearchParams(window.location.search);
    if (q.get("capsule") === "jala-dhara") {
      var csel = document.getElementById("interest");
      if (csel) csel.value = "Jala + Dharā Capsule";
      var cf = document.getElementById("studyField");
      if (cf) cf.value = "jala-dhara | Jala + Dharā capsule";
      var chead = form.querySelector(".form__head");
      if (chead) {
        var cabout = document.createElement("p");
        cabout.className = "form__about";
        var arch = { kurma: "Kūrma", matsya: "Matsya", rekha: "Rekhā" }[q.get("a")] || "";
        cabout.innerHTML = "<span>Regarding</span> Jala + Dharā" + (arch ? ", " + arch : ", the inaugural capsule");
        if (cf && arch) cf.value = "jala-dhara | Jala + Dharā capsule | " + arch;
        chead.appendChild(cabout);
      }
    }
    var studyId = (q.get("study") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    var studyTitle = (q.get("t") || "").replace(/[^\w\s.,;:&'()-]/g, "").slice(0, 160);
    if (studyId) {
      var sf = document.getElementById("studyField");
      if (sf) sf.value = studyId + (studyTitle ? " | " + studyTitle : "");
      var head = form.querySelector(".form__head");
      if (head) {
        var about = document.createElement("p");
        about.className = "form__about";
        about.innerHTML = "<span>Regarding</span> " + escapeHtml(studyTitle || studyId.replace(/-/g, " "));
        head.appendChild(about);
      }
      // a study can be commissioned or licensed: do not decide for them
      var sel = document.getElementById("interest");
      if (sel) sel.value = "Spatial Study (commission or license)";
    }
    // arriving from a study or the capsule, the form is the point: bring it into view
    if (studyId || q.get("capsule")) {
      setTimeout(function () {
        form.scrollIntoView({ behavior: MOTION_OK ? "smooth" : "auto", block: "start" });
      }, 250);
    }

    // A soft nod to the visitor's own browsing, never a scoreboard.
    var n = seenCount();
    var shortlist = document.getElementById("shortlistField");
    if (n > 0 && shortlist) {
      var intro = form.querySelector(".form__intro");
      var seenIds = (storeGet("artha-studies-seen") || []).filter(function (id) { return /^[a-z0-9-]+$/.test(id); });
      var names = seenIds.map(function (id) { return id.replace(/-/g, " "); }).join("; ");
      if (intro && seenIds.length) {
        var box = document.createElement("label");
        box.className = "form__shortlist";
        box.innerHTML = '<input type="checkbox" checked /> <span>Include the ' + seenIds.length +
          (seenIds.length === 1 ? " study" : " studies") + " I examined, so Preeti sees my shortlist.</span>";
        intro.insertAdjacentElement("afterend", box);
        var cb = box.querySelector("input");
        var syncList = function () { shortlist.value = cb.checked ? names : ""; };
        cb.addEventListener("change", syncList);
        syncList();
      }
    }
    // Tie each failed field to the status message, so a screen reader hears
    // which field is wrong, and clear the mark as soon as it is corrected.
    var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));
    function flagInvalid() {
      var bad = [];
      required.forEach(function (f) {
        var ok = f.validity.valid;
        f.setAttribute("aria-invalid", String(!ok));
        if (ok) f.removeAttribute("aria-describedby");
        else {
          f.setAttribute("aria-describedby", "formStatus");
          var lab = form.querySelector('label[for="' + f.id + '"]');
          bad.push(lab ? lab.childNodes[0].textContent.trim().toLowerCase() : f.name);
        }
      });
      if (status) {
        status.style.color = "var(--terracotta)";
        status.textContent = bad.length
          ? "Please check your " + bad.join(" and ") + (bad.indexOf("email") !== -1 ? ". Email needs a full address." : ".")
          : "";
      }
    }
    required.forEach(function (f) {
      f.addEventListener("input", function () {
        if (f.getAttribute("aria-invalid") === "true" && f.validity.valid) {
          f.setAttribute("aria-invalid", "false");
          f.removeAttribute("aria-describedby");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      // On Netlify the form posts natively — just hand over the Lookbook first.
      if (isNetlify) {
        // A bare `return` would NOT stop the submission: without preventDefault the
        // browser posts anyway, and the form carries `novalidate` so it will not
        // block invalid input either. Invalid enquiries were reaching Netlify.
        if (!form.checkValidity()) {
          e.preventDefault();
          flagInvalid();
          form.reportValidity();
          return;
        }
        try {
          var d = new FormData(form);
          window.sessionStorage.setItem("artha-sent", JSON.stringify({
            name: String(d.get("name") || "").split(" ")[0].slice(0, 40),
            interest: String(d.get("interest") || "").slice(0, 80),
            study: String(d.get("study") || "").split("|").slice(-1)[0].trim().slice(0, 120)
          }));
        } catch (err) { /* storage unavailable: the thank-you page stays generic */ }
        return; // valid: let Netlify handle the POST
      }
      e.preventDefault();
      if (!form.checkValidity()) {
        flagInvalid();
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var name = (data.get("name") || "").toString();
      var subject = "Artha Indus: " + (data.get("interest") || "Inquiry");
      var bodyLines = [
        "Name: " + name,
        "Company: " + (data.get("company") || "not given"),
        "Email: " + (data.get("email") || "not given"),
        "Interest: " + (data.get("interest") || "not given"),
        "",
        (data.get("message") || "").toString()
      ];
      var href = "mailto:preeti@arthaindus.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(bodyLines.join("\n"));

      // If they asked for the Lookbook, hand it over immediately as well.
      var wantsLookbook = /lookbook/i.test(String(data.get("interest") || ""));
      if (wantsLookbook) {
        var a = document.createElement("a");
        a.href = "assets/downloads/Artha-Indus-Atelier-Lookbook-2026.pdf";
        a.download = "Artha-Indus-Atelier-Lookbook-2026.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      if (status) {
        status.style.color = "var(--sage)";
        status.textContent = wantsLookbook
          ? "Your Lookbook is downloading. Thank you, " + (name.split(" ")[0] || "there") + ". Opening your email client so we can follow up…"
          : "Opening your email client… thank you, " + (name.split(" ")[0] || "there") + ".";
      }
      setTimeout(function () { window.location.href = href; }, wantsLookbook ? 900 : 0);
    });
  }

  /* ---------- Study filter (application × lineage) ---------- */
  function initStudyFilter() {
    var index = document.querySelector(".study-index");
    var storiesWrap = document.getElementById("stories");
    if (!index || !storiesWrap) return;
    var stories = Array.prototype.slice.call(storiesWrap.querySelectorAll(".plate"));
    var countEl = document.getElementById("studyCount");
    var emptyEl = document.getElementById("storiesEmpty");
    var state = { app: "all", lineage: "all" };

    // Filter state lives in the URL so a narrowed view can be sent to a colleague.
    var q = new URLSearchParams(window.location.search);
    if (q.get("app")) state.app = q.get("app");
    if (q.get("lineage")) state.lineage = q.get("lineage");

    // Live counts on every chip, so narrowing feels like searching a real archive.
    index.querySelectorAll(".study-index__row").forEach(function (row) {
      var type = row.getAttribute("data-filter-type");
      row.querySelectorAll(".study-index__f").forEach(function (btn) {
        var f = btn.getAttribute("data-filter");
        if (f === "all") return;
        var c = stories.filter(function (s) {
          return type === "app"
            ? (s.getAttribute("data-app") || "").split(/\s+/).indexOf(f) !== -1
            : (s.getAttribute("data-lineage") || "") === f;
        }).length;
        btn.innerHTML = escapeHtml(btn.textContent) + ' <span class="study-index__n">' + c + "</span>";
      });
    });

    function syncChips() {
      index.querySelectorAll(".study-index__row").forEach(function (row) {
        var type = row.getAttribute("data-filter-type");
        row.querySelectorAll(".study-index__f").forEach(function (b) {
          b.classList.toggle("is-active", b.getAttribute("data-filter") === state[type]);
        });
      });
    }

    var applied = false;
    function apply() {
      var shown = 0;
      // the chosen filter is announced, not only styled
      index.querySelectorAll(".study-index__f").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.classList.contains("is-active")));
      });
      stories.forEach(function (s) {
        var apps = (s.getAttribute("data-app") || "").split(/\s+/);
        var lin = s.getAttribute("data-lineage") || "";
        var okApp = state.app === "all" || apps.indexOf(state.app) !== -1;
        var okLin = state.lineage === "all" || lin === state.lineage;
        var show = okApp && okLin;
        s.classList.toggle("is-hidden", !show);
        if (show) { s.style.setProperty("--i", String(shown)); shown++; }
      });
      if (emptyEl) emptyEl.hidden = shown !== 0;
      var qs = [];
      if (state.app !== "all") qs.push("app=" + encodeURIComponent(state.app));
      if (state.lineage !== "all") qs.push("lineage=" + encodeURIComponent(state.lineage));
      history.replaceState(history.state, "",
        window.location.pathname + (qs.length ? "?" + qs.join("&") : "") + window.location.hash);
      // re-settle the surviving plates with a small stagger (skipped on first paint)
      if (applied && MOTION_OK) {
        storiesWrap.classList.remove("is-resettled");
        void storiesWrap.offsetWidth;
        storiesWrap.classList.add("is-resettled");
      }
      applied = true;
      if (countEl) {
        // Counts come from the DOM, never from a hard-coded total: adding a
        // study to the markup is all it takes for these to stay correct.
        var total = stories.length;
        var noun = total === 1 ? " study." : " studies.";
        if (state.app === "all" && state.lineage === "all") {
          countEl.textContent = "Showing all " + total + noun;
        } else {
          countEl.textContent = "Showing " + shown + " of " + total + noun;
        }
      }
    }

    index.querySelectorAll(".study-index__row").forEach(function (row) {
      var type = row.getAttribute("data-filter-type"); // "app" | "lineage"
      row.querySelectorAll(".study-index__f").forEach(function (btn) {
        btn.addEventListener("click", function () {
          row.querySelectorAll(".study-index__f").forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          state[type] = btn.getAttribute("data-filter");
          apply();
        });
      });
    });

    var reset = document.getElementById("resetFilters");
    if (reset) reset.addEventListener("click", function () {
      state.app = "all"; state.lineage = "all";
      syncChips();
      apply();
    });

    // "Draw a study" — pull a random unread plate from the drawer.
    var draw = document.getElementById("studyShuffle");
    if (draw) draw.addEventListener("click", function () {
      var seen = storeGet("artha-studies-seen") || [];
      var pool = stories.filter(function (s) { return !s.classList.contains("is-hidden"); });
      var fresh = pool.filter(function (s) { return seen.indexOf(s.id) === -1; });
      var from = fresh.length ? fresh : pool;
      var pick = from[Math.floor(Math.random() * from.length)];
      if (pick) {
        pick.scrollIntoView({ behavior: MOTION_OK ? "smooth" : "auto", block: "center" });
        var face = pick.querySelector(".plate__face");
        if (face) setTimeout(function () { face.click(); }, MOTION_OK ? 420 : 0);
      }
    });

    syncChips();
    apply();
  }

  /* ---------- Before/after compare slider ---------- */
  function initCompareSlider() {
    document.querySelectorAll(".compare").forEach(function (el) {
      var range = el.querySelector(".compare__range");
      if (!range) return;
      var set = function (v) {
        v = Math.max(0, Math.min(100, v));
        el.style.setProperty("--pos", v + "%");
        el.style.setProperty("--posn", String(v)); // unitless twin for the tag fades
        range.value = v;
        var pv = Math.round(v);
        range.setAttribute("aria-valuetext", pv + "% " + (el.getAttribute("data-before-label") || "paper original") +
          ", " + (100 - pv) + "% " + (el.getAttribute("data-after-label") || "finished relief"));
      };
      range.addEventListener("input", function () { set(parseFloat(range.value)); });
      var pointerFromX = function (clientX) {
        var r = el.getBoundingClientRect();
        set(((clientX - r.left) / r.width) * 100);
      };
      var dragging = false, downX = null, moved = false;
      el.addEventListener("pointerdown", function (e) {
        if (e.target === range) return; // native range handles it
        dragging = true; moved = false; downX = e.clientX;
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
        pointerFromX(e.clientX);
      });
      el.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        if (Math.abs(e.clientX - downX) > 6) moved = true;
        pointerFromX(e.clientX);
      });
      var release = function (e) {
        if (dragging && !moved && e && e.type === "pointerup") {
          // a plain tap flips the view: paper one side, built the other.
          // Dragging is a poor phone gesture; the tap must work on its own.
          el.classList.add("is-snapping");
          set(parseFloat(range.value) < 50 ? 100 : 0);
          setTimeout(function () { el.classList.remove("is-snapping"); }, 450);
        }
        dragging = false;
      };
      el.addEventListener("pointerup", release);
      el.addEventListener("pointercancel", release);
    });
  }

  /* ---------- Modal isolation ----------
     While a full-screen layer is open, everything else on the page is made
     inert so Tab cannot wander behind it. Layers can stack (the viewer opens
     from inside the study dossier), so each body child keeps a count and is
     only released when the last layer that needed it closes. `keep` lists
     other elements that must stay usable (the header holds the menu's own
     Close button). Returns the release function. */
  // set by initLightbox so a closing dossier can shut the viewer above it first
  var closeLightbox = null;

  function isolate(layer, keep) {
    var touched = [];
    keep = keep || [];
    // a layer locked by an earlier layer (the viewer, under an open dossier)
    // must be unlocked while it is the one in front
    var lifted = layer._isoCount > 0 && layer.hasAttribute("inert");
    if (lifted) layer.removeAttribute("inert");
    Array.prototype.forEach.call(document.body.children, function (c) {
      if (c === layer || c.contains(layer) || c.tagName === "SCRIPT") return;
      if (keep.some(function (k) { return k && (c === k || c.contains(k)); })) return;
      if (!c._isoCount) {
        c._isoCount = 0;
        c._isoOwn = !c.hasAttribute("inert");
      }
      c._isoCount++;
      if (c._isoOwn) c.setAttribute("inert", "");
      touched.push(c);
    });
    return function release() {
      touched.forEach(function (c) {
        c._isoCount--;
        if (c._isoCount <= 0) {
          if (c._isoOwn) c.removeAttribute("inert");
          c._isoCount = 0;
        }
      });
      touched = [];
      if (lifted && layer._isoCount > 0) layer.setAttribute("inert", "");
    };
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var triggers = document.querySelectorAll(".stage__media img, .study-overlay__media img, .jd-shot img");
    if (!triggers.length) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.setAttribute("aria-hidden", "true");
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button>' +
      '<img class="lightbox__img" alt="" />' +
      '<p class="lightbox__cap"></p>';
    document.body.appendChild(box);
    closeLightbox = function () { close(); };
    var boxImg = box.querySelector(".lightbox__img");
    var boxCap = box.querySelector(".lightbox__cap");
    var lastFocus = null, release = null;

    function open(img) {
      lastFocus = document.activeElement;
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt || "";
      var story = img.closest("article");
      var label = "";
      var figcap = img.closest("figure") && img.closest("figure").querySelector("figcaption");
      if (figcap && !story) {
        label = Array.prototype.map.call(figcap.children.length ? figcap.children : [figcap], function (c) {
          return c.textContent.trim();
        }).filter(Boolean).join(" · ");
      } else if (story) {
        var eb = story.querySelector(".eyebrow, .stage__label");
        var h = story.querySelector("h3, h4");
        label = [eb && eb.textContent.trim(), h && h.textContent.trim()].filter(Boolean).join(" · ");
      } else {
        var cap = img.parentElement.querySelector(".typo__cap h4");
        if (cap) label = cap.textContent.trim();
      }
      boxCap.textContent = label || img.alt || "";
      box.setAttribute("aria-label", "Image viewer: " + (label || img.alt || "enlarged image"));
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (!release) release = isolate(box);
      // .is-open flips visibility instantly (only opacity fades), so after a
      // style flush the Close button can take focus straight away
      void box.offsetWidth;
      box.querySelector(".lightbox__close").focus();
    }
    function close() {
      if (!box.classList.contains("is-open")) return;
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (release) { release(); release = null; }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    // each zoomable image sits inside a real button, so the viewer opens from
    // the keyboard too, and the button names what it will show
    triggers.forEach(function (img) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zoom-trigger";
      // name = hidden prefix + the image's own alt, so it stays right when
      // the dossier swaps its picture
      btn.innerHTML = '<span class="sr-only">View larger: </span>';
      img.parentNode.insertBefore(btn, img);
      btn.appendChild(img);
      btn.addEventListener("click", function () { open(img); });
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox__close")) close();
    });
    // capture phase: the viewer answers Escape first and stops it there, so
    // one press closes only the viewer, not the study dossier beneath it
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("is-open")) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        close();
      }
    }, true);
  }

  /* ---------- Jala + Dharā capsule page ----------
     Draft gates: blocks marked [data-gate] wait on an outside approval
     and stay hidden; ?preview=all reveals them for review. */
  function initCapsule() {
    var root = document.querySelector(".jd");
    if (!root) return;
    if (/[?&]preview=all\b/.test(window.location.search)) {
      var gated = document.querySelectorAll("[data-gate]");
      gated.forEach(function (g) { g.classList.add("gate-open"); });
      if (gated.length) {
        var banner = document.createElement("p");
        banner.className = "gate-banner";
        banner.setAttribute("role", "status");
        banner.textContent = "Preview: sections awaiting approval are shown with a dashed outline.";
        document.body.appendChild(banner);
      }
    }
    // Paper / Glass toggle: the slider without dragging (WCAG 2.5.7);
    // each button reports whether its side is the one fully shown
    root.querySelectorAll(".jd-chapter__compare").forEach(function (wrap) {
      var range = wrap.querySelector(".compare__range");
      var fig = wrap.querySelector(".compare");
      var btns = wrap.querySelectorAll(".jd-jump");
      var sync = function () {
        var v = parseFloat(range.value);
        btns.forEach(function (b) {
          var target = parseFloat(b.getAttribute("data-compare-set"));
          b.setAttribute("aria-pressed", String(v === target));
        });
      };
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          fig._userMoved = true;
          range.value = b.getAttribute("data-compare-set");
          range.dispatchEvent(new Event("input", { bubbles: true }));
        });
      });
      range.addEventListener("input", sync);
      ["pointerdown", "keydown"].forEach(function (ev) {
        fig.addEventListener(ev, function () { fig._userMoved = true; });
      });
      sync();
      // first view: one slow sweep shows that the drawing becomes the etch.
      // Skipped under reduced motion, and stopped the moment the visitor touches it.
      if (MOTION_OK && "IntersectionObserver" in window) {
        var start = parseFloat(fig.getAttribute("data-start") || range.value);
        var seen = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          seen.disconnect();
          var t0 = null, dur = 2600;
          var step = function (ts) {
            if (fig._userMoved) return;
            if (t0 === null) t0 = ts;
            var k = Math.min(1, (ts - t0) / dur);
            var v = start + Math.sin(k * Math.PI * 2) * 22 * (1 - k * 0.15);
            if (k === 1) v = start;
            range.value = v;
            range.dispatchEvent(new Event("input", { bubbles: true }));
            if (k < 1) requestAnimationFrame(step);
          };
          setTimeout(function () { requestAnimationFrame(step); }, 450);
        }, { threshold: 0.6 });
        seen.observe(fig);
      }
    });
    // five more glass studies, on request
    root.querySelectorAll(".jd-more").forEach(function (b) {
      var more = document.getElementById(b.getAttribute("aria-controls"));
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") !== "true";
        more.hidden = !open;
        b.setAttribute("aria-expanded", String(open));
        b.firstChild.textContent = open ? "Show fewer glass studies " : "Show 5 more glass studies ";
      });
    });
    // the chapter index marks the chapter in view
    var index = root.querySelector(".jd-index");
    if (index && "IntersectionObserver" in window) {
      var links = {};
      index.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(links).forEach(function (id) {
            links[id].classList.toggle("is-current", id === en.target.id);
            if (id === en.target.id) links[id].setAttribute("aria-current", "true");
            else links[id].removeAttribute("aria-current");
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      root.querySelectorAll(".jd-chapter").forEach(function (c) { io.observe(c); });
    }
  }

  /* ---------- Thank-you page ---------- */
  function initThanks() {
    var about = document.getElementById("thanksAbout");
    if (!about) return;
    var sent = null;
    try { sent = JSON.parse(window.sessionStorage.getItem("artha-sent")); } catch (e) {}
    if (!sent) return;
    var who = document.getElementById("thanksName");
    if (who && sent.name) who.textContent = ", " + sent.name;
    var topic = sent.study || sent.interest;
    if (topic) { about.textContent = "Regarding " + topic + "."; about.hidden = false; }
  }

  /* ---------- Copy-link on each study ---------- */
  function initShareLinks() {
    document.querySelectorAll(".story__link").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var id = btn.getAttribute("data-anchor");
        var url = window.location.origin + window.location.pathname + "#" + id;
        var done = function () {
          btn.classList.add("is-copied");
          history.replaceState(null, "", "#" + id);
          setTimeout(function () { btn.classList.remove("is-copied"); }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done, done);
        } else { done(); }
      });
    });
  }

  /* ---------- Markdown → HTML (hardened, prose-focused) ---------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Only permit safe URL schemes; everything else (javascript:, data:, etc.) is neutralised.
  function safeUrl(u) {
    // strip what URL parsers strip, then allowlist by shape; never fall through
    u = String(u || "").replace(/[\u0000-\u0020\u007f]/g, "");
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (/^(\/(?!\/)|\.\/|\.\.\/|#|assets\/|journal\/)/.test(u)) return u; // relative, not protocol-relative
    return "#";
  }
  function inlineMd(s) {
    // protect inline code first so its contents aren't treated as markdown
    var codes = [];
    s = s.replace(/`([^`]+)`/g, function (m, c) { codes.push(c); return " " + (codes.length - 1) + " "; });
    // images  ![alt](src)
    s = s.replace(/!\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)/g, function (m, alt, src) {
      return '<img src="' + escapeHtml(safeUrl(src)) + '" alt="' + escapeHtml(alt) + '" loading="lazy" />';
    });
    // links  [text](href)
    s = s.replace(/\[([^\]]+)\]\(\s*([^)\s]+)[^)]*\)/g, function (m, t, u) {
      var href = safeUrl(u);
      var ext = /^https?:/i.test(href);
      return '<a href="' + escapeHtml(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + t + "</a>";
    });
    // bold then italic, for both * and _ , boundary-aware to avoid stray asterisks/underscores
    s = s.replace(/\*\*(\S(?:[\s\S]*?\S)?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/__(\S(?:[\s\S]*?\S)?)__/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(>])\*(\S(?:[^*]*?\S)?)\*(?=[\s).,!?;:]|$)/g, "$1<em>$2</em>");
    s = s.replace(/(^|[\s(>])_(\S(?:[^_]*?\S)?)_(?=[\s).,!?;:]|$)/g, "$1<em>$2</em>");
    // restore code
    s = s.replace(/ (\d+) /g, function (m, i) { return "<code>" + escapeHtml(codes[+i]) + "</code>"; });
    return s;
  }
  function slugify(s) { return String(s).toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function stripFrontMatter(md) {
    return String(md).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  }
  function mdToHtml(md) {
    var blocks = stripFrontMatter(String(md)).replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
    var html = "", inRefs = false;
    blocks.forEach(function (raw) {
      var b = raw.replace(/\n+$/, "");
      if (/^```/.test(b)) { var code = b.replace(/^```[^\n]*\n?/, "").replace(/```$/, ""); html += "<pre class=\"post__code\"><code>" + escapeHtml(code) + "</code></pre>"; return; }
      var hm = b.match(/^(#{1,4})\s+(.+)$/);
      if (hm) {
        var lvl = Math.min(Math.max(hm[1].length, 2), 4); // ## → h2 (page h1 is the title), ### → h3
        var txt = escapeHtml(hm[2]);
        inRefs = /references|citations|sources/i.test(hm[2]);
        html += "<h" + lvl + ' id="' + slugify(hm[2]) + '">' + inlineMd(txt) + "</h" + lvl + ">";
        return;
      }
      if (/^&gt;\s?/.test(escapeHtml(b).slice(0, 6)) || /^>\s?/.test(b)) {
        var inner = b.replace(/^>\s?/gm, "");
        var paras = inner.split(/\n{2,}/).map(function (p) { return "<p>" + inlineMd(escapeHtml(p).replace(/\n/g, " ")) + "</p>"; }).join("");
        html += '<blockquote class="post__pull">' + paras + "</blockquote>"; return;
      }
      if (/^(-|\*|\+)\s+/.test(b)) { html += "<ul>" + b.split(/\n(?=(?:-|\*|\+)\s+)/).map(function (li) { return "<li>" + inlineMd(escapeHtml(li.replace(/^(-|\*|\+)\s+/, "")).replace(/\n\s+/g, " ")) + "</li>"; }).join("") + "</ul>"; return; }
      if (/^\d+\.\s+/.test(b)) { html += "<ol>" + b.split(/\n(?=\d+\.\s+)/).map(function (li) { return "<li>" + inlineMd(escapeHtml(li.replace(/^\d+\.\s+/, "")).replace(/\n\s+/g, " ")) + "</li>"; }).join("") + "</ol>"; return; }
      if (/^(---+|\*\*\*+|___+)$/.test(b)) { html += "<hr />"; return; }
      var im = b.match(/^!\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)$/);
      if (im) { html += '<figure class="post__figure"><img src="' + escapeHtml(safeUrl(im[2])) + '" alt="' + escapeHtml(im[1]) + '" loading="lazy" />' + (im[1] ? "<figcaption>" + escapeHtml(im[1]) + "</figcaption>" : "") + "</figure>"; return; }
      html += '<p' + (inRefs ? ' class="post__ref"' : "") + ">" + inlineMd(escapeHtml(b).replace(/\n/g, " ")) + "</p>";
    });
    return html;
  }
  function readingTime(md) {
    var words = stripFrontMatter(String(md)).replace(/[#>*_`\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200)) + " min read";
  }

  // Posting dates are deliberately not displayed anywhere in the Journal.
  // The `date` field is still required in each post's front matter and still
  // flows into posts.json — build-journal.mjs sorts on it (newest first), so
  // removing it would scramble the running order. It is ordering data, not
  // display data.

  function cardMarkup(p, cls, cta) {
    var alt = escapeHtml(p.imageAlt || p.title || "");
    return '<a class="' + cls + '" href="post.html?p=' + encodeURIComponent(p.slug) + '">' +
      '<div class="' + cls + '__media">' + (p.image ? '<img src="' + escapeHtml(safeUrl(p.image)) + '" alt="' + alt + '" loading="lazy" />' : "") + "</div>" +
      '<div class="' + cls + '__body">' +
        '<p class="' + cls + '__meta">' + [p.readingTime].filter(Boolean).map(escapeHtml).join(" &middot; ") + "</p>" +
        "<h3>" + escapeHtml(p.title) + "</h3>" +
        (p.excerpt ? '<p class="' + cls + '__excerpt">' + escapeHtml(p.excerpt) + "</p>" : "") +
        '<span class="link-arrow">' + cta + ' <span class="arrow" aria-hidden="true">&rarr;</span></span>' +
      "</div></a>";
  }

  /* ---------- Journal index ---------- */
  function initJournalIndex() {
    var featured = document.getElementById("journalFeatured");
    if (!featured) return;
    var moreWrap = document.getElementById("journalMoreWrap");
    var grid = document.getElementById("journalGrid");
    var fallback = document.getElementById("journalFallback");

    fetch("journal/posts.json?v=" + VER).then(function (r) {
      if (!r.ok) throw new Error("manifest");
      return r.json();
    }).then(function (posts) {
      if (!Array.isArray(posts) || !posts.length) { if (fallback) { fallback.hidden = false; fallback.innerHTML = '<p>New musings are on their way.</p><a class="btn" href="collaborate.html">Collaborate with the Atelier <span class="arrow" aria-hidden="true">&rarr;</span></a>'; } return; }
      var f = posts[0];
      featured.innerHTML =
        '<a class="featured" href="post.html?p=' + encodeURIComponent(f.slug) + '">' +
          '<div class="featured__media">' + (f.image ? '<img src="' + escapeHtml(safeUrl(f.image)) + '" alt="' + escapeHtml(f.imageAlt || f.title || "") + '" loading="lazy" />' : "") + "</div>" +
          '<div class="featured__body">' +
            '<p class="eyebrow eyebrow--ink">Latest &middot; ' + escapeHtml(f.tags && f.tags[0] ? f.tags[0] : "Journal") + "</p>" +
            "<h2>" + escapeHtml(f.title) + "</h2>" +
            (f.dek ? '<p class="featured__dek">' + escapeHtml(f.dek) + "</p>" : "") +
            '<p class="featured__meta">' + [f.author, f.readingTime].filter(Boolean).map(escapeHtml).join(" &middot; ") + "</p>" +
            (f.excerpt ? '<p class="featured__excerpt">' + escapeHtml(f.excerpt) + "</p>" : "") +
            '<span class="link-arrow">Read the essay <span class="arrow" aria-hidden="true">&rarr;</span></span>' +
          "</div>" +
        "</a>";

      // the featured slot stays editorial: it is labeled Latest, and the
      // date field is the founder's ordering control. The shelf below it
      // deals itself in a new order on every visit.
      var rest = posts.slice(1).sort(function () { return Math.random() - 0.5; });
      if (rest.length && grid && moreWrap) {
        moreWrap.hidden = false;
        grid.innerHTML = rest.map(function (p) { return cardMarkup(p, "jcard", "Read"); }).join("");
      }
      initReveal();
    }).catch(function () {
      if (fallback) fallback.hidden = false; // keep the hardcoded featured-link fallback for file:// previews
    });
  }

  /* ---------- Single post ---------- */
  function initPost() {
    var mount = document.getElementById("post");
    if (!mount) return;
    var params = new URLSearchParams(window.location.search);
    var slug = (params.get("p") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!slug) { mount.innerHTML = '<div class="wrap post__loading">Post not found. <a href="perspectives.html">Back to the Journal</a></div>'; return; }

    Promise.all([
      fetch("journal/posts.json?v=" + VER).then(function (r) { return r.json(); }).catch(function () { return []; }),
      fetch("journal/" + slug + ".md?v=" + VER).then(function (r) { if (!r.ok) throw new Error("404"); return r.text(); })
    ]).then(function (res) {
      var list = Array.isArray(res[0]) ? res[0] : [];
      var idx = -1;
      list.forEach(function (p, i) { if ((p.slug || "").toLowerCase() === slug) idx = i; });
      var meta = idx > -1 ? list[idx] : {};
      var rawMd = res[1];
      var body = mdToHtml(rawMd);
      var rt = meta.readingTime || readingTime(rawMd);

      // per-post metadata (helps JS-rendering crawlers; document limitation for social)
      if (meta.title) document.title = meta.title + " | Perspectives | Artha Indus Atelier";
      setMeta('meta[name="description"]', "content", meta.excerpt || meta.dek || "");
      setMeta('meta[property="og:title"]', "content", (meta.title || "Perspectives") + " | Artha Indus Atelier");
      setMeta('meta[property="og:description"]', "content", meta.excerpt || meta.dek || "");
      // Social crawlers cannot resolve a relative og:image — it must be absolute.
      if (meta.image) setMeta('meta[property="og:image"]', "content", new URL(meta.image, location.href).href);
      // Canonical/og:url must be the clean article URL: location.href would fold in
      // whatever tracking or cache-busting params a visitor happened to arrive with,
      // splitting one article across many canonicals.
      var cleanUrl = location.origin + location.pathname + "?p=" + encodeURIComponent(slug);
      setMeta('meta[property="og:url"]', "content", cleanUrl);
      var canon = document.querySelector('link[rel="canonical"]');
      if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
      canon.href = cleanUrl;

      // prev / next (list is newest-first: next = newer = idx-1, prev = older = idx+1)
      var newer = idx > 0 ? list[idx - 1] : null;
      var older = idx > -1 && idx < list.length - 1 ? list[idx + 1] : null;
      var handoffTo = older || newer;
      // the "Continue the thread" card already carries that essay: the bar offers the other one
      var barOlder = older && older !== handoffTo ? older : null;
      var barNewer = newer && newer !== handoffTo ? newer : null;
      older = barOlder; newer = barNewer;
      var prevnext = (newer || older) ?
        '<nav class="post__prevnext">' +
          (older ? '<a class="post__pn" href="post.html?p=' + encodeURIComponent(older.slug) + '"><span>Older</span>' + escapeHtml(older.title) + "</a>" : "<span></span>") +
          (newer ? '<a class="post__pn post__pn--next" href="post.html?p=' + encodeURIComponent(newer.slug) + '"><span>Newer</span>' + escapeHtml(newer.title) + "</a>" : "<span></span>") +
        "</nav>" : "";

      // related (share a tag)
      var tags = meta.tags || [];
      // the handoff: hand a finished reader the next essay in reading order
      var next = handoffTo;
      var handoffHtml = next ?
        '<a class="handoff reveal" href="post.html?p=' + encodeURIComponent(next.slug) + '">' +
          '<span class="handoff__media">' + (next.image ? '<img src="' + escapeHtml(safeUrl(next.image)) + '" alt="" loading="lazy" />' : "") + "</span>" +
          '<span class="handoff__body">' +
            '<span class="eyebrow eyebrow--ink">Continue the thread</span>' +
            '<span class="handoff__title">' + escapeHtml(next.title) + "</span>" +
            (next.dek ? '<span class="handoff__dek">' + escapeHtml(next.dek) + "</span>" : "") +
            '<span class="link-arrow">Read on <span class="arrow" aria-hidden="true">&rarr;</span></span>' +
          "</span>" +
        "</a>" : "";

      var related = list.filter(function (p, i) { return i !== idx && (!next || p.slug !== next.slug) && (p.tags || []).some(function (t) { return tags.indexOf(t) > -1; }); })
        .sort(function () { return Math.random() - 0.5; }) // vary the shelf on every read
        .slice(0, 3);
      var relatedHtml = related.length ?
        '<section class="post__related"><div class="sec-head"><span class="eyebrow eyebrow--ink">Related musings</span></div><div class="journal-grid">' +
          related.map(function (p) { return cardMarkup(p, "jcard", "Read"); }).join("") + "</div></section>" : "";

      var lineages = { warli: "Warli", madhubani: "Madhubani", mithila: "Madhubani", gond: "Gond", kalamkari: "Kalamkari", saura: "Saura", pattachitra: "Pattachitra" };
      // the lineage an essay discusses most, judged from its title, dek, tags and text
      var hay = ((meta.title || "") + " " + (meta.dek || "") + " " + tags.join(" ") + " " + String(body).replace(/<[^>]+>/g, " ")).toLowerCase();
      var lin = Object.keys(lineages).map(function (k) {
        return { k: k, n: (hay.match(new RegExp("\\b" + k + "\\b", "g")) || []).length };
      }).filter(function (x) { return x.n > 0; }).sort(function (a, b) { return b.n - a.n; }).map(function (x) { return x.k; })[0];
      var linKey = lin === "mithila" ? "madhubani" : lin;
      var nextStepHtml =
        '<aside class="post__next" aria-label="Next step">' +
          "<p>Bring a lineage into your next project.</p>" +
          '<div class="post__next__actions">' +
            '<a class="btn jd-btn-light" href="collaborate.html">Begin an inquiry <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
            (linKey ? '<a class="link-arrow" href="spatial-studies.html?lineage=' + linKey + '#collection">All ' + lineages[lin] + ' studies <span class="arrow" aria-hidden="true">&rarr;</span></a>'
                    : '<a class="link-arrow" href="spatial-studies.html#collection">Browse the studies <span class="arrow" aria-hidden="true">&rarr;</span></a>') +
          "</div>" +
        "</aside>";

      mount.setAttribute("aria-busy", "false");
      mount.innerHTML =
        '<div class="post__progress" aria-hidden="true"><span></span></div>' +
        '<header class="post__hero">' +
          '<div class="wrap">' +
            '<a class="post__back" href="perspectives.html"><span aria-hidden="true">&larr;</span> Darśana &middot; The Journal</a>' +
            (tags.length ? '<p class="eyebrow" style="margin-top:1.4rem">' + tags.map(escapeHtml).join(" &middot; ") + "</p>" : "") +
            "<h1>" + escapeHtml(meta.title || "Untitled") + "</h1>" +
            (meta.dek ? '<p class="post__dek">' + escapeHtml(meta.dek) + "</p>" : "") +
            '<p class="post__byline">' + [meta.author, rt].filter(Boolean).map(escapeHtml).join(" &middot; ") + "</p>" +
          "</div>" +
        "</header>" +
        (meta.image ? '<div class="wrap"><figure class="post__cover"><img src="' + escapeHtml(safeUrl(meta.image)) + '" alt="' + escapeHtml(meta.imageAlt || meta.title || "") + '" /></figure></div>' : "") +
        '<div class="wrap"><div class="post__layout">' +
          '<aside class="post__toc" id="postToc" aria-label="On this page"></aside>' +
          '<div class="post__body">' + body + "</div>" +
        "</div>" +
          '<div class="post__foot">' +
            '<div class="post__author">' +
              '<p class="post__sign">' + escapeHtml(meta.author || "Artha Indus Atelier") + "</p>" +
              (meta.authorBio ? '<p class="post__bio">' + escapeHtml(meta.authorBio) + "</p>" : "") +
            "</div>" +
            '<button class="post__copy" type="button" data-anchor-url="1">Copy link</button>' +
          "</div>" +
          prevnext +
          handoffHtml +
          relatedHtml +
          nextStepHtml +
        "</div>";

      buildToc();
      buildGlosses(mount);
      initPostProgress();
      var copyBtn = mount.querySelector(".post__copy");
      if (copyBtn) copyBtn.addEventListener("click", function () {
        var done = function () { copyBtn.textContent = "Link copied"; setTimeout(function () { copyBtn.textContent = "Copy link"; }, 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
      });
      initReveal();
    }).catch(function () {
      mount.innerHTML = '<div class="wrap post__loading">This post could not be loaded. <a href="perspectives.html">Back to the Journal</a></div>';
    });
  }
  /* ---------- Margin glosses: the manuscript annotates its own terms ----
     Sanskrit terms in an essay get a quiet definition in the right margin
     on wide screens. Every gloss is traceable to the atelier's own essays;
     first occurrence only, supplemental, hidden from assistive tech. */
  var GLOSSARY = {
    bija: "the primordial seed",
    kairi: "the green, unripe mango",
    ambi: "the green, unripe mango",
    kalam: "the bamboo pen of Kalamkari",
    kalka: "the sweeping architectural form of the seed",
    vrksa: "the tree; the vertical axis",
    vriksha: "the tree; the vertical axis",
    kalpavriksa: "the wish-fulfilling tree",
    kalpavriksha: "the wish-fulfilling tree",
    akasa: "boundless ether",
    aranya: "the wild forest",
    prakrti: "primal nature",
    gaja: "the elephant",
    gajathara: "the elephant frieze of temple plinths",
    sunya: "the void; deliberate negative space",
    shunya: "the void; deliberate negative space",
    kurma: "the tortoise; the grounding curve",
    matsya: "the fish; the fluid trajectory",
    mayura: "the peacock; the transmuting radiance",
    jali: "the pierced screen",
    jalis: "the pierced screens",
    tarpa: "the Warli wind instrument",
    mandala: "the circle",
    buta: "the floral bouquet motif",
    mangalya: "auspiciousness",
    simha: "the lion",
    mrga: "the deer",
    mandapa: "the pillared temple hall",
    garbhagrha: "the innermost sanctum",
    chaya: "shadow",
    parampara: "the unbroken succession; lineage",
    talamana: "the system of proportional measure",
    varna: "color; pigment",
    torana: "the ceremonial gateway",
    anital: "the framed portal of Saura murals"
  };
  function normTerm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  }
  function buildGlosses(root) {
    var body = root.querySelector(".post__body");
    if (!body) return;
    var seen = {}, glosses = [];
    Array.prototype.forEach.call(body.querySelectorAll("em"), function (em) {
      var raw = em.textContent.trim();
      if (raw.length > 24) return;
      var key = normTerm(raw);
      if (!GLOSSARY[key] || seen[key]) return;
      seen[key] = true;
      var g = document.createElement("span");
      g.className = "gloss";
      g.setAttribute("aria-hidden", "true");
      g.innerHTML = "<b>" + escapeHtml(raw) + "</b>" + escapeHtml(GLOSSARY[key]);
      body.appendChild(g);
      glosses.push({ el: g, ref: em });
    });
    if (!glosses.length) return;
    function place() {
      var lastBottom = -999;
      glosses.forEach(function (item) {
        var top = item.ref.offsetTop;
        if (top < lastBottom + 10) top = lastBottom + 10;
        item.el.style.top = top + "px";
        lastBottom = top + item.el.offsetHeight;
      });
    }
    place();
    window.addEventListener("load", place);
    window.addEventListener("resize", place);
  }

  function setMeta(sel, attr, val) { var el = document.querySelector(sel); if (el && val) el.setAttribute(attr, val); }
  function buildToc() {
    var toc = document.getElementById("postToc");
    var heads = document.querySelectorAll(".post__body h2");
    if (!toc || heads.length < 3) { if (toc) toc.remove(); return; }
    var html = '<p class="post__toc-title">On this page</p><ul>';
    heads.forEach(function (h) { html += '<li><a href="#' + h.id + '">' + escapeHtml(h.textContent) + "</a></li>"; });
    toc.innerHTML = html + "</ul>";
  }
  function initPostProgress() {
    var bar = document.querySelector(".post__progress span");
    var body = document.querySelector(".post__body");
    if (!bar || !body) return;
    var onScroll = function () {
      var total = body.offsetTop + body.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, total)));
      bar.style.transform = "scaleX(" + p + ")";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }


  /* ---------- Flipbook (one motif, five typologies) ---------- */
  function initFlipbook() {
    var book = document.getElementById("flipbook");
    if (!book) return;
    var leaves = Array.prototype.slice.call(book.querySelectorAll(".leaf"));
    var prev = document.getElementById("flipPrev");
    var next = document.getElementById("flipNext");
    var count = document.getElementById("flipCount");
    var i = 0, n = leaves.length;
    var pad = function (x) { return String(x).padStart(2, "0"); };
    var typologies = leaves.filter(function (l) { return !l.hasAttribute("data-count-label"); }).length;

    var TURN_MS = 1050;   // must match the .leaf transition duration in CSS
    var Z_LIFT = 900;     // a turning page floats above the whole stack

    function render(animate) {
      leaves.forEach(function (leaf, idx) {
        var turned = idx < i;
        var was = leaf.classList.contains("is-turned");
        leaf.classList.toggle("is-turned", turned);
        leaf.setAttribute("aria-hidden", idx === i ? "false" : "true");
        // keep focusables inside hidden leaves out of the tab order
        if (idx === i) leaf.removeAttribute("inert");
        else leaf.setAttribute("inert", "");

        // resting stack: un-turned pages descend from the top,
        // already-turned pages pile up on the left in turn order
        var restZ = turned ? idx : (n - idx);

        leaf._restZ = restZ;
        if (animate && was !== turned) {
          // this page is mid-turn — keep it above everything until it lands,
          // otherwise it appears to rotate behind the page it is revealing
          leaf._turning = true;
          leaf.style.zIndex = String(Z_LIFT - idx);
          clearTimeout(leaf._settle);
          leaf._settle = setTimeout(function () {
            leaf._turning = false;
            leaf.style.zIndex = String(leaf._restZ);
          }, TURN_MS);
        } else if (!leaf._turning) {
          // idle page — sit at its resting depth
          leaf.style.zIndex = String(restZ);
        }
        // a page still in flight keeps its lift; its own timer settles it to the latest depth
      });
      // the closing index spread is not a typology: count only the typology
      // leaves ("01 / 05") and let the index name itself ("All five")
      if (count) {
        var label = leaves[i].getAttribute("data-count-label");
        count.textContent = label || (pad(i + 1) + " / " + pad(typologies));
      }
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === n - 1;
    }
    function go(d) { var t = Math.min(n - 1, Math.max(0, i + d)); if (t !== i) { i = t; render(true); } }

    if (next) next.addEventListener("click", function () { go(1); });
    if (prev) prev.addEventListener("click", function () { go(-1); });

    // click the page itself to advance
    book.querySelector(".flipbook__stage").addEventListener("click", function (e) {
      var jump = e.target.closest("[data-goto]");
      if (jump) { i = parseInt(jump.getAttribute("data-goto"), 10); render(true); return; }
      if (e.target.closest("button")) return;
      go(1);
    });

    // keyboard
    book.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(1); }
      else if (e.key === "ArrowLeft") { go(-1); }
    });
    book.setAttribute("tabindex", "0");

    // swipe
    var x0 = null;
    book.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    book.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    });

    // the book turns its own pages while in view, pausing under the pointer
    // and handing over for good at the visitor's first touch of any control
    var auto = null, hovering = false;
    function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
    if (MOTION_OK && "IntersectionObserver" in window) {
      book.addEventListener("pointerenter", function () { hovering = true; });
      book.addEventListener("pointerleave", function () { hovering = false; });
      ["pointerdown", "keydown"].forEach(function (ev) {
        book.addEventListener(ev, stopAuto, true);
      });
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (!auto) auto = setInterval(function () {
              if (hovering || document.hidden) return;
              i = (i + 1) % n;
              render(true);
            }, 4600);
          } else {
            stopAuto();
          }
        });
      }, { threshold: 0.5 });
      bio.observe(book);
    }

    render();
  }


  /* ---------- Study overlay (the dossier) ---------- */
  function initStudyOverlay() {
    var ov = document.getElementById("studyOverlay");
    var grid = document.getElementById("stories");
    if (!ov || !grid) return;
    var plates = Array.prototype.slice.call(grid.querySelectorAll(".plate"));
    var imgEl = document.getElementById("studyOverlayImg");
    var txtEl = document.getElementById("studyOverlayText");
    var specify = document.getElementById("studySpecify");
    var copyBtn = document.getElementById("studyCopy");
    var cur = -1, lastFocus = null, release = null;

    function visible() { return plates.filter(function (p) { return !p.classList.contains("is-hidden"); }); }

    function markSeen(p) {
      p.classList.add("is-visited");
      var seen = storeGet("artha-studies-seen") || [];
      if (seen.indexOf(p.id) === -1) { seen.push(p.id); storeSet("artha-studies-seen", seen); }
    }
    // restore the visited marks from earlier browsing
    (storeGet("artha-studies-seen") || []).forEach(function (id) {
      var p = document.getElementById(id);
      if (p && p.classList.contains("plate")) p.classList.add("is-visited");
    });

    var ctxEl = document.getElementById("studyCtx");
    function updateCtx(p) {
      if (!ctxEl) return;
      var vis = visible();
      var i = vis.indexOf(p);
      if (i === -1) { ctxEl.textContent = ""; return; }
      // name the active narrowing, so the loop is legible: "3 of 9 · Hospitality"
      var labels = [];
      document.querySelectorAll(".study-index__f.is-active").forEach(function (b) {
        if (b.getAttribute("data-filter") !== "all") {
          labels.push((b.childNodes[0] && b.childNodes[0].textContent ? b.childNodes[0].textContent : b.textContent).trim());
        }
      });
      ctxEl.textContent = (i + 1) + " of " + vis.length + (labels.length ? " · " + labels.join(" · ") : "");
    }
    function fill(p, skipHistory) {
      updateCtx(p);
      var tpl = p.querySelector(".plate__dossier");
      var img = p.querySelector(".plate__media img");
      imgEl.src = img.getAttribute("src");
      imgEl.alt = img.getAttribute("alt") || "";
      txtEl.innerHTML = "";
      txtEl.appendChild(tpl.content.cloneNode(true));
      var h = txtEl.querySelector(".dossier__title");
      if (h) h.id = "studyOverlayTitle";
      if (specify) specify.href = "collaborate.html?study=" + encodeURIComponent(p.id) +
        (h ? "&t=" + encodeURIComponent(h.textContent.trim()) : "");
      txtEl.scrollTop = 0;
      if (!skipHistory) history.replaceState(history.state, "", "#" + p.id);
    }
    // FLIP: the plate's thumbnail appears to travel into the dossier
    function flipFrom(p) {
      if (!MOTION_OK) return;
      var src = p.querySelector(".plate__media img");
      if (!src) return;
      var a = src.getBoundingClientRect();
      if (!a.width) return;
      requestAnimationFrame(function () {
        var b = imgEl.getBoundingClientRect();
        if (!b.width) return;
        var ghost = document.createElement("img");
        ghost.src = imgEl.src;
        ghost.alt = "";
        ghost.className = "flip-ghost";
        ghost.style.top = b.top + "px";
        ghost.style.left = b.left + "px";
        ghost.style.width = b.width + "px";
        ghost.style.height = b.height + "px";
        ghost.style.transform = "translate(" + (a.left - b.left) + "px," + (a.top - b.top) +
          "px) scale(" + a.width / b.width + "," + a.height / b.height + ")";
        document.body.appendChild(ghost);
        ov.classList.add("is-flipping");
        var done = function () {
          clearTimeout(fallback);
          if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
          ov.classList.remove("is-flipping");
        };
        var fallback = setTimeout(done, 700);
        ghost.addEventListener("transitionend", done);
        requestAnimationFrame(function () { ghost.style.transform = "none"; });
      });
    }
    function open(p, viaPop) {
      cur = plates.indexOf(p);
      lastFocus = document.activeElement;
      fill(p, true);
      if (!viaPop) history.pushState({ arthaStudy: p.id }, "", "#" + p.id);
      markSeen(p);
      ov.hidden = false;
      if (!release) release = isolate(ov);
      requestAnimationFrame(function () { ov.classList.add("is-open"); });
      document.body.classList.add("overlay-open");
      flipFrom(p);
      txtEl.focus();
    }
    function doClose() {
      // Back can close the dossier while the viewer is still open on top:
      // shut the viewer first so focus lands back on the plate, not on body
      if (closeLightbox) closeLightbox();
      if (release) { release(); release = null; }
      ov.classList.remove("is-open");
      document.body.classList.remove("overlay-open");
      setTimeout(function () { ov.hidden = true; }, 420);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function close() {
      // If this dossier pushed a history entry, Back and the close button
      // are the same gesture: both step back and both close the overlay.
      if (history.state && history.state.arthaStudy) { history.back(); return; }
      doClose();
      if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
    window.addEventListener("popstate", function (e) {
      var id = e.state && e.state.arthaStudy;
      if (id) {
        var p = document.getElementById(id);
        if (p && p.classList.contains("plate")) {
          if (ov.hidden) open(p, true); else fill(p, true);
        }
      } else if (!ov.hidden) {
        doClose();
      }
    });
    function step(d) {
      var vis = visible();
      if (!vis.length) return;
      var i = vis.indexOf(plates[cur]);
      var t = vis[(i + d + vis.length) % vis.length];
      if (t) { cur = plates.indexOf(t); fill(t); markSeen(t); }
    }

    plates.forEach(function (p) {
      var face = p.querySelector(".plate__face");
      if (face) face.addEventListener("click", function () { open(p); });
    });
    ov.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close-overlay")) close();
    });
    document.getElementById("studyClose").addEventListener("click", close);
    document.getElementById("studyNext").addEventListener("click", function () { step(1); });
    document.getElementById("studyPrev").addEventListener("click", function () { step(-1); });
    document.addEventListener("keydown", function (e) {
      if (ov.hidden) return;
      // while the image viewer is open on top, its keys are its own
      if (document.querySelector(".lightbox.is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    });
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var url = location.origin + location.pathname + "#" + (plates[cur] ? plates[cur].id : "");
      var done = function () { copyBtn.textContent = "Link copied"; setTimeout(function(){ copyBtn.textContent = "Copy link"; }, 1400); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else done();
    });
    // deep link
    var t = location.hash && document.getElementById(location.hash.slice(1));
    if (t && t.classList.contains("plate")) open(t);
  }

  /* ---------- Image guard: deter casual saving of the artwork ----------
     Right-click save, long-press save and drag-out are blocked on images.
     This deters casual copying only; screenshots cannot be prevented. */
  function initImageGuard() {
    document.addEventListener("contextmenu", function (e) {
      var t = e.target;
      if (t && (t.tagName === "IMG" || (t.closest && t.closest(".hero__media, .macro__media, .cta-band__media, .study-overlay__media, .lightbox")))) {
        e.preventDefault();
      }
    });
    document.addEventListener("dragstart", function (e) {
      if (e.target && e.target.tagName === "IMG") e.preventDefault();
    });
  }

  /* ---------- Lineage hub: each section pulls its studies from the index ---------- */
  function initLineageHub() {
    var sections = document.querySelectorAll(".lin[data-lin]");
    if (!sections.length || !window.fetch || !window.DOMParser) return;
    fetch("spatial-studies.html?v=" + VER).then(function (r) {
      if (!r.ok) throw new Error("index");
      return r.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      sections.forEach(function (sec) {
        var lin = sec.getAttribute("data-lin");
        var grid = sec.querySelector(".lin__studies");
        if (!grid) return;
        var plates = Array.prototype.slice.call(doc.querySelectorAll('#stories .plate[data-lineage="' + lin + '"]')).slice(0, 3);
        grid.innerHTML = plates.map(function (p) {
          var img = p.querySelector(".plate__media img");
          var eb = p.querySelector(".plate__label .eyebrow");
          var title = p.querySelector(".plate__title");
          var bf = p.querySelector(".plate__bestfor");
          if (!img || !title) return "";
          return '<a class="index3__card" href="spatial-studies.html#' + escapeHtml(p.id) + '">' +
            '<span class="index3__media"><img src="' + escapeHtml(img.getAttribute("src")) + '" alt="' + escapeHtml(img.getAttribute("alt") || "") + '" loading="lazy" /></span>' +
            '<span class="index3__body">' +
              (eb ? '<span class="eyebrow eyebrow--ink">' + escapeHtml(eb.textContent) + "</span>" : "") +
              '<span class="index3__title">' + escapeHtml(title.textContent) + "</span>" +
              (bf ? '<span class="index3__bestfor"><span>Best for</span> ' + escapeHtml(bf.textContent.replace(/^\s*Best for\s*/, "")) + "</span>" : "") +
              '<span class="link-arrow">Open the study <span class="arrow" aria-hidden="true">&rarr;</span></span>' +
            "</span></a>";
        }).join("");
      });
    }).catch(function () { /* the All-studies links still stand */ });
  }

  /* ---------- Boot ---------- */
  buildNav();
  initImageGuard();
  buildFooter();
  initHours();
  initNavScroll();
  initMobileMenu();
  initFreshness();
  initProvenance();
  initVeil();
  initScrollHint();
  initHeroEffect();
  initTapInk();
  initStripDrift();
  initIndexShuffle();
  initLineageHub();
  initReveal();
  initForm();
  initStudyFilter();
  initCompareSlider();
  initLightbox();
  initCapsule();
  initThanks();
  initShareLinks();
  initFlipbook();
  initStudyOverlay();
  initJournalIndex();
  initPost();
})();
