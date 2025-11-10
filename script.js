// Common JavaScript functionality

// Format phone number function
function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.match(/.{1,3}/g)?.join(' ') ?? digits;
}

// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    // Set current year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Landing page modal functionality
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerModal = document.getElementById('register-modal');
    const loginModal = document.getElementById('login-modal');
    const closeRegister = document.getElementById('close-register');
    const closeLogin = document.getElementById('close-login');
    const phoneInput = document.getElementById('phone-input');
    const loginPhoneInput = document.getElementById('login-phone');
    const verificationCodeInput = document.getElementById('verification-code');
    const phoneForm = document.getElementById('phone-form');
    const verificationForm = document.getElementById('verification-form');
    const backToPhone = document.getElementById('back-to-phone');
    const switchToRegister = document.getElementById('switch-to-register');
    const registrationForm = document.getElementById('registration-form');
    const verificationSubmit = document.getElementById('verification-submit');
    const loginForm = document.getElementById('login-form');
    
    // Open registration modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            registerModal.classList.remove('hidden');
        });
    }
    
    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginModal.classList.remove('hidden');
        });
    }
    
    // Close registration modal
    if (closeRegister) {
        closeRegister.addEventListener('click', function() {
            registerModal.classList.add('hidden');
            phoneForm.classList.remove('hidden');
            verificationForm.classList.add('hidden');
        });
    }
    
    // Close login modal
    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            loginModal.classList.add('hidden');
        });
    }
    
    // Switch to registration from login
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function() {
            loginModal.classList.add('hidden');
            registerModal.classList.remove('hidden');
        });
    }
    
    // Back to phone input from verification
    if (backToPhone) {
        backToPhone.addEventListener('click', function() {
            phoneForm.classList.remove('hidden');
            verificationForm.classList.add('hidden');
        });
    }
    
    // Format phone inputs in real time
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }
    
    if (loginPhoneInput) {
        loginPhoneInput.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }
    
    // Registration form submission
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const raw = phoneInput.value.replace(/\s/g, '');
            if (!raw || raw.length < 9) {
                alert('Please enter a valid Zimbabwean phone number');
                return;
            }
            phoneForm.classList.add('hidden');
            verificationForm.classList.remove('hidden');
            alert('Verification code sent to +263' + raw);
        });
    }
    
    // Verification form submission
    if (verificationSubmit) {
        verificationSubmit.addEventListener('submit', function(e) {
            e.preventDefault();
            if (verificationCodeInput.value.length !== 6) {
                alert('Please enter the 6-digit verification code');
                return;
            }
            alert('Account created successfully!');
            registerModal.classList.add('hidden');
            phoneForm.classList.remove('hidden');
            verificationForm.classList.add('hidden');
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const raw = loginPhoneInput.value.replace(/\s/g, '');
            if (!raw || raw.length < 9) {
                alert('Please enter a valid Zimbabwean phone number');
                return;
            }
            alert('Login code sent to +263' + raw);
            loginModal.classList.add('hidden');
            // In a real app, you would verify the code and then redirect
            // For demo purposes, redirect directly
            window.location.href = 'dashboard.html';
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Withdrawal calculation (for withdraw.html)
    const withdrawAmount = document.getElementById('withdraw-amount');
    if (withdrawAmount) {
        withdrawAmount.addEventListener('input', calculateWithdrawal);
    }
    
    // Withdrawal form submission
    const withdrawForm = document.getElementById('withdraw-form');
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', handleWithdrawal);
    }
});

// Calculate withdrawal function
function calculateWithdrawal() {
    const amountInput = document.getElementById('withdraw-amount');
    const netAmountSpan = document.getElementById('net-amount');
    const feeSpan = document.getElementById('fee-amount');
    const statusMessage = document.getElementById('withdraw-status');
    const submitButton = document.getElementById('withdraw-submit');
    
    if (!amountInput || !netAmountSpan || !feeSpan) {
        return;
    }

    const withdrawMin = 0.50;
    const withdrawFee = 0.05; // 5%
    const balance = 15.75; // Mock balance
    
    let requestedAmount = parseFloat(amountInput.value) || 0;
    
    // Check for minimum withdrawal
    if (requestedAmount < withdrawMin) {
        netAmountSpan.textContent = "N/A";
        feeSpan.textContent = "N/A";
        if (submitButton) submitButton.disabled = true;
        if (statusMessage) {
            statusMessage.textContent = `Minimum withdrawal is $${withdrawMin.toFixed(2)}.`;
            statusMessage.className = 'text-red-500 font-semibold mt-2 text-center';
        }
        return;
    }

    // Check for balance sufficiency
    if (requestedAmount > balance) {
        netAmountSpan.textContent = "N/A";
        feeSpan.textContent = "N/A";
        if (submitButton) submitButton.disabled = true;
        if (statusMessage) {
            statusMessage.textContent = `Error: Insufficient balance. You only have $${balance.toFixed(2)}.`;
            statusMessage.className = 'text-red-500 font-semibold mt-2 text-center';
        }
        return;
    }
    
    // Perform calculation
    const fee = requestedAmount * withdrawFee;
    const netAmount = requestedAmount - fee;

    netAmountSpan.textContent = `$${netAmount.toFixed(2)}`;
    feeSpan.textContent = `$${fee.toFixed(2)}`;
    if (submitButton) submitButton.disabled = false;
    if (statusMessage) {
        statusMessage.textContent = 'Ready to submit request!';
        statusMessage.className = 'text-emerald-500 font-semibold mt-2 text-center';
    }
}

// Handle withdrawal submission
function handleWithdrawal(e) {
    e.preventDefault();
    const amount = document.getElementById('withdraw-amount').value;
    const gateway = document.getElementById('payment-gateway').value;
    const account = document.getElementById('account-details').value;
    const withdrawFee = 0.05;
    const netAmount = (parseFloat(amount) * (1 - withdrawFee)).toFixed(2);
    
    alert(`Withdrawal request submitted!
- Amount: $${amount}
- Net: $${netAmount}
- Gateway: ${gateway}
- Account: ${account}

Your request is being processed. Thank you!`);
}

// Copy to clipboard function
function copyToClipboard(text, elementId) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'Copied!' : 'Copy failed.';
        
        // Provide visual feedback
        const button = document.getElementById(elementId);
        if(button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i data-lucide="check" class="w-4 h-4 inline mr-2"></i> Copied!';
            setTimeout(() => {
                button.innerHTML = originalText;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 2000);
        }
        
        console.log(msg);
    } catch (err) {
        console.error('Copy command failed:', err);
        alert('Could not automatically copy to clipboard. Please copy manually.');
    }
    document.body.removeChild(tempInput);
}