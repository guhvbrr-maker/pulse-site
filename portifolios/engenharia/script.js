
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // CONFIGURAÇÃO GERAL
    // ==========================================
    const phoneRaw = "5519997776655"; // Número para API do WhatsApp

    // ==========================================
    // 1. MENU MOBILE
    // ==========================================
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navbar.classList.toggle("active");
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navbar.classList.remove("active");
        });
    });

    // ==========================================
    // 2. ROLAGEM SUAVE (SMOOTH SCROLL)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ==========================================
    // 3. BOTÕES DE WHATSAPP DINÂMICOS
    // ==========================================
    const openWhatsApp = (message) => {
        const url = `https://wa.me/${phoneRaw}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // Mapeamento de classes para mensagens
    const whatsappActions = [
        { selector: '.btn-whatsapp-header', msg: "Olá Henrique, vi seu site e gostaria de um orçamento." },
        { selector: '.btn-whatsapp-hero', msg: "Olá Henrique, preciso de um orçamento para minha obra." },
        { selector: '.btn-servico-calculo', msg: "Oi Henrique, tenho interesse em Cálculo Estrutural." },
        { selector: '.btn-servico-obra', msg: "Oi Henrique, tenho interesse em Gerenciamento de Obra." },
        { selector: '.btn-whatsapp-geral', msg: "Oi Henrique, gostaria de entender como funciona o seu trabalho para minha obra." },
        { selector: '.btn-whatsapp-modal', msg: "Olá, vi um projeto no seu site e gostaria de algo similar." },
        { selector: '.btn-whatsapp-arq', msg: "Olá Henrique, sou arquiteto e gostaria de conversar sobre parceria." },
        { selector: '.fab-whatsapp', msg: "Oi Henrique, vi seu site no celular e quero falar sobre minha obra." }
    ];

    whatsappActions.forEach(item => {
        const btns = document.querySelectorAll(item.selector);
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openWhatsApp(item.msg);
            });
        });
    });

    // ==========================================
    // 4. FILTRO DE PROJETOS
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 5. MODAL DE DETALHES
    // ==========================================
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const closeModal = document.querySelector(".close-modal");
    const detailBtns = document.querySelectorAll(".project-details-btn");

    detailBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const title = btn.getAttribute("data-title");
            const desc = btn.getAttribute("data-desc");

            modalTitle.textContent = title;
            modalDesc.textContent = desc;

            modal.style.display = "flex";
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // ==========================================
    // 6. ANIMAÇÕES AO ROLAR (INTERSECTION OBSERVER)
    // ==========================================
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(section => {
        observer.observe(section);
    });
});