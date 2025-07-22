document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('farmerRegistrationForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLineFill = document.querySelector('.progress-line-fill');
    const nextButtons = document.querySelectorAll('.next-step-btn');
    const prevButtons = document.querySelectorAll('.prev-step-btn');
    const submitBtn = document.getElementById('submitBtn');
    const fileNameSpan = document.getElementById('fileName');
    const idUploadInput = document.getElementById('idUpload');

    let currentStep = 0; // 0-indexed for array, corresponds to data-step 1

    // Data for dynamic dropdowns (simulated)
    const regionsData = {
        "Dar es Salaam": ["Kinondoni", "Ilala", "Temeke", "Kigamboni", "Ubungo"],
        "Arusha": ["Arusha DC", "Arusha CC", "Karatu", "Longido", "Meru", "Monduli"],
        "Morogoro": ["Morogoro DC", "Morogoro MC", "Gairo", "Kilombero", "Kilosa", "Malinyi", "Mvomero", "Ulanga", "Ifakara TC"],
        // Add more regions and districts as needed
    };

    const regionSelect = document.getElementById('region');
    const districtSelect = document.getElementById('district');

    // Populate Regions dropdown
    for (const region in regionsData) {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    }

    // Event listener for Region change to populate Districts
    regionSelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        districtSelect.innerHTML = '<option value="">Select District</option>'; // Clear existing options
        districtSelect.disabled = true; // Disable until a region is selected

        if (selectedRegion && regionsData[selectedRegion]) {
            regionsData[selectedRegion].forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
            districtSelect.disabled = false;
        }
    });

    // --- Form Navigation and Progress Bar ---

    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });

        progressSteps.forEach((pStep, index) => {
            if (index < stepIndex) {
                pStep.classList.add('completed');
                pStep.classList.remove('active');
            } else if (index === stepIndex) {
                pStep.classList.add('active');
                pStep.classList.remove('completed');
            } else {
                pStep.classList.remove('active', 'completed');
            }
        });

        // Update progress line fill
        const progressPercentage = (stepIndex / (formSteps.length - 1)) * 100;
        progressLineFill.style.width = `${progressPercentage}%`;

        currentStep = stepIndex;
    }

    // Initial display
    showStep(currentStep);

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                showStep(parseInt(button.dataset.step) - 1); // data-step is 1-indexed
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            showStep(parseInt(button.dataset.step) - 1); // data-step is 1-indexed
        });
    });

    // --- Input Validation ---
    function validateInput(inputElement) {
        const errorMessage = document.getElementById(`${inputElement.id}-error`);
        let isValid = true;
        let message = '';

        if (inputElement.hasAttribute('required') && inputElement.value.trim() === '') {
            isValid = false;
            message = 'This field is required.';
        } else if (inputElement.type === 'email' && inputElement.value.trim() !== '' && !/\S+@\S+\.\S+/.test(inputElement.value)) {
            isValid = false;
            message = 'Please enter a valid email address.';
        } else if (inputElement.id === 'phone' && inputElement.value.trim() !== '' && !/^\+?[0-9]{9,15}$/.test(inputElement.value)) {
            isValid = false;
            message = 'Please enter a valid phone number (e.g., +2557XXXXXXXX).';
        } else if (inputElement.id === 'password') {
            if (inputElement.value.length < 8) {
                isValid = false;
                message = 'Password must be at least 8 characters long.';
            }
        } else if (inputElement.id === 'confirmPassword') {
            const passwordInput = document.getElementById('password');
            if (inputElement.value !== passwordInput.value) {
                isValid = false;
                message = 'Passwords do not match.';
            }
        } else if (inputElement.id === 'terms' && !inputElement.checked) {
            isValid = false;
            message = 'You must agree to the Terms and Conditions.';
        } else if (inputElement.id === 'farmSize' && inputElement.value <= 0) {
            isValid = false;
            message = 'Farm size must be a positive number.';
        }

        if (!isValid) {
            inputElement.classList.add('invalid');
            if (errorMessage) {
                errorMessage.textContent = message;
                errorMessage.classList.add('active');
            }
        } else {
            inputElement.classList.remove('invalid');
            if (errorMessage) {
                errorMessage.textContent = '';
                errorMessage.classList.remove('active');
            }
        }
        return isValid;
    }

    function validateStep(stepIndex) {
        let stepIsValid = true;
        const currentFormStep = formSteps[stepIndex];
        const inputs = currentFormStep.querySelectorAll('input:not([type="checkbox"]), input[type="checkbox"], select, textarea');

        inputs.forEach(input => {
            // Only validate required fields when moving to next step
            if (input.hasAttribute('required') || input.id === 'password' || input.id === 'confirmPassword' || input.id === 'email' || input.id === 'phone' || input.id === 'farmSize') {
                if (!validateInput(input)) {
                    stepIsValid = false;
                }
            }
        });
        return stepIsValid;
    }

    // Add real-time validation on input blur
    form.querySelectorAll('input:not([type="checkbox"]), select, textarea').forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    // Specific validation for password and confirm password on input
    document.getElementById('password').addEventListener('input', () => {
        validateInput(document.getElementById('password'));
        validateInput(document.getElementById('confirmPassword')); // Check confirm password immediately
    });
    document.getElementById('confirmPassword').addEventListener('input', () => {
        validateInput(document.getElementById('confirmPassword'));
    });
    document.getElementById('terms').addEventListener('change', () => {
        validateInput(document.getElementById('terms'));
    });

    // --- File Upload Placeholder Logic ---
    idUploadInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            fileNameSpan.textContent = event.target.files[0].name;
        } else {
            fileNameSpan.textContent = 'No file chosen';
        }
    });


    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep(formSteps.length - 1)) { // Validate the last step before submitting
            alert('Please correct the errors in the form.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Registering...';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            // Handle multi-select crops
            if (key === 'mainCrops') {
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        // Add selected file name (for demonstration)
        if (idUploadInput.files.length > 0) {
            data.uploadedFileName = idUploadInput.files[0].name;
            data.uploadedFileSize = idUploadInput.files[0].size;
            // In a real app, you'd upload the file to a server here
        }


        console.log('Farmer Registration Data:', data);
        alert('Registration successful! Welcome to Shamba Direct.');

        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Register';

        form.reset(); // Clear the form
        showStep(0); // Go back to the first step
    });
});