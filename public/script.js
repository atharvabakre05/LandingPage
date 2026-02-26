// Pass pricing data
const passPrices = {
    student: 999,
    parent: 1499
};

const passNames = {
    student: 'Student Pass',
    parent: 'Student + Parent Pass'
};

// Modal functionality
function togglePassDropdown() {
    const dropdown = document.getElementById('passDropdown');
    dropdown.classList.toggle('active');
}

function openModal(passType) {
    // Close dropdown if open
    const dropdown = document.getElementById('passDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
    
    const modal = document.getElementById('purchaseModal');
    const selectedPassType = document.getElementById('selectedPassType');
    const selectedPrice = document.getElementById('selectedPrice');
    const passTypeInput = document.getElementById('passType');

    selectedPassType.textContent = passNames[passType];
    selectedPrice.textContent = passPrices[passType];
    passTypeInput.value = passType;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('passDropdown');
    const dropdownButton = document.querySelector('.pass-dropdown .btn-primary');
    
    if (dropdown && !dropdown.contains(event.target) && !dropdownButton.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

function closeModal() {
    const modal = document.getElementById('purchaseModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    document.getElementById('purchaseForm').reset();
}

document.getElementById('purchaseModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});


// ================= PURCHASE FORM SUBMIT =================

document.getElementById('purchaseForm').addEventListener('submit', async function(e) {

    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerHTML = "Saving...";
    submitBtn.disabled = true;

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value,
        passType: document.getElementById('passType').value,
        price: passPrices[document.getElementById('passType').value]
    };

    if (!validatePurchaseForm(formData)) {
        submitBtn.innerHTML = "Submit";
        submitBtn.disabled = false;
        return;
    }

    try {

        const response = await fetch("http://localhost:3000/api/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {

            showPurchaseSuccess(formData);

        } else {

            alert("Failed to save purchase");

        }

    } catch (error) {

        console.error(error);
        alert("Server error. Please try again.");

    }

    submitBtn.innerHTML = "Submit";
    submitBtn.disabled = false;

});


// ================= CONTACT FORM SUBMIT =================

document.getElementById('contactForm').addEventListener('submit', async function(e) {

    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.innerHTML = "Sending...";
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        message: document.getElementById('contactMessage').value
    };

    if (!validateContactForm(formData)) {
        submitBtn.innerHTML = "Send Message";
        submitBtn.disabled = false;
        return;
    }

    try {

        const response = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {

            showContactSuccess(formData);

        } else {

            alert("Failed to send message");

        }

    } catch (error) {

        console.error(error);
        alert("Server error");

    }

    submitBtn.innerHTML = "Send Message";
    submitBtn.disabled = false;

});


// ================= VALIDATION =================

function validatePurchaseForm(data) {

    const errors = [];

    if (!data.fullName || data.fullName.length < 2)
        errors.push("Enter valid name");

    if (!isValidEmail(data.email))
        errors.push("Enter valid email");

    if (!isValidPhone(data.phone))
        errors.push("Enter valid phone");

    if (!data.organization)
        errors.push("Enter organization");

    if (errors.length > 0) {

        showFormErrors(errors);
        return false;

    }

    return true;

}

function validateContactForm(data) {

    const errors = [];

    if (!data.name)
        errors.push("Enter name");

    if (!isValidEmail(data.email))
        errors.push("Enter valid email");

    if (!data.message || data.message.length < 10)
        errors.push("Message too short");

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

    return /^[0-9]{10,15}$/.test(phone.replace(/\D/g, ""));

}


// ================= SUCCESS UI =================

function showPurchaseSuccess(data) {

    const form = document.getElementById('purchaseForm');
    form.innerHTML = `
        <div style="padding:20px;text-align:center;">
            <h2>✅ Saved Successfully</h2>
            <p>${data.fullName}</p>
            <p>${data.email}</p>
            <p>₹${data.price}</p>
        </div>
    `;

}

function showContactSuccess(data) {

    const form = document.getElementById('contactForm');

    form.innerHTML = `
        <div style="padding:20px;text-align:center;">
            <h2>✅ Message Sent</h2>
            <p>We will contact you soon.</p>
        </div>
    `;

}


// ================= ERROR UI =================

function showFormErrors(errors) {

    alert(errors.join("\n"));

}

function showContactFormErrors(errors) {

    alert(errors.join("\n"));

}


// ================= SMOOTH SCROLL =================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function(e) {

        e.preventDefault();

        document.querySelector(this.getAttribute('href'))
            .scrollIntoView({ behavior: 'smooth' });

    });

});


// ================= INIT =================

console.log("Career-A-Fair Landing Page Loaded");

window.CAF = {
    openModal,
    closeModal
};

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const isOpen = answer.style.maxHeight !== '0px' && answer.style.maxHeight !== '';
        document.querySelectorAll('.faq-answer').forEach(el => el.style.maxHeight = '0px');
        if (!isOpen) answer.style.maxHeight = answer.scrollHeight + 'px';
    });
});

// Mobile Sticky
window.addEventListener('scroll', () => {
    const sticky = document.getElementById('mobileSticky');
    if (window.scrollY > 400) sticky.classList.add('visible');
    else sticky.classList.remove('visible');
});