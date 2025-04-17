/**
 * UK Limited Company Tax Calculator
 * Interdependent fields functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize interdependent fields
    initializeInterdependentFields();
});

/**
 * Initialize interdependent fields
 */
function initializeInterdependentFields() {
    // VAT fields interdependency
    const vatRegistered = document.getElementById('vat-registered');
    const vatSchemeContainer = document.getElementById('vat-scheme-container');
    const vatScheme = document.getElementById('vat-scheme');
    const flatRateContainer = document.getElementById('flat-rate-container');
    
    if (vatRegistered && vatSchemeContainer && vatScheme && flatRateContainer) {
        // Initial state
        updateVatFields();
        
        // Add event listeners
        vatRegistered.addEventListener('change', updateVatFields);
        vatScheme.addEventListener('change', updateVatFields);
    }
    
    // Director shareholding interdependency
    const shareholdingInputs = document.querySelectorAll('.director-shareholding');
    const shareholdingError = document.getElementById('shareholding-error');
    
    if (shareholdingInputs.length > 0 && shareholdingError) {
        // Add event listeners
        shareholdingInputs.forEach(input => {
            input.addEventListener('input', validateTotalShareholding);
        });
        
        // Initial validation
        validateTotalShareholding();
    }
    
    /**
     * Update VAT fields based on current values
     */
    function updateVatFields() {
        // Show/hide VAT scheme based on VAT registration
        if (vatRegistered.value === 'yes') {
            vatSchemeContainer.style.display = 'block';
            
            // Show/hide flat rate percentage based on VAT scheme
            if (vatScheme.value === 'flat-rate') {
                flatRateContainer.style.display = 'block';
            } else {
                flatRateContainer.style.display = 'none';
            }
        } else {
            vatSchemeContainer.style.display = 'none';
            flatRateContainer.style.display = 'none';
        }
    }
    
    /**
     * Validate total shareholding
     */
    function validateTotalShareholding() {
        let totalShareholding = 0;
        
        shareholdingInputs.forEach(input => {
            const value = parseFloat(input.value);
            if (!isNaN(value)) {
                totalShareholding += value;
            }
        });
        
        if (Math.abs(totalShareholding - 100) > 0.01) {
            shareholdingError.style.display = 'block';
            return false;
        } else {
            shareholdingError.style.display = 'none';
            return true;
        }
    }
}
