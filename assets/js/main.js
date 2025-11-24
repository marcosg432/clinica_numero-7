const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav[data-mobile="true"]');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.classList.toggle('is-open', isOpen);
  });
}

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^\d()+\s-]/g, '');
  });
});





