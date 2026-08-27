/* =============================================================================
   Johnstone Building — site.js
   Vanilla, no dependencies, no build step. Every behaviour degrades gracefully:
   with JS disabled the pages remain fully readable and navigable.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  // The stylesheet only hides reveal targets under html.js, so a script failure
  // or a visitor with JS disabled still sees a complete page.
  root.classList.remove("no-js");
  root.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------------------
     Preloader — hides as soon as the window has loaded (or after a hard cap).
     ------------------------------------------------------------------------ */
  var preloader = $(".preloader");
  function dismissPreloader() {
    if (!preloader || preloader.classList.contains("is-done")) return;
    preloader.classList.add("is-done");
    document.body.classList.add("is-ready");
    window.setTimeout(function () { preloader.remove(); }, 1400);
  }
  if (preloader) {
    window.addEventListener("load", function () { window.setTimeout(dismissPreloader, 220); });
    window.setTimeout(dismissPreloader, 2600); // never let a slow asset trap the page
  }

  /* ---------------------------------------------------------------------------
     Headline splitting — wraps each line in a masked span so it can rise in.
     Runs before reveal observers so the first paint is already prepared.
     ------------------------------------------------------------------------ */
  function splitLines(el) {
    if (el.dataset.split === "done") return;

    // Authored <br> tags are the reliable way to control where lines break, so
    // when they are present each authored line becomes one masked block.
    // Otherwise fall back to per-word inline-blocks, which still wrap naturally.
    var parts = el.innerHTML.split(/<br\s*\/?>/i);

    if (parts.length > 1) {
      el.innerHTML = parts.map(function (part, i) {
        return '<span class="split-line" style="--i:' + i + '"><span>' + part.trim() + "</span></span>";
      }).join("");
    } else {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span class="split-line split-line--inline" style="--i:' + Math.floor(i / 2) +
               '"><span>' + w + "</span></span>";
      }).join(" ");
    }
    el.dataset.split = "done";
  }
  if (!reduced) $$("[data-split]").forEach(splitLines);

  /* ---------------------------------------------------------------------------
     Scroll reveals
     ------------------------------------------------------------------------ */
  var revealables = $$("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    revealables.forEach(function (el) {
      // Auto-stagger siblings that share a parent unless an explicit delay is set.
      if (!el.style.getPropertyValue("--delay") && el.dataset.stagger !== "off") {
        var siblings = el.parentElement ? $$("[data-reveal]", el.parentElement) : [];
        var idx = siblings.indexOf(el);
        if (siblings.length > 1 && idx > -1 && siblings.length < 9) {
          el.style.setProperty("--delay", (idx * 0.08).toFixed(2) + "s");
        }
      }
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------------------
     Header: sticky state + hide on scroll down
     ------------------------------------------------------------------------ */
  var header = $(".site-header");
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;

    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("is-stuck", y > 40);
      if (!header.classList.contains("is-open")) {
        var goingDown = y > lastY && y > 320;
        header.classList.toggle("is-hidden", goingDown);
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  var menu = $(".menu");
  var menuBtn = $(".menu-btn");
  if (menu && menuBtn && header) {
    var setMenu = function (open) {
      menu.classList.toggle("is-open", open);
      header.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      $(".menu-btn-label", menuBtn).textContent = open ? "Close" : "Menu";
    };
    setMenu(false);

    menuBtn.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ---------------------------------------------------------------------------
     Hero parallax — transform only, rAF-throttled.
     ------------------------------------------------------------------------ */
  var heroBg = $("[data-parallax]");
  if (heroBg && !reduced) {
    var pTicking = false;
    var speed = parseFloat(heroBg.dataset.parallax) || 0.18;
    var applyParallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.4) {
        heroBg.style.transform = "translate3d(0," + (y * speed).toFixed(2) + "px,0)";
      }
      pTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (pTicking) return;
      pTicking = true;
      window.requestAnimationFrame(applyParallax);
    }, { passive: true });
    applyParallax();
  }

  /* ---------------------------------------------------------------------------
     Counters
     ------------------------------------------------------------------------ */
  var counters = $$("[data-count]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.dataset.count);
      var decimals = (el.dataset.count.split(".")[1] || "").length;
      if (reduced) { el.textContent = target.toFixed(decimals); return; }
      var dur = 1500;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          runCount(e.target);
          cio.unobserve(e.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------------------------------------------------------------------------
     Capability rows — floating image preview that tracks the cursor.
     ------------------------------------------------------------------------ */
  var capRows = $$("[data-preview]");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (capRows.length && canHover && !reduced) {
    var preview = document.createElement("div");
    preview.className = "cap-preview media";
    preview.setAttribute("aria-hidden", "true");
    var previewImg = document.createElement("img");
    previewImg.alt = "";
    previewImg.decoding = "async";
    preview.appendChild(previewImg);
    document.body.appendChild(preview);

    var px = 0, py = 0, cx = 0, cy = 0, raf = null;
    var loop = function () {
      cx += (px - cx) * 0.14;
      cy += (py - cy) * 0.14;
      preview.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)" +
        (preview.classList.contains("is-visible") ? " scale(1)" : " scale(0.94)");
      raf = window.requestAnimationFrame(loop);
    };

    capRows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        previewImg.src = row.dataset.preview;
        preview.classList.add("is-visible");
        if (!raf) loop();
      });
      row.addEventListener("mouseleave", function () {
        preview.classList.remove("is-visible");
      });
    });

    window.addEventListener("mousemove", function (e) {
      px = e.clientX; py = e.clientY;
      if (!cx && !cy) { cx = px; cy = py; }
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------------
     Work filter
     ------------------------------------------------------------------------ */
  var filterBar = $("[data-filters]");
  if (filterBar) {
    var cards = $$("[data-tags]");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      var key = btn.dataset.filter;
      $$("button", filterBar).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      cards.forEach(function (card) {
        var match = key === "all" || card.dataset.tags.split(" ").indexOf(key) > -1;
        card.classList.toggle("is-hidden", !match);
      });
    });
  }

  /* ---------------------------------------------------------------------------
     Marquee — duplicate the track once so the loop is seamless.
     ------------------------------------------------------------------------ */
  $$(".marquee-track").forEach(function (track) {
    if (track.dataset.cloned) return;
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = "true";
  });

  /* ---------------------------------------------------------------------------
     Contact form
     Static hosting has no backend, so an enquiry has to reach a human some other
     way. The submission is posted to Netlify Forms over fetch; if that post does
     not succeed — Forms not enabled on the project, a different host, no network
     — we fall back to composing a pre-filled email.

     The fallback matters: posting natively and trusting the host would show the
     visitor a thank-you page whether or not anything was captured, and a lost
     enquiry that looks like a sent one is the worst failure this form can have.
     ------------------------------------------------------------------------ */
  var form = $("[data-contact-form]");
  if (form) {
    var status = $(".form-status", form);
    var say = function (msg, state) {
      if (!status) return;
      status.textContent = msg;
      status.dataset.state = state;
      status.classList.add("is-shown");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="company"]').value) return; // honeypot

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || "").toString().trim(); };

      if (!get("name") || !get("email") || !get("message")) {
        say("Please add your name, email and a short note so we can come back to you.", "error");
        return;
      }

      var to = form.dataset.email || "hayden@johnstonebuilding.co.nz";

      var openMailClient = function () {
        var lines = [
          "Name: " + get("name"),
          "Email: " + get("email"),
          "Phone: " + (get("phone") || "—"),
          "Location: " + (get("location") || "—"),
          "Project type: " + (get("project") || "—"),
          "Indicative budget: " + (get("budget") || "—"),
          "",
          get("message")
        ];
        window.location.href = "mailto:" + to +
          "?subject=" + encodeURIComponent("Project enquiry — " + get("name")) +
          "&body=" + encodeURIComponent(lines.join("\n"));
        say("Opening your email app with the enquiry ready to send. If nothing happens, email " +
            to + " directly.", "ok");
      };

      if (form.dataset.mode !== "netlify" || typeof window.fetch !== "function") {
        openMailClient();
        return;
      }

      // Netlify Forms accepts a urlencoded POST to any path on the site.
      var body = [];
      data.forEach(function (value, key) {
        body.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      });

      say("Sending your enquiry…", "ok");

      window.fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.join("&")
      }).then(function (res) {
        if (res.ok) {
          window.location.href = form.getAttribute("action") || "thanks.html";
        } else {
          openMailClient();
        }
      }).catch(function () {
        openMailClient();
      });
    });
  }

  /* ---------------------------------------------------------------------------
     Small conveniences
     ------------------------------------------------------------------------ */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Mark the active nav item without hand-editing every page.
  var here = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  $$(".nav a, .menu-list a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) === "#" || /^https?:/i.test(href)) return;
    var path = new URL(href, location.href).pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
    if (path === here) a.setAttribute("aria-current", "page");
  });
})();
