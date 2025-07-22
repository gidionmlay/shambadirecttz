 document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    const heroSection = document.querySelector('.hero'); // Target the whole hero section for hover
    let currentSlide = 0;
    let slideshowInterval;
    const slideDuration = 5000; // 5 seconds per slide (adjust as needed)

    function showSlide(index) {
        // Remove 'active' class from all slides and reset transform for the one that was active
        slides.forEach((slide, i) => {
            if (slide.classList.contains('active')) {
                slide.style.transform = 'scale(1.05)'; // Reset to initial zoom for next cycle if it was active
            }
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true'); // Hide from screen readers
        });

        // Add 'active' class to the current slide
        slides[index].classList.add('active');
        slides[index].setAttribute('aria-hidden', 'false'); // Show to screen readers
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        // Clear any existing interval to prevent multiple intervals running
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(nextSlide, slideDuration);
    }

    function pauseSlideshow() {
        clearInterval(slideshowInterval);
    }

    // Initial display
    showSlide(currentSlide);
    startSlideshow();

    // Pause on hover, resume on mouse leave
    if (heroSection) {
        heroSection.addEventListener('mouseenter', pauseSlideshow);
        heroSection.addEventListener('mouseleave', startSlideshow);
    }
});