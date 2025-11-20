/* ==================== 
   JS - Brasa Artesanal Hamburgueria
==================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================== NÚMERO DE WHATSAPP ==================== */
    // Edite este número para o WhatsApp da sua loja
    const WHATSAPP_NUMBER = '5511999998888';
    const WHATSAPP_BASE_URL = 'https://wa.me/';

    // Mensagem padrão para botões genéricos
    const DEFAULT_MESSAGE = 'Oi Rafael, quero fazer um pedido! 🍔';

    /* ==================== MENU MOBILE (TOGGLE) ==================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            navToggle.classList.toggle('active');
        });
    }

    // Fechar o menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
                navToggle.classList.remove('active');
            }
        });
    });

    /* ==================== HEADER COM EFEITO AO ROLAR ==================== */
    const header = document.getElementById('header');
    
    function scrollHeader() {
        if (window.scrollY >= 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', scrollHeader);

    /* ==================== ROLAGEM SUAVE (SMOOTH SCROLL) ==================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ==================== LINKS DE WHATSAPP DINÂMICOS ==================== */

    // 1. Botões genéricos
    const generalWaButtons = document.querySelectorAll('.btn-whatsapp-geral');
    const encodedDefaultMessage = encodeURIComponent(DEFAULT_MESSAGE);
    const generalWaLink = `${WHATSAPP_BASE_URL}${WHATSAPP_NUMBER}?text=${encodedDefaultMessage}`;
    
    generalWaButtons.forEach(button => {
        button.href = generalWaLink;
    });

    // 2. Botão do Combo Brasa Duplo
    const btnComboDuplo = document.getElementById('btn-combo-duplo');
    if (btnComboDuplo) {
        const comboMessage = 'Oi Rafael, quero pedir o *Combo Brasa Duplo* 🍔🔥';
        const encodedComboMessage = encodeURIComponent(comboMessage);
        btnComboDuplo.href = `${WHATSAPP_BASE_URL}${WHATSAPP_NUMBER}?text=${encodedComboMessage}`;
    }

    // 3. Botões do Cardápio (Itens)
    const itemButtons = document.querySelectorAll('.btn-pedir-item');
    itemButtons.forEach(button => {
        const productName = button.getAttribute('data-produto');
        if (productName) {
            const itemMessage = `Oi Rafael, quero pedir o *${productName}* 🍔`;
            const encodedItemMessage = encodeURIComponent(itemMessage);
            button.href = `${WHATSAPP_BASE_URL}${WHATSAPP_NUMBER}?text=${encodedItemMessage}`;
        }
    });

    /* ==================== ANIMAÇÃO DE ENTRADA AO ROLAR ==================== */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Ativa quando 10% do elemento está visível
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback para navegadores antigos (apenas mostra tudo)
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }
});