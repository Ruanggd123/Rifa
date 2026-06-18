document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // CONFIGURATION & CONSTANTS
    // ==========================================================================
    const TICKET_PRICE = 0.10;
    const TOTAL_NUMBERS_AVAILABLE = 507436;
    let currentQuantity = 45;

    // Dummy user database for "Meus Títulos" lookup simulator
    const mockUsers = {
        '11999999999': {
            name: 'Renan & Junior',
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
    // Quantity controls
    const qtyInput = document.getElementById('qty-input');
    const qtyMinus = document.getElementById('qty-minus-icon');
    const qtyPlus = document.getElementById('qty-plus-icon');
    
    // Select items
    const selectItems = document.querySelectorAll('.content-select .select');
    const spinsContents = document.querySelectorAll('.spins-content');
    const boxesContents = document.querySelectorAll('.boxes-content');
    
    // Total prices
    const ctaTotalPrice = document.getElementById('cta-total-price');
    const ctaPurchaseBtn = document.getElementById('cta-purchase');
    
    // Limit alerts
    const numbersRest = document.getElementById('numbersRest');
    const restNumbersSpan = numbersRest.querySelector('.rest-numbers');

    // Accordions
    const btnDescription = document.getElementById('btnDescription');
    const descriptionContent = document.getElementById('description-content');

    // Modals
    const btnMyTickets = document.getElementById('btnMyTickets');
    const modalMyTickets = document.getElementById('modalMyTickets');
    const closeMyTickets = document.getElementById('closeMyTickets');
    const btnSearchSubmit = document.getElementById('btnSearchSubmit');
    const searchPhoneInput = document.getElementById('search-phone');
    const searchResults = document.getElementById('search-results');

    const btnPrizeOpen = document.getElementById('prize-open');
    const modalPrizes = document.getElementById('modal-prizes');
    const btnPrizeClose = document.getElementById('prize-close');

    const modalCheckout = document.getElementById('modalCheckout');
    const closeCheckout = document.getElementById('closeCheckout');
    const formCheckout = document.getElementById('form-checkout');
    const checkoutStep1 = document.getElementById('checkout-step-1');
    const checkoutStep2 = document.getElementById('checkout-step-2');
    const userNameInput = document.getElementById('user-name');
    const userPhoneInput = document.getElementById('user-phone');
    
    // Summary
    const summaryQty = document.getElementById('summary-qty');
    const summaryTotal = document.getElementById('summary-total');
    
    // PIX timer & elements
    const pixTimer = document.getElementById('pix-timer');
    const btnCopyPix = document.getElementById('btnCopyPix');
    const pixCodeInput = document.getElementById('pix-code');

    // ==========================================================================
    // PRICING & SELECTION ENGINE
    // ==========================================================================
    function updatePricing(quantity) {
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        }
        
        currentQuantity = quantity;
        qtyInput.value = quantity;

        // Verify availability limit
        if (quantity > TOTAL_NUMBERS_AVAILABLE) {
            ctaPurchaseBtn.style.pointerEvents = 'none';
            ctaPurchaseBtn.style.opacity = '0.5';
            numbersRest.style.display = 'block';
            restNumbersSpan.textContent = TOTAL_NUMBERS_AVAILABLE;
        } else {
            ctaPurchaseBtn.style.pointerEvents = 'auto';
            ctaPurchaseBtn.style.opacity = '1';
            numbersRest.style.display = 'none';
        }

        // Calculate and format total
        const total = quantity * TICKET_PRICE;
        ctaTotalPrice.textContent = total.toFixed(2).replace('.', ',');

        // Update active class on grid selections
        selectItems.forEach(item => {
            const amount = parseInt(item.dataset.amount);
            if (amount === quantity) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update active status on spin combos
        spinsContents.forEach(spin => {
            const amount = parseInt(spin.dataset.amount);
            if (amount === quantity) {
                spin.classList.add('highlighted');
            } else {
                spin.classList.remove('highlighted');
            }
        });

        // Update active status on box combos
        boxesContents.forEach(box => {
            const amount = parseInt(box.dataset.amount);
            if (amount === quantity) {
                box.classList.add('highlighted');
            } else {
                box.classList.remove('highlighted');
            }
        });
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

    // Select single options click events
    selectItems.forEach(item => {
        item.addEventListener('click', () => {
            const amount = parseInt(item.dataset.amount);
            updatePricing(amount);
        });
    });

    // Spin combos click events
    spinsContents.forEach(spin => {
        spin.addEventListener('click', () => {
            const amount = parseInt(spin.dataset.amount);
            updatePricing(amount);
            triggerCheckoutFlow();
        });
    });

    // Box combos click events
    boxesContents.forEach(box => {
        box.addEventListener('click', () => {
            const amount = parseInt(box.dataset.amount);
            updatePricing(amount);
            triggerCheckoutFlow();
        });
    });

    // ==========================================================================
    // DESCRIPTION ACCORDION
    // ==========================================================================
    btnDescription.addEventListener('click', () => {
        const isOpen = btnDescription.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            btnDescription.setAttribute('aria-expanded', 'false');
            descriptionContent.style.maxHeight = null;
        } else {
            btnDescription.setAttribute('aria-expanded', 'true');
            descriptionContent.style.maxHeight = descriptionContent.scrollHeight + "px";
        }
    });

    // ==========================================================================
    // MODALS HANDLERS
    // ==========================================================================
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Campaign prizes modal
    btnPrizeOpen.addEventListener('click', () => openModal(modalPrizes));
    btnPrizeClose.addEventListener('click', () => closeModal(modalPrizes));

    // My tickets search modal
    btnMyTickets.addEventListener('click', () => {
        openModal(modalMyTickets);
        searchResults.classList.add('hidden');
        searchPhoneInput.value = '';
    });
    closeMyTickets.addEventListener('click', () => closeModal(modalMyTickets));

    // Search simulation
    btnSearchSubmit.addEventListener('click', () => {
        const phone = searchPhoneInput.value.replace(/\D/g, '');
        searchResults.classList.remove('hidden');

        if (mockUsers[phone]) {
            const user = mockUsers[phone];
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <div class="result-header">
                        <span>${user.name}</span>
                        <span class="result-status">✅ ${user.status}</span>
                    </div>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 5px;">Comprado em: ${user.date}</p>
                    <div class="result-tickets-list">
                        ${user.tickets.map(ticket => `<span class="result-ticket-badge">${ticket}</span>`).join('')}
                    </div>
                </div>
            `;
        } else {
            searchResults.innerHTML = `
                <div class="search-result-item text-center" style="border-color: var(--danger);">
                    <p style="color: var(--danger); font-weight: 700;">Nenhum bilhete encontrado</p>
                    <p style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 4px;">
                        Verifique o telefone digitado (Ex: 11999999999).
                    </p>
                </div>
            `;
        }
    });

    // Formatting Phone Mask
    const maskPhone = (input) => {
        input.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    };
    maskPhone(searchPhoneInput);
    maskPhone(userPhoneInput);

    // ==========================================================================
    // CHECKOUT FLOW
    // ==========================================================================
    function triggerCheckoutFlow() {
        summaryQty.textContent = `${currentQuantity} Títulos`;
        summaryTotal.textContent = 'R$ ' + (currentQuantity * TICKET_PRICE).toFixed(2).replace('.', ',');
        checkoutStep1.classList.remove('hidden');
        checkoutStep2.classList.add('hidden');
        openModal(modalCheckout);
    }

    ctaPurchaseBtn.addEventListener('click', triggerCheckoutFlow);
    closeCheckout.addEventListener('click', () => closeModal(modalCheckout));

    // Submit user details -> load PIX
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault();

        const phoneKey = userPhoneInput.value.replace(/\D/g, '');
        const nameVal = userNameInput.value;

        // Generate mock tickets list
        const generatedTickets = [];
        for (let i = 0; i < Math.min(currentQuantity, 6); i++) {
            generatedTickets.push(Math.floor(100000 + Math.random() * 900000).toString());
        }
        if (currentQuantity > 6) {
            generatedTickets.push(`+ ${currentQuantity - 6} mais...`);
        }

        mockUsers[phoneKey] = {
            name: nameVal,
            tickets: generatedTickets,
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'Pendente via PIX'
        };

        // Transition checkout step views
        checkoutStep1.classList.add('hidden');
        checkoutStep2.classList.remove('hidden');
        
        startTimer(600, pixTimer);
    });

    // Copy Paste PIX logic
    btnCopyPix.addEventListener('click', () => {
        pixCodeInput.select();
        pixCodeInput.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(pixCodeInput.value)
            .then(() => {
                btnCopyPix.textContent = 'Copiado!';
                btnCopyPix.style.background = '#ffd700';
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

    // Timer utility
    let intervalId = null;
    function startTimer(duration, display) {
        if (intervalId) clearInterval(intervalId);
        
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

    // Modal background clicks to dismiss overlay
    window.addEventListener('click', (e) => {
        if (e.target === modalMyTickets) closeModal(modalMyTickets);
        if (e.target === modalCheckout) closeModal(modalCheckout);
        if (e.target === modalPrizes) closeModal(modalPrizes);
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

    // Initialize layout status
    updatePricing(currentQuantity);
});
