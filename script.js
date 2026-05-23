// 01. Hamburger Menu Toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-links a");

if (hamburgerBtn && navMenu) {
  // Toggle menu on hamburger click
  hamburgerBtn.addEventListener("click", function () {
    hamburgerBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      hamburgerBtn.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      hamburgerBtn.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// 02. CTA hover tilt interaction
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

// 03. Navbar scroll state
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

// 04. Intro animation trigger (first load)
(function setupIntroOnLoadOnly() {
  const body = document.body;
  if (!body) return;

  body.classList.add("intro-on");
})();

// 05. Section reveal observer (after hero)
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

// 05. Homepage inline chat widget - FormSubmit.co version with AJAX
(function setupHomepageChat() {
  const form = document.getElementById('siteChatForm');
  if (!form) return;

  const statusText = document.getElementById('siteChatStatus');
  const hintText = document.getElementById('siteChatHint');
  const sendBtn = document.getElementById('siteChatSendBtn');

  function setStatus(text, isError = false) {
    if (statusText) {
      statusText.textContent = text;
      statusText.classList.toggle('error', isError);
    }
    if (hintText) {
      hintText.textContent = text;
      hintText.classList.toggle('error', isError);
    }
  }

  function showSuccessNotification() {
    const notification = document.getElementById('successNotification');
    if (notification) {
      notification.style.display = 'flex';
    }
  }

  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    sendBtn.disabled = true;
    setStatus('Mengirim pesan...');

    // Prepare form data
    const formData = new FormData(form);
    
    // Add FormSubmit.co configuration
    formData.append('_subject', 'Pesan Baru dari Portfolio Website');
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    try {
      // Submit to FormSubmit.co
      const response = await fetch('https://formsubmit.co/fahmirizki.xf@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success!
        form.reset();
        setStatus('Pesan berhasil dikirim!');
        showSuccessNotification();
      } else {
        throw new Error('Gagal mengirim pesan');
      }
    } catch (error) {
      setStatus('Gagal mengirim pesan. Coba lagi.', true);
      console.error('Error:', error);
    } finally {
      sendBtn.disabled = false;
    }
  });

  // Initial status
  setStatus('Siap mengirim.');
})();

// Close notification function
function closeNotification() {
  const notification = document.getElementById('successNotification');
  if (notification) {
    notification.style.display = 'none';
  }
}




// 06. Scroll Progress Bar
(function setupScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  }

  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();
})();

// 07. Back to Top Button
(function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();
})();

// 08. Animated Stats Counter
(function setupStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length === 0) return;

  let hasAnimated = false;

  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = current;
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);
  }

  function checkStatsInView() {
    if (hasAnimated) return;

    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isInView) {
      hasAnimated = true;
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateValue(stat, 0, target, 2000);
      });
    }
  }

  window.addEventListener('scroll', checkStatsInView);
  checkStatsInView();
})();
