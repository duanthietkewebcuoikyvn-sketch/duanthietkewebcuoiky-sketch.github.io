// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Payment Page Loaded');
    loadCourseInfo();
    initializeEventListeners();
});

// ==================== LOAD COURSE INFORMATION ====================
function loadCourseInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id') || localStorage.getItem('selectedCourseId') || '4';
    
    const courseData = {
        '1': {
            name: 'Lập trình Web từ A-Z',
            instructor: 'Bình Văn B',
            price: 499000,
            image: 'laptop.png'
        },
        '2': {
            name: 'Marketing Digital cơ bản',
            instructor: 'Lê Thị C',
            price: 399000,
            image: 'marketingdigital.png'
        },
        '3': {
            name: 'Thiết kế UI/UX với Figma',
            instructor: 'Phạm Văn D',
            price: 549000,
            image: 'UIUX.png'
        },
        '4': {
            name: 'Tiếng Anh giao tiếp nâng cao',
            instructor: 'Nguyễn Thị E',
            price: 299000,
            image: 'EL.png'
        }
    };

    const course = courseData[courseId] || courseData['4'];
    
    document.getElementById('courseName').textContent = course.name;
    document.getElementById('instructorName').textContent = course.instructor;
    document.getElementById('courseImage').src = course.image;
    document.getElementById('coursePrice').textContent = formatCurrency(course.price);
    document.getElementById('totalPrice').textContent = formatCurrency(course.price);
    document.getElementById('cardPaymentAmount').textContent = formatCurrency(course.price);
    document.getElementById('transferContent').textContent = `THANHTOAN_KHOAHOC_${courseId}`;
    
    localStorage.setItem('selectedCourseId', courseId);
    localStorage.setItem('selectedCourseName', course.name);
    localStorage.setItem('selectedCoursePrice', course.price);
}

// ==================== SWITCH PAYMENT METHOD ====================
function switchPaymentMethod(method) {
    document.querySelectorAll('.payment-method-content').forEach(el => {
        el.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (method === 'bank') {
        document.getElementById('bankMethod').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else if (method === 'card') {
        document.getElementById('cardMethod').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    } else if (method === 'wallet') {
        document.getElementById('walletMethod').classList.add('active');
        document.querySelectorAll('.tab-btn')[2].classList.add('active');
    }
    
    console.log('💳 Đổi phương thức thanh toán:', method);
}

// ==================== COPY TO CLIPBOARD ====================
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target.closest('.btn-copy');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
        
        console.log('✅ Đã sao chép:', text);
    }).catch(err => {
        console.error('❌ Lỗi sao chép:', err);
        alert('Không thể sao chép, vui lòng thử lại');
    });
}

// ==================== PROCESS CARD PAYMENT ====================
function processCardPayment() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;
    const cardHolder = document.getElementById('cardHolder').value;
    
    if (!cardNumber || cardNumber.length < 13) {
        showError('Vui lòng nhập số thẻ hợp lệ');
        return;
    }
    
    if (!cardExpiry || !cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        showError('Vui lòng nhập ngày hết hạn (MM/YY)');
        return;
    }
    
    if (!cardCVV || cardCVV.length < 3) {
        showError('Vui lòng nhập CVV hợp lệ');
        return;
    }
    
    if (!cardHolder.trim()) {
        showError('Vui lòng nhập tên chủ thẻ');
        return;
    }
    
    console.log('💳 Đang xử lý thanh toán bằng thẻ...');
    
    setTimeout(() => {
        showSuccess('Thanh toán bằng thẻ thành công!');
    }, 2000);
}

// ==================== PROCESS WALLET PAYMENT ====================
function processWalletPayment(wallet) {
    console.log('💰 Đang xử lý thanh toán bằng:', wallet);
    
    const walletNames = {
        'momo': 'Momo',
        'zalopay': 'ZaloPay',
        'paypal': 'PayPal',
        'googleplay': 'Google Pay'
    };
    
    alert(`Chuyển hướng đến ${walletNames[wallet]}...\n\nTrong thực tế, đây sẽ là redirect tới ứng dụng hoặc website của ${walletNames[wallet]}`);
    
    setTimeout(() => {
        showSuccess(`Thanh toán bằng ${walletNames[wallet]} thành công!`);
    }, 2000);
}

// ==================== SHOW SUCCESS MODAL ====================
function showSuccess(message) {
    const courseName = localStorage.getItem('selectedCourseName') || 'Khóa học';
    const coursePrice = localStorage.getItem('selectedCoursePrice') || '0';
    
    document.getElementById('successDetails').innerHTML = `
        <p><strong>Khóa học:</strong> ${courseName}</p>
        <p><strong>Giá:</strong> ${formatCurrency(coursePrice)}</p>
        <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
        <p><strong>Mã giao dịch:</strong> #${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
    `;
    
    document.getElementById('successModal').classList.add('active');
    console.log('✅ Thanh toán thành công');
}

// ==================== SHOW ERROR MODAL ====================
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.add('active');
    console.log('❌ Lỗi:', message);
}

// ==================== CLOSE MODAL ====================
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ==================== GO TO COURSE ====================
function goToCourse() {
    const courseId = localStorage.getItem('selectedCourseId') || '4';
    window.location.href = `course-detail.html?id=${courseId}`;
}

// ==================== FORMAT CURRENCY ====================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
}

// ==================== INITIALIZE EVENT LISTENERS ====================
function initializeEventListeners() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cardCVVInput = document.getElementById('cardCVV');
    if (cardCVVInput) {
        cardCVVInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ==================== PERFORMANCE LOGGING ====================
console.log('%c💳 ISLearn Payment Page v1.0', 'color: #0057FF; font-size: 16px; font-weight: bold;');
console.log('%cTrang thanh toán an toàn', 'color: #27AE60; font-size: 12px;');