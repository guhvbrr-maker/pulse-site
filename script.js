// =========================================
// PULSE SITES - CONVERSION OPTIMIZATION
// Script Principal com Recursos de Urgência e Conversão
// =========================================

// =========================================
// 1. CONFIGURAÇÕES GERAIS & WHATSAPP
// =========================================
const WHATSAPP_NUMBER = "5544991310383";
const WHATSAPP_MESSAGE_DEFAULT = "Olá, vi o site da Pulse e quero saber mais.";

function openWhatsApp(event) {
  let message = WHATSAPP_MESSAGE_DEFAULT;
  const clickedEl = event.currentTarget;
  if (clickedEl && clickedEl.dataset.message) {
    message = clickedEl.dataset.message;
  }
  const encoded = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;
  window.open(url, "_blank", "noopener");
}

function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const headerOffset = 80;
  const elementPosition = el.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
}

// =========================================
// 2. COUNTDOWN TIMER (SEXTA 23:59:59)
// =========================================
function startCountdown() {
  const countdownEl = document.getElementById("countdown-timer");
  if (!countdownEl) return;

  function updateCountdown() {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 (Domingo) - 6 (Sábado)
    
    // Calcular próxima sexta-feira às 23:59:59
    let diasAteSexta = 5 - diaSemana;
    if (diasAteSexta <= 0) {
      diasAteSexta += 7; // Se hoje é sexta, sábado ou domingo, pular para próxima sexta
    }
    
    const proximaSexta = new Date(agora);
    proximaSexta.setDate(agora.getDate() + diasAteSexta);
    proximaSexta.setHours(23, 59, 59, 999);
    
    const diff = proximaSexta - agora;
    
    if (diff <= 0) {
      countdownEl.innerHTML = "⛔ Vagas encerradas! Volte na próxima semana.";
      countdownEl.style.color = "#ef4444";
      return;
    }
    
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diff % (1000 * 60)) / 1000);
    
    let display = "";
    if (dias > 0) {
      display = `⏰ ${dias}d ${horas}h ${minutos}m ${segundos}s até o fim das vagas`;
    } else {
      display = `⏰ ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} até o fim das vagas`;
    }
    
    countdownEl.innerHTML = display;
    
    // Atualizar a cada segundo
    setTimeout(updateCountdown, 1000);
  }
  
  updateCountdown();
}

// =========================================
// 3. LÓGICA DE URGÊNCIA AUTOMÁTICA (VAGAS)
// =========================================
function atualizarVagasAutomaticas() {
  const agora = new Date();
  const diaSemana = agora.getDay();
  const hora = agora.getHours();
  const hoje = agora.toLocaleDateString("pt-BR");

  const vagasSalvas = localStorage.getItem("pulse_vagas_hoje");
  const dataSalva = localStorage.getItem("pulse_data");

  let vagasStatus = "3 VAGAS";
  let msgTopo = "🔥 AGENDA ABERTA: Apenas 3 vagas disponíveis para esta semana.";
  let msgSticky = "🔥 <strong>Restam 3 VAGAS!</strong>";
  let msgFinal = "3 VAGAS";
  let ctaComprarTexto = "RECEBER CLIENTES PELO WHATSAPP";
  let ctaComprarMsg = "Olá! Quero garantir uma das últimas vagas para o meu site.";
  let ctaDuvidaMsg = "Olá Gustavo! Estou em dúvida, pode me ajudar?";
  let esgotado = false;
  let vagasRestantes = 3;

  switch (diaSemana) {
    case 0: // Domingo
    case 6: // Sábado
      esgotado = true;
      break;
    case 1: // Segunda
      vagasStatus = "3 VAGAS";
      vagasRestantes = 3;
      msgTopo = "🔥 AGENDA ABERTA: Apenas 3 vagas disponíveis para esta semana.";
      msgSticky = "🔥 <strong>Restam 3 VAGAS!</strong>";
      msgFinal = "3 VAGAS";
      break;
    case 2: // Terça
    case 3: // Quarta
      vagasStatus = "2 VAGAS";
      vagasRestantes = 2;
      msgTopo = "🔥 ATENÇÃO: Restam apenas 2 vagas para entrega em 72h esta semana.";
      msgSticky = "🔥 <strong>Restam só 2 VAGAS!</strong>";
      msgFinal = "2 VAGAS";
      break;
    case 4: // Quinta
      vagasStatus = "1 VAGA";
      vagasRestantes = 1;
      msgTopo = "🚨 URGENTE: Resta apenas 1 vaga! Garanta agora ou espere a próxima semana.";
      msgSticky = "🚨 <strong>ÚLTIMA VAGA!</strong>";
      msgFinal = "1 VAGA";
      ctaComprarTexto = "GARANTIR ÚLTIMA VAGA";
      break;
    case 5: // Sexta
      if (hora < 12) {
        vagasStatus = "1 VAGA";
        vagasRestantes = 1;
        msgTopo = "🚨 URGENTE: Resta apenas 1 vaga! Garanta agora ou espere a próxima semana.";
        msgSticky = "🚨 <strong>ÚLTIMA VAGA!</strong>";
        msgFinal = "1 VAGA";
        ctaComprarTexto = "GARANTIR ÚLTIMA VAGA";
      } else {
        esgotado = true;
      }
      break;
  }

  // NOVO: Mensagem especial quando restam 1-2 vagas
  if (vagasRestantes <= 2 && vagasRestantes > 0) {
    msgTopo = `🚨 ÚLTIMAS ${vagasRestantes} ${vagasRestantes === 1 ? 'VAGA' : 'VAGAS'} PARA ESTA SEMANA! GARANTA JÁ!`;
    const textoTopo = document.getElementById("vagas-topo");
    if (textoTopo) {
      textoTopo.classList.add("urgency-critical");
    }
  }

  if (esgotado) {
    vagasStatus = "ESGOTADAS";
    msgTopo = "⛔ VAGAS ESGOTADAS! A agenda desta semana lotou. Entre na lista de espera para Segunda.";
    msgSticky = "⛔ <strong>ESGOTADO</strong><br>Lista de espera";
    msgFinal = "ESGOTADAS";
    ctaComprarTexto = "ENTRAR NA LISTA DE ESPERA (Abre Segunda)";
    ctaComprarMsg = "Olá! As vagas da semana acabaram. Quero entrar na lista de espera para segunda-feira.";
    ctaDuvidaMsg = "Olá! Vi que as vagas esgotaram, mas tenho uma dúvida.";
  }

  // Escassez Persistente (Local Storage)
  if (!esgotado && dataSalva === hoje && vagasSalvas) {
    const numeroBase = parseInt(vagasStatus, 10);
    if (Number.isFinite(numeroBase) && numeroBase > 1 && diaSemana >= 1 && diaSemana <= 5) {
      const novoNumero = numeroBase - 1;
      vagasStatus = novoNumero === 1 ? "1 VAGA" : `${novoNumero} VAGAS`;
      vagasRestantes = novoNumero;

      if (novoNumero === 3) {
        msgTopo = "🔥 AGENDA ABERTA: Apenas 3 vagas disponíveis para esta semana.";
        msgSticky = "🔥 <strong>Restam 3 VAGAS!</strong>";
        msgFinal = "3 VAGAS";
      } else if (novoNumero === 2) {
        msgTopo = "🚨 ÚLTIMAS 2 VAGAS PARA ESTA SEMANA! GARANTA JÁ!";
        msgSticky = "🔥 <strong>Restam só 2 VAGAS!</strong>";
        msgFinal = "2 VAGAS";
      } else if (novoNumero === 1) {
        msgTopo = "🚨 ÚLTIMA VAGA PARA ESTA SEMANA! GARANTA JÁ!";
        msgSticky = "🚨 <strong>ÚLTIMA VAGA!</strong>";
        msgFinal = "1 VAGA";
        ctaComprarTexto = "GARANTIR ÚLTIMA VAGA";
      }
    }
  }

  try {
    if (esgotado) {
      localStorage.setItem("pulse_vagas_hoje", "ESGOTADAS");
    } else {
      localStorage.setItem("pulse_vagas_hoje", vagasStatus);
    }
    localStorage.setItem("pulse_data", hoje);
  } catch (e) {
    // Fallback silencioso
  }

  // Atualizar Textos no DOM
  const textoTopo = document.getElementById("vagas-topo");
  const stickyInfo = document.getElementById("sticky-vagas") || document.querySelector(".sticky-mobile-cta .info");
  const vagasFinal = document.getElementById("vagas-restantes-final");
  const avisoPlanos = document.getElementById("aviso-planos");

  if (textoTopo) textoTopo.innerHTML = msgTopo;
  if (stickyInfo) stickyInfo.innerHTML = msgSticky;
  if (vagasFinal) {
    vagasFinal.innerHTML = msgFinal;
    if (esgotado) vagasFinal.style.color = "#ef4444";
  }
  if (avisoPlanos) {
    if (esgotado) {
      avisoPlanos.innerHTML = "⏰ <strong>AGENDA FECHADA.</strong> Entre na lista de espera para garantir sua vaga na próxima semana.";
    } else {
      avisoPlanos.innerHTML = `<strong>AGENDA LIMITADA:</strong> Restam apenas ${vagasStatus}. Garanta a sua!`;
    }
  }

  // Atualizar Botões de Compra
  const ctaComprarBotoes = [
    document.querySelector(".btn-hero"),
    document.getElementById("cta-plano-autoridade"),
    document.getElementById("cta-final-comprar"),
  ];

  ctaComprarBotoes.forEach((btn) => {
    if (btn) {
      btn.innerHTML = ctaComprarTexto;
      btn.setAttribute("data-message", ctaComprarMsg);
      if (esgotado) {
        btn.style.opacity = "0.7";
        btn.style.background = "var(--color-muted)";
        btn.style.borderColor = "var(--color-muted)";
        btn.style.boxShadow = "none";
      }
    }
  });

  const ctaDuvidaFinal = document.getElementById("cta-final-duvida");
  if (ctaDuvidaFinal) {
    ctaDuvidaFinal.setAttribute("data-message", ctaDuvidaMsg);
  }
}

// =========================================
// 4. CALCULADORA DE PERDAS (OTIMIZADA)
// =========================================
function inicializarCalculadora() {
  const ticketInput = document.getElementById("ticket-medio");
  const resultadoAnual = document.getElementById("calculo-anual");
  const ctaCalcButton = document.getElementById("cta-calc-button");
  const ctaCalcValue = document.getElementById("cta-calc-value");

  const calcularPerda = () => {
    if (!ticketInput || !resultadoAnual) return;

    const ticket = parseFloat(ticketInput.value) || 0;
    const vendasPorSemana = 1;
    const semanasPorAno = 52;
    const perdaAnual = ticket * vendasPorSemana * semanasPorAno;

    const formatador = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const valorFormatado = formatador.format(perdaAnual);
    resultadoAnual.textContent = `${valorFormatado} por ano`;

    // Atualizar CTA dinâmico
    if (ctaCalcValue) {
      ctaCalcValue.textContent = valorFormatado;
    }

    if (ctaCalcButton && perdaAnual > 0) {
      const mensagem = `Olá! Vi que estou perdendo ${valorFormatado} por ano e quero resolver isso com um site profissional.`;
      ctaCalcButton.setAttribute("data-message", mensagem);
      
      // Animação visual
      ctaCalcButton.classList.add("animated-currency");
      setTimeout(() => {
        ctaCalcButton.classList.remove("animated-currency");
      }, 1000);
    }

    // Destaque visual
    if (perdaAnual > 0) {
      resultadoAnual.style.color = "#ef4444";
      resultadoAnual.style.fontSize = "1.8rem";
      resultadoAnual.style.fontWeight = "700";
    } else {
      resultadoAnual.style.color = "var(--color-heading)";
      resultadoAnual.style.fontSize = "";
      resultadoAnual.style.fontWeight = "";
    }
  };

  if (ticketInput) {
    ticketInput.addEventListener("input", calcularPerda);
    calcularPerda();
  }
}

// =========================================
// 5. EXIT-INTENT POPUP
// =========================================
function inicializarExitPopup() {
  const exitPopup = document.getElementById("exit-popup");
  const closePopup = document.getElementById("close-popup");
  const denyLink = document.getElementById("deny-popup");
  
  // Verificar se já foi mostrado nas últimas 24h
  const popupLastShown = localStorage.getItem("pulse_exit_popup_shown");
  const agora = Date.now();
  const umDia = 24 * 60 * 60 * 1000;
  
  let popupShown = false;
  
  if (popupLastShown && (agora - parseInt(popupLastShown)) < umDia) {
    return; // Não mostrar se já foi exibido nas últimas 24h
  }

  if (!exitPopup) return;

  const showPopup = () => {
    if (!popupShown) {
      exitPopup.classList.remove("hidden");
      exitPopup.style.display = "flex";
      popupShown = true;
      
      try {
        localStorage.setItem("pulse_exit_popup_shown", agora.toString());
      } catch (e) {
        // Fallback silencioso
      }
      
      const popupBtn = exitPopup.querySelector(".js-open-whatsapp");
      if (popupBtn) {
        popupBtn.addEventListener("click", openWhatsApp);
      }
    }
  };

  const hidePopup = () => {
    exitPopup.classList.add("hidden");
    exitPopup.style.display = "none";
  };

  // Detecção de exit-intent (mouse saindo pela parte superior)
  document.addEventListener("mouseleave", (e) => {
    if (e.clientY < 10 && window.innerWidth >= 768) {
      showPopup();
    }
  });

  // Botão fechar
  if (closePopup) {
    closePopup.addEventListener("click", hidePopup);
  }
  
  // Link "não, obrigado"
  if (denyLink) {
    denyLink.addEventListener("click", (e) => {
      e.preventDefault();
      hidePopup();
    });
  }

  // Fechar ao clicar fora
  exitPopup.addEventListener("click", (e) => {
    if (e.target === exitPopup) {
      hidePopup();
    }
  });
}

// =========================================
// 6. INICIALIZAÇÃO (DOM READY)
// =========================================
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar recursos de conversão
  startCountdown();
  atualizarVagasAutomaticas();
  inicializarCalculadora();
  inicializarExitPopup();

  // =========================================
  // RASTREAMENTO DE BOTÕES (ORIGEM DO LEAD)
  // =========================================
  const botoesWhatsApp = document.querySelectorAll(".js-open-whatsapp");

  if (botoesWhatsApp.length > 0) {
    botoesWhatsApp[0].dataset.message = "Olá Gustavo! Vi o TOPO do site e quero garantir minha vaga.";
  }

  const botaoCalculadora = document.querySelector("#problema .btn--danger.js-open-whatsapp");
  if (botaoCalculadora) {
    botaoCalculadora.dataset.message = "Olá! Vi o prejuízo na Calculadora e quero resolver isso.";
  }

  const botaoPreco = document.getElementById("cta-plano-autoridade");
  if (botaoPreco) {
    botaoPreco.dataset.message = "Olá! Vi o preço de 990 e quero fechar.";
  }

  const botaoFinal = document.getElementById("cta-final-comprar");
  if (botaoFinal) {
    botaoFinal.dataset.message = "Olá! Vi que são as ÚLTIMAS VAGAS e quero garantir.";
  }

  // =========================================
  // LISTENERS GERAIS
  // =========================================
  document.querySelectorAll(".js-open-whatsapp").forEach((btn) => btn.addEventListener("click", openWhatsApp));

  document.querySelectorAll(".js-scroll-to").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = btn.dataset.target || btn.getAttribute("href");
      if (target && target.startsWith("#")) scrollToTarget(target);
    })
  );

  // Footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Menu Mobile
  const toggle = document.querySelector(".navbar__toggle");
  const mobileMenu = document.getElementById("navbarMobile");
  if (toggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("open");
      if (!isOpen) {
        mobileMenu.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      } else {
        closeMenu();
      }
    });
    mobileMenu.querySelectorAll(".js-close-mobile").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900 && mobileMenu.classList.contains("open")) closeMenu();
    });
  }

  // Sticky Mobile CTA
  const stickyCta = document.querySelector(".sticky-mobile-cta");
  if (stickyCta) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) stickyCta.classList.add("visible");
      else stickyCta.classList.remove("visible");
    });
  }

  // Animações de Scroll
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const animatedEls = document.querySelectorAll(".animated, .animated--stagger");
  if (!motionQuery.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    animatedEls.forEach((el) => observer.observe(el));
  } else {
    animatedEls.forEach((el) => el.classList.add("is-visible"));
  }

  // Scripts do Player de Vídeo
  var youtubePlayers = document.querySelectorAll(".youtube-player");
  youtubePlayers.forEach(function (player) {
    var playButton = player.querySelector(".youtube-play-button");
    var youtubeId = player.dataset.youtubeId;
    if (playButton && youtubeId) {
      playButton.addEventListener("click", function () {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://www.youtube.com/embed/" + youtubeId + "?autoplay=1");
        iframe.setAttribute("title", "Apresentação");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
        iframe.setAttribute("allowfullscreen", "");
        player.appendChild(iframe);
        player.classList.add("active");
      });
    }
  });
});
