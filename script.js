// 01. CTA hover tilt interaction
const cta = document.querySelector(".cta");

if (cta) {
  cta.addEventListener("mousemove", function (e) {
    const rect = cta.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    cta.style.transform = "translate(" + x * 0.06 + "px, " + y * 0.06 + "px)";
  });

  cta.addEventListener("mouseleave", function () {
    cta.style.transform = "";
  });
}

// 02. Navbar scroll state
const navbar = document.querySelector(".navbar");

function updateNavbarOnScroll() {
  if (!navbar) return;
  if (window.scrollY > 30) {
    navbar.classList.add("nav-scrolled");
  } else {
    navbar.classList.remove("nav-scrolled");
  }
}

window.addEventListener("scroll", updateNavbarOnScroll);
updateNavbarOnScroll();

// 03. Intro animation trigger (first load)
(function setupIntroOnLoadOnly() {
  const body = document.body;
  if (!body) return;

  body.classList.add("intro-on");
})();

// 04. Section reveal observer (after hero)
(function setupSectionRevealOnceAfterHero() {
  const body = document.body;
  const hero = document.getElementById("hero");
  const allSections = Array.from(document.querySelectorAll("section"));
  if (!body || !hero || allSections.length === 0) return;

  const heroIndex = allSections.indexOf(hero);
  if (heroIndex < 0) return;

  // hanya section setelah Hero (section 1-2 tidak disentuh)
  const revealSections = allSections.slice(heroIndex + 1);
  if (revealSections.length === 0) return;

  body.classList.add("reveal-ready");

  revealSections.forEach((section, index) => {
    section.classList.add("section-reveal");
    section.style.setProperty("--reveal-order", String(index));
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // sekali jalan: setelah muncul, tidak replay saat scroll balik
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -12% 0px",
    },
  );

  revealSections.forEach((section) => observer.observe(section));
})();

// 05. Auto-typing code showcase
(function () {
  const el = document.getElementById("auto-code");
  if (!el) return;

  const stream = [
    { text: "const", cls: "tk-keyword" },
    { text: " stack ", cls: "tk-name" },
    { text: "= {\n", cls: "" },

    { text: "  go: ", cls: "tk-prop" },
    { text: '["Gin", "Fiber"],\n', cls: "tk-string" },

    { text: "  node: ", cls: "tk-prop" },
    { text: '"NestJS",\n', cls: "tk-string" },

    { text: "  db: ", cls: "tk-prop" },
    { text: '"PostgreSQL",\n', cls: "tk-string" },

    { text: "  architecture: ", cls: "tk-prop" },
    { text: '"Microservices",\n', cls: "tk-string" },

    { text: "  scaling: ", cls: "tk-prop" },
    { text: '"Docker"\n', cls: "tk-string" },

    { text: "};", cls: "" },
  ];

  const speed = 28;
  const hold = 1400;

  let tokenIndex = 0;
  let charIndex = 0;
  let html = "";

  function esc(ch) {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return ch;
  }

  function render() {
    el.innerHTML = html + '<span class="cursor">|</span>';
  }

  function type() {
    if (tokenIndex >= stream.length) {
      setTimeout(() => {
        tokenIndex = 0;
        charIndex = 0;
        html = "";
        render();
        type();
      }, hold);
      return;
    }

    const token = stream[tokenIndex];
    const ch = token.text[charIndex];

    if (token.cls) {
      html += '<span class="' + token.cls + '">' + esc(ch) + "</span>";
    } else {
      html += esc(ch);
    }

    charIndex += 1;

    if (charIndex >= token.text.length) {
      tokenIndex += 1;
      charIndex = 0;
    }

    render();
    setTimeout(type, speed);
  }

  type();
})();
