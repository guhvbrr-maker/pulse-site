document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CONFIGURAÇÃO WHATSAPP
    const whatsappNumber = '5544991310383'; // Apenas números
    const whatsappBaseURL = `https://wa.me/${whatsappNumber}`;

    function openWhatsApp(msg) {
        const url = `${whatsappBaseURL}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    }

    // Event Listener para todos os botões de WhatsApp
    document.querySelectorAll('.btn-whatsapp-generic').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = btn.getAttribute('data-message') || "Olá, vim pelo site da Urban.";
            openWhatsApp(msg);
        });
    });

    // 2. MENU MOBILE
    const menuBtn = document.querySelector('.menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 3. SCROLL HEADER (Muda cor ao rolar)
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. ACCORDION (FAQ)
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // Fecha outros abertos (opcional, para comportamento "apenas um aberto")
            accordions.forEach(item => {
                if (item !== acc) item.classList.remove('active');
            });
            
            acc.classList.toggle('active');
        });
    });

    // 5. ANIMAÇÃO AO SCROLL (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-up').forEach(el => {
        observer.observe(el);
    });

});