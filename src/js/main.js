// ── Scroll Progress Bar ───────────────────────────────────────────────────
const progressBar = document.getElementById("scroll-progress");
if (progressBar) {
  const updateProgress = () => {
    const scrolled =
      window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.width = Math.min(scrolled * 100, 100) + "%";
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
}

// ── Card 3D Tilt + Mouse Glow ────────────────────────────────────────────────
document.querySelectorAll(".project-card, .cert-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
    // 3D tilt
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const mx = e.clientX - rect.left - cx;
    const my = e.clientY - rect.top - cy;
    const rotX = (my / cy) * -7;
    const rotY = (mx / cx) * 7;
    card.style.transition =
      "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s";
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transition =
      "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s";
    card.style.transform = "";
  });
});

// ── Navbar: glassmorphism on scroll ──────────────────────────────────────
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

// ── Mobile menu toggle ────────────────────────────────────────────────────
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const iconMenu = document.getElementById("icon-menu");
const iconClose = document.getElementById("icon-close");

menuBtn.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden", isOpen);
  mobileMenu.classList.toggle("flex", !isOpen);
  iconMenu.classList.toggle("hidden", !isOpen);
  iconClose.classList.toggle("hidden", isOpen);
});

function closeMobileMenu() {
  mobileMenu.classList.add("hidden");
  mobileMenu.classList.remove("flex");
  iconMenu.classList.remove("hidden");
  iconClose.classList.add("hidden");
}

// ── Active nav link on scroll ─────────────────────────────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
        });
      }
    });
  },
  { threshold: 0.35, rootMargin: "-80px 0px -45% 0px" },
);

sections.forEach((s) => sectionObserver.observe(s));
// ── Lazy Image Loading ────────────────────────────────────────────────────
(function lazyLoadImages() {
  const lazyEls = document.querySelectorAll("img[data-src], [data-bg]");
  if (!lazyEls.length) return;

  const imgObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        if (el.tagName === "IMG") {
          el.src = el.dataset.src;
          if (el.dataset.srcset) el.srcset = el.dataset.srcset;
          el.addEventListener(
            "load",
            () => {
              el.classList.add("lazy-loaded");
              el.closest(".lazy-skeleton")?.classList.add(
                "lazy-skeleton--done",
              );
            },
            { once: true },
          );
          el.addEventListener("error", () => el.classList.add("lazy-error"), {
            once: true,
          });
        } else if (el.dataset.bg) {
          const img = new Image();
          img.onload = () => {
            el.style.backgroundImage = `url('${el.dataset.bg}')`;
            el.classList.add("lazy-loaded");
          };
          img.src = el.dataset.bg;
        }

        observer.unobserve(el);
      });
    },
    { rootMargin: "200px 0px" },
  );

  lazyEls.forEach((el) => imgObserver.observe(el));
})();
// ── Reveal on scroll (staggered siblings) ────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll(".reveal:not(.visible)"),
      );
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 90}ms`;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ── Typing animation ──────────────────────────────────────────────────────
const typedEl = document.getElementById("typed-text");
const roles = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
];

let roleIdx = 0,
  charIdx = 0,
  deleting = false;

function typeLoop() {
  const current = roles[roleIdx];
  typedEl.textContent = deleting
    ? current.slice(0, --charIdx)
    : current.slice(0, ++charIdx);

  let delay = deleting ? 55 : 95;

  if (!deleting && charIdx === current.length) {
    delay = 2000;
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

typeLoop();

// ── Contact form ──────────────────────────────────────────────────────────
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl = document.getElementById("cf-name");
    const emailEl = document.getElementById("cf-email");
    const messageEl = document.getElementById("cf-message");
    const errName = document.getElementById("err-name");
    const errEmail = document.getElementById("err-email");
    const errMsg = document.getElementById("err-message");
    const toast = document.getElementById("cf-toast");
    const btnText = document.getElementById("cf-btn-text");
    const btnIcon = document.getElementById("cf-btn-icon");
    const spinner = document.getElementById("cf-spinner");

    // Clear previous errors
    [nameEl, emailEl, messageEl].forEach((el) =>
      el.classList.remove("input-error"),
    );
    [errName, errEmail, errMsg].forEach((el) => (el.textContent = ""));
    toast.className = "cf-toast hidden";

    let valid = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameEl.value.trim()) {
      errName.textContent = "Name is required.";
      nameEl.classList.add("input-error");
      valid = false;
    }
    if (!emailEl.value.trim() || !emailRe.test(emailEl.value.trim())) {
      errEmail.textContent = "Please enter a valid email.";
      emailEl.classList.add("input-error");
      valid = false;
    }
    if (!messageEl.value.trim()) {
      errMsg.textContent = "Message is required.";
      messageEl.classList.add("input-error");
      valid = false;
    }

    if (!valid) return;

    // Loading state
    btnText.textContent = "Sending…";
    btnIcon.classList.add("hidden");
    spinner.classList.remove("hidden");
    document.getElementById("cf-submit").disabled = true;

    try {
      const subjectEl = document.getElementById("cf-subject");
      const payload = {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        subject: subjectEl ? subjectEl.value.trim() : "",
        message: messageEl.value.trim(),
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Server error. Please try again later.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Success: show the email-sent panel
      contactForm.reset();
      if (typeof window.showEmailSentPanel === "function") {
        window.showEmailSentPanel(payload.email, payload);
      } else {
        toast.textContent = "✓ Message sent! I'll get back to you soon.";
        toast.className = "cf-toast toast-success";
      }
    } catch (err) {
      toast.textContent =
        "✗ " + (err.message || "Failed to send. Please try again.");
      toast.className = "cf-toast toast-error";
    } finally {
      btnText.textContent = "Send Message";
      btnIcon.classList.remove("hidden");
      spinner.classList.add("hidden");
      document.getElementById("cf-submit").disabled = false;
    }

    setTimeout(() => {
      toast.className = "cf-toast hidden";
    }, 5000);
  });
}

// ── Email Sent Panel (Resend feature) ────────────────────────────────────────
(function initEmailSentPanel() {
  const panel = document.getElementById("email-sent-panel");
  if (!panel) return;

  const form = document.getElementById("contact-form");
  const resendBtn = document.getElementById("esp-resend-btn");
  const ringFill = document.getElementById("esp-ring-fill");
  const ringPhase = document.getElementById("esp-ring-phase");
  const refreshIcon = document.getElementById("esp-refresh-icon");
  const countdownNum = document.getElementById("esp-countdown-num");
  const resendLabel = document.getElementById("esp-resend-label");
  const backBtn = document.getElementById("esp-back-btn");
  const emailDisplay = document.getElementById("esp-email-display");
  const espFeedback = document.getElementById("esp-feedback");

  const CIRC = 69.12; // 2π × 11  (SVG r=11)
  const TOTAL = 60; // seconds
  let timer = null;
  let lastPayload = null;

  function setLabel(html) {
    resendLabel.innerHTML = html;
  }

  function updateRing(elapsed) {
    const offset = ((elapsed / TOTAL) * CIRC).toFixed(2);
    ringFill.style.strokeDashoffset = offset;
    const rem = TOTAL - elapsed;
    countdownNum.textContent = rem;
    setLabel(`Resend in <b style="color:#818cf8">${rem}</b>s`);
  }

  function startCountdown() {
    clearInterval(timer);
    let elapsed = 0;
    resendBtn.disabled = true;
    resendBtn.classList.remove("esp-resend-active", "esp-resend-sending");
    ringPhase.classList.remove("hidden");
    refreshIcon.classList.add("hidden");
    updateRing(0);

    timer = setInterval(() => {
      elapsed++;
      if (elapsed >= TOTAL) {
        clearInterval(timer);
        resendBtn.disabled = false;
        resendBtn.classList.add("esp-resend-active");
        ringPhase.classList.add("hidden");
        refreshIcon.classList.remove("hidden");
        setLabel("Resend Email");
      } else {
        updateRing(elapsed);
      }
    }, 1000);
  }

  function showFeedback(msg, type) {
    espFeedback.textContent = msg;
    espFeedback.className = `esp-feedback esp-feedback--${type}`;
    setTimeout(() => {
      espFeedback.className = "esp-feedback hidden";
    }, 4500);
  }

  // Called from the contact form success handler
  window.showEmailSentPanel = function (email, payload) {
    lastPayload = payload;
    emailDisplay.textContent = email;
    form.classList.add("hidden");
    panel.classList.remove("hidden");
    // Re-trigger entrance animation
    panel.classList.remove("esp-animate");
    void panel.offsetWidth;
    panel.classList.add("esp-animate");
    startCountdown();
  };

  backBtn.addEventListener("click", () => {
    clearInterval(timer);
    panel.classList.add("hidden");
    form.classList.remove("hidden");
  });

  resendBtn.addEventListener("click", async () => {
    if (resendBtn.disabled || !lastPayload) return;
    resendBtn.disabled = true;
    resendBtn.classList.remove("esp-resend-active");
    resendBtn.classList.add("esp-resend-sending");
    refreshIcon.classList.add("esp-spin");
    setLabel("Sending…");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lastPayload),
      });
      let data = {};
      try { data = await res.json(); } catch { throw new Error("Server error. Please try again."); }
      if (!res.ok) throw new Error(data.error || "Failed to resend.");
      showFeedback("✓ Email resent successfully!", "success");
    } catch (err) {
      showFeedback("✗ " + (err.message || "Failed to resend."), "error");
    } finally {
      refreshIcon.classList.remove("esp-spin");
      startCountdown();
    }
  });
})();

// ── Particle Stars ──────────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    const colors = ["#818cf8", "#c084fc", "#67e8f9", "#a5b4fc"];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        alpha: Math.random() * 0.5 + 0.1,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: Math.random() * 0.004 + 0.001,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha <= 0.05 || p.alpha >= 0.65) p.alphaDir *= -1;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(animate);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });

  resize();
  createParticles();
  animate();
})();

// ── Custom Cursor ──────────────────────────────────────────────────────────
(function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;
  // Only enable on true pointer devices
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    dot.style.display = "none";
    ring.style.display = "none";
    return;
  }

  let mouseX = -200,
    mouseY = -200,
    ringX = -200,
    ringY = -200;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  })();

  document
    .querySelectorAll("a, button, .skill-badge, .project-card, input, textarea")
    .forEach((el) => {
      el.addEventListener("mouseenter", () =>
        ring.classList.add("cursor-hover"),
      );
      el.addEventListener("mouseleave", () =>
        ring.classList.remove("cursor-hover"),
      );
    });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
})();

// ── Stats Counter Animation ───────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll(".counter-num");
  if (!counters.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1500;
        const t0 = performance.now();
        function tick(now) {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => obs.observe(el));
})();

// ── Magnetic Buttons ───────────────────────────────────────────────────────
document.querySelectorAll(".btn-primary, .btn-outline").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.38}px) translateY(-3px)`;
    btn.style.transition = "transform 0.1s ease";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
    btn.style.transition =
      "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s, background 0.3s";
  });
});

// ── Certificate Card Carousel ─────────────────────────────────────────────────
function slideCert(btn, dir) {
  const thumb = btn.closest(".cert-thumb");
  const slides = thumb.querySelectorAll(".cert-slide");
  const dots = thumb.querySelectorAll(".cert-dot");
  if (slides.length < 2) return;

  let current = Array.from(slides).findIndex(
    (s) => !s.classList.contains("opacity-0"),
  );
  slides[current].classList.add("opacity-0");
  slides[current].classList.remove("opacity-100");
  if (dots[current]) {
    dots[current].classList.remove("bg-white");
    dots[current].classList.add("bg-white/40");
  }

  let next = (current + dir + slides.length) % slides.length;
  slides[next].classList.remove("opacity-0");
  slides[next].classList.add("opacity-100");
  if (dots[next]) {
    dots[next].classList.remove("bg-white/40");
    dots[next].classList.add("bg-white");
  }
}

// ── Certificate Lightbox ──────────────────────────────────────────────────────
let certModalImages = [];
let certModalIndex = 0;

function openCertModal(card) {
  const modal = document.getElementById("cert-modal");
  const modalImg = document.getElementById("cert-modal-img");
  const prevBtn = document.getElementById("cert-modal-prev");
  const nextBtn = document.getElementById("cert-modal-next");
  const dotsWrap = document.getElementById("cert-modal-dots");

  // Check if card has multiple images
  const imagesAttr = card.getAttribute("data-cert-images");
  if (imagesAttr) {
    certModalImages = JSON.parse(imagesAttr);
  } else {
    const img = card.querySelector(".cert-thumb img");
    certModalImages = img ? [img.src] : [];
  }

  if (!certModalImages.length) return;
  certModalIndex = 0;

  modalImg.src = certModalImages[0];
  modalImg.alt = card.querySelector(".cert-thumb img")?.alt || "Certificate";

  // Show/hide nav for multi-image
  if (certModalImages.length > 1) {
    prevBtn.classList.remove("hidden");
    prevBtn.classList.add("flex");
    nextBtn.classList.remove("hidden");
    nextBtn.classList.add("flex");
    dotsWrap.classList.remove("hidden");
    dotsWrap.classList.add("flex");
    dotsWrap.innerHTML = certModalImages
      .map(
        (_, i) =>
          `<span class="w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === 0 ? "bg-white" : "bg-white/40"}" onclick="event.stopPropagation(); goModalCert(${i})"></span>`,
      )
      .join("");
  } else {
    prevBtn.classList.add("hidden");
    prevBtn.classList.remove("flex");
    nextBtn.classList.add("hidden");
    nextBtn.classList.remove("flex");
    dotsWrap.classList.add("hidden");
    dotsWrap.classList.remove("flex");
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function slideModalCert(dir) {
  if (certModalImages.length < 2) return;
  certModalIndex =
    (certModalIndex + dir + certModalImages.length) % certModalImages.length;
  updateModalCert();
}

function goModalCert(idx) {
  certModalIndex = idx;
  updateModalCert();
}

function updateModalCert() {
  const modalImg = document.getElementById("cert-modal-img");
  const dotsWrap = document.getElementById("cert-modal-dots");
  modalImg.src = certModalImages[certModalIndex];
  dotsWrap.querySelectorAll("span").forEach((dot, i) => {
    dot.classList.toggle("bg-white", i === certModalIndex);
    dot.classList.toggle("bg-white/40", i !== certModalIndex);
  });
}

function closeCertModal(e, force) {
  if (force || e.target === document.getElementById("cert-modal")) {
    const modal = document.getElementById("cert-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("cert-modal");
  if (!modal || !modal.classList.contains("active")) return;
  if (e.key === "Escape") {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  } else if (e.key === "ArrowLeft") {
    slideModalCert(-1);
  } else if (e.key === "ArrowRight") {
    slideModalCert(1);
  }
});
