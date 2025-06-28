// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links'); // Changed to class selector

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling for Anchor Links
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

            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Initialize Date Picker
const initializeDatePicker = () => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
};

// Time Validation and Handling
const setupTimeInputs = () => {
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    if (!startTimeInput || !endTimeInput) return;

    // Update end time minimum when start time changes
    startTimeInput.addEventListener('change', () => {
        if (startTimeInput.value) {
            endTimeInput.min = addTime(startTimeInput.value, 30);
            // If current end time is invalid, reset it
            if (endTimeInput.value && endTimeInput.value <= startTimeInput.value) {
                endTimeInput.value = '';
            }
        }
    });

    // Validate end time is after start time
    endTimeInput.addEventListener('change', () => {
        if (startTimeInput.value && endTimeInput.value && endTimeInput.value <= startTimeInput.value) {
            endTimeInput.setCustomValidity('End time must be after start time');
        } else {
            endTimeInput.setCustomValidity('');
        }
    });
};

// Helper function to add minutes to a time string
const addTime = (timeString, minutesToAdd) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + minutesToAdd);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Format time for display (e.g. "09:00" -> "9:00 AM")
const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Format date for display (e.g. "2025-07-15" -> "Tuesday, July 15, 2025")
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Form Submission Handler
const setupFormSubmission = () => {
    const bookingForm = document.querySelector('.booking-form');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const eventType = document.getElementById('event-type').value;
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        // Validate time range
        if (endTime <= startTime) {
            alert('Please select an end time that is after the start time');
            return;
        }

        // Format for display
        const formattedDate = formatDateForDisplay(date);
        const formattedStart = formatTimeForDisplay(startTime);
        const formattedEnd = formatTimeForDisplay(endTime);

        // Calculate duration
        const duration = calculateDuration(startTime, endTime);

        // Show confirmation
        alert(`Thank you for your booking request, ${name}!\n\n` +
            `Event: ${eventType}\n` +
            `Date: ${formattedDate}\n` +
            `Time: ${formattedStart} - ${formattedEnd} (${duration})\n\n` +
            `We will contact you shortly at ${email} or ${phone} to confirm your session.`);

        // Reset form
        this.reset();
        initializeDatePicker(); // Reset date picker min date
    });
};

// Calculate duration between two times (e.g. "1 hour 30 minutes")
const calculateDuration = (startTime, endTime) => {
    const [startHours, startMins] = startTime.split(':').map(Number);
    const [endHours, endMins] = endTime.split(':').map(Number);

    let totalMinutes = (endHours * 60 + endMins) - (startHours * 60 + startMins);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let duration = '';
    if (hours > 0) duration += `${hours} hour${hours !== 1 ? 's' : ''}`;
    if (minutes > 0) {
        if (hours > 0) duration += ' ';
        duration += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    return duration || '0 minutes';
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDatePicker();
    setupTimeInputs();
    setupFormSubmission();

    // Change header style on scroll
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