document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        document.querySelectorAll('#navLinks a').forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('click', function (e) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    initializeDatePicker();
    setupTimeInputs();
    setupFormSubmission();

    // Change header on scroll
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(17, 17, 17, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'var(--black)';
            header.style.boxShadow = 'none';
        }
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.getAttribute('href') === '#') return;
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
            navLinks?.classList.remove('active');
        }
    });
});

// Set today's date as min for date input
function initializeDatePicker() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
}

// Setup dynamic time validation
function setupTimeInputs() {
    const start = document.getElementById('start-time');
    const end = document.getElementById('end-time');

    if (!start || !end) return;

    start.addEventListener('change', () => {
        if (start.value) {
            end.min = addTime(start.value, 30);
            if (end.value && end.value <= start.value) end.value = '';
        }
    });

    end.addEventListener('change', () => {
        if (start.value && end.value && end.value <= start.value) {
            end.setCustomValidity('End time must be after start time');
        } else {
            end.setCustomValidity('');
        }
    });
}

function addTime(time, minutesToAdd) {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m + minutesToAdd);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// Form submission
function setupFormSubmission() {
    const form = document.querySelector('.booking-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const eventType = document.getElementById('event-type').value;
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if (endTime <= startTime) {
            e.preventDefault();
            alert('Please select an end time that is after the start time.');
            return;
        }

        const formattedDate = formatDate(date);
        const formattedStart = formatTime(startTime);
        const formattedEnd = formatTime(endTime);
        const duration = getDuration(startTime, endTime);

        alert(`Thank you for your booking request, ${name}!\n\n` +
            `Event: ${eventType}\n` +
            `Date: ${formattedDate}\n` +
            `Time: ${formattedStart} - ${formattedEnd} (${duration})\n\n` +
            `We will contact you shortly at ${email} or ${phone} to confirm your session.`);

        // ✅ Do NOT preventDefault — form will now submit to Netlify
    });
}

// Helpers
function formatTime(time) {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h);
    date.setMinutes(m);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getDuration(start, end) {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    const minutes = (h2 * 60 + m2) - (h1 * 60 + m1);
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs ? `${hrs} hour${hrs !== 1 ? 's' : ''}` : ''}${hrs && mins ? ' ' : ''}${mins ? `${mins} minute${mins !== 1 ? 's' : ''}` : ''}` || '0 minutes';
}
