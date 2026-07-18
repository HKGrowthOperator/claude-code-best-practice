/* Living Charity e. V. — zentrales Frontend-Skript (ohne Abhängigkeiten, < 5 KB)
   Alles hier ist Progressive Enhancement: Die Seite funktioniert vollständig ohne JS. */
(function () {
  "use strict";

  /* ---------- Sticky-Header: Schatten erst nach leichtem Scrollen ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
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
    // Stagger-Index für Kartenraster
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

  /* ---------- Projektfortschritt animieren (nur mit echten Daten befüllt) ---------- */
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

  /* ---------- IBAN-Kopierknopf ---------- */
  document.querySelectorAll("[data-copy-plain]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy-plain");
      var done = function () {
        btn.classList.add("is-copied");
        window.setTimeout(function () { btn.classList.remove("is-copied"); }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, done);
      } else {
        // Fallback: Textauswahl
        var target = document.getElementById(btn.getAttribute("data-copy-target"));
        if (target && window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(target);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        done();
      }
    });
  });

  /* ---------- Kontaktformular: klientenseitige Validierung ----------
     Serverseitige Validierung ist zwingend zusätzlich nötig — siehe
     wordpress-blueprint/migration-guide.md (Formular-Integration). */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
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
      // Honeypot: gefüllt = Bot, still verwerfen
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
      // Vorabversion: kein Backend angebunden. Absenden abfangen und ehrlich melden.
      if (form.getAttribute("data-endpoint") === "none") {
        e.preventDefault();
        if (status) {
          status.className = "form__status is-success";
          status.textContent =
            "Vielen Dank! Hinweis Vorabversion: Der Versand wird erst mit der WordPress-Integration aktiviert. " +
            "Bis dahin erreichen Sie uns per E-Mail.";
        }
        form.reset();
      }
    });
    // Fehlermarkierung beim Korrigieren entfernen
    form.addEventListener("input", function (e) {
      if (e.target.matches("[required]")) setError(e.target, false);
    });
  }

  /* ---------- Aktuelles Jahr im Footer ---------- */
  document.querySelectorAll("[data-current-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
