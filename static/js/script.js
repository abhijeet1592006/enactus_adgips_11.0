// =============================================
// COUNTING ANIMATION - STATS SECTION
// =============================================

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);

    let frame = 0;
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(target * progress);

        // Format large numbers with K suffix
        if (target >= 10000) {
            element.textContent = (currentCount / 1000).toFixed(1) + 'k' + suffix;
        } else {
            element.textContent = currentCount + suffix;
        }

        if (frame === totalFrames) {
            clearInterval(counter);
            // Final value formatting
            if (target >= 10000) {
                element.textContent = (target / 1000).toFixed(0) + 'k' + suffix;
            } else {
                element.textContent = target + suffix;
            }
        }
    }, frameDuration);
}

function initCountingAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number, .home-stat-number');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

// =============================================
// PAST PROJECTS INFINITE SCROLL
// =============================================

function initPastProjectsScroll() {
    const track = document.querySelector('.past-projects-track');
    if (!track) return;

    // Clone items for infinite scroll effect
    const items = track.innerHTML;
    track.innerHTML = items + items;
}

// =============================================
// SMOOTH SCROLL FOR ANCHORS
// =============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// =============================================
// PREMIUM SCROLL-HIDE NAVIGATION
// =============================================

function initScrollHideNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastScrollY = window.scrollY;
    let ticking = false;
    const hideThreshold = 80; // Only hide after scrolling past this point

    function updateNavState() {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;

        // Always show nav at top of page
        if (currentScrollY <= 20) {
            nav.classList.remove('nav-hidden');
            nav.classList.remove('nav-scrolled');
            lastScrollY = currentScrollY;
            ticking = false;
            return;
        }

        // Add scrolled class for enhanced shadow
        nav.classList.add('nav-scrolled');

        // Scrolling DOWN and past threshold - hide nav
        if (scrollDiff > 5 && currentScrollY > hideThreshold) {
            nav.classList.add('nav-hidden');
        }
        // Scrolling UP - show nav
        else if (scrollDiff < -5) {
            nav.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavState);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Show nav when hovering near top
    document.addEventListener('mousemove', (e) => {
        if (e.clientY < 80 && nav.classList.contains('nav-hidden')) {
            nav.classList.remove('nav-hidden');
        }
    });

    // Debug log to confirm init
    console.log('Scroll-hide nav initialized');
}

// =============================================
// CHARACTER ANIMATION FOR HERO TEXT
// =============================================

function initCharacterAnimation() {
    const chars = document.querySelectorAll('.split-text .char');
    chars.forEach((char, index) => {
        char.style.animationDelay = `${0.1 + (index * 0.05)}s`;
    });
}

// =============================================
// PARALLAX SCROLL EFFECT
// =============================================

function initParallaxEffect() {
    const hero = document.querySelector('.projects-hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.projects-hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });
}

// =============================================
// 3D TILT EFFECT FOR PORTRAIT CARDS
// =============================================

function initTiltEffect() {
    const cards = document.querySelectorAll('.portrait-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// =============================================
// GALLERY HORIZONTAL SCROLL (INFINITE)
// =============================================

function initGalleryInfinite() {
    const track = document.getElementById('galleryTrack');
    const wrapper = document.querySelector('.gallery-scroll-wrapper');
    if (!track || !wrapper) return;

    // Clone items for infinite scroll effect
    const items = track.innerHTML;
    track.innerHTML = items + items + items; // Triple for safety

    // Center the scroll
    const singleWidth = track.scrollWidth / 3;
    wrapper.scrollLeft = singleWidth;

    // Boundary check for infinite feel
    wrapper.addEventListener('scroll', () => {
        const scrollPos = wrapper.scrollLeft;
        if (scrollPos <= 0) {
            wrapper.scrollLeft = singleWidth;
        } else if (scrollPos >= singleWidth * 2) {
            wrapper.scrollLeft = singleWidth;
        }
    });

    initGalleryDrag(wrapper);
}

function scrollGallery(direction) {
    const wrapper = document.querySelector('.gallery-scroll-wrapper');
    if (!wrapper) return;

    const scrollAmount = 350;
    wrapper.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function initGalleryDrag(wrapper) {
    let isDown = false;
    let startX;
    let scrollLeft;

    wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        wrapper.style.cursor = 'grabbing';
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });

    wrapper.addEventListener('mouseleave', () => {
        isDown = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mouseup', () => {
        isDown = false;
        wrapper.style.cursor = 'grab';
    });

    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 2;
        wrapper.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor
    wrapper.style.cursor = 'grab';
}

// =============================================
// TEAM DATA - STRUCTURED BY TENURE & CATEGORY
// =============================================

const teamData = {
    "10.0": {
        council: [
            { name: "Shruti", role: "President", img: "/static/images/team/Council/1) President.jpg", linkedin: "https://www.linkedin.com/in/shruti-shrivastava-9b16142a1", instagram: "https://www.instagram.com/shrutttiiii.27" },
            { name: "Shivam Naithani", role: "Vice President", img: "/static/images/team/Council/2) Vice President.jpg", linkedin: "https://www.linkedin.com/in/shivam-naithani-76138a2b8/", instagram: "https://www.instagram.com/naithani_shivam_" },
            { name: "Kushal Goyal", role: "General Secretary", img: "/static/images/team/Council/3) General Secretory.jpg", pos: "center 5%", linkedin: "https://www.linkedin.com/in/kushalgoyaldev/", instagram: "https://www.instagram.com/kushal_goyal_27/" },
            { name: "Sujal Bhardwaj", role: "PR Head", img: "/static/images/team/Council/4) PR Head.jpg", linkedin: "https://www.linkedin.com/in/sujal-bhardwaj-8332b92b1/", instagram: "https://www.instagram.com/sujjal.__/" }
        ],
        department: [
            { name: "Tushar Jha", role: "Technical Head", img: "/static/images/team/Department heads/1) Technical Head.jpg", linkedin: "https://www.linkedin.com/in/tushar-jha-4350882b1/", instagram: "https://www.instagram.com/tushar_jha._/" },
            { name: "Ankit Jha", role: "Graphics & Photography Head", img: "/static/images/team/Department heads/2) Graphics & Photography Head.jpg", linkedin: "https://www.linkedin.com/in/ankitt-jha", instagram: "https://www.instagram.com/ankitt_07/" },
            { name: "Granth Chawla", role: "Graphics & Photography Head", img: "/static/images/team/Department heads/3) Graphics & Photography Head.png", linkedin: "https://www.linkedin.com/in/granth-chawla-489965325/", instagram: "https://www.instagram.com/granthchawla_01/" },
            { name: "Aman Giri", role: "Research And Content Head", img: "/static/images/team/Department heads/4) Content Head.jpg", linkedin: "https://www.linkedin.com/in/aman-giri-4bb311327", instagram: "https://www.instagram.com/ofc_.aman2g" },
            { name: "Aniket", role: "Social Media Head", img: "/static/images/team/Department heads/5) Social Media Head.jpg", linkedin: "https://www.linkedin.com/in/", instagram: "https://www.instagram.com/anikethsharmakaushik" },
            { name: "Radhika", role: "Marketing Head", img: "/static/images/team/Department heads/6) Marketing Head.jpg", linkedin: "https://www.linkedin.com/in/radhika-mittal-0296a8230", instagram: "https://www.instagram.com/enne_radhika/" },
            { name: "Yug Sharma", role: "Sponsorship Head", img: "/static/images/team/Department heads/7) Sponsorship Head.jpeg", linkedin: "https://www.linkedin.com/in/yug-sharma-1b47b7347/", instagram: "https://www.instagram.com/yug_sharmaa__/" }
        ],
        project: [
            { name: "Vishv Dhama", role: "Project Navodaya Head", img: "/static/images/team/Project heads/1) Project Navodaya Head.jpg", linkedin: "https://www.linkedin.com/in/vishvdhama1405/", instagram: "https://www.instagram.com/vishv._.dhama/" },
            { name: "Rubi Negi", role: "Project Navodaya Head", img: "/static/images/team/Project heads/2) Project Navodaya Head.jpg", linkedin: "https://www.linkedin.com/in/rubi-negi28/", instagram: "" },
            { name: "Lakshay Gupta", role: "Project Astitva Head", img: "/static/images/team/Project heads/3) Project Astitva Head.jpg", linkedin: "https://www.linkedin.com/in/lakshay-gupta-436776349", instagram: "https://www.instagram.com/lakshaayy75" },
            { name: "S. V. Mounika", role: "Project Astitva Head", img: "/static/images/team/Project heads/4) Project Astitva Head.jpg", linkedin: "https://www.linkedin.com/in/sangati-veera-mounika", instagram: "https://www.instagram.com/mounikareddy8003" },
            { name: "Priyanshu", role: "Project Vriksh Head", img: "/static/images/team/Project heads/5) Project Vriksh Head.jpg", linkedin: "https://www.linkedin.com/in/priyanshu-thakur-301112326/", instagram: "https://www.instagram.com/pri_yanshu88/" },
            { name: "Swastiki", role: "Project Vriksh Head", img: "/static/images/team/Project heads/6) Project Vriksh Head.png", linkedin: "https://www.linkedin.com/in/swastiki-vishnoi-871864320", instagram: "https://www.instagram.com/danceamoureuse" }
        ]
    }
};

// Legacy Data - Past Presidents & Key Leaders
const legacyData = [
    { tenure: "1", name: "Vaishali Aggarwal", designation: "Founder President", achievement: "Established the Enactus foundation." },
    { tenure: "2", name: "Deepanshu Wadhwa", designation: "President", achievement: "Achieved the first National Recognition." },
    { tenure: "3", name: "Manasvi Grover", designation: "President", achievement: "Focused on Community Outreach." },
    { tenure: "4", name: "Aayush Gill", designation: "President", achievement: "Reached the 100+ Volunteers milestone." },
    { tenure: "5", name: "Tanya Nischal", designation: "President", achievement: "Formed International Partnerships." },
    { tenure: "6", name: "Akashat Dhaunda", designation: "President", achievement: "Introduced Innovation in Social Tech." },
    { tenure: "7", name: "Anushka Khanduja", designation: "President", achievement: "Achieved Strategic Impact Scaling." },
    { tenure: "8", name: "Vibhor Jain", designation: "President", achievement: "National Competition Finalist." },
    { tenure: "9", name: "Sonika Nautiyal", designation: "President", achievement: "Focused on Sustainable Development Goals." }
];

// =============================================
// RENDER FUNCTIONS - PORTRAIT CARDS
// =============================================

function renderPortraitCard(member, showDept = false) {
    const deptHtml = showDept && member.dept ? `<span class="portrait-dept">${member.dept}</span>` : '';

    return `
        <div class="portrait-card" data-aos="fade-up">
            <div class="portrait-image">
                <img src="${member.img}" alt="${member.name}" loading="lazy" style="${member.pos ? `object-position: ${member.pos};` : ''} ${member.scale ? `transform: scale(${member.scale});` : ''}" onerror="this.src='https://via.placeholder.com/400x500?text=${encodeURIComponent(member.name)}'">
                <div class="portrait-gradient"></div>
            </div>
            <div class="portrait-info">
                <h3 class="portrait-name">${member.name}</h3>
                <span class="portrait-role">${member.role}</span>
                ${deptHtml}
                <div class="portrait-socials">
                    ${member.linkedin && member.linkedin !== '#' ? `
                    <a href="${member.linkedin}" target="_blank" aria-label="LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>` : ''}
                    ${member.instagram && member.instagram !== '#' ? `
                    <a href="${member.instagram}" target="_blank" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderMemberCard(member, showDept = false) {
    const deptHtml = showDept && member.dept ? `<p class="member-dept">${member.dept}</p>` : '';

    return `
        <div class="member-card" data-aos="fade-up">
            <div class="member-avatar">
                <img src="${member.img}" alt="${member.name}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${member.name.split(' ').map(n => n[0]).join('')}</span>'; this.parentElement.classList.add('placeholder');">
            </div>
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            ${deptHtml}
            <div class="member-socials">
                <a href="${member.linkedin || '#'}" target="_blank" class="social-link" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
                <a href="${member.instagram || '#'}" target="_blank" class="social-link" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>
            </div>
        </div>
    `;
}

function renderTeamSection(tenure, category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const members = teamData[tenure]?.[category] || [];

    if (members.length === 0) {
        container.innerHTML = `
            <div class="no-data-message" style="text-align: center; padding: 3rem; color: #7a8b88; grid-column: 1 / -1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 15h8M9 9h.01M15 9h.01"></path>
                </svg>
                <p>No team members found for this tenure.</p>
            </div>
        `;
        return;
    }

    const showDept = category !== 'council';
    // Use portrait cards for the new design
    container.innerHTML = members.map(m => renderPortraitCard(m, showDept)).join('');

    // Re-initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }

    // Initialize tilt effect for new cards
    setTimeout(() => initTiltEffect(), 100);
}

function renderLegacyTable() {
    const tbody = document.getElementById('legacyTableBody');
    if (!tbody) return;

    tbody.innerHTML = legacyData.map(leader => `
        <tr>
            <td><span class="tenure-badge">${leader.tenure}</span></td>
            <td>${leader.name}</td>
            <td>${leader.designation}</td>
            <td><span class="achievement-badge">${leader.achievement}</span></td>
        </tr>
    `).join('');
}

// =============================================
// FILTER & NAVIGATION FUNCTIONS
// =============================================

let currentTenure = "10.0";
let currentCategory = "council";

function filterByTenure() {
    const tenureSelect = document.getElementById('tenureFilter');
    if (!tenureSelect) return;

    currentTenure = tenureSelect.value;
    renderAllSections();
}

function switchCategory(category) {
    currentCategory = category;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${category}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function renderAllSections() {
    renderTeamSection(currentTenure, 'council', 'councilContainer');
    renderTeamSection(currentTenure, 'department', 'departmentContainer');
    renderTeamSection(currentTenure, 'project', 'projectContainer');
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Premium Navigation - Scroll Hide
    initScrollHideNav();
    initHamburgerMenu();

    // Projects Page Initialization
    initCountingAnimation();
    initPastProjectsScroll();
    initCharacterAnimation();
    initParallaxEffect();
    initSmoothScroll();

    // Team Page Initialization
    if (document.getElementById('councilContainer')) {
        renderAllSections();
        renderLegacyTable();
    }

    // Gallery infinite scroll
    initGalleryInfinite();

    // Initialize tilt effect
    initTiltEffect();

    // Initialize tilt effect
    initTiltEffect();

    // Emotional Design: Micro-interactions
    initMagneticButtons();

    // Legacy Team Grid (Old Implementation - Keep for backward compatibility)
    if (document.getElementById('teamContainer')) {
        renderTeam(teamMembers);
    }
});

// =============================================
// EMOTIONAL DESIGN - MAGNETIC BUTTONS
// =============================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-links a');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull strength (lower is stronger/more movement)
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// =============================================
// LEGACY CODE - KEEP FOR BACKWARD COMPATIBILITY
// =============================================

// Dummy Data for Team Members (Old)
const teamMembers = [
    { name: "Sarah Jenkins", role: "President", year: "2024", dept: "executive", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500" },
    { name: "Aryan Mehta", role: "Tech Head", year: "2024", dept: "tech", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500" },
    { name: "John Doe", role: "Marketing Lead", year: "2023", dept: "marketing", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500" },
    { name: "Emily Chen", role: "Research Head", year: "2024", dept: "research", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500" },
    { name: "Mike Ross", role: "Ex-President", year: "2022", dept: "executive", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" },
    { name: "Priya Singh", role: "UI Designer", year: "2024", dept: "tech", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500" }
];

function renderTeam(members) {
    const container = document.getElementById('teamContainer');
    if (!container) return;
    container.innerHTML = '';

    members.forEach(member => {
        const card = `
            <div class="member-card" data-aos="fade-in">
                <img src="${member.img}" alt="${member.name}" class="member-img">
                <h3 style="font-size: 1.5rem;">${member.name}</h3>
                <p style="color: var(--brand-yellow); font-weight: 600;">${member.role}</p>
                <p style="color: #888; font-size: 0.9rem;">${member.year} | ${member.dept.toUpperCase()}</p>
            </div>
        `;
        container.innerHTML += card;
    });
}

function filterTeam() {
    const year = document.getElementById('yearFilter')?.value;
    const dept = document.getElementById('deptFilter')?.value;

    if (!year || !dept) return;

    const filtered = teamMembers.filter(member => {
        const matchYear = year === "all" || member.year === year;
        const matchDept = dept === "all" || member.dept === dept;
        return matchYear && matchDept;
    });

    renderTeam(filtered);
}

// =============================================
// EVENT ACCORDION LOGIC
// =============================================

function toggleEvent(card) {
    // Check if the clicked card is already open
    const isOpen = card.classList.contains('active');

    // Close all cards first (Exclusive Accordion)
    document.querySelectorAll('.event-card').forEach(c => {
        c.classList.remove('active');
    });

    // If it wasn't open, open it now
    if (!isOpen) {
        card.classList.add('active');
    }
}

// Fade out flash messages after 4 seconds
setTimeout(() => {
    const flash = document.querySelector('.flash-messages');
    if (flash) {
        flash.style.transition = "opacity 1s ease";
        flash.style.opacity = 0;
        setTimeout(() => flash.remove(), 1000);
    }
}, 4000);

// =============================================
// HAMBURGER MENU LOGIC
// =============================================

function initHamburgerMenu() {
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close on link click
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(link => link.style.animation = '');
        }
    });
}
