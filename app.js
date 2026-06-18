document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // CONFIGURATION & CONSTANTS
    // ==========================================================================
    const TICKET_PRICE = 0.10;
    let currentQuantity = 100;

    // Dummy user database for "Meus Títulos" lookup simulator
    const mockUsers = {
        '11999999999': {
            name: 'José da Silva',
            tickets: ['029481', '029482', '029483', '122890', '169976'],
            date: '18/06/2026',
            status: 'Aprovado via PIX'
        },
        '11988888888': {
            name: 'Kauan Mendes',
            tickets: ['884729', '884730'],
            date: '17/06/2026',
            status: 'Aprovado via PIX'
        }
    };

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    // Selector elements
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const quickButtons = document.querySelectorAll('.quick-select-btn');
    const comboCards = document.querySelectorAll('.combo-card');
    const ctaTotalPrice = document.getElementById('cta-total-price');
    const ctaPurchaseBtn = document.getElementById('cta-purchase');

    // Accordions
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // Modals
    const btnMyTickets = document.getElementById('btnMyTickets');
    const modalMyTickets = document.getElementById('modalMyTickets');
    const closeMyTickets = document.getElementById('closeMyTickets');
    const btnSearchSubmit = document.getElementById('btnSearchSubmit');
    const searchPhoneInput = document.getElementById('search-phone');
    const searchResults = document.getElementById('search-results');

    const modalCheckout = document.getElementById('modalCheckout');
    const closeCheckout = document.getElementById('closeCheckout');
    const formCheckout = document.getElementById('form-checkout');
    const checkoutStep1 = document.getElementById('checkout-step-1');
    const checkoutStep2 = document.getElementById('checkout-step-2');
    const userNameInput = document.getElementById('user-name');
    const userPhoneInput = document.getElementById('user-phone');
    
    // Summary inside checkout
    const summaryQty = document.getElementById('summary-qty');
    const summaryTotal = document.getElementById('summary-total');
    
    // PIX Elements
    const pixTimer = document.getElementById('pix-timer');
    const btnCopyPix = document.getElementById('btnCopyPix');
    const pixCodeInput = document.getElementById('pix-code');

    // ==========================================================================
    // EVENT LISTENERS & FUNCTIONALITY
    // ==========================================================================

    // Dynamic Price Calculation
    function updatePricing(quantity) {
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        }
        currentQuantity = quantity;
        qtyInput.value = quantity;
        
        const total = quantity * TICKET_PRICE;
        ctaTotalPrice.textContent = formatCurrency(total);

        // Update active state in grid buttons
        quickButtons.forEach(btn => {
            const amount = parseInt(btn.dataset.amount);
            if (amount === quantity) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update active state in combo cards
        comboCards.forEach(card => {
            const amount = parseInt(card.dataset.amount);
            if (amount === quantity) {
                card.classList.add('highlighted');
            } else {
                card.classList.remove('highlighted');
            }
        });
    }

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Input handlers
    qtyInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        updatePricing(val);
    });

    qtyMinus.addEventListener('click', () => {
        if (currentQuantity > 1) {
            updatePricing(currentQuantity - 1);
        }
    });

    qtyPlus.addEventListener('click', () => {
        updatePricing(currentQuantity + 1);
    });

    // Quick select buttons
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.dataset.amount);
            updatePricing(amount);
            
            // Subtle click scale effect
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = ''; }, 100);
        });
    });

    // Combo Cards
    comboCards.forEach(card => {
        card.addEventListener('click', () => {
            const amount = parseInt(card.dataset.amount);
            updatePricing(amount);
        });
    });

    // ==========================================================================
    // ACCORDIONS
    // ==========================================================================
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const targetId = header.getAttribute('aria-controls');
            const targetContent = document.getElementById(targetId);

            // Close all other accordions for compact clean view
            accordionHeaders.forEach(h => {
                if (h !== header) {
                    h.setAttribute('aria-expanded', 'false');
                    const c = document.getElementById(h.getAttribute('aria-controls'));
                    c.style.maxHeight = null;
                }
            });

            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                targetContent.style.maxHeight = null;
            } else {
                header.setAttribute('aria-expanded', 'true');
                targetContent.style.maxHeight = targetContent.scrollHeight + "px";
            }
        });
    });

    // ==========================================================================
    // MODALS FLOW
    // ==========================================================================
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Modal "Meus Títulos"
    btnMyTickets.addEventListener('click', () => {
        openModal(modalMyTickets);
        searchResults.classList.add('hidden');
        searchPhoneInput.value = '';
    });
    
    closeMyTickets.addEventListener('click', () => closeModal(modalMyTickets));

    // Search action simulator
    btnSearchSubmit.addEventListener('click', () => {
        const rawPhone = searchPhoneInput.value.replace(/\D/g, '');
        searchResults.classList.remove('hidden');
        
        if (mockUsers[rawPhone]) {
            const user = mockUsers[rawPhone];
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <div class="result-header">
                        <span>${user.name}</span>
                        <span class="result-status">✅ ${user.status}</span>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-secondary);">Comprado em: ${user.date}</p>
                    <div class="result-tickets-list">
                        ${user.tickets.map(ticket => `<span class="result-ticket-badge">${ticket}</span>`).join('')}
                    </div>
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <div class="search-result-item text-center" style="border-color: var(--danger);">
                    <p style="color: var(--danger); font-weight: 700;">Nenhum bilhete encontrado</p>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">
                        Verifique se digitou o telefone corretamente com o DDD (Ex: 11999999999).
                    </p>
                </div>
            `;
        }
    });

    // Format phone mask dynamically
    const applyPhoneMask = (input) => {
        input.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    };
    applyPhoneMask(searchPhoneInput);
    applyPhoneMask(userPhoneInput);

    // ==========================================================================
    // CHECKOUT PROCESS
    // ==========================================================================
    ctaPurchaseBtn.addEventListener('click', () => {
        // Prepare Step 1 summary
        summaryQty.textContent = `${currentQuantity} Títulos`;
        summaryTotal.textContent = formatCurrency(currentQuantity * TICKET_PRICE);
        
        // Setup initial step state
        checkoutStep1.classList.remove('hidden');
        checkoutStep2.classList.add('hidden');
        
        openModal(modalCheckout);
    });

    closeCheckout.addEventListener('click', () => closeModal(modalCheckout));

    // Submit Checkout step 1 -> step 2
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate save purchase database entry
        const phoneKey = userPhoneInput.value.replace(/\D/g, '');
        const nameVal = userNameInput.value;

        // Generate tickets list based on current selection size
        const generatedTickets = [];
        for (let i = 0; i < Math.min(currentQuantity, 10); i++) {
            generatedTickets.push(Math.floor(100000 + Math.random() * 900000).toString());
        }
        if (currentQuantity > 10) {
            generatedTickets.push(`+ ${currentQuantity - 10} mais...`);
        }

        mockUsers[phoneKey] = {
            name: nameVal,
            tickets: generatedTickets,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'Pendente via PIX'
        };

        // Transition layout steps
        checkoutStep1.classList.add('hidden');
        checkoutStep2.classList.remove('hidden');
        
        startTimer(600, pixTimer); // 10 minutes PIX expiration timer
    });

    // Copy Paste PIX button
    btnCopyPix.addEventListener('click', () => {
        pixCodeInput.select();
        pixCodeInput.setSelectionRange(0, 99999); // For mobile devices
        
        navigator.clipboard.writeText(pixCodeInput.value)
            .then(() => {
                btnCopyPix.textContent = 'Copiado!';
                btnCopyPix.style.background = '#ffd700'; // Feedback background
                btnCopyPix.style.color = '#000';
                
                setTimeout(() => {
                    btnCopyPix.textContent = 'Copiar';
                    btnCopyPix.style.background = '';
                    btnCopyPix.style.color = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Falha ao copiar: ', err);
            });
    });

    // Timer simulation utility
    let intervalId = null;
    function startTimer(duration, display) {
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        let timer = duration, minutes, seconds;
        intervalId = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(intervalId);
                display.textContent = "Expirado";
            }
        }, 1000);
    }

    // Modal background click close handler
    window.addEventListener('click', (e) => {
        if (e.target === modalMyTickets) closeModal(modalMyTickets);
        if (e.target === modalCheckout) closeModal(modalCheckout);
    });

    // ==========================================================================
    // THEME TOGGLE (LIGHT / DARK)
    // ==========================================================================
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        btnThemeToggle.textContent = '☀️ Light';
    } else {
        btnThemeToggle.textContent = '🌙 Dark';
    }

    btnThemeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            btnThemeToggle.textContent = '☀️ Light';
        } else {
            localStorage.setItem('theme', 'dark');
            btnThemeToggle.textContent = '🌙 Dark';
        }
    });

    // Initial load setup
    updatePricing(200); // Sets default recommended tickets count
});
