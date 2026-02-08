document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. إعدادات وبيانات --- */
    const coursesGrid = document.getElementById('courses-grid');
    const searchInput = document.getElementById('course-search');
    const categoryFilter = document.getElementById('category-filter');
    const modal = document.getElementById('course-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // بيانات احتياطية (Fallback) في حال فشل تحميل ملف JSON
    const fallbackCourses = [
        { id: "c001", title: "Python Basics", category: "برمجة", instructor: "د. أحمد علي", duration: "8 أسابيع", price: "تواصل", shortDesc: "دورة بايثون شاملة للمبتدئين.", image: "assets/images/placeholder.webp" },
        { id: "c002", title: "Web Development", category: "برمجة", instructor: "م. محمد صلاح", duration: "10 أسابيع", price: "تواصل", shortDesc: "HTML, CSS, JS من الصفر للاحتراف.", image: "assets/images/placeholder.webp" },
        { id: "c003", title: "Graphic Design", category: "تصميم", instructor: "أ. سارة يوسف", duration: "6 أسابيع", price: "تواصل", shortDesc: "فوتوشوب واليستريتور.", image: "assets/images/placeholder.webp" }
    ];

    let allCourses = [];

    /* --- 2. تحميل الدورات --- */
    async function fetchCourses() {
        try {
            const response = await fetch('assets/data/courses.json');
            if (!response.ok) throw new Error('Network error');
            allCourses = await response.json();
            renderCourses(allCourses);
        } catch (error) {
            console.error('Error loading courses:', error);
            // استخدام البيانات الاحتياطية
            console.log('Using fallback data');
            renderCourses(fallbackCourses); 
            // ملاحظة: بما أننا كتبنا البيانات داخل الذاكرة كاحتياط، سيتم استخدامها.
            // في البيئة الحقيقية تأكد من أن ملف JSON موجود ومساره صحيح.
        }
    }

    /* --- 3. عرض الدورات (Rendering) --- */
    function renderCourses(courses) {
        coursesGrid.innerHTML = '';
        
        if (courses.length === 0) {
            coursesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">لا توجد دورات تطابق بحثك.</p>';
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card glass';
            card.innerHTML = `
                <img src="${course.image}" alt="${course.title}" class="course-img" onerror="this.src='https://placehold.co/600x400/222/FFF?text=New+Yali'">
                <div class="course-content">
                    <span class="course-cat">${course.category}</span>
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-desc">${course.shortDesc}</p>
                    <div class="course-meta">
                        <span>👤 ${course.instructor}</span>
                        <span>⏱ ${course.duration}</span>
                    </div>
                    <div class="course-actions">
                        <button class="btn-outline" onclick="openCourseModal('${course.id}')">تفاصيل</button>
                        <a href="#contact" class="btn-primary-sm" style="flex:1; text-align:center;">سجل</a>
                    </div>
                </div>
            `;
            coursesGrid.appendChild(card);
        });
    }

    /* --- 4. البحث والفلترة --- */
    function filterCourses() {
        const query = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filtered = allCourses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(query) || 
                                  course.instructor.toLowerCase().includes(query);
            const matchesCategory = category === 'all' || course.category === category;
            
            return matchesSearch && matchesCategory;
        });

        renderCourses(filtered);
    }

    searchInput.addEventListener('input', filterCourses);
    categoryFilter.addEventListener('change', filterCourses);

    /* --- 5. المودال (Modal Logic) --- */
    window.openCourseModal = (courseId) => {
        // البحث في القائمة الأصلية أو الاحتياطية
        let course = allCourses.find(c => c.id === courseId);
        if(!course) course = fallbackCourses.find(c => c.id === courseId);
        
        if (course) {
            modalBody.innerHTML = `
                <img src="${course.image}" class="modal-img" onerror="this.src='https://placehold.co/600x400/222/FFF?text=Course'">
                <div class="modal-body-content">
                    <span class="course-cat">${course.category}</span>
                    <h2>${course.title}</h2>
                    <p style="color:#aaa; margin-bottom:15px;">المدرب: ${course.instructor} | المدة: ${course.duration}</p>
                    <p>${course.shortDesc}</p>
                    <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:20px 0;">
                    <p><strong>مميزات الدورة:</strong><br>
                    - منهج عملي وتطبيقي<br>
                    - شهادة معتمدة من نيو يالي<br>
                    - متابعة مستمرة مع المدرب
                    </p>
                </div>
            `;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // منع السكرول في الخلفية
        }
    };

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    /* --- 6. القائمة الجانبية (Mobile Menu) --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mainNav.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        mainNav.classList.remove('active');
    });

    // إغلاق القائمة عند الضغط على أي رابط
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });
    });

    /* --- 7. تأثيرات السكرول (Intersection Observer) --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    /* --- 8. نموذج التواصل (تظاهر بالإرسال) --- */
    const contactForm = document.getElementById('contact-form');
    const formMsg = document.getElementById('form-msg');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'جاري الإرسال...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = 'تم الإرسال بنجاح!';
            btn.style.background = '#25D366';
            formMsg.innerText = 'شكراً لتواصلك معنا، سيتم الرد عليك قريباً.';
            formMsg.style.color = '#25D366';
            formMsg.style.marginTop = '10px';
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.disabled = false;
                btn.style.background = ''; // Reset CSS
                formMsg.innerText = '';
            }, 3000);
        }, 1500);
    });

    // البدء بتحميل الدورات
    fetchCourses();
});
