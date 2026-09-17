(function () {
  const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

  function toCssLength(value) {
    return typeof value === "number" ? `${value}px` : value ?? undefined;
  }

  class LogoLoop {
    constructor(container, options = {}) {
      this.el = container;
      this.opts = {
        logos: options.logos || [],
        speed: options.speed ?? 120,
        direction: options.direction || "left",
        width: options.width ?? "100%",
        logoHeight: options.logoHeight ?? 28,
        gap: options.gap ?? 32,
        hoverSpeed: options.hoverSpeed,
        fadeOut: options.fadeOut ?? false,
        fadeOutColor: options.fadeOutColor,
        scaleOnHover: options.scaleOnHover ?? false,
        ariaLabel: options.ariaLabel || "Partner logos",
        className: options.className || "",
      };

      this.seqWidth = 0;
      this.seqHeight = 0;
      this.copyCount = ANIMATION_CONFIG.MIN_COPIES;
      this.isHovered = false;
      this.raf = null;
      this.lastTs = null;
      this.offset = 0;
      this.velocity = 0;
      this.seqEl = null;
      this.trackEl = null;

      this.build();
      this.bind();
      this.observe();
      this.loadImages();
      this.loop();
    }

    get isVertical() {
      return this.opts.direction === "up" || this.opts.direction === "down";
    }

    get hoverSpeed() {
      return this.opts.hoverSpeed !== undefined ? this.opts.hoverSpeed : 0;
    }

    get targetVelocity() {
      const mag = Math.abs(this.opts.speed);
      const dir = this.isVertical
        ? this.opts.direction === "up" ? 1 : -1
        : this.opts.direction === "left" ? 1 : -1;
      return mag * dir * (this.opts.speed < 0 ? -1 : 1);
    }

    build() {
      const o = this.opts;
      this.el.className = [
        "logoloop",
        this.isVertical ? "logoloop--vertical" : "logoloop--horizontal",
        o.fadeOut && "logoloop--fade",
        o.scaleOnHover && "logoloop--scale-hover",
        o.className,
      ]
        .filter(Boolean)
        .join(" ");

      Object.assign(this.el.style, {
        width: this.isVertical
          ? toCssLength(o.width) === "100%"
            ? ""
            : toCssLength(o.width)
          : toCssLength(o.width) ?? "100%",
        "--logoloop-gap": `${o.gap}px`,
        "--logoloop-logoHeight": `${o.logoHeight}px`,
        ...(o.fadeOutColor ? { "--logoloop-fadeColor": o.fadeOutColor } : {}),
      });

      this.el.setAttribute("role", "region");
      this.el.setAttribute("aria-label", o.ariaLabel);

      this.trackEl = document.createElement("div");
      this.trackEl.className = "logoloop__track";
      this.el.appendChild(this.trackEl);
      this.renderLists();
    }

    renderItem(item) {
      const li = document.createElement("li");
      li.className = "logoloop__item";
      li.setAttribute("role", "listitem");

      let content;
      if (item.node) {
        const span = document.createElement("span");
        span.className = "logoloop__node";
        if (typeof item.node === "string") span.innerHTML = item.node;
        else span.appendChild(item.node);
        content = span;
      } else {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt ?? "";
        if (item.title) img.title = item.title;
        img.loading = "lazy";
        img.decoding = "async";
        img.draggable = false;
        content = img;
      }

      const label = item.ariaLabel ?? item.title ?? item.alt ?? "logo link";
      if (item.href) {
        const a = document.createElement("a");
        a.className = "logoloop__link";
        a.href = item.href;
        a.setAttribute("aria-label", label);
        a.target = "_blank";
        a.rel = "noreferrer noopener";
        a.appendChild(content);
        li.appendChild(a);
      } else {
        li.appendChild(content);
      }
      return li;
    }

    renderLists() {
      if (this._ro && this.seqEl) this._ro.unobserve(this.seqEl);
      this.trackEl.replaceChildren();
      for (let i = 0; i < this.copyCount; i++) {
        const ul = document.createElement("ul");
        ul.className = "logoloop__list";
        ul.setAttribute("role", "list");
        if (i > 0) ul.setAttribute("aria-hidden", "true");
        if (i === 0) this.seqEl = ul;
        this.opts.logos.forEach((item) => ul.appendChild(this.renderItem(item)));
        this.trackEl.appendChild(ul);
      }
      if (this._ro && this.seqEl) this._ro.observe(this.seqEl);
    }

    measure() {
      const seq = this.seqEl?.getBoundingClientRect?.();
      if (this.isVertical) {
        const parentH = this.el.parentElement?.clientHeight ?? 0;
        if (parentH > 0) this.el.style.height = `${Math.ceil(parentH)}px`;
        const h = seq?.height ?? 0;
        if (h <= 0) return;
        this.seqHeight = Math.ceil(h);
        const viewport = this.el.clientHeight || parentH || this.seqHeight;
        const needed = Math.max(
          ANIMATION_CONFIG.MIN_COPIES,
          Math.ceil(viewport / this.seqHeight) + ANIMATION_CONFIG.COPY_HEADROOM,
        );
        if (needed !== this.copyCount) {
          this.copyCount = needed;
          this.renderLists();
        }
      } else {
        const w = seq?.width ?? 0;
        if (w <= 0) return;
        this.seqWidth = Math.ceil(w);
        const needed = Math.max(
          ANIMATION_CONFIG.MIN_COPIES,
          Math.ceil(this.el.clientWidth / this.seqWidth) +
            ANIMATION_CONFIG.COPY_HEADROOM,
        );
        if (needed !== this.copyCount) {
          this.copyCount = needed;
          this.renderLists();
        }
      }
    }

    observe() {
      if (!window.ResizeObserver) {
        this._onResize = () => this.measure();
        window.addEventListener("resize", this._onResize, { passive: true });
        this.measure();
        return;
      }
      this._ro = new ResizeObserver(() => this.measure());
      this._ro.observe(this.el);
      if (this.seqEl) this._ro.observe(this.seqEl);
      this.measure();
    }

    loadImages() {
      const imgs = this.seqEl?.querySelectorAll("img") ?? [];
      if (!imgs.length) {
        this.measure();
        return;
      }
      let left = imgs.length;
      const done = () => {
        left -= 1;
        if (left <= 0) this.measure();
      };
      imgs.forEach((img) => {
        if (img.complete) done();
        else {
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }
      });
    }

    bind() {
      this.trackEl.addEventListener("mouseenter", () => {
        this.isHovered = true;
      });
      this.trackEl.addEventListener("mouseleave", () => {
        this.isHovered = false;
      });
    }

    loop() {
      const tick = (ts) => {
        if (this.lastTs === null) this.lastTs = ts;
        const dt = Math.max(0, ts - this.lastTs) / 1000;
        this.lastTs = ts;

        const target = this.isHovered ? this.hoverSpeed : this.targetVelocity;
        this.velocity +=
          (target - this.velocity) *
          (1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU));

        const size = this.isVertical ? this.seqHeight : this.seqWidth;
        if (size > 0) {
          this.offset = ((this.offset + this.velocity * dt) % size + size) % size;
          this.trackEl.style.transform = this.isVertical
            ? `translate3d(0, ${-this.offset}px, 0)`
            : `translate3d(${-this.offset}px, 0, 0)`;
        }
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }
  }

  window.LogoLoop = LogoLoop;

  const TECH_LOGOS = [
    { src: "https://img.icons8.com/color/96/html-5--v1.png", alt: "HTML", title: "HTML", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { src: "https://img.icons8.com/color/96/css3.png", alt: "CSS", title: "CSS", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    { src: "https://img.icons8.com/color/96/javascript--v1.png", alt: "JavaScript", title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { src: "https://cdn.simpleicons.org/typescript/3178C6", alt: "TypeScript", title: "TypeScript", href: "https://www.typescriptlang.org" },
    { src: "https://img.icons8.com/color/96/react-native--v1.png", alt: "React", title: "React", href: "https://react.dev" },
    { src: "https://cdn.simpleicons.org/laravel/FF2D20", alt: "Laravel", title: "Laravel", href: "https://laravel.com" },
    { src: "https://cdn.simpleicons.org/nextdotjs/FFFFFF", alt: "Next.js", title: "Next.js", href: "https://nextjs.org" },
    { src: "https://cdn.simpleicons.org/nodedotjs/5FA04E", alt: "Node.js", title: "Node.js", href: "https://nodejs.org" },
    {
      node: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true"><path fill="#29b6f6" d="M44,11.11v25.78c0,1.27-0.79,2.4-1.98,2.82l-8.82,4.14L34,33V15L33.2,4.15l8.82,4.14 C43.21,8.71,44,9.84,44,11.11z"/><path fill="#0277bd" d="M9,33.896L34,15V5.353c0-1.198-1.482-1.758-2.275-0.86L4.658,29.239 c-0.9,0.83-0.849,2.267,0.107,3.032c0,0,1.324,1.232,1.803,1.574C7.304,34.37,8.271,34.43,9,33.896z"/><path fill="#0288d1" d="M9,14.104L34,33v9.647c0,1.198-1.482,1.758-2.275,0.86L4.658,18.761 c-0.9-0.83-0.849-2.267,0.107-3.032c0,0,1.324-1.232,1.803-1.574C7.304,13.63,8.271,13.57,9,14.104z"/></svg>',
      title: "Visual Studio Code",
      href: "https://code.visualstudio.com",
    },
    {
      node: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m19.94,20.59c1.09.82,2.73.27,1.23-1.23-4.5-4.36-3.55-16.36-9.14-16.36S7.39,15,2.89,19.36c-1.64,1.64.14,2.05,1.23,1.23,4.23-2.86,3.95-7.91,7.91-7.91s3.68,5.05,7.91,7.91Z"/></svg>',
      title: "Antigravity",
    },
    { src: "https://cdn.simpleicons.org/githubcopilot/FFFFFF", alt: "GitHub Copilot", title: "GitHub Copilot", href: "https://github.com/features/copilot" },
    {
      node: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.25 7.5 4.5 12l3.75 4.5M15.75 7.5 19.5 12l-3.75 4.5M13.5 4.5 10.5 19.5"/></svg>',
      title: "Codex",
    },
  ];

  function initTechLogoLoop() {
    const el = document.getElementById("tech-logo-loop");
    if (!el) return;
    new LogoLoop(el, {
      logos: TECH_LOGOS,
      speed: 80,
      direction: "left",
      logoHeight: 48,
      gap: 48,
      hoverSpeed: 20,
      scaleOnHover: true,
      fadeOut: true,
      fadeOutColor: "#0a0a0f",
      ariaLabel: "Tech stack",
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTechLogoLoop);
  } else {
    initTechLogoLoop();
  }
})();
