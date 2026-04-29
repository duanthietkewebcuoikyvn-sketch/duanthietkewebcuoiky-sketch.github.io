// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Login Page Loaded');

    // Nếu đã đăng nhập thì chuyển thẳng vào profile
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'profile.html';
        return;
    }

    // Điền sẵn email nếu có ghi nhớ
    const remembered = localStorage.getItem('rememberedIdentifier');
    if (remembered) {
        document.getElementById('loginIdentifier').value = remembered;
        document.getElementById('rememberMe').checked = true;
    }

    // Cho phép nhấn Enter để đăng nhập
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
});

// ==================== TOGGLE PASSWORD ====================
function toggleLoginPassword() {
    const input = document.getElementById('loginPassword');
    const icon = document.getElementById('loginPasswordIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ==================== HANDLE LOGIN ====================
function handleLogin() {
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Reset lỗi cũ
    hideError();

    // Kiểm tra bỏ trống
    if (!identifier) {
        document.getElementById('identifierError').textContent = 'Vui lòng nhập email hoặc tên đăng nhập';
        return;
    }
    if (!password) {
        document.getElementById('passwordError').textContent = 'Vui lòng nhập mật khẩu';
        return;
    }

    // Lấy tài khoản đã đăng ký từ localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        showError('Chưa có tài khoản nào được đăng ký. Vui lòng đăng ký trước.');
        return;
    }

    // Kiểm tra identifier (chấp nhận cả email lẫn username)
    const identifierMatch =
        identifier === user.email ||
        identifier === user.username;

    if (!identifierMatch) {
        showError('Email hoặc tên đăng nhập không đúng');
        return;
    }

    // Kiểm tra mật khẩu
    if (password !== user.password) {
        showError('Mật khẩu không đúng');
        return;
    }

    // Đăng nhập thành công
    localStorage.setItem('isLoggedIn', 'true');

    // Ghi nhớ đăng nhập
    if (rememberMe) {
        localStorage.setItem('rememberedIdentifier', identifier);
    } else {
        localStorage.removeItem('rememberedIdentifier');
    }

    console.log('✅ Đăng nhập thành công:', user.displayName);
    window.location.href = 'profile.html';
}

// ==================== HANDLE GOOGLE LOGIN ====================
function handleGoogleLogin() {
    alert('Tính năng đăng nhập bằng Google cần tích hợp Google OAuth.\nHiện tại đang ở chế độ demo.');
}

// ==================== SHOW / HIDE ERROR ====================
function showError(message) {
    const box = document.getElementById('loginErrorBox');
    document.getElementById('loginErrorMsg').textContent = message;
    box.style.display = 'flex';
    // Reset animation
    box.style.animation = 'none';
    box.offsetHeight; // trigger reflow
    box.style.animation = '';
}

function hideError() {
    document.getElementById('loginErrorBox').style.display = 'none';
    document.getElementById('identifierError').textContent = '';
    document.getElementById('passwordError').textContent = '';
}