"use strict";

const root = document.documentElement;
const motion = root.classList.contains("motion");
const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("mainNav");
const navLinksBox = document.getElementById("navLinks");
const mobileNav = window.matchMedia("(max-width: 900px)");
const mobileLayout = window.matchMedia("(max-width: 760px)");
menuToggle.hidden = false;
root.classList.add("nav-enhanced");
function setMenu(open) {
  navigation.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
}
menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenu(open);
  // The links come before the button in the DOM, so Tab would otherwise skip them.
  if (open) navLinksBox.querySelector("a").focus({ preventScroll: true });
});
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenu(false);
    aimNavAt(link);
    const target = document.querySelector(link.getAttribute("href"));
    if (mobileNav.matches && target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    menuToggle.focus();
  }
  if (event.key === "Escape") dropLens(false);
});
mobileNav.addEventListener("change", () => {
  setMenu(false);
  placeLens();
});

/* Glass lens over the current nav item. Press and hold to lift it out of the bar and drag it along;
   letting go drops it on the nearest item and goes there. */
const navLinks = [...navLinksBox.querySelectorAll("a")];
const navContact = navigation.querySelector(".nav-contact");
const navBar = navigation.parentElement;
const navLens = document.getElementById("navLens");
const lens = { x: 0, y: 0, w: 0, h: 0, vx: 0, vy: 0, vw: 0, vh: 0 };
const lensAim = { x: 0, y: 0 };
let lensPlaced = false;
let lensHeld = false;
let lensRunning = false;
let lensLast = 0;
let lensPress = null;
let lensHoldTimer;
let lensUnder = null;
let lensSwallowClick = false;
let navTarget = null;
let navTargetTimer;

const linkCentre = (link) => link.offsetLeft + link.offsetWidth / 2;
const nearestNavLink = (x) =>
  navLinks.reduce((best, link) =>
    Math.abs(linkCentre(link) - x) < Math.abs(linkCentre(best) - x)
      ? link
      : best,
  );
// Past the edge the lens keeps following, with less and less give.
const softLimit = (distance, reach) => reach * (1 - 1 / (distance / reach + 1));

// While the page travels to a chosen section, the lens waits there instead of visiting every section on the way.
function aimNavAt(target) {
  navTarget = target;
  clearTimeout(navTargetTimer);
  navTargetTimer = setTimeout(releaseNavTarget, 2200);
  wakeLens();
}
function releaseNavTarget() {
  navTarget = null;
  clearTimeout(navTargetTimer);
  wakeLens();
}
["wheel", "touchmove", "scrollend"].forEach((name) =>
  window.addEventListener(
    name,
    () => {
      if (navTarget) releaseNavTarget();
    },
    { passive: true },
  ),
);

function lensGoal() {
  if (lensHeld) {
    return {
      x: lensAim.x,
      y: lensAim.y,
      w: nearestNavLink(lensAim.x).offsetWidth + 60,
      h: navBar.offsetHeight + 20,
    };
  }
  const current = navTarget || navigation.querySelector("a[aria-current]");
  const link = navLinks.includes(current) ? current : null;
  navLinksBox.classList.toggle("no-lens", !link);
  if (!link) return lens;
  return {
    x: linkCentre(link),
    y: 0,
    w: link.offsetWidth,
    h: link.offsetHeight,
  };
}

/* True refraction needs SVG filters in backdrop-filter, which only Chromium renders.
   Elsewhere the lens keeps its clear glass, rim, and rainbow edge. */
const lensFilter = document.getElementById("lensRefraction");
const lensMapImage = document.getElementById("lensMap");
const lensShifts = [...lensFilter.querySelectorAll("feDisplacementMap")];
let lensRefracts = false;
let lensFilterKey = "";
function buildLensRefraction() {
  const mapWidth = 360;
  const mapHeight = 180;
  const map = document.createElement("canvas");
  map.width = mapWidth;
  map.height = mapHeight;
  const context = map.getContext("2d");
  const image = context.createImageData(mapWidth, mapHeight);
  const radius = mapHeight / 2;
  const bezel = mapHeight * 0.2;
  for (let y = 0; y < mapHeight; y += 1) {
    for (let x = 0; x < mapWidth; x += 1) {
      const px = x + 0.5 - mapWidth / 2;
      const py = y + 0.5 - mapHeight / 2;
      const qx = Math.max(Math.abs(px) - (mapWidth / 2 - radius), 0);
      const qy = Math.abs(py);
      const distance = Math.hypot(qx, qy) || 1;
      const depth = radius - distance;
      const strength =
        depth > 0 && depth < bezel ? Math.pow(1 - depth / bezel, 2.4) : 0;
      const at = (y * mapWidth + x) * 4;
      image.data[at] = 128 + ((Math.sign(px) * qx) / distance) * strength * 127;
      image.data[at + 1] =
        128 + ((Math.sign(py) * qy) / distance) * strength * 127;
      image.data[at + 2] = 128;
      image.data[at + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  lensMapImage.setAttribute("href", map.toDataURL());
  navLinksBox.classList.add("has-refraction");
  lensRefracts = true;
}
// One capsule map, stretched to the lens; the bend grows with the lift.
function paintRefraction(width, height) {
  const rest = navLinks[0].offsetHeight;
  const lift = Math.min(
    1,
    Math.max(0, (lens.h - rest) / Math.max(navBar.offsetHeight + 20 - rest, 1)),
  );
  const bend = 7 + lift * 9;
  const key = `${width}|${height}|${bend.toFixed(1)}`;
  if (key === lensFilterKey) return;
  lensFilterKey = key;
  [lensFilter, lensMapImage].forEach((node) => {
    node.setAttribute("width", width);
    node.setAttribute("height", height);
  });
  lensShifts.forEach((node, index) =>
    node.setAttribute("scale", (bend + index * (1 + lift)).toFixed(1)),
  );
}
function paintLens() {
  const width = Math.round(lens.w + Math.min(Math.abs(lens.vx) * 1.5, 36));
  const height = Math.round(lens.h - Math.min(Math.abs(lens.vx) * 0.5, 9));
  navLens.style.width = `${width}px`;
  navLens.style.height = `${height}px`;
  navLens.style.translate = `${(lens.x - width / 2).toFixed(1)}px ${(lens.y - height / 2).toFixed(1)}px`;
  if (lensRefracts) paintRefraction(width, height);
}
function spring(key, goal, stiffness, damping, step) {
  const velocity = `v${key}`;
  lens[velocity] += (goal - lens[key]) * stiffness * step;
  lens[velocity] *= Math.pow(damping, step);
  lens[key] += lens[velocity] * step;
}
function lensFrame(now) {
  const step = Math.max(0.2, Math.min((now - lensLast) / 16.67, 2));
  lensLast = now;
  const goal = lensGoal();
  const keys = ["x", "y", "w", "h"];
  if (!motion || !lensPlaced) {
    keys.forEach((key) => {
      lens[key] = goal[key];
      lens[`v${key}`] = 0;
    });
    lensPlaced = true;
  } else {
    spring("x", goal.x, lensHeld ? 0.2 : 0.13, lensHeld ? 0.7 : 0.74, step);
    spring("y", goal.y, 0.16, 0.72, step);
    spring("w", goal.w, 0.16, 0.7, step);
    spring("h", goal.h, 0.16, 0.7, step);
  }
  const moving = keys.some(
    (key) =>
      Math.abs(goal[key] - lens[key]) > 0.1 || Math.abs(lens[`v${key}`]) > 0.1,
  );
  if (!moving) {
    keys.forEach((key) => {
      lens[key] = goal[key];
      lens[`v${key}`] = 0;
    });
  }
  paintLens();
  if (moving || lensHeld) requestAnimationFrame(lensFrame);
  else lensRunning = false;
}
function wakeLens() {
  if (lensRunning || mobileNav.matches) return;
  lensRunning = true;
  lensLast = performance.now();
  requestAnimationFrame(lensFrame);
}
function placeLens() {
  lensPlaced = false;
  wakeLens();
}
function aimLens(clientX, clientY) {
  const box = navLinksBox.getBoundingClientRect();
  const over = clientX - box.left;
  if (over < 0) lensAim.x = -softLimit(-over, 46);
  else if (over > box.width)
    lensAim.x = box.width + softLimit(over - box.width, 46);
  else lensAim.x = over;
  const rise = clientY - (box.top + box.height / 2);
  lensAim.y = Math.sign(rise) * softLimit(Math.abs(rise), 9);
  const under = nearestNavLink(lensAim.x);
  if (under !== lensUnder) {
    lensUnder?.classList.remove("is-under");
    under.classList.add("is-under");
    lensUnder = under;
  }
}
function liftLens(clientX, clientY) {
  clearTimeout(lensHoldTimer);
  lensHeld = true;
  navLinksBox.setPointerCapture(lensPress.id);
  navLinksBox.classList.remove("no-lens");
  navLinksBox.classList.add("is-held");
  root.classList.add("lens-held");
  aimLens(clientX, clientY);
  wakeLens();
}
function dropLens(navigate) {
  clearTimeout(lensHoldTimer);
  lensPress = null;
  if (!lensHeld) return;
  lensHeld = false;
  navLinksBox.classList.remove("is-held");
  root.classList.remove("lens-held");
  lensUnder?.classList.remove("is-under");
  lensUnder = null;
  if (navigate) {
    const link = nearestNavLink(lensAim.x);
    aimNavAt(link);
    // The browser still sends its own click after this pointerup; only ours should count.
    lensSwallowClick = true;
    setTimeout(() => {
      lensSwallowClick = false;
      link.click();
    }, 0);
  }
  wakeLens();
}
navLinksBox.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || mobileNav.matches) return;
  lensPress = { id: event.pointerId, x: event.clientX };
  const { clientX, clientY } = event;
  lensHoldTimer = setTimeout(() => liftLens(clientX, clientY), 110);
});
navLinksBox.addEventListener("pointermove", (event) => {
  if (!lensPress || event.pointerId !== lensPress.id) return;
  if (lensHeld) aimLens(event.clientX, event.clientY);
  else if (Math.abs(event.clientX - lensPress.x) > 4)
    liftLens(event.clientX, event.clientY);
});
navLinksBox.addEventListener("pointerup", () => dropLens(true));
navLinksBox.addEventListener("pointercancel", () => dropLens(false));
navLinksBox.addEventListener(
  "click",
  (event) => {
    if (!lensSwallowClick) return;
    event.preventDefault();
    event.stopPropagation();
  },
  true,
);
navLinksBox.addEventListener("dragstart", (event) => event.preventDefault());
navLinksBox.addEventListener("contextmenu", (event) => {
  if (lensHeld) event.preventDefault();
});

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const href = `#${entry.target.id}`;
      [...navLinks, navContact].forEach((item) => {
        if (item.getAttribute("href") === href)
          item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      });
      if (navTarget?.getAttribute("href") === href) releaseNavTarget();
      wakeLens();
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
["beranda", "project", "tentang", "keahlian", "kontak"].forEach((id) =>
  spy.observe(document.getElementById(id)),
);
if (navigator.userAgentData?.brands?.some((item) => item.brand === "Chromium"))
  buildLensRefraction();
new ResizeObserver(wakeLens).observe(navLinksBox);
window.addEventListener("resize", placeLens);
document.fonts.ready.then(placeLens);

const header = document.getElementById("siteHeader");
const progressBar = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
function onPageScroll() {
  const top = window.scrollY;
  const range = root.scrollHeight - window.innerHeight;
  progressBar.style.scale = `${range > 0 ? (top / range).toFixed(4) : 0} 1`;
  header.classList.toggle("is-scrolled", top > 8);
  toTop.classList.toggle("is-visible", top > 600);
}
window.addEventListener("scroll", onPageScroll, { passive: true });
onPageScroll();

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const fields = ["fieldName", "fieldEmail", "fieldMessage"].map((id) =>
  document.getElementById(id),
);
document.getElementById("contactSubmit").disabled = false;
fields.forEach((field) =>
  field.addEventListener("input", () => {
    field.setCustomValidity("");
    formStatus.replaceChildren();
  }),
);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  fields.forEach((field) =>
    field.setCustomValidity(
      field.value.trim() ? "" : "Mohon isi kolom ini, bukan hanya spasi.",
    ),
  );
  if (!form.reportValidity()) return;
  const [name, email, message] = fields.map((field) => field.value.trim());
  const subject = encodeURIComponent(`Pesan dari ${name} — Website Portofolio`);
  const body = encodeURIComponent(
    `Halo Rayhandi,\n\n${message}\n\nSalam,\n${name}\n${email}`,
  );
  const draft = document.createElement("a");
  draft.href = `mailto:rayhandizulmi@gmail.com?subject=${subject}&body=${body}`;
  draft.textContent = "Buka ulang draft email";
  formStatus.replaceChildren(
    document.createTextNode(
      "Draft siap dibuka; pesan belum terkirim. Kirim melalui aplikasi email kamu. Jika tidak terbuka, atur aplikasi email default atau gunakan alamat email di samping. ",
    ),
    draft,
  );
  draft.click();
});
document.getElementById("year").textContent = new Date().getFullYear();

// Content remains visible without JavaScript; enhancement is optional.
const filters = [...document.querySelectorAll("[data-filter]")];
const projects = [...document.querySelectorAll(".project-card")];
function applyFilter(button) {
  filters.forEach((item) =>
    item.setAttribute("aria-pressed", String(item === button)),
  );
  projects.forEach((project) => {
    project.hidden =
      button.dataset.filter !== "all" &&
      project.dataset.category !== button.dataset.filter;
    project.classList.add("is-in");
  });
  const visible = projects.filter((project) => !project.hidden);
  // A supporting project left on its own takes the lead layout instead of leaving half a row empty.
  const supporting = visible.filter((project) => project !== projects[0]);
  projects
    .slice(1)
    .forEach((project) =>
      project.classList.toggle(
        "project-featured",
        supporting.length === 1 && project === supporting[0],
      ),
    );
  document.getElementById("filterStatus").textContent =
    `${visible.length} project ditampilkan`;
}
filters.forEach((button) => {
  button.addEventListener("click", () => {
    if (motion && document.startViewTransition)
      document.startViewTransition(() => applyFilter(button));
    else applyFilter(button);
  });
});

if (motion) startMotion();

function startMotion() {
  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));
  const hero = document.getElementById("beranda");
  let heroVisible = true;
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    if (heroVisible) startSea();
  }).observe(hero);

  /* Sans-to-serif wipe, built word by word so headings can still wrap. */
  function buildMorph(element) {
    const words = element.textContent.trim().split(/\s+/);
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
    return { element, nodes, progress: -1 };
  }
  // The two faces differ in width. Size does most of the matching, one value per group so
  // sibling titles stay alike; tracking per word then lands the sans exactly on the serif.
  function fitMorphs(group) {
    const nodes = group.flatMap((morph) => morph.nodes);
    const inner = (node) => {
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
    const total = (key) =>
      nodes.reduce((sum, node) => sum + inner(node[key]), 0);
    const first = nodes[0].sans;
    const current =
      parseFloat(getComputedStyle(first).fontSize) /
      parseFloat(getComputedStyle(first.parentElement).fontSize);
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
  function paintMorph(morph, progress) {
    if (morph.progress === progress) return;
    morph.progress = progress;
    const count = morph.nodes.length;
    morph.nodes.forEach(({ word }, index) => {
      const local = clamp(progress * (count + 0.6) - index * 0.8);
      word.style.setProperty("--p", local.toFixed(3));
    });
  }

  const heroMorph = buildMorph(hero.querySelector("h1 em"));
  const scrollMorphs = [
    ...document.querySelectorAll("h2 em, .footer-name em"),
  ].map(buildMorph);
  const hoverMorphs = [...document.querySelectorAll(".skill-row h3")].map(
    buildMorph,
  );
  const fitAll = () => {
    [[heroMorph], ...scrollMorphs.map((morph) => [morph]), hoverMorphs].forEach(
      fitMorphs,
    );
  };
  scrollMorphs
    .concat(heroMorph, hoverMorphs)
    .forEach((morph) => paintMorph(morph, 0));

  /* Opening: name, photograph, and note arrive once, in order. */
  const nameFirst = hero.querySelector(".name-first");
  function splitName() {
    const text = nameFirst.textContent;
    const node = nameFirst.firstChild;
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
      char.style.setProperty("--i", index);
      char.textContent = letter;
      return char;
    });
    nameFirst.replaceChildren(...chars);
    // Inline-block drops kerning; put each letter back where the unsplit word had it.
    chars.forEach((char, index) => {
      const shift = positions[index] - char.getBoundingClientRect().left;
      char.style.marginLeft = `${shift / size}em`;
    });
    const title = hero.querySelector("h1");
    title.setAttribute("aria-label", "Rayhandi Zulmi.");
    title
      .querySelectorAll(":scope > .name-line")
      .forEach((line) => line.setAttribute("aria-hidden", "true"));
  }
  function tween(duration, onFrame) {
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / duration);
      onFrame(1 - Math.pow(1 - t, 3));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Typed role line. */
  const roles = [
    "Web Developer",
    "UI/UX Designer",
    "Data Analyst",
    "Dashboard Builder",
  ];
  const typed = document.getElementById("typedRole");
  typed.textContent = "";
  function typeRoles() {
    let role = 0;
    let length = 0;
    let deleting = false;
    (function type() {
      if (!heroVisible) {
        setTimeout(type, 500);
        return;
      }
      const word = roles[role];
      length += deleting ? -1 : 1;
      typed.textContent = word.slice(0, length);
      let delay = deleting ? 45 : 95;
      if (!deleting && length === word.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && length === 0) {
        deleting = false;
        role = (role + 1) % roles.length;
        delay = 450;
      }
      setTimeout(type, delay);
    })();
  }

  /* The sea: constellation on the canvas and the light circling the portrait share one loop,
     and it sleeps when the hero is off screen or the tab is hidden. */
  const canvas = document.getElementById("heroCanvas");
  const context = canvas.getContext("2d");
  const rim = document.getElementById("portraitRim");
  const pointer = { x: null, y: null };
  let particles = [];
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
    if (seaRunning) return;
    seaRunning = true;
    requestAnimationFrame(sea);
  }
  function sea(now) {
    if (!heroVisible || document.hidden) {
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
      if (pointer.x !== null) {
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
  hero.addEventListener("pointermove", (event) => {
    const box = hero.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
  });
  hero.addEventListener("pointerleave", () => {
    pointer.x = null;
    pointer.y = null;
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && heroVisible) startSea();
  });
  sizeSea();
  startSea();

  const fontsReady = Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 1200)),
  ]);
  fontsReady.then(() => {
    fitAll();
    splitName();
    hero.classList.add("hero-play");
    setTimeout(() => tween(1100, (t) => paintMorph(heroMorph, t)), 780);
    setTimeout(typeRoles, 1250);
    measure();
    wake();
  });

  /* One-shot reveals. */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -9% 0px" },
  );
  document
    .querySelectorAll(".reveal, .project-card")
    .forEach((element) => revealObserver.observe(element));

  /* Numbers count up and skill bars fill the first time they are seen. */
  function playOnce(elements, threshold, play) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          play(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold },
    );
    elements.forEach((element) => observer.observe(element));
  }
  const counters = [...document.querySelectorAll("[data-count]")];
  counters.forEach((counter) => {
    counter.textContent = "0";
  });
  playOnce(counters, 0.6, (counter) => {
    const target = Number(counter.dataset.count);
    tween(1600, (t) => {
      counter.textContent = String(Math.round(target * t));
    });
  });
  const meters = [...document.querySelectorAll("#skillLevels meter")];
  const meterLevels = new Map(
    meters.map((meter) => [meter, Number(meter.getAttribute("value"))]),
  );
  meters.forEach((meter) => {
    meter.value = 0;
  });
  playOnce(meters, 0.4, (meter) => {
    tween(1400, (t) => {
      meter.value = meterLevels.get(meter) * t;
    });
  });

  /* Arrows get a second copy to swap with on hover. */
  document
    .querySelectorAll(".button > span, .text-link > span, .project-link > span")
    .forEach((holder) => {
      const glyph = holder.textContent.trim();
      if (!/^[↗↓↑]$/.test(glyph)) return;
      const inner = document.createElement("span");
      inner.className = glyph === "↗" ? "arrow" : "arrow arrow-v";
      if (glyph === "↑") inner.style.setProperty("--from", "110%");
      if (glyph === "↓") inner.style.setProperty("--from", "-110%");
      const first = document.createElement("i");
      first.textContent = glyph;
      inner.append(first, first.cloneNode(true));
      holder.replaceChildren(inner);
    });

  /* Marquee: enough copies of the set to cover twice the viewport. */
  const track = document.getElementById("disciplineTrack");
  const firstSet = track.firstElementChild;
  let setWidth = 1;
  function fillTrack() {
    setWidth = firstSet.getBoundingClientRect().width || 1;
    const needed = Math.ceil((window.innerWidth * 2) / setWidth) + 1;
    while (track.children.length < needed) {
      const clone = firstSet.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.append(clone);
    }
  }

  /* Lit sentence, word by word. */
  const lead = document.getElementById("aboutLead");
  const leadWords = lead.textContent.trim().split(/\s+/);
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
  if (hoverPointer.matches) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const box = card.getBoundingClientRect();
        card.style.setProperty(
          "--mx",
          ((event.clientX - box.left) / box.width - 0.5).toFixed(3),
        );
        card.style.setProperty(
          "--my",
          ((event.clientY - box.top) / box.height - 0.5).toFixed(3),
        );
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--mx", 0);
        card.style.setProperty("--my", 0);
      });
    });
    document.querySelectorAll(".skill-row").forEach((row, index) => {
      const morph = hoverMorphs[index];
      row.addEventListener("pointerenter", () => {
        morph.target = 1;
        wake();
      });
      row.addEventListener("pointerleave", () => {
        morph.target = 0;
        wake();
      });
    });

    const ring = document.createElement("span");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.append(ring);
    const aim = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };
    let ringRunning = false;
    const moveRing = () => {
      at.x += (aim.x - at.x) * 0.18;
      at.y += (aim.y - at.y) * 0.18;
      ring.style.translate = `${at.x.toFixed(1)}px ${at.y.toFixed(1)}px`;
      if (Math.abs(aim.x - at.x) + Math.abs(aim.y - at.y) > 0.2)
        requestAnimationFrame(moveRing);
      else ringRunning = false;
    };
    window.addEventListener(
      "pointermove",
      (event) => {
        if (!ring.classList.contains("is-on")) {
          at.x = event.clientX;
          at.y = event.clientY;
          ring.classList.add("is-on");
        }
        aim.x = event.clientX;
        aim.y = event.clientY;
        ring.classList.toggle(
          "is-hover",
          Boolean(
            event.target.closest?.("a, button, .chips li, .project-card"),
          ),
        );
        if (!ringRunning) {
          ringRunning = true;
          requestAnimationFrame(moveRing);
        }
      },
      { passive: true },
    );
    document.documentElement.addEventListener("pointerleave", () =>
      ring.classList.remove("is-on"),
    );
  }

  /* Scroll pipeline: positions are cached, and one eased scroll value drives everything. */
  const portraitImage = hero.querySelector(".portrait-frame img");
  const note = hero.querySelector(".portrait-note");
  const nameLineOne = hero.querySelector(".name-first");
  const nameLineTwo = hero.querySelector("h1 em");
  const spinners = [...document.querySelectorAll("[data-spin]")].map(
    (element) => ({ element, rate: Number(element.dataset.spin) }),
  );
  const depthCards = projects.map((element) => ({
    element,
    rate: Number(element.dataset.depth),
  }));
  const unfolds = [...document.querySelectorAll(".unfold")].map((element) => ({
    element,
    value: -1,
  }));
  let viewport = window.innerHeight;
  let maxScroll = 1;
  let leadBox = { top: 0, height: 1 };
  const docTop = (element) =>
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
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }
  function frame() {
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
        nameLineOne.style.translate = `${(heroShift * -46).toFixed(1)}px 0`;
        nameLineTwo.style.translate = `${(heroShift * 64).toFixed(1)}px 0`;
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
      const target = morph.target || 0;
      const current = Math.max(morph.progress, 0);
      if (current === target) return;
      const next = current + (target - current) * 0.11;
      paintMorph(morph, Math.abs(target - next) < 0.004 ? target : next);
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

  window.addEventListener("scroll", wake, { passive: true });
  let fittedWidth = window.innerWidth;
  new ResizeObserver(() => {
    if (window.innerWidth !== fittedWidth) {
      fittedWidth = window.innerWidth;
      fitAll();
      sizeSea();
    }
    measure();
    wake();
  }).observe(document.body);
  window.addEventListener("load", () => {
    measure();
    wake();
  });
  measure();
  wake();
}
