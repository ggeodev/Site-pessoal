document.addEventListener('DOMContentLoaded', () => {
            
    // 1. FÍSICA DO CURSOR CUSTOMIZADO E LUZ DE FUNDO
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const spotlight = document.getElementById('spotlight');
    
    // Estado atual (posição física) do cursor contorno (para fazer o efeito de atraso elástico)
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // A bolinha menor segue instantaneamente
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // A luz de fundo global segue instantaneamente
        spotlight.style.setProperty('--mouse-x', `${posX}px`);
        spotlight.style.setProperty('--mouse-y', `${posY}px`);

        // Animação do contorno elástico (usando requestAnimationFrame para 60fps lisos)
        const animateOutline = () => {
            const distX = posX - outlineX;
            const distY = posY - outlineY;
            
            // O 0.1 define a velocidade (atrito). Quanto menor, mais lento/mais elástico.
            outlineX += distX * 0.15;
            outlineY += distY * 0.15;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            if (Math.abs(distX) > 0.1 || Math.abs(distY) > 0.1) {
                requestAnimationFrame(animateOutline);
            }
        };
        requestAnimationFrame(animateOutline);
    });


    // 2. EFEITO 3D MATEMÁTICO NOS CARTÕES DE PORTFÓLIO
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Pega as dimensões e posições exatas do card na tela
            const rect = card.getBoundingClientRect();
            // Calcula o centro do card
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calcula os graus de rotação (dividido por 10 para suavizar o movimento)
            const rotateX = ((y - centerY) / 10) * -1;
            const rotateY = (x - centerX) / 10;
            
            // Aplica o transform em 3D puramente com CSS e JS
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        // Quando o mouse sai, o cartão volta pro lugar suavemente
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    // 3. OBSERVER: FAZER ELEMENTOS SURGIREM AO ROLAR (SCROLL REVEAL)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15 // Dispara quando 15% do elemento estiver visível
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // 4. VALIDAÇÃO AVANÇADA DE FORMULÁRIO EXIGIDA PELA ATIVIDADE
    const form = document.getElementById('contact-form');
    const alertBox = document.getElementById('alertBox');

    // Função para exibir a caixa de aviso customizada no topo
    function showAlert(message, isError) {
        alertBox.textContent = message;
        if(isError) {
            alertBox.classList.add('error');
        } else {
            alertBox.classList.remove('error');
        }
        
        alertBox.classList.add('show');
        
        // Esconde depois de 4 segundos
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 4000);
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();
        
        // Expressão regular complexa para validar e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validações
        if (nome === '' || email === '' || mensagem === '') {
            showAlert('Falha: Preencha todos os campos vitais.', true);
            return;
        }

        if (!emailRegex.test(email)) {
            showAlert('Falha: Protocolo de e-mail inválido.', true);
            return;
        }

        // Simulação de envio com sucesso!
        showAlert('Requisição enviada com sucesso. Aguarde retorno.', false);
        form.reset();
        
        // Retira o "foco" dos inputs para as labels descerem novamente
        document.querySelectorAll('.input-group input, .input-group textarea').forEach(el => el.blur());
    });
});