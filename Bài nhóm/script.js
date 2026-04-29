// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ ISLearn Platform Loaded');
    initializeEventListeners();
    loadUserInfo(); // ← thêm vào đây
});

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Search functionality
    const searchButtons = document.querySelectorAll('.search-box button, .search-hero button');
    searchButtons.forEach(btn => {
        btn.addEventListener('click', handleSearch);
    });

    // Navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Quiz buttons
    const quizButtons = document.querySelectorAll('.btn-quiz');
    quizButtons.forEach(btn => {
        btn.addEventListener('click', handleQuizClick);
    });

    // Course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach((card, index) => {
        card.addEventListener('click', (e) => handleCourseClick(e, index + 1));
    });

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', handleCategoryClick);
    });

    // Notification bell
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.addEventListener('click', handleNotificationClick);
    }

    // User menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', handleUserMenuClick);
    }
}

// ==================== LOAD USER INFO ====================
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn && user) {
        // Header
        const headerAvatar = document.getElementById('headerAvatar');
        const headerUsername = document.getElementById('headerUsername');
        const userMenu = document.getElementById('userMenu');
        const btnRegister = document.getElementById('btnRegister');

        if (headerAvatar) headerAvatar.src = user.avatar || 'user.png';
        if (headerUsername) headerUsername.innerHTML =
            `${user.displayName} <i class="fas fa-chevron-down"></i>`;
        if (userMenu) userMenu.style.display = 'flex';
        if (btnRegister) btnRegister.style.display = 'none';

        // Sidebar (chỉ có ở index.html)
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        const sidebarName = document.getElementById('sidebarName');
        if (sidebarAvatar) sidebarAvatar.src = user.avatar || 'user.png';
        if (sidebarName) sidebarName.textContent = user.displayName;

    } else {
        const userMenu = document.getElementById('userMenu');
        const btnRegister = document.getElementById('btnRegister');
        if (userMenu) userMenu.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'block';
    }
}

// ==================== SEARCH HANDLER ====================
function handleSearch(e) {
    const input = e.target.previousElementSibling;
    const searchQuery = input.value.trim();

    if (searchQuery === '') {
        alert('Vui lòng nhập từ khóa tìm kiếm');
        return;
    }

    console.log('🔍 Tìm kiếm:', searchQuery);
    alert(`Đang tìm kiếm: "${searchQuery}"`);
}

// ==================== QUIZ HANDLER ====================
function handleQuizClick(e) {
    const quizCard = e.target.closest('.quiz-card');
    const quizTitle = quizCard.querySelector('h3').textContent;
    const quizQuestions = quizCard.querySelector('p').textContent;

    console.log('📝 Quiz được chọn:', quizTitle, quizQuestions);
    alert(`Bạn đang bắt đầu: ${quizTitle}\n${quizQuestions}`);
}

// ==================== COURSE HANDLER ====================
function handleCourseClick(e, courseId) {
    const courseCard = e.target.closest('.course-card');
    const courseName = courseCard.querySelector('.course-info h3').textContent;
    const coursePrice = courseCard.querySelector('.price').textContent;
    const instructor = courseCard.querySelector('.instructor').textContent;
    const courseImage = courseCard.querySelector('.course-image img').src;

    console.log('📚 Khóa học được chọn:', courseName, coursePrice);

    const courseData = {
        id: courseId,
        name: courseName,
        price: coursePrice,
        instructor: instructor,
        image: courseImage
    };

    localStorage.setItem('selectedCourse', JSON.stringify(courseData));
    window.location.href = `course-detail.html?id=${courseId}`;
}

// ==================== CATEGORY HANDLER ====================
function handleCategoryClick(e) {
    const categoryCard = e.target.closest('.category-card');
    const categoryName = categoryCard.querySelector('h3').textContent;

    console.log('📂 Danh mục được chọn:', categoryName);
    alert(`Xem danh mục: ${categoryName}`);
}

// ==================== NOTIFICATION HANDLER ====================
function handleNotificationClick() {
    console.log('🔔 Đã click vào thông báo');

    const notifications = [
        { id: 1, message: 'Bạn có bài tập mới cần làm', time: '5 phút trước' },
        { id: 2, message: 'Giảng viên đã phản hồi câu hỏi của bạn', time: '1 giờ trước' },
        { id: 3, message: 'Khóa học bạn theo dõi có nội dung mới', time: '2 giờ trước' }
    ];

    const notificationList = notifications.map(n => `- ${n.message} (${n.time})`).join('\n');
    alert(`Thông báo:\n\n${notificationList}`);
}

// ==================== USER MENU HANDLER ====================
function handleUserMenuClick() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'login.html';
    }
}

// ==================== SMOOTH SCROLL ====================
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// ==================== ANIMATION ON SCROLL ====================
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.category-card, .course-card, .quiz-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

setTimeout(observeElements, 100);

// ==================== UTILITY FUNCTIONS ====================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function goToCourseDetail(courseId) {
    window.location.href = `course-detail.html?id=${courseId}`;
}

// ==================== PERFORMANCE LOGGING ====================
console.log('%c🎓 ISLearn Platform v1.0', 'color: #0057FF; font-size: 16px; font-weight: bold;');
console.log('%cNền tảng học trực tuyến chất lượng cao', 'color: #6C5CE7; font-size: 12px;');