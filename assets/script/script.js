// =========================================
// HEADER PRINCIPAL E MENU MOBILE
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const btnMobile = document.getElementById('btn-abrir-menu'); // O botão único (Hambúrguer/X)
    const navMenu = document.getElementById('menu-mobile');
    const navLinks = document.querySelectorAll('.nav-link, .btn-cta-header');

    // 1. Lógica do Header Fixo e Transparente (Performance Scroll)
    if (header) {
        window.addEventListener('scroll', () => {
            // Se rolou mais de 50px, adiciona o fundo de vidro (scrolled)
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true }); // passive: true melhora muito o Google PageSpeed
    }

    // 2. Função Única para Alternar Menu (Abrir e Fechar)
    function alternarMenu() {
        if (!navMenu || !btnMobile) return; // Trava de segurança Sênior

        // Alterna a classe 'ativo' tanto no Menu (aparece a tela) quanto no Botão (vira o X)
        navMenu.classList.toggle('ativo');
        btnMobile.classList.toggle('ativo');

        // Verifica se ficou aberto ou fechado após o toggle
        const estaAberto = navMenu.classList.contains('ativo');
        
        // Atualiza acessibilidade e trava o scroll do fundo
        btnMobile.setAttribute('aria-expanded', estaAberto);
        document.body.style.overflow = estaAberto ? 'hidden' : '';
    }

    // 3. Evento de Clique no Botão Mobile
    if (btnMobile) {
        btnMobile.addEventListener('click', alternarMenu);
    }

    // 4. Fechar menu e animar ao clicar num link (UX Premium)
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Apenas aplica a lógica se o menu mobile estiver ativo na tela
                if (navMenu && navMenu.classList.contains('ativo')) {
                    // Adiciona classe de animação tátil no link clicado
                    this.classList.add('clicked');

                    // Aguarda a animação visual (300ms) antes de fechar o menu
                    setTimeout(() => {
                        alternarMenu(); // Chama a função que fecha a tela e destrava o scroll
                        this.classList.remove('clicked'); // Limpa a classe para o próximo clique
                    }, 300);
                }
            });
        });
    }
});
// =========================================
// INTERAÇÕES PREMIUM: SEÇÃO MANIFESTO
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica do Botão Magnético (Hover Tracking)
    // O botão segue levemente a posição do cursor quando o mouse passa por cima dele
    const btnMagnetico = document.querySelector('.btn-magnetico');

    if (btnMagnetico && window.matchMedia("(pointer: fine)").matches) {
        btnMagnetico.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            // Calcula a posição do mouse em relação ao centro do botão
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move o botão 30% da distância do mouse (Efeito sutil e não quebra layout)
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btnMagnetico.addEventListener('mouseleave', function () {
            // Volta para a posição original de forma suave
            this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.style.transform = `translate(0px, 0px)`;

            // Remove a transição depois para evitar lag no próximo mousemove
            setTimeout(() => {
                this.style.transition = 'none';
            }, 400);
        });
    }

    // 2. Observer para a Máscara da Imagem do Manifesto
    // Adiciona a classe '.ativo' assim que a imagem entra na tela
    const imagemMascara = document.querySelector('.reveal-imagem-mascara');

    if (imagemMascara) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ativo');
                    observer.unobserve(entry.target); // Roda só uma vez para performance
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Dispara quando 20% da imagem aparece
        });

        imgObserver.observe(imagemMascara);
    }
});
// =========================================
// INTERAÇÕES PREMIUM: EFEITO 3D TILT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const tiltCard = document.getElementById('img-tilt');

    // Executa apenas se o dispositivo tiver mouse preciso (evita bugs no mobile)
    if (tiltCard && window.matchMedia("(pointer: fine)").matches) {

        tiltCard.addEventListener('mousemove', function (e) {
            // Remove a transição para seguir o mouse instantaneamente
            this.style.transition = 'none';

            // Pega as dimensões e posição da imagem
            const rect = this.getBoundingClientRect();

            // Posição do cursor em relação à imagem
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Encontra o centro da imagem
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calcula a inclinação (Multiplicador define a força do efeito. 5 é elegante)
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            // Aplica a transformação via GPU
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Intensifica a sombra oposta à inclinação para mais realismo
            this.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2 + 30}px 60px rgba(58, 53, 53, 0.15)`;
        });

        // Quando o mouse sai, volta a imagem para a posição original suavemente
        tiltCard.addEventListener('mouseleave', function () {
            this.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease';
            this.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            this.style.boxShadow = `0 30px 60px rgba(58, 53, 53, 0.1)`;
        });
    }
});
// =========================================
// FORMULÁRIO VIP: INTELIGÊNCIA DE ENVIO WHATSAPP
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const formVip = document.getElementById('form-vip-whatsapp');
    const aceiteValor = document.getElementById('aceite-valor');
    const btnSubmit = document.getElementById('btn-enviar-vip');

    if (formVip && aceiteValor && btnSubmit) {

        // 1. Libera o botão apenas se concordar com o valor base (Filtro Anti-Curioso)
        aceiteValor.addEventListener('change', function () {
            btnSubmit.disabled = !this.checked;
        });

        // 2. Lógica de Envio e Montagem da Mensagem Dinâmica
        formVip.addEventListener('submit', function (e) {
            e.preventDefault(); // Impede a página de recarregar

            // Coleta os dados digitados
            const nome = document.getElementById('nome-paciente').value.trim();
            const whats = document.getElementById('whats-paciente').value.trim();

            // Pega o valor do card (radio button) que foi selecionado
            const interesseSelecionado = document.querySelector('input[name="interesse"]:checked');

            if (!interesseSelecionado) {
                alert("Por favor, selecione qual protocolo você deseja na lista acima.");
                return;
            }

            const interesse = interesseSelecionado.value;

            // Formata a mensagem premium para chegar na secretária
            const mensagemBase = `Olá, equipe da Dra. Dainara Freire! ✨%0A%0AMe chamo *${nome}* (WhatsApp: ${whats}) e acabei de solicitar um atendimento através do site.%0A%0A📌 *O que desejo realçar:* ${interesse}.%0A%0A✅ Confirmo que li sobre os investimentos a partir de R$ 850 e gostaria de agendar minha avaliação para alinhar meu protocolo.`;

            // O NÚMERO DO WHATSAPP DA CLÍNICA VAI AQUI (Somente números, ex: 5511999999999)
            const numeroClinica = "5500000000000";

            // Cria o link final da API do WhatsApp
            const urlWhatsApp = `https://wa.me/${numeroClinica}?text=${mensagemBase}`;

            // Abre o WhatsApp numa nova aba
            window.open(urlWhatsApp, '_blank');
        });

        // 3. Máscara Básica para o Input de Telefone (Melhoria de UX)
        const whatsInput = document.getElementById('whats-paciente');
        whatsInput.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }
});
// =========================================
// INTERAÇÕES PREMIUM: SCROLL PARALLAX
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const parallaxImg = document.querySelector('.tech-bg img');
    const secaoTech = document.getElementById('tecnologia');

    if (parallaxImg && secaoTech) {

        // Usamos requestAnimationFrame para não matar o PageSpeed no scroll
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Verifica se a seção está visível na tela
                    const rect = secaoTech.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top <= windowHeight && rect.bottom >= 0) {
                        // Calcula a porcentagem de scroll dentro da seção
                        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);

                        // Move a imagem de -10% a 10% no eixo Y (Efeito cinematográfico lento)
                        const translateY = (scrollPercent * 20) - 10;

                        parallaxImg.style.transform = `translateY(${translateY}%)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
});
// =========================================
// SOCIAL WALL: LÓGICA DO SLIDER ANTES/DEPOIS
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const containersCompara = document.querySelectorAll('.compara-container');

    containersCompara.forEach(container => {
        const slider = container.querySelector('.slider-compara');

        if (slider) {
            slider.addEventListener('input', (e) => {
                // requestAnimationFrame garante que o CSS atualize na mesma taxa de Hz do monitor
                requestAnimationFrame(() => {
                    container.style.setProperty('--position', `${e.target.value}%`);
                });
            });
        }
    });
});
// =========================================
// DEPOIMENTOS: MARQUEE INFINITO + DRAG TÁTIL
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('depoimentos-marquee');
    const track = document.getElementById('marquee-track');

    if (!slider || !track) return;

    // 1. Clona os cards originais para criar o loop infinito real
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    // Variáveis de controle
    let isDown = false;
    let startX;
    let scrollLeft;
    let isHovered = false;
    let animationId;

    // Velocidade do auto-scroll (Aumente para ir mais rápido)
    const speed = 1;

    // 2. Motor de Auto-Scroll (requestAnimationFrame)
    function playMarquee() {
        // Só move automaticamente se não estiver com mouse em cima e não estiver arrastando
        if (!isHovered && !isDown) {
            slider.scrollLeft += speed;

            // Se chegou na metade da pista (onde termina o conteúdo original e começam os clones)
            // Ele reseta a posição para 0 de forma invisível
            if (slider.scrollLeft >= track.scrollWidth / 2) {
                slider.scrollLeft = 0;
            }
        }
        animationId = requestAnimationFrame(playMarquee);
    }

    // Inicia a animação
    playMarquee();

    // 3. Eventos de Mouse (Desktop Drag & Drop)
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        // Pega a posição inicial do clique em relação ao slider
        startX = e.pageX - slider.offsetLeft;
        // Guarda a posição do scroll atual
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        isHovered = false; // Volta a rolar automaticamente se o mouse sair
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Se não estiver segurando o clique, não faz nada
        e.preventDefault(); // Evita comportamentos padrão do navegador

        const x = e.pageX - slider.offsetLeft;
        // Multiplica por 2 para o arraste ser mais rápido que o movimento do mouse
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;

        // Mantém a ilusão de loop infinito mesmo enquanto arrasta
        if (slider.scrollLeft >= track.scrollWidth / 2) {
            slider.scrollLeft = 0;
            startX = e.pageX - slider.offsetLeft; // Reseta a âncora de arraste
            scrollLeft = slider.scrollLeft;
        } else if (slider.scrollLeft <= 0) {
            slider.scrollLeft = track.scrollWidth / 2;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        }
    });

    // 4. Eventos de Hover (Pausar ao ler)
    slider.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    // 5. Otimização para Mobile (Touch Events)
    // No celular, o toque nativo já faz o scroll e pausa a animação naturalmente.
    slider.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
    slider.addEventListener('touchend', () => { isHovered = false; }, { passive: true });
});
// =========================================
// GALERIA EDITORIAL E LIGHTBOX
// =========================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. Observer do Título (Word Reveal)
    const tituloAnimado = document.getElementById('titulo-animado');

    if (tituloAnimado) {
        const tituloObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ativo');
                    observer.unobserve(entry.target); // Anima só uma vez
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px', // Aciona um pouco antes de aparecer totalmente
            threshold: 0.1
        });

        tituloObserver.observe(tituloAnimado);
    }

    // 2. Lógica do Lightbox (Zoom nas Imagens)
    const modal = document.getElementById('lightbox');
    const modalImg = document.getElementById('lightbox-img');
    const btnFechar = document.querySelector('.lightbox-fechar');
    const imagensGaleria = document.querySelectorAll('.resultado-imagem-box');

    if (modal && modalImg && btnFechar) {

        imagensGaleria.forEach(box => {
            box.addEventListener('click', function () {
                const imgSource = this.querySelector('img').src;
                modalImg.src = imgSource;
                modal.classList.add('ativo');
                document.body.style.overflow = 'hidden'; // Trava rolagem do fundo
            });
        });

        const fecharLightbox = () => {
            modal.classList.remove('ativo');
            document.body.style.overflow = '';
            setTimeout(() => { modalImg.src = ''; }, 300);
        };

        btnFechar.addEventListener('click', fecharLightbox);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) fecharLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('ativo')) fecharLightbox();
        });
    }
});
// =========================================
// FAQ ACCORDION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const faqItens = document.querySelectorAll('.faq-item');

    faqItens.forEach(item => {
        const btnPergunta = item.querySelector('.faq-pergunta');

        btnPergunta.addEventListener('click', () => {
            const estaAberto = item.classList.contains('ativo');

            // Opcional: Fecha todos os outros antes de abrir o clicado
            // (Isso mantém o site limpo e não empurra a tela infinitamente pra baixo)
            faqItens.forEach(faq => {
                faq.classList.remove('ativo');
                faq.querySelector('.faq-pergunta').setAttribute('aria-expanded', 'false');
            });

            // Se não estava aberto, agora abre
            if (!estaAberto) {
                item.classList.add('ativo');
                btnPergunta.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
// Atualiza o ano automaticamente no rodapé para nunca ficar com cara de site desatualizado
document.addEventListener('DOMContentLoaded', () => {
    const spanAno = document.getElementById('ano-atual');
    if (spanAno) {
        spanAno.textContent = new Date().getFullYear();
    }
});