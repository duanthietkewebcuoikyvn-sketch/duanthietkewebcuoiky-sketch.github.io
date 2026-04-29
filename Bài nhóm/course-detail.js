// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Course Detail Page Loaded');
    initializeEventListeners();
    loadCourseData();
});

// ==================== EVENT LISTENERS ====================
function initializeEventListeners() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });

    // Module expand/collapse
    const moduleHeaders = document.querySelectorAll('.module-header');
    moduleHeaders.forEach(header => {
        header.addEventListener('click', toggleModule);
    });

    // Buy course button
    const buyBtn = document.querySelector('.btn-buy');
    if (buyBtn) {
        buyBtn.addEventListener('click', handleBuyCourse);
    }

    // Expand more lessons
    const expandMore = document.querySelector('.expand-more');
    if (expandMore) {
        expandMore.addEventListener('click', handleExpandMore);
    }

    // Back to home button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// ==================== LOAD COURSE DATA ====================
function loadCourseData() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    // Dữ liệu khóa học mẫu
    const courses = {
        1: {
            id: 1,
            title: 'Lập trình Web từ A-Z',
            instructor: 'Bình Văn B',
            instructorEmail: 'binhvanb@gmail.com',
            price: 499000,
            originalPrice: 699000,
            rating: 4.8,
            reviews: 1234,
            image: 'laptop.png',
            duration: '40 giờ',
            lessons: 126,
            level: 'Nâng cao',
            description: 'Khóa học lập trình web toàn diện từ HTML, CSS, JavaScript đến ReactJS và Backend với Node.js'
        },
        2: {
            id: 2,
            title: 'Marketing Digital cơ bản',
            instructor: 'Lê Thị C',
            instructorEmail: 'lethic@gmail.com',
            price: 399000,
            originalPrice: 599000,
            rating: 4.7,
            reviews: 987,
            image: 'marketingdigital.png',
            duration: '35 giờ',
            lessons: 98,
            level: 'Trung bình',
            description: 'Học marketing digital từ cơ bản đến nâng cao, bao gồm SEO, SEM, Social Media Marketing'
        },
        3: {
            id: 3,
            title: 'Thiết kế UI/UX với Figma',
            instructor: 'Phạm Văn D',
            instructorEmail: 'phamvand@gmail.com',
            price: 549000,
            originalPrice: 799000,
            rating: 4.9,
            reviews: 756,
            image: 'UIUX.png',
            duration: '45 giờ',
            lessons: 145,
            level: 'Nâng cao',
            description: 'Thiết kế giao diện người dùng chuyên nghiệp với Figma, từ prototyping đến design system'
        },
        4: {
            id: 4,
            title: 'Tiếng Anh giao tiếp nâng cao',
            instructor: 'Nguyễn Thị E',
            instructorEmail: 'nguyenthie@gmail.com',
            price: 299000,
            originalPrice: 499000,
            rating: 4.6,
            reviews: 1122,
            image: 'EL.png',
            duration: '50 giờ',
            lessons: 156,
            level: 'Nâng cao',
            description: 'Nâng cao kỹ năng tiếng Anh giao tiếp thực tế, tự tin trong công việc và cuộc sống'
        }
    };

    const course = courses[courseId] || courses[1];
    
    // Cập nhật tiêu đề trang
    document.title = course.title + ' - ISLearn';
    
    // Cập nhật thông tin khóa học trên trang
    updateCourseDisplay(course);
    
    // Lưu dữ liệu khóa học vào global variable
    window.currentCourse = course;
}

function updateCourseDisplay(course) {
    // Cập nhật banner
    const bannerContent = document.querySelector('.banner-content');
    if (bannerContent) {
        bannerContent.innerHTML = `
            <a href="index.html" class="back-btn">← Quay lại</a>
            <h1>${course.title}</h1>
            <p class="instructor-name">Giảng viên: ${course.instructor}</p>
        `;
    }

    // Cập nhật sidebar
    const courseBannerImg = document.querySelector('.course-banner-img img');
    if (courseBannerImg) {
        courseBannerImg.src = course.image;
    }

    const priceElement = document.querySelector('.course-price');
    if (priceElement) {
        priceElement.innerHTML = `
            <span class="current-price">${course.price.toLocaleString('vi-VN')}₫</span>
            <span class="original-price">${course.originalPrice.toLocaleString('vi-VN')}₫</span>
        `;
    }

    const ratingElement = document.querySelector('.course-rating');
    if (ratingElement) {
        ratingElement.innerHTML = `
            <span class="stars">⭐ ${course.rating}</span>
            <span class="reviews">(${course.reviews.toLocaleString('vi-VN')} đánh giá)</span>
        `;
    }

    const statsElement = document.querySelector('.course-stats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="stat">
                <i class="fas fa-clock"></i>
                <span>${course.duration}</span>
            </div>
            <div class="stat">
                <i class="fas fa-book"></i>
                <span>${course.lessons} bài học</span>
            </div>
            <div class="stat">
                <i class="fas fa-graduation-cap"></i>
                <span>${course.level}</span>
            </div>
        `;
    }
}

// ==================== TAB HANDLER ====================
function handleTabClick(e) {
    const tabBtn = e.target;
    const tabId = tabBtn.getAttribute('data-tab');

    // Remove active class from all buttons and panes
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // Add active class to clicked button and corresponding pane
    tabBtn.classList.add('active');
    document.getElementById(tabId).classList.add('active');

    console.log('📑 Tab được chọn:', tabId);
}

// ==================== MODULE TOGGLE ====================
function toggleModule(e) {
    const moduleHeader = e.currentTarget;
    const module = moduleHeader.closest('.module');
    const moduleContent = module.querySelector('.module-content');
    const icon = moduleHeader.querySelector('i');

    // Toggle content visibility
    if (moduleContent.style.maxHeight === '0px' || moduleContent.style.maxHeight === '') {
        moduleContent.style.maxHeight = '500px';
        icon.style.transform = 'rotate(180deg)';
    } else {
        moduleContent.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    }
}

// ==================== BUY COURSE HANDLER ====================
function handleBuyCourse(e) {
    const course = window.currentCourse;
    
    if (!course) {
        alert('Không tìm thấy thông tin khóa học');
        return;
    }

    console.log('🛒 Chuyển hướng thanh toán:', course.title);
    
    // Lưu thông tin khóa học vào localStorage
    localStorage.setItem('purchaseCourse', JSON.stringify({
        id: course.id,
        title: course.title,
        price: course.price,
        instructor: course.instructor
    }));
    
    // Chuyển hướng sang trang thanh toán
    window.location.href = 'payment.html';
}

// ==================== EXPAND MORE LESSONS ====================
function handleExpandMore(e) {
    const expandBtn = e.currentTarget;
    const parentModule = expandBtn.previousElementSibling;
    const moduleContent = parentModule.querySelector('.module-content');

    // Increase max-height để hiển thị thêm bài
    moduleContent.style.maxHeight = 'none';
    expandBtn.style.display = 'none';

    console.log('📚 Đã mở rộng danh sách bài học');
}

// ==================== SMOOTH SCROLL ====================
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// ==================== UTILITY: Check if element is in viewport ====================
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ==================== PERFORMANCE LOGGING ====================
console.log('%c🎓 ISLearn - Course Detail Page v1.0', 'color: #E85B9C; font-size: 16px; font-weight: bold;');
console.log('%cHiển thị chi tiết khóa học', 'color: #0057FF; font-size: 12px;');

// ==================== FUNCTION TO NAVIGATE FROM COURSE CARD ====================
function goToCourseDetail(courseId) {
    // Lấy thông tin khóa học dựa trên ID
    // Có thể lưu trong localStorage hoặc truyền qua URL
    window.location.href = `course-detail.html?id=${courseId}`;
}
