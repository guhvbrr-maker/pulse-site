/* ==================== 
   JS - Brasa Artesanal Hamburgueria
==================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==================== CONFIGURAÇÃO DO WHATSAPP ==================== */
    // 1. Digite seu número aqui (apenas números, com código do país e DDD)
    const WHATSAPP_NUMBER = '5544991310383'; 
    
    // 2. URL base do WhatsApp
    const WHATSAPP_BASE_URL = 'https://wa.me/';

    // 3. Mensagem padrão para botões gerais
    const DEFAULT_MESSAGE = 'Oi Rafael, quero fazer um pedido! 🍔';


    /* ==================== ATUALIZAÇÃO DOS LINKS (BOTÕES) ==================== */

    // TIPO 1: Botões Genéricos (Hero, Footer, Botão Flutuante, CTA)
    // Procura por qualquer tag com a classe .btn-whatsapp-geral
    const generalWaButtons = document.querySelectorAll('.btn-whatsapp-geral');
    const encodedDefaultMessage = encodeURIComponent(DEFAULT_MESSAGE);
    const generalWaLink = `${WHATSAPP_BASE_URL}${WHATSAPP_NUMBER}?text=${encodedDefaultMessage}`;
    
    generalWaButtons.forEach(button => {
        button.href = generalWaLink;
        // Garante que abra em nova aba
        button.target = '_blank'; 
    });


    // TIPO 2: Botão Específico do Combo Duplo
    // Procura pelo ID #btn-combo-duplo
    const btnComboDuplo = document.getElementById('btn-combo-duplo');
    if (btnComboDuplo) {
        const comboMessage = 'Oi Rafael, vi no site e quero pedir o *Combo Brasa Duplo* 🍔🔥';
        const encodedComboMessage = encodeURIComponent(comboMessage);
        btnComboDuplo.href = `${WHATSAPP_BASE_URL}${WHATSAPP_NUMBER}?text=${encodedComboMessage}`;
    }


    // TIPO 3: Botões do Cardápio (Itens Individuais)
    // Pega o nome do produto automaticamente do atributo data-produto
    const itemButtons = document.querySelectorAll('.btn-pedir-item');
    itemButtons.forEach(button => {
        const productName = button.getAttribute('data-produto');
        
        if (productName) {
            const itemMessage = `Oi Rafael, quero pedir o *${productName}* que vi no cardápio! 🍔`;
            const encodedItemMessage = encodeURIComponent(itemMessage);
            button.href = `${WHATSAPP_BASE_URL}${WHATSAPP_NUMBER}?text=${encodedItemMessage}`;
        }
    });


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


    /* ==================== ROLAGEM SUAVE ==================== */
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


    /* ==================== ANIMAÇÃO DE ENTRADA (SCROLL) ==================== */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        animatedElements.forEach(element => {
            element.classList.add('visible');
        });
    }
});