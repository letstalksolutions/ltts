/**
 * Validation and field dependency management
 * This script handles field validation and manages interdependent fields
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize validation for all fields
    initializeValidation();
    
    // Set up interdependent field relationships
    setupInterdependentFields();
    
    // Initialize tooltips
    initializeTooltips();
});

/**
 * Initialize validation for all input fields
 */
function initializeValidation() {
    // Company income validation
    const companyIncomeField = document.getElementById('company-income');
    if (companyIncomeField) {
        companyIncomeField.addEventListener('input', function() {
            validateNumericField(this, 0, 100000000, 'company-income-error', 'Please enter a valid income amount between £0 and £100,000,000.');
        });
    }
    
    // Flat rate percentage validation
    const flatRateField = document.getElementById('flat-rate-percentage');
    if (flatRateField) {
        flatRateField.addEventListener('input', function() {
            validateNumericField(this, 0, 100, 'flat-rate-percentage-error', 'Please enter a valid percentage between 0% and 100%.');
        });
    }
    
    // Director shareholding validation
    const directorSharesFields = document.querySelectorAll('[id^="director-shares-"]');
    directorSharesFields.forEach(function(field) {
        field.addEventListener('input', function() {
            validateShareholding(this);
        });
    });
    
    // Director salary validation
    const directorSalaryFields = document.querySelectorAll('[id^="director-salary-"]');
    directorSalaryFields.forEach(function(field) {
        field.addEventListener('input', function() {
            validateNumericField(this, 0, 1000000, field.id + '-error', 'Please enter a valid salary amount between £0 and £1,000,000.');
        });
    });
    
    // Director pension validation
    const directorPensionFields = document.querySelectorAll('[id^="director-pension-"]');
    directorPensionFields.forEach(function(field) {
        field.addEventListener('input', function() {
            validateNumericField(this, 0, 60000, field.id + '-error', 'Please enter a valid pension amount between £0 and £60,000 (annual allowance).');
        });
    });
    
    // Employee salary validation
    const employeeSalaryFields = document.querySelectorAll('[id^="employee-salary-"]');
    employeeSalaryFields.forEach(function(field) {
        field.addEventListener('input', function() {
            validateNumericField(this, 0, 1000000, field.id + '-error', 'Please enter a valid salary amount between £0 and £1,000,000.');
        });
    });
}

/**
 * Validate a numeric field
 * @param {HTMLElement} field - The input field to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {string} errorId - ID of the error message element
 * @param {string} errorMessage - Error message to display
 */
function validateNumericField(field, min, max, errorId, errorMessage) {
    const value = parseFloat(field.value);
    const errorElement = document.getElementById(errorId);
    const validationIndicator = field.parentElement.querySelector('.validation-indicator');
    
    if (isNaN(value) || value < min || value > max) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('visible');
        }
        if (validationIndicator) {
            validationIndicator.classList.remove('valid');
            validationIndicator.classList.add('invalid');
            validationIndicator.innerHTML = '<i class="fas fa-times-circle"></i>';
        }
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
        if (validationIndicator) {
            validationIndicator.classList.remove('invalid');
            validationIndicator.classList.add('valid');
            validationIndicator.innerHTML = '<i class="fas fa-check-circle"></i>';
        }
        return true;
    }
}

/**
 * Validate shareholding percentages
 * @param {HTMLElement} field - The shareholding input field
 */
function validateShareholding(field) {
    const value = parseFloat(field.value);
    const errorElement = document.getElementById(field.id + '-error');
    const validationIndicator = field.parentElement.querySelector('.validation-indicator');
    
    // Basic validation for the individual field
    if (isNaN(value) || value < 0 || value > 100) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = 'Shareholding must be between 0% and 100%.';
            errorElement.classList.add('visible');
        }
        if (validationIndicator) {
            validationIndicator.classList.remove('valid');
            validationIndicator.classList.add('invalid');
            validationIndicator.innerHTML = '<i class="fas fa-times-circle"></i>';
        }
        return false;
    }
    
    // Check that all shareholdings add up to 100%
    const allShareholdingFields = document.querySelectorAll('[id^="director-shares-"]');
    let totalShareholding = 0;
    
    allShareholdingFields.forEach(function(shareField) {
        const shareValue = parseFloat(shareField.value);
        if (!isNaN(shareValue)) {
            totalShareholding += shareValue;
        }
    });
    
    if (Math.abs(totalShareholding - 100) > 0.01) { // Allow for small floating point errors
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = `Total shareholding is ${totalShareholding.toFixed(2)}%. It must equal 100%.`;
            errorElement.classList.add('visible');
        }
        if (validationIndicator) {
            validationIndicator.classList.remove('valid');
            validationIndicator.classList.add('invalid');
            validationIndicator.innerHTML = '<i class="fas fa-times-circle"></i>';
        }
        
        // Highlight all shareholding fields as they're interdependent
        allShareholdingFields.forEach(function(shareField) {
            shareField.parentElement.classList.add('highlight');
        });
        
        return false;
    } else {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
        if (validationIndicator) {
            validationIndicator.classList.remove('invalid');
            validationIndicator.classList.add('valid');
            validationIndicator.innerHTML = '<i class="fas fa-check-circle"></i>';
        }
        
        // Remove highlight from all shareholding fields
        allShareholdingFields.forEach(function(shareField) {
            shareField.parentElement.classList.remove('highlight');
        });
        
        return true;
    }
}

/**
 * Set up interdependent field relationships
 */
function setupInterdependentFields() {
    // VAT registration dependencies
    const vatRegisteredField = document.getElementById('vat-registered');
    const vatSchemeContainer = document.getElementById('vat-scheme-container');
    const flatRateContainer = document.getElementById('flat-rate-container');
    const vatSchemeField = document.getElementById('vat-scheme');
    
    if (vatRegisteredField && vatSchemeContainer && flatRateContainer && vatSchemeField) {
        // Initial setup
        updateVatFields();
        
        // Add event listeners
        vatRegisteredField.addEventListener('change', updateVatFields);
        vatSchemeField.addEventListener('change', updateVatFields);
    }
    
    // Employee invoiceable dependencies
    const employeeInvoiceableFields = document.querySelectorAll('[id^="employee-invoiceable-"]');
    employeeInvoiceableFields.forEach(function(field) {
        // Initial setup
        updateInvoiceableFields(field);
        
        // Add event listener
        field.addEventListener('change', function() {
            updateInvoiceableFields(this);
        });
    });
    
    // Billable hours must be less than or equal to total hours
    const employeeHoursFields = document.querySelectorAll('[id^="employee-hours-"]');
    const employeeBillableHoursFields = document.querySelectorAll('[id^="employee-billable-hours-"]');
    
    employeeHoursFields.forEach(function(field) {
        field.addEventListener('input', function() {
            const employeeId = field.id.split('-').pop();
            const billableHoursField = document.getElementById(`employee-billable-hours-${employeeId}`);
            
            if (billableHoursField) {
                const hoursValue = parseFloat(field.value);
                const billableHoursValue = parseFloat(billableHoursField.value);
                
                if (!isNaN(hoursValue) && !isNaN(billableHoursValue) && billableHoursValue > hoursValue) {
                    billableHoursField.value = hoursValue;
                    // Trigger validation
                    const event = new Event('input');
                    billableHoursField.dispatchEvent(event);
                }
            }
        });
    });
    
    employeeBillableHoursFields.forEach(function(field) {
        field.addEventListener('input', function() {
            const employeeId = field.id.split('-').pop();
            const hoursField = document.getElementById(`employee-hours-${employeeId}`);
            
            if (hoursField) {
                const hoursValue = parseFloat(hoursField.value);
                const billableHoursValue = parseFloat(field.value);
                
                if (!isNaN(hoursValue) && !isNaN(billableHoursValue)) {
                    if (billableHoursValue > hoursValue) {
                        field.value = hoursValue;
                    }
                }
            }
        });
    });
}

/**
 * Update VAT-related fields based on VAT registration status
 */
function updateVatFields() {
    const vatRegisteredField = document.getElementById('vat-registered');
    const vatSchemeContainer = document.getElementById('vat-scheme-container');
    const flatRateContainer = document.getElementById('flat-rate-container');
    const vatSchemeField = document.getElementById('vat-scheme');
    
    if (vatRegisteredField.value === 'yes') {
        // Enable VAT scheme selection
        vatSchemeContainer.style.display = 'block';
        vatSchemeField.disabled = false;
        
        // Show/hide flat rate percentage based on selected scheme
        if (vatSchemeField.value === 'flat-rate') {
            flatRateContainer.style.display = 'block';
            document.getElementById('flat-rate-percentage').disabled = false;
        } else {
            flatRateContainer.style.display = 'none';
            document.getElementById('flat-rate-percentage').disabled = true;
        }
    } else {
        // Disable VAT scheme selection and flat rate percentage
        vatSchemeContainer.style.display = 'none';
        flatRateContainer.style.display = 'none';
        vatSchemeField.disabled = true;
        document.getElementById('flat-rate-percentage').disabled = true;
    }
    
    // Highlight interdependent fields
    highlightInterdependentFields([
        vatRegisteredField.parentElement,
        vatSchemeContainer,
        flatRateContainer
    ]);
}

/**
 * Update invoiceable-related fields based on invoiceable status
 * @param {HTMLElement} field - The invoiceable select field
 */
function updateInvoiceableFields(field) {
    const employeeId = field.id.split('-').pop();
    const invoicingDetails = document.getElementById(`invoicing-details-${employeeId}`);
    
    if (invoicingDetails) {
        if (field.value === 'yes') {
            invoicingDetails.style.display = 'block';
            const inputs = invoicingDetails.querySelectorAll('input');
            inputs.forEach(function(input) {
                input.disabled = false;
            });
        } else {
            invoicingDetails.style.display = 'none';
            const inputs = invoicingDetails.querySelectorAll('input');
            inputs.forEach(function(input) {
                input.disabled = true;
            });
        }
    }
}

/**
 * Highlight interdependent fields to show their relationship
 * @param {Array} fields - Array of field container elements
 */
function highlightInterdependentFields(fields) {
    // First remove all highlights
    fields.forEach(function(field) {
        if (field) {
            field.classList.remove('highlight');
        }
    });
    
    // Then add highlights with a slight delay for visual effect
    setTimeout(function() {
        fields.forEach(function(field) {
            if (field && field.style.display !== 'none') {
                field.classList.add('highlight');
            }
        });
        
        // Remove highlights after a short time
        setTimeout(function() {
            fields.forEach(function(field) {
                if (field) {
                    field.classList.remove('highlight');
                }
            });
        }, 2000);
    }, 100);
}

/**
 * Initialize tooltips for help icons
 */
function initializeTooltips() {
    // Add click handler for mobile devices
    const helpIcons = document.querySelectorAll('.field-help');
    helpIcons.forEach(function(icon) {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle tooltip visibility
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                const isVisible = tooltip.style.visibility === 'visible';
                
                // Hide all tooltips first
                document.querySelectorAll('.tooltip').forEach(function(tip) {
                    tip.style.visibility = 'hidden';
                    tip.style.opacity = '0';
                });
                
                // Toggle this tooltip
                if (!isVisible) {
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                    
                    // Hide after 3 seconds
                    setTimeout(function() {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    }, 3000);
                }
            }
        });
    });
}
