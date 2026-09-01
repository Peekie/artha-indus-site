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
    { id: "perspectives", href: "perspectives.html",    label: "Perspectives" },
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
  var MOTION_OK = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: no-preference)").matches);

  /* ---------- NAV ---------- */
  function buildNav() {
    var links = PAGES.map(function (p, i) {
      var active = p.id === current ? " is-active" : "";
      var cta = p.id === "collaborate" ? " nav__cta" : "";
      return '<a class="nav__link' + cta + active + '" href="' + p.href + '">' + p.label + "</a>";
    }).join("");

    var mobile = PAGES.map(function (p, i) {
      var n = String(i + 1).padStart(2, "0");
      return '<a href="' + p.href + '"><span class="m-num">' + n + "</span>" + p.label + "</a>";
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
        '<button class="nav__toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">' +
          '<svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.4"><line x1="0" y1="1" x2="26" y2="1"/><line x1="0" y1="7" x2="26" y2="7"/><line x1="0" y1="13" x2="26" y2="13"/></svg>' +
        "</button>" +
      "</header>" +
      '<nav class="mobile-menu" id="mobileMenu" aria-label="Mobile">' + mobile + "</nav>";

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
      return "<li><a href=\"" + p.href + "\">" + p.label + "</a></li>";
    }).join("");

    var html =
      '<footer class="footer">' +
        '<div class="wrap">' +
          '<div class="footer__top">' +
            "<div>" +
              '<div class="footer__mark">Artha Indus Atelier<span>Ancient Heritage. Modern Resonance.</span></div>' +
              '<p class="footer__note" style="margin-top:1.4rem">A boutique curation house bridging ancient master lineages with modern corporate, hospitality, and healthcare environments, preserving the soul of the artisan’s hand.</p>' +
            "</div>" +
            "<div><h6>Navigate</h6><ul>" + nav + "</ul></div>" +
            '<div><h6>Connect</h6><ul>' +
              '<li><a href="mailto:preeti@arthaindus.com">preeti@arthaindus.com</a></li>' +
              '<li><a href="https://arthaindus.com">www.arthaindus.com</a></li>' +
              '<li>Chicago, IL</li>' +
              '<li><a href="collaborate.html">Request 2026 Lookbook</a></li>' +
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

  /* ---------- Scroll state on nav ---------- */
  function initNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
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
    var open = false;
    var set = function (state) {
      open = state;
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () { set(!open); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { set(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) set(false); });
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
        { src: "assets/img/story-gaja-bronze.jpg", alt: "A caparisoned Kalamkari Gaja elephant pierced through darkened bronze, glowing amber behind an upscale hotel bar." },
        { src: "assets/img/story-12-tarpa-mandala.jpg", alt: "Oversized framed Warli Tarpa dance masterwork, white figures spiralling on a charcoal ground, above an oak bench on a travertine threshold wall." }
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
    }
    // CTA backdrops rotate on the pages without a pinned choice
    if (current === "home" || current === "perspectives") {
      var pool = ["cta-environment.jpg", "scale-thematic.jpg", "studio-parrot-fish.jpg", "studio-landscape-pattachitra.jpg", "studio-buddha.jpg"];
      var cta = document.querySelector(".cta-band__media img");
      if (cta) cta.src = "assets/img/" + pick(pool);
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

  /* ---------- Hero torch: the pointer excavates the underdrawing ---------- */
  function initHeroTorch() {
    var hero = document.querySelector(".hero");
    var media = hero && hero.querySelector(".hero__media");
    var photo = media && media.querySelector(".hero__photo");
    if (!hero || !media || !photo || !MOTION_OK) return;
    // Hover-capable fine pointers only. On touch devices the torch fired on
    // every scroll-touch and read as flicker, so they get the plain photo.
    if (!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches)) return;
    var tx = 50, ty = 40, tr = 0, cx = 50, cy = 40, cr = 0, raf = null;
    function tick() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cr += (tr - cr) * 0.12;
      media.style.setProperty("--mx", cx.toFixed(2) + "%");
      media.style.setProperty("--my", cy.toFixed(2) + "%");
      media.style.setProperty("--tr", Math.max(0.5, cr).toFixed(1) + "px");
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
      tr = 200;
      kick();
    });
    hero.addEventListener("pointerleave", function () { tr = 0; kick(); });
  }

  /* ---------- From the index: three random studies per visit ---------- */
  // The static cards in the markup are the fallback (file://, no JS). When we
  // can fetch the studies index, the trio is drawn fresh from the live plates,
  // so it never goes stale as studies are added.
  function initIndexShuffle() {
    var grid = document.querySelector(".index3");
    if (!grid || !window.fetch || !window.DOMParser) return;
    fetch("spatial-studies.html").then(function (r) {
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
            (eb ? '<span class="eyebrow eyebrow--ink">' + eb.innerHTML + "</span>" : "") +
            '<span class="index3__title">' + title.innerHTML + "</span>" +
            (bf ? '<span class="index3__bestfor">' + bf.innerHTML + "</span>" : "") +
            '<span class="link-arrow">Open the study <span class="arrow" aria-hidden="true">&rarr;</span></span>' +
          "</span></a>";
      }).join("");
    }).catch(function () { /* the static trio stays */ });
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
    var studyId = (q.get("study") || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    var studyTitle = (q.get("t") || "").slice(0, 160);
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
      var sel = document.getElementById("interest");
      if (sel) sel.value = "Bespoke Masterwork Commission";
    }

    // A soft nod to the visitor's own browsing, never a scoreboard.
    var n = seenCount();
    if (n > 0) {
      var intro = form.querySelector(".form__intro");
      if (intro) {
        var thread = document.createElement("p");
        thread.className = "form__threadnote";
        thread.textContent = "You have examined " + n + (n === 1 ? " study." : " studies.") + " Bring the shortlist.";
        intro.insertAdjacentElement("afterend", thread);
      }
    }
    form.addEventListener("submit", function (e) {
      // On Netlify the form posts natively — just hand over the Lookbook first.
      if (isNetlify) {
        // A bare `return` would NOT stop the submission: without preventDefault the
        // browser posts anyway, and the form carries `novalidate` so it will not
        // block invalid input either. Invalid enquiries were reaching Netlify.
        if (!form.checkValidity()) {
          e.preventDefault();
          if (status) { status.style.color = "var(--terracotta)"; status.textContent = "Please add your name and a valid email."; }
          form.reportValidity();
          return;
        }
        return; // valid — let Netlify handle the POST
      }
      e.preventDefault();
      if (!form.checkValidity()) {
        if (status) { status.style.color = "var(--terracotta)"; status.textContent = "Please add your name and a valid email."; }
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
        range.value = v;
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
        el.setPointerCapture(e.pointerId); pointerFromX(e.clientX);
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

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var triggers = document.querySelectorAll(".stage__media img, .study-overlay__media img");
    if (!triggers.length) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button>' +
      '<img class="lightbox__img" alt="" />' +
      '<p class="lightbox__cap"></p>';
    document.body.appendChild(box);
    var boxImg = box.querySelector(".lightbox__img");
    var boxCap = box.querySelector(".lightbox__cap");
    var lastFocus = null;

    function open(img) {
      lastFocus = document.activeElement;
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt || "";
      var story = img.closest("article");
      var label = "";
      if (story) {
        var eb = story.querySelector(".eyebrow, .stage__label");
        var h = story.querySelector("h3, h4");
        label = [eb && eb.textContent.trim(), h && h.textContent.trim()].filter(Boolean).join(" · ");
      } else {
        var cap = img.parentElement.querySelector(".typo__cap h4");
        if (cap) label = cap.textContent.trim();
      }
      boxCap.textContent = label || img.alt || "";
      box.classList.add("is-open");
      box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      box.querySelector(".lightbox__close").focus();
    }
    function close() {
      box.classList.remove("is-open");
      box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    triggers.forEach(function (img) {
      img.addEventListener("click", function () { open(img); });
    });
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox__close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box.classList.contains("is-open")) close();
    });
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
    u = String(u || "").trim();
    if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
    if (/^(\/|\.|#|assets\/|journal\/)/.test(u)) return u; // relative
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return "#";        // unknown scheme → block
    return u;
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

    fetch("journal/posts.json").then(function (r) {
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

      var rest = posts.slice(1);
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
      fetch("journal/posts.json").then(function (r) { return r.json(); }).catch(function () { return []; }),
      fetch("journal/" + slug + ".md").then(function (r) { if (!r.ok) throw new Error("404"); return r.text(); })
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
      var prevnext = (newer || older) ?
        '<nav class="post__prevnext">' +
          (older ? '<a class="post__pn" href="post.html?p=' + encodeURIComponent(older.slug) + '"><span>Older</span>' + escapeHtml(older.title) + "</a>" : "<span></span>") +
          (newer ? '<a class="post__pn post__pn--next" href="post.html?p=' + encodeURIComponent(newer.slug) + '"><span>Newer</span>' + escapeHtml(newer.title) + "</a>" : "<span></span>") +
        "</nav>" : "";

      // related (share a tag)
      var tags = meta.tags || [];
      var related = list.filter(function (p, i) { return i !== idx && (p.tags || []).some(function (t) { return tags.indexOf(t) > -1; }); }).slice(0, 3);
      var relatedHtml = related.length ?
        '<section class="post__related"><div class="sec-head"><span class="eyebrow eyebrow--ink">Related musings</span></div><div class="journal-grid">' +
          related.map(function (p) { return cardMarkup(p, "jcard", "Read"); }).join("") + "</div></section>" : "";

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
          relatedHtml +
        "</div>";

      buildToc();
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
  function setMeta(sel, attr, val) { var el = document.querySelector(sel); if (el && val) el.setAttribute(attr, val); }
  function buildToc() {
    var toc = document.getElementById("postToc");
    var heads = document.querySelectorAll(".post__body h2");
    if (!toc || heads.length < 3) { if (toc) toc.remove(); return; }
    var html = '<p class="post__toc-title">On this page</p><ul>';
    heads.forEach(function (h) { html += '<li><a href="#' + h.id + '">' + h.textContent + "</a></li>"; });
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

    var TURN_MS = 1050;   // must match the .leaf transition duration in CSS
    var Z_LIFT = 900;     // a turning page floats above the whole stack

    function render(animate) {
      leaves.forEach(function (leaf, idx) {
        var turned = idx < i;
        var was = leaf.classList.contains("is-turned");
        leaf.classList.toggle("is-turned", turned);
        leaf.setAttribute("aria-hidden", idx === i ? "false" : "true");

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
      if (count) count.textContent = pad(i + 1) + " / " + pad(n);
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
    var cur = -1, lastFocus = null;

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
      requestAnimationFrame(function () { ov.classList.add("is-open"); });
      document.body.classList.add("overlay-open");
      flipFrom(p);
      txtEl.focus();
    }
    function doClose() {
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

  /* ---------- Boot ---------- */
  buildNav();
  buildFooter();
  initNavScroll();
  initMobileMenu();
  initFreshness();
  initVeil();
  initScrollHint();
  initHeroTorch();
  initIndexShuffle();
  initReveal();
  initForm();
  initStudyFilter();
  initCompareSlider();
  initLightbox();
  initShareLinks();
  initFlipbook();
  initStudyOverlay();
  initJournalIndex();
  initPost();
})();
