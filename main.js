/* ============================================
   MOBILEPULSE - Main JavaScript
   ============================================ */

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('mp-theme', theme);
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark'
      ? '<span>☀️</span><span>Light</span>'
      : '<span>🌙</span><span>Dark</span>';
  }
}

const savedTheme = localStorage.getItem('mp-theme') || 'dark';
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ========== NAVBAR SCROLL ==========
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ========== MOBILE NAV ==========
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const navOverlay = document.getElementById('navOverlay');

function openMobileNav() {
  mobileNav?.classList.add('open');
  navOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileNav?.classList.remove('open');
  navOverlay?.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileNav);
navOverlay?.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', closeMobileNav));

// ========== SEARCH OVERLAY ==========
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchBtn?.addEventListener('click', () => {
  searchOverlay?.classList.add('active');
  setTimeout(() => searchInput?.focus(), 100);
});
searchClose?.addEventListener('click', () => searchOverlay?.classList.remove('active'));
searchOverlay?.addEventListener('click', (e) => {
  if (e.target === searchOverlay) searchOverlay.classList.remove('active');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') searchOverlay?.classList.remove('active');
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchOverlay?.classList.add('active');
    setTimeout(() => searchInput?.focus(), 100);
  }
});

// ========== CATEGORY FILTER ==========
const catChips = document.querySelectorAll('.cat-chip');
catChips.forEach(chip => {
  chip.addEventListener('click', () => {
    catChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filterPosts(chip.dataset.cat);
  });
});

function filterPosts(cat) {
  const cards = document.querySelectorAll('.review-card[data-cat]');
  cards.forEach(card => {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
      card.style.animation = 'fadeSlide 0.3s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// ========== NEWSLETTER ==========
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('🎉 Subscribed! Welcome to MobilePulse.');
  newsletterForm.reset();
});

// ========== TOAST ==========
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('✅ Message sent! We\'ll get back to you soon.');
  contactForm.reset();
});

// ========== SCROLL REVEAL ==========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeSlide 0.5s ease forwards';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.review-card, .strip-card, .team-card, .sidebar-widget').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ========== TICKER DUPLICATION ==========
const tickerInner = document.querySelector('.ticker-inner');
if (tickerInner) {
  tickerInner.innerHTML += tickerInner.innerHTML;
}

// ========== ACTIVE NAV LINK ==========
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ========== SHARE BUTTONS ==========
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    let shareUrl = '';
    if (btn.classList.contains('twitter')) shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    if (btn.classList.contains('facebook')) shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (btn.classList.contains('whatsapp')) shareUrl = `https://wa.me/?text=${title}%20${url}`;
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  });
});

// ========== READING PROGRESS BAR ==========
function createProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'readingProgress';
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: var(--accent); z-index: 9999;
    width: 0%; transition: width 0.1s; pointer-events: none;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(scrolled, 100) + '%';
  });
}
if (document.querySelector('.post-content')) createProgressBar();

// ========== COPY LINK ==========
const copyLinkBtn = document.getElementById('copyLink');
copyLinkBtn?.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).then(() => showToast('🔗 Link copied!'));
});

// ========== LAZY IMAGES (emoji placeholders animate in) ==========
document.querySelectorAll('.card-img, .phone-img-placeholder, .post-hero-img').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'scale(0.97)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'scale(1)';
  }, 100 + Math.random() * 300);
});

// ========== SMOOTH PAGE TRANSITIONS ==========
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    e.preventDefault();
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.2s';
    setTimeout(() => { window.location.href = href; }, 200);
  });
});
window.addEventListener('pageshow', () => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.3s';
});
