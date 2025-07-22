document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('supplierRegistrationForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLineFill = document.querySelector('.progress-line-fill');
    const nextButtons = document.querySelectorAll('.next-step-btn');
    const prevButtons = document.querySelectorAll('.prev-step-btn');
    const submitBtn = document.getElementById('submitBtn');

    let currentStep = 0; // 0-indexed for array, corresponds to data-step 1

    // --- Data for dynamic dropdowns (simulated for Tanzania regions/districts) ---
    const regionsData = {
        "Dar es Salaam": ["Kinondoni", "Ilala", "Temeke", "Kigamboni", "Ubungo"],
        "Arusha": ["Arusha DC", "Arusha CC", "Karatu", "Longido", "Meru", "Monduli"],
        "Morogoro": ["Morogoro DC", "Morogoro MC", "Gairo", "Kilombero", "Kilosa", "Malinyi", "Mvomero", "Ulanga", "Ifakara TC"],
        "Mwanza": ["Geita DC", "Magu", "Misungwi", "Nyamagana", "Kwimba", "Sengerema", "Ukerewe"],
        "Dodoma": ["Bahi", "Chamwino", "Chemba", "Dodoma CC", "Kondoa", "Mpwapwa", "Kongwa", "Singida", "Manyoni"]
        // Add more regions and districts as needed for comprehensive coverage
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
        // Also clear district error if region changes after validation
        validateInput(districtSelect);
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

        // Update progress line fill based on current step
        // (number of completed transitions / total transitions) * 100
        const completedTransitions = stepIndex; // Number of lines filled
        const totalTransitions = formSteps.length - 1; // Total lines to fill
        const progressPercentage = (completedTransitions / totalTransitions) * 100;
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

        // Handle required attribute
        if (inputElement.hasAttribute('required') && inputElement.value.trim() === '') {
            isValid = false;
            message = 'This field is required.';
        }
        // Specific validations based on input ID or type
        else if (inputElement.type === 'email' && inputElement.value.trim() !== '' && !/\S+@\S+\.\S+/.test(inputElement.value)) {
            isValid = false;
            message = 'Please enter a valid email address.';
        }
        else if (inputElement.id === 'contactPhone' && inputElement.value.trim() !== '' && !/^\+?[0-9]{9,15}$/.test(inputElement.value)) {
            isValid = false;
            message = 'Please enter a valid phone number (e.g., +2557XXXXXXXX).';
        }
        else if (inputElement.id === 'password') {
            if (inputElement.value.length < 8) {
                isValid = false;
                message = 'Password must be at least 8 characters long.';
            }
        }
        else if (inputElement.id === 'confirmPassword') {
            const passwordInput = document.getElementById('password');
            if (inputElement.value !== passwordInput.value) {
                isValid = false;
                message = 'Passwords do not match.';
            }
        }
        else if (inputElement.id === 'terms' && !inputElement.checked) {
            isValid = false;
            message = 'You must agree to the Terms and Conditions.';
        }
        else if (inputElement.id === 'productType' && inputElement.multiple && Array.from(inputElement.selectedOptions).length === 0) {
            isValid = false;
            message = 'Please select at least one product type.';
        }
        else if (inputElement.type === 'file') {
             if (inputElement.hasAttribute('required') && inputElement.files.length === 0) {
                isValid = false;
                message = 'This file upload is required.';
            } else if (inputElement.files.length > 0) {
                const file = inputElement.files[0];
                const maxSizeMB = (inputElement.id === 'locationGpsUpload') ? 2 : 5; // 2MB for GPS, 5MB for others
                if (file.size > maxSizeMB * 1024 * 1024) {
                    isValid = false;
                    message = `File size exceeds ${maxSizeMB}MB limit.`;
                }
                const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                const allowedPdfType = 'application/pdf';
                const fileType = file.type;

                if (inputElement.id === 'locationGpsUpload' && !allowedImageTypes.includes(fileType)) {
                    isValid = false;
                    message = 'Only image files (JPG, PNG, GIF, WEBP) are allowed.';
                } else if ((inputElement.id === 'regCertificateUpload' || inputElement.id === 'businessLicenseUpload') && !(allowedImageTypes.includes(fileType) || fileType === allowedPdfType)) {
                     isValid = false;
                     message = 'Only PDF or image files (JPG, PNG, GIF, WEBP) are allowed.';
                }
            }
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

    // Validate all required/key fields in the current step
    function validateStep(stepIndex) {
        let stepIsValid = true;
        const currentFormStep = formSteps[stepIndex];
        // Select all form control elements within the current step
        const inputs = currentFormStep.querySelectorAll('input:not([type="checkbox"]), input[type="checkbox"], select, textarea');

        inputs.forEach(input => {
            // Only validate if it's a required field OR a field with specific validation rules
            // (e.g., email, phone, password, file inputs)
            if (input.hasAttribute('required') || input.id === 'contactPhone' || input.id === 'contactEmail' ||
                input.id === 'password' || input.id === 'confirmPassword' || input.id === 'username' ||
                input.id === 'regCertificateUpload' || input.id === 'businessLicenseUpload' || input.id === 'locationGpsUpload') {
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

    // Specific validation on input for password and confirm password, and change for terms/multi-select
    document.getElementById('password').addEventListener('input', () => {
        validateInput(document.getElementById('password'));
        validateInput(document.getElementById('confirmPassword'));
    });
    document.getElementById('confirmPassword').addEventListener('input', () => {
        validateInput(document.getElementById('confirmPassword'));
    });
    document.getElementById('terms').addEventListener('change', () => {
        validateInput(document.getElementById('terms'));
    });
    document.getElementById('productType').addEventListener('change', () => {
        validateInput(document.getElementById('productType'));
    });
    document.getElementById('username').addEventListener('blur', () => {
        // Here you might add an AJAX call to check username availability
        validateInput(document.getElementById('username'));
    });


    // --- File Upload Logic ---
    const fileInputs = [
        { id: 'regCertificateUpload', nameSpan: 'regCertificateFileName' },
        { id: 'businessLicenseUpload', nameSpan: 'businessLicenseFileName' },
        { id: 'locationGpsUpload', nameSpan: 'locationGpsFileName' }
    ];

    fileInputs.forEach(fileData => {
        const inputElement = document.getElementById(fileData.id);
        const nameSpanElement = document.getElementById(fileData.nameSpan);

        inputElement.addEventListener('change', (event) => {
            if (event.target.files.length > 0) {
                nameSpanElement.textContent = event.target.files[0].name;
            } else {
                nameSpanElement.textContent = 'No file chosen';
            }
            validateInput(inputElement); // Validate immediately after file selection
        });
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

        // Simulate API call to backend
        await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 second delay for effect

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            // Special handling for multi-select product types
            if (key === 'productType') {
                if (!data[key]) {
                    data[key] = [];
                }
                data[key].push(value);
            } else {
                data[key] = value;
            }
        });

        // Add file names/sizes (for demonstration; actual files would be sent via FormData)
        fileInputs.forEach(fileData => {
            const inputElement = document.getElementById(fileData.id);
            if (inputElement.files.length > 0) {
                data[`${fileData.id}Name`] = inputElement.files[0].name;
                data[`${fileData.id}Size`] = inputElement.files[0].size;
            }
        });

        console.log('Supplier Registration Data:', data);

        // Success message or redirect
        alert('Supplier registration successful! Please check your email for verification.');
        // In a real application, you might redirect:
        // window.location.href = '/supplier-dashboard-welcome';

        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('.btn-text').textContent = 'Register Supplier';

        form.reset(); // Clear the form
        showStep(0); // Go back to the first step
        // Reset file input display names
        fileInputs.forEach(fileData => {
            document.getElementById(fileData.nameSpan).textContent = 'No file chosen';
        });
        // Reset dropdowns dependent on dynamic loading
        districtSelect.innerHTML = '<option value="">Select District</option>';
        districtSelect.disabled = true;
    });
});