/* Living Charity e. V. — zentrales Frontend-Skript (ohne Abhängigkeiten)
   Progressive Enhancement: Die Seite funktioniert vollständig ohne JS. */
(function () {
  "use strict";

  /* ---------- Sticky-Header: Schatten erst nach erstem Scrollbereich ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 32);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Navigation ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Reveal-Animationen (respektiert prefers-reduced-motion) ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    document.querySelectorAll(".reveal-stagger").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty("--stagger-i", String(i % 6));
      });
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Projektfortschritt (nur mit echten Daten befüllt) ---------- */
  document.querySelectorAll(".progress[data-progress]").forEach(function (el) {
    var val = Math.max(0, Math.min(100, parseFloat(el.getAttribute("data-progress")) || 0));
    var bar = el.querySelector(".progress__bar");
    if (bar) {
      requestAnimationFrame(function () {
        el.style.setProperty("--progress", val + "%");
        bar.style.width = val + "%";
      });
    }
  });

  /* ---------- Kopierknöpfe (IBAN, BIC) ----------
     Erfolg wird visuell (Tooltip) UND über eine Live-Region gemeldet;
     schlägt das Kopieren fehl, wird der Wert markiert und ehrlich gemeldet. */
  var copyStatus = document.querySelector("[data-copy-status]");
  var announceCopy = function (text) {
    if (copyStatus) { copyStatus.textContent = ""; window.setTimeout(function () { copyStatus.textContent = text; }, 30); }
  };
  var selectValue = function (btn) {
    var target = document.getElementById(btn.getAttribute("data-copy-target"));
    if (target && window.getSelection) {
      var range = document.createRange();
      range.selectNodeContents(target);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };
  document.querySelectorAll("[data-copy-plain]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy-plain");
      var label = btn.getAttribute("data-copy-label") || "Wert";
      var ok = function () {
        btn.classList.add("is-copied");
        announceCopy(label + " in die Zwischenablage kopiert.");
        window.setTimeout(function () { btn.classList.remove("is-copied"); }, 2200);
      };
      var fail = function () {
        selectValue(btn);
        announceCopy("Kopieren nicht möglich — " + label + " ist markiert, bitte manuell kopieren.");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(ok, fail);
      } else {
        fail();
      }
    });
  });

  /* ---------- Betragsauswahl (Orientierung für die Überweisung) ---------- */
  document.querySelectorAll(".amount-picker").forEach(function (picker) {
    picker.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      picker.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      var purpose = document.getElementById("purpose-value");
      if (purpose) {
        var amount = btn.getAttribute("data-amount");
        purpose.textContent = amount === "frei"
          ? "Spende Living Charity"
          : "Spende Living Charity — Orientierungsbetrag " + amount + " €";
      }
    });
  });

  /* ---------- Kontaktformular ----------
     Serverseitige Validierung ist zusätzlich zwingend — siehe docs/migration-guide.md. */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    // Native Browser-Validierung bleibt ohne JS aktiv; mit JS übernehmen wir.
    form.setAttribute("novalidate", "");
    // Thema aus URL vorbelegen (?thema=… / ?anliegen=…)
    try {
      var params = new URLSearchParams(location.search);
      var topic = params.get("thema") || params.get("anliegen");
      var select = form.querySelector("select[name=thema]");
      if (topic && select && select.querySelector('option[value="' + topic + '"]')) select.value = topic;
    } catch (e) {}

    var status = form.querySelector(".form__status");
    var setError = function (field, hasError) {
      var wrap = field.closest(".field, .checkbox-field");
      if (wrap) wrap.classList.toggle("has-error", hasError);
      field.setAttribute("aria-invalid", hasError ? "true" : "false");
    };
    form.addEventListener("submit", function (e) {
      var invalid = [];
      form.querySelectorAll("[required]").forEach(function (field) {
        var ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
        if (ok && field.type === "email") {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        setError(field, !ok);
        if (!ok) invalid.push(field);
      });
      var hp = form.querySelector(".hp-field input");
      if (hp && hp.value !== "") { e.preventDefault(); return; }

      if (invalid.length) {
        e.preventDefault();
        invalid[0].focus();
        if (status) {
          status.className = "form__status is-error";
          status.textContent = "Bitte prüfen Sie die markierten Felder — es fehlen noch Angaben.";
        }
        return;
      }
      // Vorabversion: kein Backend. Ehrlich melden und zur Danke-Logik der
      // späteren WordPress-Integration (Weiterleitung auf /danke/) überleiten.
      if (form.getAttribute("data-endpoint") === "none") {
        e.preventDefault();
        window.location.href = "/danke/";
      }
    });
    form.addEventListener("input", function (e) {
      if (e.target.matches("[required]")) setError(e.target, false);
    });
  }

  /* ---------- Suche (clientseitig über generierten Index) ---------- */
  var searchForm = document.querySelector("[data-search]");
  if (searchForm) {
    var resultsEl = document.getElementById("suchergebnisse");
    var statusEl = document.getElementById("suchstatus");
    var runSearch = function (index, q) {
      var query = q.trim().toLowerCase();
      resultsEl.innerHTML = "";
      if (query.length < 2) {
        statusEl.textContent = "Bitte mindestens zwei Zeichen eingeben.";
        return;
      }
      var hits = index.filter(function (p) {
        return (p.title + " " + p.text).toLowerCase().indexOf(query) !== -1;
      });
      statusEl.textContent = hits.length
        ? hits.length + " Treffer für „" + q.trim() + "“"
        : "Keine Treffer für „" + q.trim() + "“. Versuchen Sie einen anderen Begriff oder nutzen Sie die Navigation.";
      hits.forEach(function (p) {
        var pos = p.text.toLowerCase().indexOf(query);
        var excerpt = pos > -1 ? "… " + p.text.slice(Math.max(0, pos - 60), pos + 120) + " …" : "";
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = p.path;
        a.textContent = p.title;
        var para = document.createElement("p");
        para.className = "text-sm text-muted";
        para.textContent = excerpt;
        li.appendChild(a); li.appendChild(para);
        resultsEl.appendChild(li);
      });
    };
    var withIndex = function (cb) {
      if (window.__LC_SEARCH_INDEX) { cb(window.__LC_SEARCH_INDEX); return; }
      fetch("/assets/search-index.json")
        .then(function (r) { return r.json(); })
        .then(cb)
        .catch(function () {
          statusEl.textContent = "Die Suche ist gerade nicht verfügbar. Bitte nutzen Sie die Navigation oder schreiben Sie uns.";
        });
    };
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = searchForm.querySelector("input[name=q]").value;
      withIndex(function (index) { runSearch(index, q); });
    });
    // Direktaufruf mit ?q=
    try {
      var q0 = new URLSearchParams(location.search).get("q");
      if (q0) {
        searchForm.querySelector("input[name=q]").value = q0;
        withIndex(function (index) { runSearch(index, q0); });
      }
    } catch (e) {}
  }

  /* ---------- Aktuelles Jahr im Footer ---------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
