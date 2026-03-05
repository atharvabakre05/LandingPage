// ================= PASS DATA =================

/** Base prices per pass type */
const passPrices = {
    student: 399,
    parent: 699
};

/** Display names per pass type */
const passNames = {
    student: 'Student Participant Pass',
    parent: 'Family Bundle Pass'
};

// ================= HERO SCROLL =================

/**
 * Smoothly scrolls the page to the Passes / Pricing section.
 * Called by the "Book Pass" hero button.
 */
function scrollToPasses() {
    document.getElementById('passes').scrollIntoView({ behavior: 'smooth' });
}

// ================= PASS CARD SELECTION =================

/**
 * Highlights the selected pass card, then opens the purchase modal.
 * @param {string} passType - 'student' or 'parent'
 * @param {HTMLElement} btnEl - The button element that was clicked
 */
function selectPass(passType, btnEl) {
    // Remove selected state from all pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Add selected state to the card containing this button
    const card = btnEl.closest('.pricing-card');
    if (card) card.classList.add('selected');

    // Open the purchase modal
    openModal(passType);
}

// ================= MODAL =================

/**
 * Opens the purchase modal and pre-fills pass info.
 * @param {string} passType - 'student' or 'parent'
 */
function openModal(passType) {
    const modal = document.getElementById('purchaseModal');
    const selectedPassType = document.getElementById('selectedPassType');
    const selectedPrice = document.getElementById('selectedPrice');
    const passTypeInput = document.getElementById('passType');
    const numPassesInput = document.getElementById('numPasses');

    // Set pass name and unit price in the banner
    selectedPassType.textContent = passNames[passType];
    selectedPrice.textContent = passPrices[passType].toLocaleString('en-IN');
    passTypeInput.value = passType;

    // Reset quantity to 1 and update total
    if (numPassesInput) {
        numPassesInput.value = 1;
    }
    updateTotal();

    // Show modal with fade-in
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the purchase modal and resets the form.
 */
function closeModal() {
    const modal = document.getElementById('purchaseModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    // Reset the form back to its original state
    const form = document.getElementById('purchaseForm');
    if (form) form.reset();

    // Update the total after reset (numPasses resets to 1)
    updateTotal();
}

// Close modal when clicking outside the content box
document.getElementById('purchaseModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});

// ================= DYNAMIC TOTAL PRICE =================

/**
 * Reads the current passType and numPasses, then updates
 * the total price display in the modal.
 */
function updateTotal() {
    const passType = document.getElementById('passType').value || 'student';
    const numPasses = parseInt(document.getElementById('numPasses')?.value, 10) || 1;
    const basePrice = passPrices[passType] || 0;
    const total = basePrice * Math.max(1, numPasses);

    const totalEl = document.getElementById('totalPrice');
    if (totalEl) {
        totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    }
}

// ================= PURCHASE FORM SUBMIT =================

document.getElementById('purchaseForm').addEventListener('submit', async function (e) {

    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:0.5rem;"></i>Processing...';
    submitBtn.disabled = true;

    const numPasses = parseInt(document.getElementById('numPasses').value, 10) || 1;
    const passType = document.getElementById('passType').value;
    const totalPrice = passPrices[passType] * numPasses;

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value || 'N/A',
        passType: passType,
        numPasses: numPasses,
        price: totalPrice
    };

    if (!validatePurchaseForm(formData)) {
        submitBtn.innerHTML = '<i class="fas fa-lock" style="margin-right:0.5rem;"></i>Confirm Purchase';
        submitBtn.disabled = false;
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showPurchaseSuccess(formData);
        } else {
            alert('Failed to save purchase. Please try again.');
        }

    } catch (error) {
        console.error(error);
        alert('Server error. Please try again later.');
    }

    submitBtn.innerHTML = '<i class="fas fa-lock" style="margin-right:0.5rem;"></i>Confirm Purchase';
    submitBtn.disabled = false;
});

// ================= CONTACT FORM SUBMIT =================

document.getElementById('contactForm').addEventListener('submit', async function (e) {

    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value
    };

    if (!validateContactForm(formData)) {
        submitBtn.innerHTML = 'Send Message';
        submitBtn.disabled = false;
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showContactSuccess(formData);
        } else {
            alert('Failed to send message. Please try again.');
        }

    } catch (error) {
        console.error(error);
        alert('Server error. Please try again later.');
    }

    submitBtn.innerHTML = 'Send Message';
    submitBtn.disabled = false;
});

// ================= VALIDATION =================

function validatePurchaseForm(data) {
    const errors = [];

    if (!data.fullName || data.fullName.trim().length < 2)
        errors.push('Please enter your full name (at least 2 characters).');

    if (!isValidEmail(data.email))
        errors.push('Please enter a valid email address.');

    if (!isValidPhone(data.phone))
        errors.push('Please enter a valid 10-digit phone number.');

    if (!data.numPasses || data.numPasses < 1)
        errors.push('Please enter a valid number of passes (minimum 1).');

    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }

    return true;
}

function validateContactForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2)
        errors.push('Please enter your name.');

    if (!isValidEmail(data.email))
        errors.push('Please enter a valid email address.');

    if (!data.message || data.message.trim().length < 10)
        errors.push('Message is too short (minimum 10 characters).');

    if (errors.length > 0) {
        showContactFormErrors(errors);
        return false;
    }

    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9]{10,15}$/.test(phone.replace(/\D/g, ''));
}

// ================= SUCCESS UI =================

function showPurchaseSuccess(data) {
    const form = document.getElementById('purchaseForm');
    form.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="color: var(--caf-navy); margin-bottom: 0.5rem;">Purchase Confirmed!</h2>
            <p style="color: var(--caf-muted); margin-bottom: 1.5rem;">
                Thank you, <strong>${data.fullName}</strong>! Your pass has been booked.
            </p>
            <div style="background: var(--caf-bg); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; border: 1px solid var(--caf-border);">
                <div style="font-size: 0.85rem; color: var(--caf-muted);">Confirmation sent to</div>
                <div style="font-weight: 700; color: var(--caf-navy);">${data.email}</div>
                <div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--caf-muted);">Total Paid</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: var(--caf-navy);">₹${data.price.toLocaleString('en-IN')}</div>
            </div>
            <button onclick="closeModal()" class="btn btn-primary" style="width: 100%;">Close</button>
        </div>
    `;
}

function showContactSuccess(data) {
    const form = document.getElementById('contactForm');
    form.innerHTML = `
        <div style="padding: 2rem; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: var(--caf-navy); margin-bottom: 0.5rem;">Message Sent!</h2>
            <p style="color: var(--caf-muted);">We'll get back to you shortly at <strong>${data.email}</strong>.</p>
        </div>
    `;
}

// ================= ERROR UI =================

function showFormErrors(errors) {
    alert(errors.join('\n'));
}

function showContactFormErrors(errors) {
    alert(errors.join('\n'));
}

// ================= SMOOTH SCROLL =================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ================= FAQ ACCORDION =================

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const isOpen = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
        document.querySelectorAll('.faq-answer').forEach(el => el.style.maxHeight = '0px');
        if (!isOpen) answer.style.maxHeight = answer.scrollHeight + 'px';
    });
});

// ================= MOBILE STICKY CTA =================

window.addEventListener('scroll', () => {
    const sticky = document.getElementById('mobileSticky');
    if (window.scrollY > 400) sticky.classList.add('visible');
    else sticky.classList.remove('visible');
});

// ================= INIT =================

console.log('Career-A-Fair Landing Page Loaded');

window.CAF = {
    openModal,
    closeModal,
    selectPass,
    scrollToPasses,
    updateTotal
};