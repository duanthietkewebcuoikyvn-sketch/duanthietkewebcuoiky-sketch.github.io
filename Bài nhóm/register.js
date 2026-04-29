// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Register Page Loaded');
    setupAvatarUpload();
    setupRealtimeValidation();
});

// ==================== AVATAR UPLOAD ====================
let avatarBase64 = null;

function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatarInput');
    
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kiểm tra định dạng
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh (JPG, PNG, GIF...)');
            return;
        }

        // Kiểm tra kích thước (tối đa 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB');
            return;
        }

        // Đọc và hiển thị ảnh
        const reader = new FileReader();
        reader.onload = (event) => {
            avatarBase64 = event.target.result;
            document.getElementById('avatarImg').src = avatarBase64;
        };
        reader.readAsDataURL(file);
    });
}

// ==================== REALTIME VALIDATION ====================
function setupRealtimeValidation() {
    document.getElementById('displayName').addEventListener('input', validateDisplayName);
    document.getElementById('username').addEventListener('input', validateUsername);
    document.getElementById('email').addEventListener('input', validateEmail);
    document.getElementById('password').addEventListener('input', () => {
        validatePassword();
        checkPasswordStrength();
    });
    document.getElementById('confirmPassword').addEventListener('input', validateConfirmPassword);
}

// ==================== VALIDATION FUNCTIONS ====================
function validateDisplayName() {
    const value = document.getElementById('displayName').value.trim();
    const error = document.getElementById('displayNameError');
    const input = document.getElementById('displayName');

    if (!value) {
        setError(input, error, 'Vui lòng nhập tên hiển thị');
        return false;
    }
    if (value.length < 2) {
        setError(input, error, 'Tên phải có ít nhất 2 ký tự');
        return false;
    }
    setValid(input, error);
    return true;
}

function validateUsername() {
    const value = document.getElementById('username').value.trim();
    const error = document.getElementById('usernameError');
    const input = document.getElementById('username');
    const regex = /^[a-z0-9_]+$/;

    if (!value) {
        setError(input, error, 'Vui lòng nhập tên đăng nhập');
        return false;
    }
    if (value.length < 4) {
        setError(input, error, 'Tên đăng nhập phải có ít nhất 4 ký tự');
        return false;
    }
    if (!regex.test(value)) {
        setError(input, error, 'Chỉ dùng chữ thường, số và dấu gạch dưới (_)');
        return false;
    }
    setValid(input, error);
    return true;
}

function validateEmail() {
    const value = document.getElementById('email').value.trim();
    const error = document.getElementById('emailError');
    const input = document.getElementById('email');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        setError(input, error, 'Vui lòng nhập Gmail');
        return false;
    }
    if (!regex.test(value)) {
        setError(input, error, 'Email không hợp lệ');
        return false;
    }
    if (!value.includes('gmail.com') && !value.includes('@')) {
        setError(input, error, 'Vui lòng dùng địa chỉ email hợp lệ');
        return false;
    }
    setValid(input, error);
    return true;
}

function validatePassword() {
    const value = document.getElementById('password').value;
    const error = document.getElementById('passwordError');
    const input = document.getElementById('password');

    if (!value) {
        setError(input, error, 'Vui lòng nhập mật khẩu');
        return false;
    }
    if (value.length < 8) {
        setError(input, error, 'Mật khẩu phải có ít nhất 8 ký tự');
        return false;
    }
    setValid(input, error);
    return true;
}

function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const error = document.getElementById('confirmPasswordError');
    const input = document.getElementById('confirmPassword');

    if (!confirm) {
        setError(input, error, 'Vui lòng xác nhận mật khẩu');
        return false;
    }
    if (password !== confirm) {
        setError(input, error, 'Mật khẩu không khớp');
        return false;
    }
    setValid(input, error);
    return true;
}

// ==================== PASSWORD STRENGTH ====================
function checkPasswordStrength() {
    const value = document.getElementById('password').value;
    const strengthEl = document.getElementById('passwordStrength');
    const fillEl = document.getElementById('strengthFill');
    const textEl = document.getElementById('strengthText');

    if (!value) {
        strengthEl.classList.remove('visible');
        return;
    }

    strengthEl.classList.add('visible');

    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const levels = [
        { width: '20%', color: '#DC3545', text: 'Rất yếu' },
        { width: '40%', color: '#FF6B35', text: 'Yếu' },
        { width: '60%', color: '#FFC107', text: 'Trung bình' },
        { width: '80%', color: '#20C997', text: 'Mạnh' },
        { width: '100%', color: '#27AE60', text: 'Rất mạnh' },
    ];

    const level = levels[Math.min(score - 1, 4)] || levels[0];
    fillEl.style.width = level.width;
    fillEl.style.background = level.color;
    textEl.textContent = level.text;
    textEl.style.color = level.color;
}

// ==================== HELPER FUNCTIONS ====================
function setError(input, errorEl, message) {
    input.classList.remove('valid');
    input.classList.add('invalid');
    errorEl.textContent = message;
}

function setValid(input, errorEl) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    errorEl.textContent = '';
}

// ==================== TOGGLE PASSWORD VISIBILITY ====================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const iconId = inputId === 'password' ? 'passwordIcon' : 'confirmPasswordIcon';
    const icon = document.getElementById(iconId);

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ==================== HANDLE REGISTER ====================
function handleRegister() {
    // Validate tất cả trường
    const isDisplayNameValid = validateDisplayName();
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    const termsError = document.getElementById('termsError');
    const agreeTerms = document.getElementById('agreeTerms').checked;
    if (!agreeTerms) {
        termsError.textContent = 'Bạn cần đồng ý với điều khoản để tiếp tục';
        return;
    } else {
        termsError.textContent = '';
    }

    if (!isDisplayNameValid || !isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
        return;
    }
    // Lưu vào localStorage (thực tế gửi lên server)
    const userData = {
    displayName: document.getElementById('displayName').value.trim(),
    username: document.getElementById('username').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value, // thêm dòng này
    avatar: avatarBase64 || 'user.png',
    registeredAt: new Date().toLocaleString('vi-VN')
    };
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    // Hiển thị modal thành công
    document.getElementById('successInfo').innerHTML = `
        <div><strong>Tên:</strong> ${userData.displayName}</div>
        <div><strong>Tên đăng nhập:</strong> @${userData.username}</div>
        <div><strong>Email:</strong> ${userData.email}</div>
    `;
    document.getElementById('successModal').classList.add('active');
}

// ==================== HANDLE GOOGLE REGISTER ====================
function handleGoogleRegister() {
    alert('Tính năng đăng ký bằng Google sẽ cần tích hợp Google OAuth.\nHiện tại đang ở chế độ demo.');
}

// ==================== GO TO HOME ====================
function goToHome() {
    window.location.href = 'profile.html';
}