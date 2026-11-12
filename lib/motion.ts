/* Page motion: the hero opening, the scroll pipeline, and the pointer effects. No library.
   React renders the markup; this module only animates it. Where it has to restructure text (the serif
   wipe, the split name, the lit sentence) it keeps the nodes React created and puts them back on cleanup,
   so the DOM is exactly as React left it after an unmount or a hot reload. */

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const ROLES = [
  "Web Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Dashboard Builder",
];

interface MorphNode {
  word: HTMLElement;
  sans: HTMLElement;
  serif: HTMLElement;
  length: number;
}
interface Morph {
  element: HTMLElement;
  nodes: MorphNode[];
  progress: number;
  top: number;
  target: number;
}

/** Starts the motion and returns the function that stops it and restores the page. */
export function startMotion(): () => void {
  const controller = new AbortController();
  const cleanups: Array<() => void> = [];
  // One frame of grace: React's development remount stops the first start before it has touched anything.
  const first = requestAnimationFrame(() => run(controller.signal, cleanups));
  return () => {
    cancelAnimationFrame(first);
    controller.abort();
    cleanups.reverse().forEach((cleanup) => cleanup());
  };
}

interface Stage {
  hero: HTMLElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  rim: HTMLElement;
  typed: HTMLElement;
  track: HTMLElement;
  firstSet: Element;
  lead: HTMLElement;
  heroEm: HTMLElement;
  nameFirst: HTMLElement;
  portraitImage: HTMLElement;
  note: HTMLElement;
  title: HTMLElement;
}

function run(signal: AbortSignal, cleanups: Array<() => void>) {
  const hero = document.getElementById("beranda");
  const canvas = document.getElementById("heroCanvas") as HTMLCanvasElement | null;
  const rim = document.getElementById("portraitRim");
  const typed = document.getElementById("typedRole");
  const track = document.getElementById("disciplineTrack");
  const lead = document.getElementById("aboutLead");
  const heroEm = hero?.querySelector<HTMLElement>("h1 em");
  const nameFirst = hero?.querySelector<HTMLElement>(".name-first");
  const portraitImage = hero?.querySelector<HTMLElement>(".portrait-frame img");
  const note = hero?.querySelector<HTMLElement>(".portrait-note");
  const title = hero?.querySelector<HTMLElement>("h1");
  const firstSet = track?.firstElementChild;
  const context = canvas?.getContext("2d");
  if (
    !hero || !canvas || !context || !rim || !typed || !track || !lead ||
    !heroEm || !nameFirst || !portraitImage || !note || !title || !firstSet
  )
    return;
  animate(
    { hero, canvas, context, rim, typed, track, firstSet, lead, heroEm, nameFirst, portraitImage, note, title },
    signal,
    cleanups,
  );
}

function animate(
  { hero, canvas, context, rim, typed, track, firstSet, lead, heroEm, nameFirst, portraitImage, note, title }: Stage,
  signal: AbortSignal,
  cleanups: Array<() => void>,
) {
  const root = document.documentElement;
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const mobileLayout = window.matchMedia("(max-width: 760px)");

  const on = (
    target: EventTarget,
    type: string,
    handler: (event: Event) => void,
    options: AddEventListenerOptions = {},
  ) => target.addEventListener(type, handler, { ...options, signal });
  const later = (callback: () => void, delay: number) =>
    window.setTimeout(() => {
      if (!signal.aborted) callback();
    }, delay);
  const watch = <T extends { disconnect(): void }>(observer: T) => {
    cleanups.push(() => observer.disconnect());
    return observer;
  };
  // Remembers an element's own child nodes so the cleanup can hand them back untouched.
  const keepChildren = (element: Element) => {
    const original = [...element.childNodes];
    cleanups.push(() => element.replaceChildren(...original));
  };
  const clearStyles = (element: HTMLElement | SVGElement, ...properties: string[]) =>
    cleanups.push(() =>
      properties.forEach((property) => element.style.removeProperty(property)),
    );

  let heroVisible = true;
  watch(
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible) startSea();
    }),
  ).observe(hero);

  /* Sans-to-serif wipe, built word by word so headings can still wrap. */
  function buildMorph(element: HTMLElement): Morph {
    const words = (element.textContent ?? "").trim().split(/\s+/);
    keepChildren(element);
    cleanups.push(() => {
      element.classList.remove("morph-host");
      element.style.removeProperty("--sans-size");
    });
    element.replaceChildren();
    element.classList.add("morph-host");
    const nodes = words.map((text, index) => {
      const word = document.createElement("span");
      word.className = "morph-word";
      const sans = document.createElement("span");
      sans.className = "morph-sans";
      sans.setAttribute("aria-hidden", "true");
      sans.textContent = text;
      const serif = document.createElement("span");
      serif.className = "morph-serif";
      serif.textContent = text;
      word.append(sans, serif);
      element.append(word);
      if (index < words.length - 1) element.append(" ");
      return { word, sans, serif, length: text.length };
    });
    return { element, nodes, progress: -1, top: 0, target: 0 };
  }
  // The two faces differ in width. Size does most of the matching, one value per group so
  // sibling titles stay alike; tracking per word then lands the sans exactly on the serif.
  function fitMorphs(group: Morph[]) {
    const nodes = group.flatMap((morph) => morph.nodes);
    if (!nodes.length) return;
    const inner = (node: HTMLElement) => {
      const style = getComputedStyle(node);
      return (
        node.getBoundingClientRect().width -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight)
      );
    };
    group.forEach(({ element }) => element.style.removeProperty("--sans-size"));
    nodes.forEach(({ sans }) => {
      sans.style.letterSpacing = "";
    });
    const total = (key: "sans" | "serif") =>
      nodes.reduce((sum, node) => sum + inner(node[key]), 0);
    const first = nodes[0].sans;
    const current =
      parseFloat(getComputedStyle(first).fontSize) /
      parseFloat(getComputedStyle(first.parentElement as HTMLElement).fontSize);
    const size = clamp(
      current * (total("serif") / total("sans")),
      0.55,
      1.1,
    ).toFixed(3);
    group.forEach(({ element }) =>
      element.style.setProperty("--sans-size", `${size}em`),
    );
    nodes.forEach(({ sans, serif, length }) => {
      // A lone glyph like "&" has no gaps to track, so it sits centred on the serif instead.
      if (length === 1) {
        sans.style.justifySelf = "center";
        return;
      }
      const base = parseFloat(getComputedStyle(sans).letterSpacing) || 0;
      sans.style.letterSpacing = `${base + (inner(serif) - inner(sans)) / length}px`;
    });
  }
  function paintMorph(morph: Morph, progress: number) {
    if (morph.progress === progress) return;
    morph.progress = progress;
    const count = morph.nodes.length;
    morph.nodes.forEach(({ word }, index) => {
      const local = clamp(progress * (count + 0.6) - index * 0.8);
      word.style.setProperty("--p", local.toFixed(3));
    });
  }

  const heroMorph = buildMorph(heroEm);
  const scrollMorphs = [
    ...document.querySelectorAll<HTMLElement>("h2 em, .footer-name em"),
  ].map(buildMorph);
  const hoverMorphs = [
    ...document.querySelectorAll<HTMLElement>(".skill-row h3"),
  ].map(buildMorph);
  const fitAll = () => {
    [[heroMorph], ...scrollMorphs.map((morph) => [morph]), hoverMorphs].forEach(
      fitMorphs,
    );
  };
  scrollMorphs
    .concat(heroMorph, hoverMorphs)
    .forEach((morph) => paintMorph(morph, 0));

  /* Opening: name, photograph, and note arrive once, in order. */
  function splitName() {
    const text = nameFirst.textContent ?? "";
    const node = nameFirst.firstChild;
    if (!node) return;
    const range = document.createRange();
    const positions = [...text].map((_, index) => {
      range.setStart(node, index);
      range.setEnd(node, index + 1);
      return range.getBoundingClientRect().left;
    });
    const size = parseFloat(getComputedStyle(nameFirst).fontSize);
    const chars = [...text].map((letter, index) => {
      const char = document.createElement("span");
      char.className = "char";
      char.style.setProperty("--i", String(index));
      char.textContent = letter;
      return char;
    });
    keepChildren(nameFirst);
    nameFirst.replaceChildren(...chars);
    // Inline-block drops kerning; put each letter back where the unsplit word had it.
    chars.forEach((char, index) => {
      const shift = positions[index] - char.getBoundingClientRect().left;
      char.style.marginLeft = `${shift / size}em`;
    });
    const lines = [...title.querySelectorAll(":scope > .name-line")];
    title.setAttribute("aria-label", "Rayhandi Zulmi.");
    lines.forEach((line) => line.setAttribute("aria-hidden", "true"));
    cleanups.push(() => {
      title.removeAttribute("aria-label");
      lines.forEach((line) => line.removeAttribute("aria-hidden"));
    });
  }
  function tween(duration: number, onFrame: (eased: number) => void) {
    const start = performance.now();
    const step = (now: number) => {
      if (signal.aborted) return;
      const t = clamp((now - start) / duration);
      onFrame(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Typed role line. */
  keepChildren(typed);
  typed.textContent = "";
  function typeRoles() {
    let role = 0;
    let length = 0;
    let deleting = false;
    (function type() {
      if (!heroVisible) {
        later(type, 500);
        return;
      }
      const word = ROLES[role];
      length += deleting ? -1 : 1;
      typed.textContent = word.slice(0, length);
      let delay = deleting ? 45 : 95;
      if (!deleting && length === word.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && length === 0) {
        deleting = false;
        role = (role + 1) % ROLES.length;
        delay = 450;
      }
      later(type, delay);
    })();
  }

  /* The sea: constellation on the canvas and the light circling the portrait share one loop,
     and it sleeps when the hero is off screen or the tab is hidden. */
  const pointer: { x: number | null; y: number | null } = { x: null, y: null };
  let particles: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
  let seaRunning = false;
  let width = 0;
  let height = 0;
  function sizeSea() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(Math.floor(width / 16), 80);
    if (particles.length !== count) {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    }
  }
  function startSea() {
    if (seaRunning || signal.aborted) return;
    seaRunning = true;
    requestAnimationFrame(sea);
  }
  function sea(now: number) {
    if (signal.aborted || !heroVisible || document.hidden) {
      seaRunning = false;
      return;
    }
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(140, 207, 255, 0.6)";
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      if (pointer.x !== null && pointer.y !== null) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 170 && distance > 0.001) {
          particle.x += (dx / distance) * 0.28;
          particle.y += (dy / distance) * 0.28;
        }
      }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fill();
    });
    context.lineWidth = 1;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        if (Math.abs(dx) > 130 || Math.abs(dy) > 130) continue;
        const distance = Math.hypot(dx, dy);
        if (distance < 130) {
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.strokeStyle = `rgba(140, 207, 255, ${0.17 * (1 - distance / 130)})`;
          context.stroke();
        }
      }
    }
    rim.style.setProperty(
      "--angle",
      `${((now / 7000) * 360 + window.scrollY * 0.2) % 360}deg`,
    );
    requestAnimationFrame(sea);
  }
  on(hero, "pointermove", (event) => {
    const box = hero.getBoundingClientRect();
    pointer.x = (event as PointerEvent).clientX - box.left;
    pointer.y = (event as PointerEvent).clientY - box.top;
  });
  on(hero, "pointerleave", () => {
    pointer.x = null;
    pointer.y = null;
  });
  on(document, "visibilitychange", () => {
    if (!document.hidden && heroVisible) startSea();
  });
  cleanups.push(() => {
    context.clearRect(0, 0, width, height);
    rim.style.removeProperty("--angle");
  });
  sizeSea();
  startSea();

  const fontsReady = Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 1200)),
  ]);
  void fontsReady.then(() => {
    if (signal.aborted) return;
    fitAll();
    splitName();
    hero.classList.add("hero-play");
    cleanups.push(() => hero.classList.remove("hero-play"));
    later(() => tween(1100, (t) => paintMorph(heroMorph, t)), 780);
    later(typeRoles, 1250);
    measure();
    wake();
  });

  /* One-shot reveals. */
  const revealObserver = watch(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -9% 0px" },
    ),
  );
  document
    .querySelectorAll(".reveal, .project-card")
    .forEach((element) => revealObserver.observe(element));

  /* Numbers count up and skill bars fill the first time they are seen. */
  function playOnce<T extends Element>(
    elements: T[],
    threshold: number,
    play: (element: T) => void,
  ) {
    const observer = watch(
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            play(entry.target as T);
            observer.unobserve(entry.target);
          });
        },
        { threshold },
      ),
    );
    elements.forEach((element) => observer.observe(element));
  }
  const counters = [...document.querySelectorAll<HTMLElement>("[data-count]")];
  counters.forEach((counter) => {
    keepChildren(counter);
    counter.textContent = "0";
  });
  playOnce(counters, 0.6, (counter) => {
    const target = Number(counter.dataset.count);
    tween(1600, (t) => {
      counter.textContent = String(Math.round(target * t));
    });
  });
  const meters = [
    ...document.querySelectorAll<HTMLMeterElement>("#skillLevels meter"),
  ];
  const meterLevels = new Map(
    meters.map((meter) => [meter, Number(meter.getAttribute("value"))]),
  );
  meters.forEach((meter) => {
    meter.value = 0;
  });
  cleanups.push(() =>
    meters.forEach((meter) => {
      meter.value = meterLevels.get(meter) ?? 0;
    }),
  );
  playOnce(meters, 0.4, (meter) => {
    tween(1400, (t) => {
      meter.value = (meterLevels.get(meter) ?? 0) * t;
    });
  });

  /* Marquee: enough copies of the set to cover twice the viewport. */
  let setWidth = 1;
  function fillTrack() {
    setWidth = firstSet.getBoundingClientRect().width || 1;
    const needed = Math.ceil((window.innerWidth * 2) / setWidth) + 1;
    while (track.children.length < needed) {
      const clone = firstSet.cloneNode(true) as Element;
      clone.setAttribute("aria-hidden", "true");
      track.append(clone);
    }
  }
  cleanups.push(() => {
    [...track.children].slice(1).forEach((clone) => clone.remove());
    track.style.removeProperty("transform");
  });

  /* Lit sentence, word by word. */
  const leadWords = (lead.textContent ?? "").trim().split(/\s+/);
  keepChildren(lead);
  lead.replaceChildren();
  const litWords = leadWords.map((text, index) => {
    const word = document.createElement("span");
    word.className = "lit";
    word.textContent = text;
    word.style.opacity = "0.22";
    lead.append(word);
    if (index < leadWords.length - 1) lead.append(" ");
    return word;
  });

  /* Pointer: tilt and depth on project cards, a ring trailing the cursor, titles turning on hover. */
  const projects = [...document.querySelectorAll<HTMLElement>(".project-card")];
  if (hoverPointer.matches) {
    projects.forEach((card) => {
      on(card, "pointermove", (event) => {
        const box = card.getBoundingClientRect();
        const { clientX, clientY } = event as PointerEvent;
        card.style.setProperty(
          "--mx",
          ((clientX - box.left) / box.width - 0.5).toFixed(3),
        );
        card.style.setProperty(
          "--my",
          ((clientY - box.top) / box.height - 0.5).toFixed(3),
        );
      });
      on(card, "pointerleave", () => {
        card.style.setProperty("--mx", "0");
        card.style.setProperty("--my", "0");
      });
      clearStyles(card, "--mx", "--my");
    });
    document.querySelectorAll(".skill-row").forEach((row, index) => {
      const morph = hoverMorphs[index];
      if (!morph) return;
      on(row, "pointerenter", () => {
        morph.target = 1;
        wake();
      });
      on(row, "pointerleave", () => {
        morph.target = 0;
        wake();
      });
    });

    const ring = document.createElement("span");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.append(ring);
    cleanups.push(() => ring.remove());
    const aim = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    let ringRunning = false;
    const moveRing = () => {
      if (signal.aborted) return;
      at.x += (aim.x - at.x) * 0.18;
      at.y += (aim.y - at.y) * 0.18;
      ring.style.translate = `${at.x.toFixed(1)}px ${at.y.toFixed(1)}px`;
      if (Math.abs(aim.x - at.x) + Math.abs(aim.y - at.y) > 0.2)
        requestAnimationFrame(moveRing);
      else ringRunning = false;
    };
    on(
      window,
      "pointermove",
      (event) => {
        const { clientX, clientY, target } = event as PointerEvent;
        if (!ring.classList.contains("is-on")) {
          at.x = clientX;
          at.y = clientY;
          ring.classList.add("is-on");
        }
        aim.x = clientX;
        aim.y = clientY;
        ring.classList.toggle(
          "is-hover",
          Boolean(
            (target as Element | null)?.closest?.(
              "a, button, .chips li, .project-card",
            ),
          ),
        );
        if (!ringRunning) {
          ringRunning = true;
          requestAnimationFrame(moveRing);
        }
      },
      { passive: true },
    );
    on(root, "pointerleave", () => ring.classList.remove("is-on"));
  }

  /* Scroll pipeline: positions are cached, and one eased scroll value drives everything. */
  const spinners = [
    ...document.querySelectorAll<SVGElement>("[data-spin]"),
  ].map((element) => ({ element, rate: Number(element.dataset.spin) }));
  const depthCards = projects.map((element) => ({
    element,
    rate: Number(element.dataset.depth),
    top: 0,
  }));
  const unfolds = [...document.querySelectorAll<HTMLElement>(".unfold")].map(
    (element) => ({ element, value: -1, top: 0 }),
  );
  clearStyles(portraitImage, "translate");
  clearStyles(note, "translate");
  clearStyles(nameFirst, "translate");
  clearStyles(heroEm, "translate");
  spinners.forEach(({ element }) => clearStyles(element, "rotate"));
  depthCards.forEach(({ element }) => clearStyles(element, "translate"));
  unfolds.forEach(({ element }) => clearStyles(element, "clip-path"));

  let viewport = window.innerHeight;
  let maxScroll = 1;
  let leadBox = { top: 0, height: 1 };
  const docTop = (element: Element) =>
    element.getBoundingClientRect().top + window.scrollY;
  function measure() {
    viewport = window.innerHeight;
    maxScroll = Math.max(1, root.scrollHeight - viewport);
    scrollMorphs.forEach((morph) => {
      morph.top = docTop(morph.element);
    });
    unfolds.forEach((item) => {
      item.top = docTop(item.element);
    });
    depthCards.forEach((item) => {
      item.top = item.element.offsetTop;
    });
    leadBox = { top: docTop(lead), height: lead.offsetHeight };
    fillTrack();
  }

  let smooth = window.scrollY;
  let previous = smooth;
  let bandOffset = 0;
  let running = false;
  function wake() {
    if (running || signal.aborted) return;
    running = true;
    requestAnimationFrame(frame);
  }
  function frame() {
    if (signal.aborted) return;
    const actual = window.scrollY;
    smooth += (actual - smooth) * 0.13;
    if (Math.abs(actual - smooth) < 0.05) smooth = actual;
    const delta = smooth - previous;
    previous = smooth;

    // Hero: the photograph drifts inside its frame while the two names part slightly.
    const heroShift = clamp(smooth / 900);
    if (smooth < viewport * 1.4) {
      portraitImage.style.translate = `0 ${(-12.3 + heroShift * 12.3).toFixed(2)}%`;
      note.style.translate = `0 ${(heroShift * -90).toFixed(1)}px`;
      if (!mobileLayout.matches) {
        nameFirst.style.translate = `${(heroShift * -46).toFixed(1)}px 0`;
        heroEm.style.translate = `${(heroShift * 64).toFixed(1)}px 0`;
      }
    }

    bandOffset = (bandOffset - delta * 0.55) % setWidth;
    track.style.transform = `translate3d(${(bandOffset > 0 ? bandOffset - setWidth : bandOffset).toFixed(1)}px,0,0)`;
    spinners.forEach(({ element, rate }) => {
      element.style.rotate = `${(smooth * rate).toFixed(1)}deg`;
    });

    depthCards.forEach(({ element, rate, top }) => {
      if (
        mobileLayout.matches ||
        !rate ||
        element.classList.contains("project-featured")
      ) {
        element.style.translate = "";
        return;
      }
      element.style.translate = `0 ${((smooth + viewport / 2 - top) * rate).toFixed(1)}px`;
    });

    const atEnd = actual >= maxScroll - 2;
    scrollMorphs.forEach((morph) => {
      const start = morph.top - viewport * 0.9;
      const span = viewport * 0.36;
      paintMorph(morph, atEnd ? 1 : clamp((smooth - start) / span));
    });

    let settling = false;
    hoverMorphs.forEach((morph) => {
      const current = Math.max(morph.progress, 0);
      if (current === morph.target) return;
      const next = current + (morph.target - current) * 0.11;
      paintMorph(morph, Math.abs(morph.target - next) < 0.004 ? morph.target : next);
      settling = true;
    });

    unfolds.forEach((item) => {
      const reveal = clamp((smooth + viewport - item.top) / (viewport * 0.8));
      const value = Number(reveal.toFixed(3));
      if (value === item.value) return;
      item.value = value;
      item.element.style.clipPath =
        value === 1
          ? ""
          : `inset(0 ${((1 - value) * 4.5).toFixed(2)}vw 0 round ${((1 - value) * 72).toFixed(1)}px ${((1 - value) * 72).toFixed(1)}px 0 0)`;
    });

    const litStart = leadBox.top - viewport * 0.82;
    const litSpan = Math.max(leadBox.height + viewport * 0.28, 1);
    const litProgress =
      clamp((smooth - litStart) / litSpan) * (litWords.length + 3);
    litWords.forEach((word, index) => {
      const value = (0.22 + clamp(litProgress - index) * 0.78).toFixed(2);
      if (word.style.opacity !== value) word.style.opacity = value;
    });

    if (smooth !== actual || settling) requestAnimationFrame(frame);
    else running = false;
  }

  on(window, "scroll", wake, { passive: true });
  let fittedWidth = window.innerWidth;
  watch(
    new ResizeObserver(() => {
      if (window.innerWidth !== fittedWidth) {
        fittedWidth = window.innerWidth;
        fitAll();
        sizeSea();
      }
      measure();
      wake();
    }),
  ).observe(document.body);
  on(window, "load", () => {
    measure();
    wake();
  });
  measure();
  wake();
}
