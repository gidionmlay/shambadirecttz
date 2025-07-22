const catalogBtn = document.querySelector('.catalog-btn');
    const dropdown = document.querySelector('.catalog-dropdown');
  
    catalogBtn.addEventListener('click', () => {
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
  
    // Optional: close dropdown if clicking outside
    window.addEventListener('click', function(e) {
      if (!document.querySelector('.catalog').contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });