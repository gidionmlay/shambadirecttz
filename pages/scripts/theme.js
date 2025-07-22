const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    console.log("Dark mode toggled:", document.body.classList.contains('dark-mode'));
  });