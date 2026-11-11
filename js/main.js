/* CrossRoads Tutoring — site behavior: loader, mobile nav, subjects slider. */
(() => {
  "use strict";

  const MIN_LOADER_MS = 700;
  const NAV_BREAKPOINT = 991;

  /* ---- Loader ------------------------------------------------------------ */
  function initLoader() {
    const loader = document.getElementById("loader");
    const start = performance.now();
    const skipEvents = ["wheel", "touchmove", "keydown"];
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      skipEvents.forEach((type) => window.removeEventListener(type, finish));
      document.body.classList.remove("is-loading");
      if (!loader) return;
      loader.classList.add("is-hidden");
      loader.addEventListener("transitionend", () => loader.remove(), { once: true });
      setTimeout(() => loader.remove(), 1000); // fallback if no transition fires
    };

    // Any scroll attempt or key press skips the intro
    skipEvents.forEach((type) => window.addEventListener(type, finish, { passive: true }));

    const onLoad = () => setTimeout(finish, Math.max(0, MIN_LOADER_MS - (performance.now() - start)));

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
  }

  /* ---- Mobile navigation --------------------------------------------------- */
  function initNav() {
    const nav = document.getElementById("siteNav");
    const toggle = nav && nav.querySelector(".site-nav__toggle");
    if (!toggle) return;

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("click", (e) => { if (!nav.contains(e.target)) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > NAV_BREAKPOINT) setOpen(false); });
  }

  /* ---- Subjects slider (endless, both directions) -------------------------- */
  function initSlider() {
    const root = document.getElementById("subjectsSlider");
    if (!root) return;

    const track = root.querySelector(".slider__track");
    const slides = [...root.querySelectorAll(".slide")];
    const title = root.querySelector(".slider__title");
    const dots = [...root.querySelectorAll(".slider__dot")];
    const count = slides.length;

    // Clone the ends so the track can keep moving the same direction forever
    const makeClone = (slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("role");
      return clone;
    };
    track.insertBefore(makeClone(slides[count - 1]), slides[0]);
    track.appendChild(makeClone(slides[0]));

    let pos = 1; // track position (0 and count + 1 are clones)
    let moving = false;
    let startX = null;

    const realIndex = () => (pos - 1 + count) % count;

    const place = (animate) => {
      track.style.transition = animate ? "" : "none";
      track.style.transform = `translateX(${-pos * 100}%)`;
      if (!animate) track.getBoundingClientRect(); // commit the jump before re-enabling transitions
    };

    const sync = () => {
      const i = realIndex();
      title.textContent = slides[i].dataset.title;
      slides.forEach((s, n) => s.setAttribute("aria-hidden", String(n !== i)));
      dots.forEach((d, n) => d.setAttribute("aria-current", String(n === i)));
    };

    // After landing on a clone, jump (without animation) to the matching real slide
    const settle = () => {
      if (pos === 0) pos = count;
      else if (pos === count + 1) pos = 1;
      place(false);
      moving = false;
    };

    const moveTo = (nextPos) => {
      if (moving) return;
      moving = true;
      pos = nextPos;
      place(true);
      sync();
      setTimeout(() => { if (moving) settle(); }, 700); // fallback if transitionend is skipped
    };

    track.addEventListener("transitionend", (e) => { if (e.target === track && moving) settle(); });

    root.querySelector(".slider__arrow--prev").addEventListener("click", () => moveTo(pos - 1));
    root.querySelector(".slider__arrow--next").addEventListener("click", () => moveTo(pos + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => { if (i !== realIndex()) moveTo(i + 1); }));

    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") moveTo(pos - 1);
      if (e.key === "ArrowRight") moveTo(pos + 1);
    });

    root.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) moveTo(pos + (dx < 0 ? 1 : -1));
      startX = null;
    });

    place(false);
    sync();
  }

  initLoader();
  initNav();
  initSlider();
})();
