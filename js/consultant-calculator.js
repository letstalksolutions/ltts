/**
 * UK Consultant Earnings Calculator
 * Main calculator functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Store calculator data
    const calculatorData = {
        consultant: {
            businessStructure: 'limited-company',
            vatRegistered: 'no',
            vatScheme: 'flat-rate',
            salaryStrategy: 'ni-threshold',
            customSalary: 8840,
            pensionContribution: 10000
        },
        engagement: {
            dayRate: 550,
            agencyMargin: 100,
            workingDays: 220,
            otherIncome: 0
        },
        expenses: {
            officeRent: 3600,
            equipment: 2000,
            software: 1000,
            insurance: 800,
            accounting: 1200,
            travel: 1500,
            marketing: 1000,
            other: 0
        }
    };

    // Initialize UI elements
    initializeCalculator();
    
    // Tab navigation
    initializeTabNavigation();
    
    // Form validation and data collection
    initializeFormHandling();
    
    // Update summary panel
    updateSummaryPanel();
});

/**
 * Initialize calculator UI elements
 */
function initializeCalculator() {
    // Initialize summary panel toggle
    const summaryToggle = document.querySelector('.summary-toggle');
    const summaryContent = document.querySelector('.summary-content');
    
    if (summaryToggle && summaryContent) {
        summaryToggle.addEventListener('click', function() {
            summaryContent.classList.toggle('collapsed');
            const icon = summaryToggle.querySelector('i');
            if (icon) {
                if (summaryContent.classList.contains('collapsed')) {
                    icon.className = 'fas fa-chevron-down';
                } else {
                    icon.className = 'fas fa-chevron-up';
                }
            }
        });
    }
    
    // Initialize print and save buttons
    const printButton = document.getElementById('print-results');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    const saveButton = document.getElementById('save-results');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Create a print window and then use browser's save as PDF
            const printWindow = window.open('', '_blank');
            
            // Create content for the print window
            let content = `
                <html>
                <head>
                    <title>Consultant Earnings Report - Let's Talk Tax Solutions</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        h1, h2, h3 { color: #2c3e50; }
                        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                        .results-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .results-table-row { display: flex; border-bottom: 1px solid #ddd; padding: 8px 0; }
                        .results-table-cell { flex: 1; padding: 8px; }
                        .results-table-cell:last-child { text-align: right; font-weight: bold; }
                        .total { font-weight: bold; background-color: #f8f9fa; }
                        .highlight { background-color: #e8f4f8; font-weight: bold; }
                        .disclaimer { font-size: 12px; font-style: italic; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Consultant Earnings Report</h1>
                        <p>Generated on ${new Date().toLocaleDateString()} by Let's Talk Tax Solutions</p>
                        
                        <h2>Summary</h2>
                        <div class="results-table">
                            <div class="results-table-row highlight">
                                <div class="results-table-cell">Annual Take-Home Pay</div>
                                <div class="results-table-cell">${document.getElementById('results-take-home').textContent}</div>
                            </div>
                            <div class="results-table-row">
                                <div class="results-table-cell">Monthly Take-Home</div>
                                <div class="results-table-cell">${document.getElementById('results-monthly').textContent}</div>
                            </div>
                            <div class="results-table-row">
                                <div class="results-table-cell">Daily Take-Home</div>
                                <div class="results-table-cell">${document.getElementById('results-daily').textContent}</div>
                            </div>
                        </div>
                        
                        <h2>Detailed Breakdown</h2>
            `;
            
            // Add all the detailed sections
            const detailSections = document.querySelectorAll('.results-table-section');
            detailSections.forEach(section => {
                const heading = section.querySelector('h4').textContent;
                content += `<h3>${heading}</h3><div class="results-table">`;
                
                const rows = section.querySelectorAll('.results-table-row');
                rows.forEach(row => {
                    const isTotal = row.classList.contains('total');
                    const isHighlight = row.classList.contains('highlight');
                    let rowClass = '';
                    if (isTotal) rowClass = 'total';
                    if (isHighlight) rowClass = 'highlight';
                    
                    const label = row.querySelector('.results-table-cell:first-child').textContent;
                    const value = row.querySelector('.results-table-cell:last-child').textContent;
                    
                    content += `
                        <div class="results-table-row ${rowClass}">
                            <div class="results-table-cell">${label}</div>
                            <div class="results-table-cell">${value}</div>
                        </div>
                    `;
                });
                
                content += `</div>`;
            });
            
            content += `
                        <div class="disclaimer">
                            <p><strong>Not Financial Advice:</strong> This report provides estimates only and does not constitute professional financial or tax advice. Always consult with a qualified accountant or tax professional before making financial decisions.</p>
                            <p>&copy; 2025 Let's Talk Tax Solutions. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.open();
            printWindow.document.write(content);
            printWindow.document.close();
            
            // Give time for content to load then print
            setTimeout(function() {
                printWindow.print();
            }, 500);
        });
    }
}

/**
 * Initialize tab navigation
 */
function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const nextButtons = document.querySelectorAll('.next-tab');
    const prevButtons = document.querySelectorAll('.prev-tab');
    
    // Tab button click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Validate current tab before switching
            const currentTab = document.querySelector('.tab-pane.active');
            if (currentTab && !validateTab(currentTab.id)) {
                // Don't switch tabs if validation fails
                return;
            }
            
            // Switch tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Update summary panel
            updateSummaryPanel();
            
            // Generate charts if results tab
            if (tabId === 'results-tab') {
                generateCharts();
            }
        });
    });
    
    // Next button click handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentTab = this.closest('.tab-pane');
            const currentTabId = currentTab.id;
            
            // Validate current tab before proceeding
            if (!validateTab(currentTabId)) {
                return;
            }
            
            // Find the next tab
            const currentTabButton = document.querySelector(`.tab-button[data-tab="${currentTabId}"]`);
            const nextTabButton = currentTabButton.nextElementSibling;
            
            if (nextTabButton) {
                // Click the next tab button
                nextTabButton.click();
                
                // Scroll to top of tab
                document.querySelector('.calculator-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Previous button click handlers
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentTab = this.closest('.tab-pane');
            const currentTabId = currentTab.id;
            
            // Find the previous tab
            const currentTabButton = document.querySelector(`.tab-button[data-tab="${currentTabId}"]`);
            const prevTabButton = currentTabButton.previousElementSibling;
            
            if (prevTabButton) {
                // Click the previous tab button
                prevTabButton.click();
                
                // Scroll to top of tab
                document.querySelector('.calculator-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Initialize form handling
 */
function initializeFormHandling() {
    // Consultant details tab form handling
    initializeConsultantTab();
    
    // Engagement details tab form handling
    initializeEngagementTab();
    
    // Expenses tab form handling
    initializeExpensesTab();
}

/**
 * Initialize consultant tab form handling
 */
function initializeConsultantTab() {
    // Business structure select
    const businessStructureSelect = document.getElementById('business-structure');
    if (businessStructureSelect) {
        businessStructureSelect.addEventListener('change', function() {
            calculatorData.consultant.businessStructure = this.value;
            updateInterdependentFields();
            updateSummaryPanel();
        });
    }
    
    // VAT registered select
    const vatRegisteredSelect = document.getElementById('vat-registered');
    if (vatRegisteredSelect) {
        vatRegisteredSelect.addEventListener('change', function() {
            calculatorData.consultant.vatRegistered = this.value;
            updateInterdependentFields();
            updateSummaryPanel();
        });
    }
    
    // VAT scheme select
    const vatSchemeSelect = document.getElementById('vat-scheme');
    if (vatSchemeSelect) {
        vatSchemeSelect.addEventListener('change', function() {
            calculatorData.consultant.vatScheme = this.value;
            updateSummaryPanel();
        });
    }
    
    // Salary strategy select
    const salaryStrategySelect = document.getElementById('salary-strategy');
    if (salaryStrategySelect) {
        salaryStrategySelect.addEventListener('change', function() {
            calculatorData.consultant.salaryStrategy = this.value;
            
            // Update custom salary field based on strategy
            const customSalaryContainer = document.getElementById('custom-salary-container');
            const customSalaryInput = document.getElementById('custom-salary');
            
            if (customSalaryContainer && customSalaryInput) {
                if (this.value === 'custom') {
                    customSalaryContainer.style.display = 'block';
                } else {
                    customSalaryContainer.style.display = 'none';
                    
                    // Set default salary based on strategy
                    if (this.value === 'ni-threshold') {
                        calculatorData.consultant.customSalary = 8840;
                        customSalaryInput.value = 8840;
                    } else if (this.value === 'personal-allowance') {
                        calculatorData.consultant.customSalary = 12570;
                        customSalaryInput.value = 12570;
                    }
                }
            }
            
            updateSummaryPanel();
        });
    }
    
    // Custom salary input
    const customSalaryInput = document.getElementById('custom-salary');
    if (customSalaryInput) {
        customSalaryInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.consultant.customSalary = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Pension contribution input
    const pensionInput = document.getElementById('pension-contribution');
    if (pensionInput) {
        pensionInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.consultant.pensionContribution = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Initialize interdependent fields
    updateInterdependentFields();
}

/**
 * Initialize engagement tab form handling
 */
function initializeEngagementTab() {
    // Day rate input
    const dayRateInput = document.getElementById('day-rate');
    if (dayRateInput) {
        dayRateInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.engagement.dayRate = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Agency margin input
    const agencyMarginInput = document.getElementById('agency-margin');
    if (agencyMarginInput) {
        agencyMarginInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.engagement.agencyMargin = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Working days input
    const workingDaysInput = document.getElementById('working-days');
    if (workingDaysInput) {
        workingDaysInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0 && value <= 365) {
                calculatorData.engagement.workingDays = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Other income input
    const otherIncomeInput = document.getElementById('other-income');
    if (otherIncomeInput) {
        otherIncomeInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.engagement.otherIncome = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
}

/**
 * Initialize expenses tab form handling
 */
function initializeExpensesTab() {
    // Office rent input
    const officeRentInput = document.getElementById('office-rent');
    if (officeRentInput) {
        officeRentInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.officeRent = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Equipment input
    const equipmentInput = document.getElementById('equipment');
    if (equipmentInput) {
        equipmentInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.equipment = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Software input
    const softwareInput = document.getElementById('software');
    if (softwareInput) {
        softwareInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.software = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Insurance input
    const insuranceInput = document.getElementById('insurance');
    if (insuranceInput) {
        insuranceInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.insurance = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Accounting input
    const accountingInput = document.getElementById('accounting');
    if (accountingInput) {
        accountingInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.accounting = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Travel input
    const travelInput = document.getElementById('travel');
    if (travelInput) {
        travelInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.travel = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Marketing input
    const marketingInput = document.getElementById('marketing');
    if (marketingInput) {
        marketingInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.marketing = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Other expenses input
    const otherExpensesInput = document.getElementById('other-expenses');
    if (otherExpensesInput) {
        otherExpensesInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.other = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
}

/**
 * Update interdependent fields based on current values
 */
function updateInterdependentFields() {
    // Business structure dependencies
    const businessStructure = document.getElementById('business-structure');
    const vatRegisteredContainer = document.getElementById('vat-registered-container');
    const vatSchemeContainer = document.getElementById('vat-scheme-container');
    
    if (businessStructure && vatRegisteredContainer && vatSchemeContainer) {
        // Show/hide VAT fields based on business structure
        if (businessStructure.value === 'limited-company' || businessStructure.value === 'sole-trader') {
            vatRegisteredContainer.style.display = 'block';
            
            // Show/hide VAT scheme based on VAT registration
            const vatRegistered = document.getElementById('vat-registered');
            if (vatRegistered && vatRegistered.value === 'yes') {
                vatSchemeContainer.style.display = 'block';
            } else {
                vatSchemeContainer.style.display = 'none';
            }
        } else {
            // Umbrella company - hide VAT fields
            vatRegisteredContainer.style.display = 'none';
            vatSchemeContainer.style.display = 'none';
        }
    }
    
    // Salary strategy dependencies
    const salaryStrategy = document.getElementById('salary-strategy');
    const customSalaryContainer = document.getElementById('custom-salary-container');
    
    if (salaryStrategy && customSalaryContainer) {
        if (salaryStrategy.value === 'custom') {
            customSalaryContainer.style.display = 'block';
        } else {
            customSalaryContainer.style.display = 'none';
        }
    }
}

/**
 * Validate a form field
 */
function validateField(field, isValid) {
    const validationIndicator = field.nextElementSibling;
    const errorMessage = field.nextElementSibling?.nextElementSibling;
    
    if (validationIndicator && validationIndicator.classList.contains('validation-indicator')) {
        if (isValid) {
            validationIndicator.classList.add('valid');
            validationIndicator.classList.remove('invalid');
            validationIndicator.innerHTML = '<i class="fas fa-check-circle"></i>';
            
            if (errorMessage && errorMessage.classList.contains('field-error')) {
                errorMessage.style.display = 'none';
            }
        } else {
            validationIndicator.classList.add('invalid');
            validationIndicator.classList.remove('valid');
            validationIndicator.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
            
            if (errorMessage && errorMessage.classList.contains('field-error')) {
                errorMessage.style.display = 'block';
            }
        }
    }
    
    return isValid;
}

/**
 * Validate a tab before proceeding
 */
function validateTab(tabId) {
    let isValid = true;
    
    // Validate consultant details tab
    if (tabId === 'consultant-details-tab') {
        const customSalaryInput = document.getElementById('custom-salary');
        const salaryStrategy = document.getElementById('salary-strategy');
        
        if (customSalaryInput && salaryStrategy && salaryStrategy.value === 'custom') {
            const value = parseFloat(customSalaryInput.value);
            if (isNaN(value) || value < 0) {
                validateField(customSalaryInput, false);
                isValid = false;
            }
        }
        
        const pensionInput = document.getElementById('pension-contribution');
        if (pensionInput) {
            const value = parseFloat(pensionInput.value);
            if (isNaN(value) || value < 0) {
                validateField(pensionInput, false);
                isValid = false;
            }
        }
    }
    
    // Validate engagement details tab
    else if (tabId === 'engagement-details-tab') {
        const dayRateInput = document.getElementById('day-rate');
        if (dayRateInput) {
            const value = parseFloat(dayRateInput.value);
            if (isNaN(value) || value < 0) {
                validateField(dayRateInput, false);
                isValid = false;
            }
        }
        
        const agencyMarginInput = document.getElementById('agency-margin');
        if (agencyMarginInput) {
            const value = parseFloat(agencyMarginInput.value);
            if (isNaN(value) || value < 0) {
                validateField(agencyMarginInput, false);
                isValid = false;
            }
        }
        
        const workingDaysInput = document.getElementById('working-days');
        if (workingDaysInput) {
            const value = parseFloat(workingDaysInput.value);
            if (isNaN(value) || value < 0 || value > 365) {
                validateField(workingDaysInput, false);
                isValid = false;
            }
        }
        
        const otherIncomeInput = document.getElementById('other-income');
        if (otherIncomeInput) {
            const value = parseFloat(otherIncomeInput.value);
            if (isNaN(value) || value < 0) {
                validateField(otherIncomeInput, false);
                isValid = false;
            }
        }
    }
    
    // Validate expenses tab
    else if (tabId === 'expenses-tab') {
        const expenseInputs = [
            document.getElementById('office-rent'),
            document.getElementById('equipment'),
            document.getElementById('software'),
            document.getElementById('insurance'),
            document.getElementById('accounting'),
            document.getElementById('travel'),
            document.getElementById('marketing'),
            document.getElementById('other-expenses')
        ];
        
        expenseInputs.forEach(input => {
            if (input) {
                const value = parseFloat(input.value);
                if (isNaN(value) || value < 0) {
                    validateField(input, false);
                    isValid = false;
                }
            }
        });
    }
    
    return isValid;
}

/**
 * Update the summary panel with current data
 */
function updateSummaryPanel() {
    // Calculate income
    const dayRateIncome = calculatorData.engagement.dayRate * calculatorData.engagement.workingDays;
    const totalIncome = dayRateIncome + calculatorData.engagement.otherIncome;
    const clientCharge = (calculatorData.engagement.dayRate + calculatorData.engagement.agencyMargin) * calculatorData.engagement.workingDays;
    
    // Calculate total expenses
    const totalExpenses = calculateTotalExpenses();
    
    // Calculate tax based on business structure
    let salary = 0;
    let pension = 0;
    let corporationTax = 0;
    let availableDividends = 0;
    let personalTax = 0;
    let takeHomePay = 0;
    
    if (calculatorData.consultant.businessStructure === 'limited-company') {
        // Get salary based on strategy
        if (calculatorData.consultant.salaryStrategy === 'ni-threshold') {
            salary = 8840;
        } else if (calculatorData.consultant.salaryStrategy === 'personal-allowance') {
            salary = 12570;
        } else {
            salary = calculatorData.consultant.customSalary;
        }
        
        pension = calculatorData.consultant.pensionContribution;
        
        // Calculate corporation tax
        const taxableProfit = totalIncome - salary - totalExpenses - pension;
        corporationTax = calculateCorporationTax(taxableProfit);
        availableDividends = taxableProfit - corporationTax;
        
        // Calculate personal tax
        personalTax = calculatePersonalTax(salary, availableDividends);
        
        // Calculate take-home pay
        takeHomePay = salary + availableDividends - personalTax;
    } else if (calculatorData.consultant.businessStructure === 'sole-trader') {
        // Sole trader - simpler tax calculation
        const taxableProfit = totalIncome - totalExpenses;
        personalTax = calculateSoleTraderTax(taxableProfit);
        takeHomePay = taxableProfit - personalTax;
    } else {
        // Umbrella company - PAYE calculation
        const umbrellaMargin = 25 * calculatorData.engagement.workingDays; // Typical umbrella margin
        const employerNI = calculateEmployerNI(totalIncome - umbrellaMargin);
        const taxableIncome = totalIncome - umbrellaMargin - employerNI;
        personalTax = calculatePayeTax(taxableIncome);
        takeHomePay = taxableIncome - personalTax;
    }
    
    // Update summary values
    document.getElementById('summary-day-rate').textContent = formatCurrency(calculatorData.engagement.dayRate);
    document.getElementById('summary-client-charge').textContent = formatCurrency(calculatorData.engagement.dayRate + calculatorData.engagement.agencyMargin);
    document.getElementById('summary-annual-gross').textContent = formatCurrency(totalIncome);
    document.getElementById('summary-expenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('summary-total-tax').textContent = formatCurrency(corporationTax + personalTax);
    document.getElementById('summary-take-home').textContent = formatCurrency(takeHomePay);
    
    // Update take-home pay card
    updateTakeHomePayCard(totalIncome, totalExpenses, corporationTax + personalTax, takeHomePay);
    
    // Update results tab if it's visible
    updateResultsTab(dayRateIncome, totalIncome, totalExpenses, salary, pension, corporationTax, availableDividends, personalTax, takeHomePay);
}

/**
 * Update take-home pay card
 */
function updateTakeHomePayCard(grossIncome, expenses, totalTax, takeHome) {
    const takeHomeGrid = document.getElementById('take-home-grid');
    
    if (takeHomeGrid) {
        // Clear existing cards
        takeHomeGrid.innerHTML = '';
        
        // Add card
        const card = document.createElement('div');
        card.className = 'take-home-card';
        card.innerHTML = `
            <div class="take-home-name">Consultant</div>
            <div class="take-home-amount">${formatCurrency(takeHome)}</div>
            <div class="take-home-breakdown">
                <div class="breakdown-item">
                    <span class="breakdown-label">Gross Income:</span>
                    <span class="breakdown-value">${formatCurrency(grossIncome)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Expenses:</span>
                    <span class="breakdown-value">-${formatCurrency(expenses)}</span>
                </div>
                <div class="breakdown-item">
                    <span class="breakdown-label">Total Tax:</span>
                    <span class="breakdown-value">-${formatCurrency(totalTax)}</span>
                </div>
            </div>
        `;
        
        takeHomeGrid.appendChild(card);
    }
}

/**
 * Update results tab
 */
function updateResultsTab(dayRateIncome, totalIncome, totalExpenses, salary, pension, corporationTax, availableDividends, personalTax, takeHomePay) {
    // Update main results values
    document.getElementById('results-take-home').textContent = formatCurrency(takeHomePay);
    document.getElementById('results-monthly').textContent = formatCurrency(takeHomePay / 12);
    document.getElementById('results-daily').textContent = formatCurrency(takeHomePay / calculatorData.engagement.workingDays);
    
    // Update detailed breakdown
    // Income section
    document.getElementById('detail-day-rate-income').textContent = formatCurrency(dayRateIncome);
    document.getElementById('detail-other-income').textContent = formatCurrency(calculatorData.engagement.otherIncome);
    document.getElementById('detail-total-income').textContent = formatCurrency(totalIncome);
    
    // Expenses section
    const officeEquipment = calculatorData.expenses.officeRent + calculatorData.expenses.equipment + calculatorData.expenses.software;
    const businessServices = calculatorData.expenses.insurance + calculatorData.expenses.accounting;
    const travelMarketing = calculatorData.expenses.travel + calculatorData.expenses.marketing;
    
    document.getElementById('detail-office-equipment').textContent = formatCurrency(officeEquipment);
    document.getElementById('detail-business-services').textContent = formatCurrency(businessServices);
    document.getElementById('detail-travel-marketing').textContent = formatCurrency(travelMarketing);
    document.getElementById('detail-other-expenses').textContent = formatCurrency(calculatorData.expenses.other);
    document.getElementById('detail-total-expenses').textContent = formatCurrency(totalExpenses);
    
    // Company finances section
    const grossProfit = totalIncome - totalExpenses;
    document.getElementById('detail-gross-profit').textContent = formatCurrency(grossProfit);
    document.getElementById('detail-salary').textContent = formatCurrency(salary);
    document.getElementById('detail-pension').textContent = formatCurrency(pension);
    document.getElementById('detail-taxable-profit').textContent = formatCurrency(grossProfit - salary - pension);
    document.getElementById('detail-corporation-tax').textContent = formatCurrency(corporationTax);
    document.getElementById('detail-available-dividends').textContent = formatCurrency(availableDividends);
    
    // Personal taxation section
    document.getElementById('detail-personal-salary').textContent = formatCurrency(salary);
    document.getElementById('detail-dividends').textContent = formatCurrency(availableDividends);
    document.getElementById('detail-personal-income').textContent = formatCurrency(salary + availableDividends);
    
    // Simplified breakdown of personal tax
    let incomeTax = 0;
    let nationalInsurance = 0;
    let dividendTax = 0;
    
    if (calculatorData.consultant.businessStructure === 'limited-company') {
        // Simplified calculation for display purposes
        const personalAllowance = 12570;
        
        // Income tax on salary
        if (salary > personalAllowance) {
            incomeTax = (salary - personalAllowance) * 0.2;
        }
        
        // National Insurance
        if (salary > 8840) {
            nationalInsurance = (Math.min(salary, 50270) - 8840) * 0.12;
            if (salary > 50270) {
                nationalInsurance += (salary - 50270) * 0.02;
            }
        }
        
        // Dividend tax
        const dividendAllowance = 1000;
        let taxableDividends = Math.max(0, availableDividends - dividendAllowance);
        
        // Determine which tax bands the dividends fall into
        let remainingBasicBand = 37700;
        
        // Adjust bands based on salary
        if (salary > personalAllowance) {
            remainingBasicBand -= Math.min(salary - personalAllowance, 37700);
        }
        
        // Calculate dividend tax
        if (taxableDividends > 0) {
            const basicRateDividends = Math.min(taxableDividends, remainingBasicBand);
            dividendTax = basicRateDividends * 0.0875;
            taxableDividends -= basicRateDividends;
            
            if (taxableDividends > 0) {
                const higherRateDividends = Math.min(taxableDividends, 87440);
                dividendTax += higherRateDividends * 0.3375;
                taxableDividends -= higherRateDividends;
                
                if (taxableDividends > 0) {
                    dividendTax += taxableDividends * 0.3935;
                }
            }
        }
    }
    
    document.getElementById('detail-income-tax').textContent = formatCurrency(incomeTax);
    document.getElementById('detail-national-insurance').textContent = formatCurrency(nationalInsurance);
    document.getElementById('detail-dividend-tax').textContent = formatCurrency(dividendTax);
    document.getElementById('detail-personal-tax').textContent = formatCurrency(personalTax);
    
    // Final results section
    const totalTax = corporationTax + personalTax;
    const effectiveTaxRate = Math.round((totalTax / totalIncome) * 1000) / 10;
    
    document.getElementById('detail-total-tax').textContent = formatCurrency(totalTax);
    document.getElementById('detail-tax-rate').textContent = `${effectiveTaxRate}%`;
    document.getElementById('detail-take-home').textContent = formatCurrency(takeHomePay);
}

/**
 * Calculate total expenses
 */
function calculateTotalExpenses() {
    return (
        calculatorData.expenses.officeRent +
        calculatorData.expenses.equipment +
        calculatorData.expenses.software +
        calculatorData.expenses.insurance +
        calculatorData.expenses.accounting +
        calculatorData.expenses.travel +
        calculatorData.expenses.marketing +
        calculatorData.expenses.other
    );
}

/**
 * Calculate corporation tax
 */
function calculateCorporationTax(taxableProfit) {
    // Corporation tax rate for 2025/26 is 25% for profits over £250,000
    // Small profits rate is 19% for profits under £50,000
    // Marginal relief applies between £50,000 and £250,000
    
    if (taxableProfit <= 0) {
        return 0;
    } else if (taxableProfit <= 50000) {
        return taxableProfit * 0.19;
    } else if (taxableProfit >= 250000) {
        return taxableProfit * 0.25;
    } else {
        // Marginal relief calculation
        const mainRate = 0.25;
        const smallProfitsRate = 0.19;
        const lowerLimit = 50000;
        const upperLimit = 250000;
        
        const marginalReliefFraction = (upperLimit - taxableProfit) / (upperLimit - lowerLimit);
        const effectiveRate = mainRate - ((mainRate - smallProfitsRate) * marginalReliefFraction);
        
        return taxableProfit * effectiveRate;
    }
}

/**
 * Calculate personal tax for limited company director
 */
function calculatePersonalTax(salary, dividends) {
    // Tax rates for 2025/26
    const personalAllowance = 12570;
    const basicRateLimit = 37700;
    const higherRateLimit = 125140;
    
    // Adjust personal allowance for high earners
    let adjustedPersonalAllowance = personalAllowance;
    const totalIncome = salary + dividends;
    
    if (totalIncome > 100000) {
        const reduction = Math.min(personalAllowance, (totalIncome - 100000) / 2);
        adjustedPersonalAllowance -= reduction;
    }
    
    // Calculate income tax on salary
    let salaryTaxableAmount = Math.max(0, salary - adjustedPersonalAllowance);
    let salaryTax = 0;
    
    if (salaryTaxableAmount > 0) {
        const basicRateSalary = Math.min(salaryTaxableAmount, basicRateLimit);
        salaryTax += basicRateSalary * 0.2;
        salaryTaxableAmount -= basicRateSalary;
        
        if (salaryTaxableAmount > 0) {
            const higherRateSalary = Math.min(salaryTaxableAmount, higherRateLimit - basicRateLimit);
            salaryTax += higherRateSalary * 0.4;
            salaryTaxableAmount -= higherRateSalary;
            
            if (salaryTaxableAmount > 0) {
                salaryTax += salaryTaxableAmount * 0.45;
            }
        }
    }
    
    // Calculate dividend tax
    const dividendAllowance = 1000;
    let dividendTaxableAmount = Math.max(0, dividends - dividendAllowance);
    let dividendTax = 0;
    
    // Determine which tax bands the dividends fall into
    let remainingBasicBand = basicRateLimit;
    let remainingHigherBand = higherRateLimit - basicRateLimit;
    
    // Adjust bands based on salary
    if (salary > adjustedPersonalAllowance) {
        const salaryInBasicBand = Math.min(salary - adjustedPersonalAllowance, basicRateLimit);
        remainingBasicBand -= salaryInBasicBand;
        
        if (salary - adjustedPersonalAllowance > basicRateLimit) {
            const salaryInHigherBand = Math.min(salary - adjustedPersonalAllowance - basicRateLimit, higherRateLimit - basicRateLimit);
            remainingHigherBand -= salaryInHigherBand;
        }
    }
    
    // Calculate dividend tax
    if (dividendTaxableAmount > 0) {
        const basicRateDividends = Math.min(dividendTaxableAmount, remainingBasicBand);
        dividendTax += basicRateDividends * 0.0875;
        dividendTaxableAmount -= basicRateDividends;
        
        if (dividendTaxableAmount > 0) {
            const higherRateDividends = Math.min(dividendTaxableAmount, remainingHigherBand);
            dividendTax += higherRateDividends * 0.3375;
            dividendTaxableAmount -= higherRateDividends;
            
            if (dividendTaxableAmount > 0) {
                dividendTax += dividendTaxableAmount * 0.3935;
            }
        }
    }
    
    // Calculate National Insurance
    let nationalInsurance = 0;
    
    // Primary threshold for 2025/26 is £12,570 per year
    // Upper earnings limit is £50,270 per year
    // Rate is 12% between primary threshold and upper earnings limit
    // Rate is 2% above upper earnings limit
    
    if (salary > 8840) {
        const niBasicBand = Math.min(salary, 50270) - 8840;
        nationalInsurance += niBasicBand * 0.12;
        
        if (salary > 50270) {
            const niHigherBand = salary - 50270;
            nationalInsurance += niHigherBand * 0.02;
        }
    }
    
    return salaryTax + dividendTax + nationalInsurance;
}

/**
 * Calculate tax for sole trader
 */
function calculateSoleTraderTax(taxableProfit) {
    // Tax rates for 2025/26
    const personalAllowance = 12570;
    const basicRateLimit = 37700;
    const higherRateLimit = 125140;
    
    // Adjust personal allowance for high earners
    let adjustedPersonalAllowance = personalAllowance;
    
    if (taxableProfit > 100000) {
        const reduction = Math.min(personalAllowance, (taxableProfit - 100000) / 2);
        adjustedPersonalAllowance -= reduction;
    }
    
    // Calculate income tax
    let taxableAmount = Math.max(0, taxableProfit - adjustedPersonalAllowance);
    let incomeTax = 0;
    
    if (taxableAmount > 0) {
        const basicRateAmount = Math.min(taxableAmount, basicRateLimit);
        incomeTax += basicRateAmount * 0.2;
        taxableAmount -= basicRateAmount;
        
        if (taxableAmount > 0) {
            const higherRateAmount = Math.min(taxableAmount, higherRateLimit - basicRateLimit);
            incomeTax += higherRateAmount * 0.4;
            taxableAmount -= higherRateAmount;
            
            if (taxableAmount > 0) {
                incomeTax += taxableAmount * 0.45;
            }
        }
    }
    
    // Calculate National Insurance
    let nationalInsurance = 0;
    
    // Class 4 NI thresholds for 2025/26
    const lowerProfitsLimit = 12570;
    const upperProfitsLimit = 50270;
    
    if (taxableProfit > lowerProfitsLimit) {
        const niBasicBand = Math.min(taxableProfit, upperProfitsLimit) - lowerProfitsLimit;
        nationalInsurance += niBasicBand * 0.09;
        
        if (taxableProfit > upperProfitsLimit) {
            const niHigherBand = taxableProfit - upperProfitsLimit;
            nationalInsurance += niHigherBand * 0.02;
        }
    }
    
    // Class 2 NI
    if (taxableProfit > 6725) {
        nationalInsurance += 3.45 * 52; // £3.45 per week
    }
    
    return incomeTax + nationalInsurance;
}

/**
 * Calculate PAYE tax for umbrella company
 */
function calculatePayeTax(taxableIncome) {
    // Tax rates for 2025/26
    const personalAllowance = 12570;
    const basicRateLimit = 37700;
    const higherRateLimit = 125140;
    
    // Adjust personal allowance for high earners
    let adjustedPersonalAllowance = personalAllowance;
    
    if (taxableIncome > 100000) {
        const reduction = Math.min(personalAllowance, (taxableIncome - 100000) / 2);
        adjustedPersonalAllowance -= reduction;
    }
    
    // Calculate income tax
    let taxableAmount = Math.max(0, taxableIncome - adjustedPersonalAllowance);
    let incomeTax = 0;
    
    if (taxableAmount > 0) {
        const basicRateAmount = Math.min(taxableAmount, basicRateLimit);
        incomeTax += basicRateAmount * 0.2;
        taxableAmount -= basicRateAmount;
        
        if (taxableAmount > 0) {
            const higherRateAmount = Math.min(taxableAmount, higherRateLimit - basicRateLimit);
            incomeTax += higherRateAmount * 0.4;
            taxableAmount -= higherRateAmount;
            
            if (taxableAmount > 0) {
                incomeTax += taxableAmount * 0.45;
            }
        }
    }
    
    // Calculate National Insurance
    let nationalInsurance = 0;
    
    if (taxableIncome > 12570) {
        const niBasicBand = Math.min(taxableIncome, 50270) - 12570;
        nationalInsurance += niBasicBand * 0.12;
        
        if (taxableIncome > 50270) {
            const niHigherBand = taxableIncome - 50270;
            nationalInsurance += niHigherBand * 0.02;
        }
    }
    
    return incomeTax + nationalInsurance;
}

/**
 * Calculate employer NI contributions
 */
function calculateEmployerNI(salary) {
    // Employer NI threshold for 2025/26
    const secondaryThreshold = 9100;
    
    if (salary > secondaryThreshold) {
        return (salary - secondaryThreshold) * 0.138;
    }
    
    return 0;
}

/**
 * Generate charts for the results tab
 */
function generateCharts() {
    generateIncomeBreakdownChart();
    generateTaxBreakdownChart();
}

/**
 * Generate income breakdown chart
 */
function generateIncomeBreakdownChart() {
    const ctx = document.getElementById('income-breakdown-chart');
    
    if (ctx) {
        // Calculate values
        const totalExpenses = calculateTotalExpenses();
        const dayRateIncome = calculatorData.engagement.dayRate * calculatorData.engagement.workingDays;
        const totalIncome = dayRateIncome + calculatorData.engagement.otherIncome;
        
        let salary = 0;
        let pension = 0;
        let corporationTax = 0;
        let personalTax = 0;
        let takeHomePay = 0;
        
        if (calculatorData.consultant.businessStructure === 'limited-company') {
            // Get salary based on strategy
            if (calculatorData.consultant.salaryStrategy === 'ni-threshold') {
                salary = 8840;
            } else if (calculatorData.consultant.salaryStrategy === 'personal-allowance') {
                salary = 12570;
            } else {
                salary = calculatorData.consultant.customSalary;
            }
            
            pension = calculatorData.consultant.pensionContribution;
            
            // Calculate corporation tax
            const taxableProfit = totalIncome - salary - totalExpenses - pension;
            corporationTax = calculateCorporationTax(taxableProfit);
            const availableDividends = taxableProfit - corporationTax;
            
            // Calculate personal tax
            personalTax = calculatePersonalTax(salary, availableDividends);
            
            // Calculate take-home pay
            takeHomePay = salary + availableDividends - personalTax;
        } else if (calculatorData.consultant.businessStructure === 'sole-trader') {
            // Sole trader - simpler tax calculation
            const taxableProfit = totalIncome - totalExpenses;
            personalTax = calculateSoleTraderTax(taxableProfit);
            takeHomePay = taxableProfit - personalTax;
        } else {
            // Umbrella company - PAYE calculation
            const umbrellaMargin = 25 * calculatorData.engagement.workingDays; // Typical umbrella margin
            const employerNI = calculateEmployerNI(totalIncome - umbrellaMargin);
            const taxableIncome = totalIncome - umbrellaMargin - employerNI;
            personalTax = calculatePayeTax(taxableIncome);
            takeHomePay = taxableIncome - personalTax;
        }
        
        // Destroy existing chart if it exists
        if (window.incomeBreakdownChart) {
            window.incomeBreakdownChart.destroy();
        }
        
        // Create chart data based on business structure
        let labels = [];
        let data = [];
        let colors = [];
        
        if (calculatorData.consultant.businessStructure === 'limited-company') {
            labels = ['Take-Home Pay', 'Business Expenses', 'Pension Contribution', 'Corporation Tax', 'Personal Tax'];
            data = [takeHomePay, totalExpenses, pension, corporationTax, personalTax];
            colors = ['#4e73df', '#1cc88a', '#36b9cc', '#e74a3b', '#f6c23e'];
        } else {
            labels = ['Take-Home Pay', 'Business Expenses', 'Tax & NI'];
            data = [takeHomePay, totalExpenses, personalTax];
            colors = ['#4e73df', '#1cc88a', '#e74a3b'];
        }
        
        // Create new chart
        window.incomeBreakdownChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Generate tax breakdown chart
 */
function generateTaxBreakdownChart() {
    const ctx = document.getElementById('tax-breakdown-chart');
    
    if (ctx) {
        // Calculate values
        const totalExpenses = calculateTotalExpenses();
        const dayRateIncome = calculatorData.engagement.dayRate * calculatorData.engagement.workingDays;
        const totalIncome = dayRateIncome + calculatorData.engagement.otherIncome;
        
        let corporationTax = 0;
        let incomeTax = 0;
        let nationalInsurance = 0;
        let dividendTax = 0;
        
        if (calculatorData.consultant.businessStructure === 'limited-company') {
            // Get salary based on strategy
            let salary = 0;
            if (calculatorData.consultant.salaryStrategy === 'ni-threshold') {
                salary = 8840;
            } else if (calculatorData.consultant.salaryStrategy === 'personal-allowance') {
                salary = 12570;
            } else {
                salary = calculatorData.consultant.customSalary;
            }
            
            const pension = calculatorData.consultant.pensionContribution;
            
            // Calculate corporation tax
            const taxableProfit = totalIncome - salary - totalExpenses - pension;
            corporationTax = calculateCorporationTax(taxableProfit);
            const availableDividends = taxableProfit - corporationTax;
            
            // Simplified calculation for display purposes
            const personalAllowance = 12570;
            
            // Income tax on salary
            if (salary > personalAllowance) {
                incomeTax = (salary - personalAllowance) * 0.2;
            }
            
            // National Insurance
            if (salary > 8840) {
                nationalInsurance = (Math.min(salary, 50270) - 8840) * 0.12;
                if (salary > 50270) {
                    nationalInsurance += (salary - 50270) * 0.02;
                }
            }
            
            // Dividend tax
            const dividendAllowance = 1000;
            let taxableDividends = Math.max(0, availableDividends - dividendAllowance);
            
            // Determine which tax bands the dividends fall into
            let remainingBasicBand = 37700;
            
            // Adjust bands based on salary
            if (salary > personalAllowance) {
                remainingBasicBand -= Math.min(salary - personalAllowance, 37700);
            }
            
            // Calculate dividend tax
            if (taxableDividends > 0) {
                const basicRateDividends = Math.min(taxableDividends, remainingBasicBand);
                dividendTax = basicRateDividends * 0.0875;
                taxableDividends -= basicRateDividends;
                
                if (taxableDividends > 0) {
                    const higherRateDividends = Math.min(taxableDividends, 87440);
                    dividendTax += higherRateDividends * 0.3375;
                    taxableDividends -= higherRateDividends;
                    
                    if (taxableDividends > 0) {
                        dividendTax += taxableDividends * 0.3935;
                    }
                }
            }
        } else if (calculatorData.consultant.businessStructure === 'sole-trader') {
            // Sole trader - simpler tax calculation
            const taxableProfit = totalIncome - totalExpenses;
            
            // Simplified calculation for display purposes
            const personalAllowance = 12570;
            
            // Income tax
            if (taxableProfit > personalAllowance) {
                const basicRateAmount = Math.min(taxableProfit - personalAllowance, 37700);
                incomeTax = basicRateAmount * 0.2;
                
                if (taxableProfit - personalAllowance > 37700) {
                    const higherRateAmount = Math.min(taxableProfit - personalAllowance - 37700, 87440);
                    incomeTax += higherRateAmount * 0.4;
                    
                    if (taxableProfit - personalAllowance - 37700 > 87440) {
                        incomeTax += (taxableProfit - personalAllowance - 37700 - 87440) * 0.45;
                    }
                }
            }
            
            // National Insurance
            if (taxableProfit > 12570) {
                nationalInsurance = (Math.min(taxableProfit, 50270) - 12570) * 0.09;
                if (taxableProfit > 50270) {
                    nationalInsurance += (taxableProfit - 50270) * 0.02;
                }
            }
            
            // Class 2 NI
            if (taxableProfit > 6725) {
                nationalInsurance += 3.45 * 52; // £3.45 per week
            }
        } else {
            // Umbrella company - PAYE calculation
            const umbrellaMargin = 25 * calculatorData.engagement.workingDays; // Typical umbrella margin
            const employerNI = calculateEmployerNI(totalIncome - umbrellaMargin);
            const taxableIncome = totalIncome - umbrellaMargin - employerNI;
            
            // Simplified calculation for display purposes
            const personalAllowance = 12570;
            
            // Income tax
            if (taxableIncome > personalAllowance) {
                const basicRateAmount = Math.min(taxableIncome - personalAllowance, 37700);
                incomeTax = basicRateAmount * 0.2;
                
                if (taxableIncome - personalAllowance > 37700) {
                    const higherRateAmount = Math.min(taxableIncome - personalAllowance - 37700, 87440);
                    incomeTax += higherRateAmount * 0.4;
                    
                    if (taxableIncome - personalAllowance - 37700 > 87440) {
                        incomeTax += (taxableIncome - personalAllowance - 37700 - 87440) * 0.45;
                    }
                }
            }
            
            // National Insurance
            if (taxableIncome > 12570) {
                nationalInsurance = (Math.min(taxableIncome, 50270) - 12570) * 0.12;
                if (taxableIncome > 50270) {
                    nationalInsurance += (taxableIncome - 50270) * 0.02;
                }
            }
        }
        
        // Destroy existing chart if it exists
        if (window.taxBreakdownChart) {
            window.taxBreakdownChart.destroy();
        }
        
        // Create chart data based on business structure
        let labels = [];
        let data = [];
        let colors = [];
        
        if (calculatorData.consultant.businessStructure === 'limited-company') {
            labels = ['Corporation Tax', 'Income Tax', 'National Insurance', 'Dividend Tax'];
            data = [corporationTax, incomeTax, nationalInsurance, dividendTax];
            colors = ['#e74a3b', '#4e73df', '#1cc88a', '#36b9cc'];
        } else {
            labels = ['Income Tax', 'National Insurance'];
            data = [incomeTax, nationalInsurance];
            colors = ['#e74a3b', '#1cc88a'];
        }
        
        // Create new chart
        window.taxBreakdownChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Format a number as currency
 */
function formatCurrency(value) {
    return '£' + Math.round(value).toLocaleString();
}
