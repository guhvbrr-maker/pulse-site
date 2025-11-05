// Configurações principais
const WHATSAPP_NUMBER = "55SEU_NUMERO_AQUI"; // ex: 5544999998888
const WHATSAPP_MESSAGE_DEFAULT =
  "Olá, vi o site da Pulse e quero saber mais sobre um site profissional para o meu negócio.";

/**
 * [MELHORIA UX] Abre WhatsApp com mensagem dinâmica
 * @param {Event} event O evento do clique
 */
function openWhatsApp(event) {
  let message = WHATSAPP_MESSAGE_DEFAULT;
  const clickedEl = event.currentTarget;

  // Verifica se o elemento clicado tem uma mensagem personalizada
  if (clickedEl && clickedEl.dataset.message) {
    message = clickedEl.dataset.message;
  }

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank", "noopener");
  
  // Exemplo: se usar Pixel depois -> fbq('track', 'Contact');
}

/**
 * Scroll suave para alvo
 * @param {string} selector 
 */
function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Lógica principal do site
 */
document.addEventListener("DOMContentLoaded", () => {
  
  // ================================================
  // GERAL
  // ================================================

  // Botões que abrem o WhatsApp
  document.querySelectorAll(".js-open-whatsapp").forEach((btn) => {
    btn.addEventListener("click", (e) => openWhatsApp(e));
  });

  // Botões de scroll
  document.querySelectorAll(".js-scroll-to").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.dataset.target || btn.getAttribute("href");
      if (target) scrollToTarget(target);
    });
  });

  // Ano do rodapé
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ================================================
  // ACESSIBILIDADE (A11y)
  // ================================================

  // --- Menu Mobile Acessível ---
  const toggle = document.querySelector(".navbar__toggle");
  const mobileMenu = document.getElementById("navbarMobile");
  
  if (toggle && mobileMenu) {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let firstFocusableEl;
    let lastFocusableEl;

    const setFocusableElements = () => {
      const focusableEls = mobileMenu.querySelectorAll(focusableElements);
      firstFocusableEl = focusableEls[0];
      lastFocusableEl = focusableEls[focusableEls.length - 1];
    };
    
    const openMenu = () => {
      mobileMenu.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      setFocusableElements();
      firstFocusableEl.focus();
    };

    const closeMenu = (returnFocus = true) => {
      mobileMenu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) {
        toggle.focus();
      }
    };
    
    toggle.addEventListener("click", () => {
      const isOpening = !mobileMenu.classList.contains("open");
      if (isOpening) {
        openMenu();
      } else {
        closeMenu();
      }
    });

    mobileMenu.querySelectorAll(".js-close-mobile").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
        closeMenu();
      }
    });
    
    mobileMenu.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) { 
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus();
          e.preventDefault();
        }
      }
    });
  }

  // --- Verificação de Movimento Reduzido ---
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ================================================
  // ANIMAÇÕES
  // ================================================

  // --- Animações de Scroll (IntersectionObserver) ---
  const animatedEls = document.querySelectorAll(".animated, .animated--stagger");

  if (!motionQuery.matches) {
    // Se o usuário quer movimento, animamos
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
      }
    );
    animatedEls.forEach((el) => observer.observe(el));
  } else {
    // Se não quer movimento, apenas tornamos tudo visível
    animatedEls.forEach((el) => el.classList.add("is-visible"));
  }
  

  // --- Animação 3D Tilt ---
  // (A função initTilt já tem a verificação de 'motionQuery' dentro dela)
  initTilt(".card-3d");
});


/**
 * Inicializa o Efeito 3D Tilt
 * @param {string} selector 
 */
function initTilt(selector) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motionQuery.matches) return;

  const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!pointerQuery.matches) return;

  const cards = document.querySelectorAll(selector);
  const maxRotate = 8; // graus

  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      const rotateY = ((x - bounds.width / 2) / bounds.width) * -maxRotate;
      const rotateX = ((y - bounds.height / 2) / bounds.height) * maxRotate;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
      card.classList.remove("is-tilting");
    });

    card.addEventListener("pointerdown", () => {
      card.style.transform += " scale(0.99)";
    });

    card.addEventListener("pointerup", () => {
      card.style.transform = card.style.transform.replace(" scale(0.99)", "");
    });
  });
}