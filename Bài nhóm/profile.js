// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    loadProfile();
    setupAvatarUpload();
});

// ==================== CHECK LOGIN ====================
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

// ==================== LOAD PROFILE ====================
function loadProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    // Header
    document.getElementById('headerAvatar').src = user.avatar || 'user.png';
    document.getElementById('headerUsername').innerHTML =
        `${user.displayName || 'Người dùng'} <i class="fas fa-chevron-down"></i>`;

    // Sidebar
    document.getElementById('profileAvatar').src = user.avatar || 'user.png';
    document.getElementById('profileDisplayName').textContent = user.displayName || '—';
    document.getElementById('profileUsername').textContent = '@' + (user.username || '—');

    // View mode
    document.getElementById('view-displayName').textContent = user.displayName || '—';
    document.getElementById('view-username').textContent = '@' + (user.username || '—');
    document.getElementById('view-email').textContent = user.email || '—';
    document.getElementById('view-phone').textContent = user.phone || 'Chưa cập nhật';
    document.getElementById('view-birthday').textContent = user.birthday || 'Chưa cập nhật';
    document.getElementById('view-gender').textContent = user.gender || 'Chưa cập nhật';
    document.getElementById('view-bio').textContent = user.bio || 'Chưa cập nhật';
    document.getElementById('view-registeredAt').textContent = user.registeredAt || '—';

    // Security tab
    document.getElementById('security-email').textContent = user.email || '—';
    document.getElementById('security-date').textContent = user.registeredAt || '—';
}

// ==================== SWITCH TAB ====================
function switchTab(tabName) {
    // Ẩn tất cả tab
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Bỏ active tất cả nav btn
    document.querySelectorAll('.profile-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hiển thị tab được chọn
    document.getElementById('tab-' + tabName).classList.add('active');

    // Active nav btn tương ứng
    const btns = document.querySelectorAll('.profile-nav-btn');
    const tabIndex = { info: 0, security: 1, courses: 2 };
    if (tabIndex[tabName] !== undefined) {
        btns[tabIndex[tabName]].classList.add('active');
    }
}

// ==================== TOGGLE EDIT MODE ====================
let isEditing = false;

function toggleEdit() {
    isEditing = !isEditing;
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    if (isEditing) {
        // Điền dữ liệu vào form
        document.getElementById('edit-displayName').value = user.displayName || '';
        document.getElementById('edit-username').value = user.username || '';
        document.getElementById('edit-email').value = user.email || '';
        document.getElementById('edit-phone').value = user.phone || '';
        document.getElementById('edit-birthday').value = user.birthday || '';
        document.getElementById('edit-gender').value = user.gender || '';
        document.getElementById('edit-bio').value = user.bio || '';

        document.getElementById('viewMode').style.display = 'none';
        document.getElementById('editMode').style.display = 'block';
        document.getElementById('editBtn').innerHTML = '<i class="fas fa-times"></i> Hủy';
    } else {
        document.getElementById('viewMode').style.display = 'block';
        document.getElementById('editMode').style.display = 'none';
        document.getElementById('editBtn').innerHTML = '<i class="fas fa-pen"></i> Chỉnh sửa';
    }
}

// ==================== SAVE PROFILE ====================
function saveProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    const displayName = document.getElementById('edit-displayName').value.trim();
    const username = document.getElementById('edit-username').value.trim();
    const email = document.getElementById('edit-email').value.trim();

    if (!displayName) { showToast('Tên hiển thị không được để trống', 'error'); return; }
    if (!username) { showToast('Tên đăng nhập không được để trống', 'error'); return; }
    if (!email) { showToast('Email không được để trống', 'error'); return; }

    // Cập nhật dữ liệu
    user.displayName = displayName;
    user.username = username;
    user.email = email;
    user.phone = document.getElementById('edit-phone').value.trim();
    user.birthday = document.getElementById('edit-birthday').value;
    user.gender = document.getElementById('edit-gender').value;
    user.bio = document.getElementById('edit-bio').value.trim();

    localStorage.setItem('currentUser', JSON.stringify(user));

    // Reload lại thông tin
    loadProfile();

    // Tắt edit mode
    isEditing = true;
    toggleEdit();

    showToast('✅ Cập nhật thông tin thành công!', 'success');
}

// ==================== AVATAR UPLOAD ====================
function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatarInput');

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Vui lòng chọn file ảnh', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showToast('Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const newAvatar = event.target.result;

            // Cập nhật UI
            document.getElementById('profileAvatar').src = newAvatar;
            document.getElementById('headerAvatar').src = newAvatar;

            // Lưu vào localStorage
            const user = JSON.parse(localStorage.getItem('currentUser')) || {};
            user.avatar = newAvatar;
            localStorage.setItem('currentUser', JSON.stringify(user));

            showToast('✅ Cập nhật ảnh đại diện thành công!', 'success');
        };
        reader.readAsDataURL(file);
    });
}

// ==================== CHANGE PASSWORD ====================
function changePassword() {
    const current = document.getElementById('currentPassword').value;
    const newPw = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmNewPassword').value;
    const errorEl = document.getElementById('passwordChangeError');

    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    if (!current) { errorEl.textContent = 'Vui lòng nhập mật khẩu hiện tại'; return; }
    if (current !== (user.password || '')) {
        errorEl.textContent = 'Mật khẩu hiện tại không đúng';
        return;
    }
    if (!newPw || newPw.length < 8) { errorEl.textContent = 'Mật khẩu mới phải có ít nhất 8 ký tự'; return; }
    if (newPw !== confirm) { errorEl.textContent = 'Mật khẩu xác nhận không khớp'; return; }

    errorEl.textContent = '';
    user.password = newPw;
    localStorage.setItem('currentUser', JSON.stringify(user));

    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';

    showToast('✅ Đổi mật khẩu thành công!', 'success');
}

// ==================== TOGGLE PASSWORD VISIBILITY ====================
function togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ==================== LOGOUT ====================
function handleLogout() {
    document.getElementById('logoutModal').classList.add('active');
}

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.remove('active');
}

function confirmLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html'; // ← chuyển đến trang đăng nhập
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}