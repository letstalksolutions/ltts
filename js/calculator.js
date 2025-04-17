/**
 * UK Limited Company Tax Calculator
 * Main calculator functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Store calculator data
    const calculatorData = {
        company: {
            income: 132000,
            vatRegistered: 'no',
            vatScheme: 'flat-rate',
            flatRatePercentage: 16.5,
            accountingPeriod: 'apr'
        },
        directors: [
            {
                id: 1,
                name: 'Primary Director',
                salary: 8840,
                shareholding: 100,
                pensionContribution: 10000
            }
        ],
        employees: [],
        expenses: {
            officeRent: 3600,
            utilities: 1200,
            insurance: 800,
            travel: 1500,
            equipment: 2000,
            software: 1000,
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
    
    // Check for URL parameters to load example
    loadExampleIfRequested();
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
    
    // Initialize interdependent fields
    initializeInterdependentFields();
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
    // Company tab form handling
    initializeCompanyTab();
    
    // Directors tab form handling
    initializeDirectorsTab();
    
    // Employees tab form handling
    initializeEmployeesTab();
    
    // Expenses tab form handling
    initializeExpensesTab();
    
    // Results tab form handling
    initializeResultsTab();
}

/**
 * Initialize company tab form handling
 */
function initializeCompanyTab() {
    // Company income input
    const companyIncomeInput = document.getElementById('company-income');
    if (companyIncomeInput) {
        companyIncomeInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.company.income = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // VAT registered select
    const vatRegisteredSelect = document.getElementById('vat-registered');
    if (vatRegisteredSelect) {
        vatRegisteredSelect.addEventListener('change', function() {
            calculatorData.company.vatRegistered = this.value;
            updateInterdependentFields();
            updateSummaryPanel();
        });
    }
    
    // VAT scheme select
    const vatSchemeSelect = document.getElementById('vat-scheme');
    if (vatSchemeSelect) {
        vatSchemeSelect.addEventListener('change', function() {
            calculatorData.company.vatScheme = this.value;
            updateInterdependentFields();
            updateSummaryPanel();
        });
    }
    
    // Flat rate percentage input
    const flatRateInput = document.getElementById('flat-rate-percentage');
    if (flatRateInput) {
        flatRateInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0 && value <= 100) {
                calculatorData.company.flatRatePercentage = value;
                updateSummaryPanel();
                validateField(this, true);
            } else {
                validateField(this, false);
            }
        });
    }
    
    // Accounting period select
    const accountingPeriodSelect = document.getElementById('accounting-period');
    if (accountingPeriodSelect) {
        accountingPeriodSelect.addEventListener('change', function() {
            calculatorData.company.accountingPeriod = this.value;
            updateSummaryPanel();
        });
    }
}

/**
 * Initialize directors tab form handling
 */
function initializeDirectorsTab() {
    // Add director button
    const addDirectorButton = document.getElementById('add-director');
    if (addDirectorButton) {
        addDirectorButton.addEventListener('click', function() {
            addDirector();
        });
    }
    
    // Initialize existing directors
    initializeExistingDirectors();
}

/**
 * Initialize existing directors
 */
function initializeExistingDirectors() {
    const directorSections = document.querySelectorAll('.director-section');
    
    directorSections.forEach((section, index) => {
        const directorId = index + 1;
        section.setAttribute('data-director-id', directorId);
        
        // Director name input
        const nameInput = section.querySelector('.director-name');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                updateDirectorData(directorId, 'name', this.value);
            });
        }
        
        // Director salary input
        const salaryInput = section.querySelector('.director-salary');
        if (salaryInput) {
            salaryInput.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value) && value >= 0) {
                    updateDirectorData(directorId, 'salary', value);
                    validateField(this, true);
                } else {
                    validateField(this, false);
                }
            });
        }
        
        // Director shareholding input
        const shareholdingInput = section.querySelector('.director-shareholding');
        if (shareholdingInput) {
            shareholdingInput.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value) && value >= 0 && value <= 100) {
                    updateDirectorData(directorId, 'shareholding', value);
                    validateField(this, true);
                } else {
                    validateField(this, false);
                }
            });
        }
        
        // Director pension input
        const pensionInput = section.querySelector('.director-pension');
        if (pensionInput) {
            pensionInput.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value) && value >= 0) {
                    updateDirectorData(directorId, 'pensionContribution', value);
                    validateField(this, true);
                } else {
                    validateField(this, false);
                }
            });
        }
        
        // Remove director button
        const removeButton = section.querySelector('.remove-director');
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                removeDirector(directorId);
            });
        }
    });
}

/**
 * Add a new director
 */
function addDirector() {
    const directorsContainer = document.getElementById('directors-container');
    const directorTemplate = document.getElementById('director-template');
    
    if (directorsContainer && directorTemplate) {
        // Create new director ID
        const newDirectorId = calculatorData.directors.length + 1;
        
        // Clone template
        const newDirectorSection = directorTemplate.content.cloneNode(true);
        const directorSection = newDirectorSection.querySelector('.director-section');
        
        // Set director ID
        directorSection.setAttribute('data-director-id', newDirectorId);
        
        // Add to DOM
        directorsContainer.appendChild(newDirectorSection);
        
        // Add to data model
        calculatorData.directors.push({
            id: newDirectorId,
            name: `Director ${newDirectorId}`,
            salary: 8840,
            shareholding: 0,
            pensionContribution: 0
        });
        
        // Initialize event handlers
        initializeExistingDirectors();
        
        // Update summary panel
        updateSummaryPanel();
    }
}

/**
 * Remove a director
 */
function removeDirector(directorId) {
    // Remove from DOM
    const directorSection = document.querySelector(`.director-section[data-director-id="${directorId}"]`);
    if (directorSection) {
        directorSection.remove();
    }
    
    // Remove from data model
    calculatorData.directors = calculatorData.directors.filter(director => director.id !== directorId);
    
    // Update summary panel
    updateSummaryPanel();
}

/**
 * Update director data
 */
function updateDirectorData(directorId, field, value) {
    const director = calculatorData.directors.find(d => d.id === directorId);
    
    if (director) {
        director[field] = value;
        updateSummaryPanel();
    }
}

/**
 * Initialize employees tab form handling
 */
function initializeEmployeesTab() {
    // Add employee button
    const addEmployeeButton = document.getElementById('add-employee');
    if (addEmployeeButton) {
        addEmployeeButton.addEventListener('click', function() {
            addEmployee();
        });
    }
    
    // Initialize existing employees
    initializeExistingEmployees();
}

/**
 * Initialize existing employees
 */
function initializeExistingEmployees() {
    const employeeSections = document.querySelectorAll('.employee-section');
    
    employeeSections.forEach((section, index) => {
        const employeeId = index + 1;
        section.setAttribute('data-employee-id', employeeId);
        
        // Employee name input
        const nameInput = section.querySelector('.employee-name');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                updateEmployeeData(employeeId, 'name', this.value);
            });
        }
        
        // Employee salary input
        const salaryInput = section.querySelector('.employee-salary');
        if (salaryInput) {
            salaryInput.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value) && value >= 0) {
                    updateEmployeeData(employeeId, 'salary', value);
                    validateField(this, true);
                } else {
                    validateField(this, false);
                }
            });
        }
        
        // Employee pension input
        const pensionInput = section.querySelector('.employee-pension');
        if (pensionInput) {
            pensionInput.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value) && value >= 0) {
                    updateEmployeeData(employeeId, 'pensionContribution', value);
                    validateField(this, true);
                } else {
                    validateField(this, false);
                }
            });
        }
        
        // Remove employee button
        const removeButton = section.querySelector('.remove-employee');
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                removeEmployee(employeeId);
            });
        }
    });
}

/**
 * Add a new employee
 */
function addEmployee() {
    const employeesContainer = document.getElementById('employees-container');
    const employeeTemplate = document.getElementById('employee-template');
    
    if (employeesContainer && employeeTemplate) {
        // Create new employee ID
        const newEmployeeId = calculatorData.employees.length + 1;
        
        // Clone template
        const newEmployeeSection = employeeTemplate.content.cloneNode(true);
        const employeeSection = newEmployeeSection.querySelector('.employee-section');
        
        // Set employee ID
        employeeSection.setAttribute('data-employee-id', newEmployeeId);
        
        // Add to DOM
        employeesContainer.appendChild(newEmployeeSection);
        
        // Add to data model
        calculatorData.employees.push({
            id: newEmployeeId,
            name: `Employee ${newEmployeeId}`,
            salary: 20000,
            pensionContribution: 0
        });
        
        // Initialize event handlers
        initializeExistingEmployees();
        
        // Update summary panel
        updateSummaryPanel();
    }
}

/**
 * Remove an employee
 */
function removeEmployee(employeeId) {
    // Remove from DOM
    const employeeSection = document.querySelector(`.employee-section[data-employee-id="${employeeId}"]`);
    if (employeeSection) {
        employeeSection.remove();
    }
    
    // Remove from data model
    calculatorData.employees = calculatorData.employees.filter(employee => employee.id !== employeeId);
    
    // Update summary panel
    updateSummaryPanel();
}

/**
 * Update employee data
 */
function updateEmployeeData(employeeId, field, value) {
    const employee = calculatorData.employees.find(e => e.id === employeeId);
    
    if (employee) {
        employee[field] = value;
        updateSummaryPanel();
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
    
    // Utilities input
    const utilitiesInput = document.getElementById('utilities');
    if (utilitiesInput) {
        utilitiesInput.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value >= 0) {
                calculatorData.expenses.utilities = value;
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
    const otherInput = document.getElementById('other-expenses');
    if (otherInput) {
        otherInput.addEventListener('input', function() {
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
 * Initialize results tab form handling
 */
function initializeResultsTab() {
    // Generate charts when results tab is shown
    const resultsTabButton = document.querySelector('.tab-button[data-tab="results-tab"]');
    if (resultsTabButton) {
        resultsTabButton.addEventListener('click', function() {
            generateCharts();
        });
    }
}

/**
 * Initialize interdependent fields
 */
function initializeInterdependentFields() {
    // VAT fields interdependency
    updateInterdependentFields();
}

/**
 * Update interdependent fields based on current values
 */
function updateInterdependentFields() {
    const vatRegistered = document.getElementById('vat-registered');
    const vatSchemeContainer = document.getElementById('vat-scheme-container');
    const vatScheme = document.getElementById('vat-scheme');
    const flatRateContainer = document.getElementById('flat-rate-container');
    
    if (vatRegistered && vatSchemeContainer && vatScheme && flatRateContainer) {
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
    
    // Validate company tab
    if (tabId === 'company-tab') {
        const companyIncomeInput = document.getElementById('company-income');
        if (companyIncomeInput) {
            const value = parseFloat(companyIncomeInput.value);
            if (isNaN(value) || value < 0) {
                validateField(companyIncomeInput, false);
                isValid = false;
            }
        }
        
        const flatRateInput = document.getElementById('flat-rate-percentage');
        const vatRegistered = document.getElementById('vat-registered');
        const vatScheme = document.getElementById('vat-scheme');
        
        if (flatRateInput && vatRegistered && vatScheme) {
            if (vatRegistered.value === 'yes' && vatScheme.value === 'flat-rate') {
                const value = parseFloat(flatRateInput.value);
                if (isNaN(value) || value < 0 || value > 100) {
                    validateField(flatRateInput, false);
                    isValid = false;
                }
            }
        }
    }
    
    // Validate directors tab
    else if (tabId === 'directors-tab') {
        const directorSections = document.querySelectorAll('.director-section');
        let totalShareholding = 0;
        
        directorSections.forEach(section => {
            const salaryInput = section.querySelector('.director-salary');
            if (salaryInput) {
                const value = parseFloat(salaryInput.value);
                if (isNaN(value) || value < 0) {
                    validateField(salaryInput, false);
                    isValid = false;
                }
            }
            
            const shareholdingInput = section.querySelector('.director-shareholding');
            if (shareholdingInput) {
                const value = parseFloat(shareholdingInput.value);
                if (isNaN(value) || value < 0 || value > 100) {
                    validateField(shareholdingInput, false);
                    isValid = false;
                } else {
                    totalShareholding += value;
                }
            }
            
            const pensionInput = section.querySelector('.director-pension');
            if (pensionInput) {
                const value = parseFloat(pensionInput.value);
                if (isNaN(value) || value < 0) {
                    validateField(pensionInput, false);
                    isValid = false;
                }
            }
        });
        
        // Check total shareholding
        const shareholdingError = document.getElementById('shareholding-error');
        if (shareholdingError) {
            if (Math.abs(totalShareholding - 100) > 0.01) {
                shareholdingError.style.display = 'block';
                isValid = false;
            } else {
                shareholdingError.style.display = 'none';
            }
        }
    }
    
    // Validate employees tab
    else if (tabId === 'employees-tab') {
        const employeeSections = document.querySelectorAll('.employee-section');
        
        employeeSections.forEach(section => {
            const salaryInput = section.querySelector('.employee-salary');
            if (salaryInput) {
                const value = parseFloat(salaryInput.value);
                if (isNaN(value) || value < 0) {
                    validateField(salaryInput, false);
                    isValid = false;
                }
            }
            
            const pensionInput = section.querySelector('.employee-pension');
            if (pensionInput) {
                const value = parseFloat(pensionInput.value);
                if (isNaN(value) || value < 0) {
                    validateField(pensionInput, false);
                    isValid = false;
                }
            }
        });
    }
    
    // Validate expenses tab
    else if (tabId === 'expenses-tab') {
        const expenseInputs = [
            document.getElementById('office-rent'),
            document.getElementById('utilities'),
            document.getElementById('insurance'),
            document.getElementById('travel'),
            document.getElementById('equipment'),
            document.getElementById('software'),
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
    // Calculate totals
    const totalSalaries = calculateTotalSalaries();
    const totalExpenses = calculateTotalExpenses();
    const totalPensions = calculateTotalPensions();
    
    // Calculate tax
    const taxableProfit = calculatorData.company.income - totalSalaries - totalExpenses - totalPensions;
    const corporationTax = calculateCorporationTax(taxableProfit);
    const availableDividends = taxableProfit - corporationTax;
    
    // Calculate personal tax for each director
    let totalPersonalTax = 0;
    calculatorData.directors.forEach(director => {
        const dividendAmount = (director.shareholding / 100) * availableDividends;
        const personalTax = calculatePersonalTax(director.salary, dividendAmount);
        director.personalTax = personalTax;
        director.dividendAmount = dividendAmount;
        totalPersonalTax += personalTax;
    });
    
    // Update summary values
    document.getElementById('summary-income').textContent = formatCurrency(calculatorData.company.income);
    document.getElementById('summary-expenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('summary-salaries').textContent = formatCurrency(totalSalaries);
    document.getElementById('summary-corp-tax').textContent = formatCurrency(corporationTax);
    document.getElementById('summary-dividends').textContent = formatCurrency(availableDividends);
    document.getElementById('summary-total-tax').textContent = formatCurrency(corporationTax + totalPersonalTax);
    
    // Update take-home pay cards
    updateTakeHomePayCards(availableDividends);
}

/**
 * Update take-home pay cards
 */
function updateTakeHomePayCards(availableDividends) {
    const takeHomeGrid = document.getElementById('take-home-grid');
    
    if (takeHomeGrid) {
        // Clear existing cards
        takeHomeGrid.innerHTML = '';
        
        // Add card for each director
        calculatorData.directors.forEach(director => {
            const dividendAmount = (director.shareholding / 100) * availableDividends;
            const takeHome = director.salary + dividendAmount - director.personalTax;
            
            const card = document.createElement('div');
            card.className = 'take-home-card';
            card.innerHTML = `
                <div class="take-home-name">${director.name}</div>
                <div class="take-home-amount">${formatCurrency(takeHome)}</div>
                <div class="take-home-breakdown">
                    <div class="breakdown-item">
                        <span class="breakdown-label">Salary:</span>
                        <span class="breakdown-value">${formatCurrency(director.salary)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="breakdown-label">Dividends:</span>
                        <span class="breakdown-value">${formatCurrency(dividendAmount)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="breakdown-label">Personal Tax:</span>
                        <span class="breakdown-value">-${formatCurrency(director.personalTax)}</span>
                    </div>
                </div>
            `;
            
            takeHomeGrid.appendChild(card);
        });
    }
}

/**
 * Calculate total salaries
 */
function calculateTotalSalaries() {
    let total = 0;
    
    // Add director salaries
    calculatorData.directors.forEach(director => {
        total += director.salary;
    });
    
    // Add employee salaries
    calculatorData.employees.forEach(employee => {
        total += employee.salary;
    });
    
    return total;
}

/**
 * Calculate total expenses
 */
function calculateTotalExpenses() {
    return (
        calculatorData.expenses.officeRent +
        calculatorData.expenses.utilities +
        calculatorData.expenses.insurance +
        calculatorData.expenses.travel +
        calculatorData.expenses.equipment +
        calculatorData.expenses.software +
        calculatorData.expenses.marketing +
        calculatorData.expenses.other
    );
}

/**
 * Calculate total pension contributions
 */
function calculateTotalPensions() {
    let total = 0;
    
    // Add director pension contributions
    calculatorData.directors.forEach(director => {
        total += director.pensionContribution;
    });
    
    // Add employee pension contributions
    calculatorData.employees.forEach(employee => {
        total += employee.pensionContribution;
    });
    
    return total;
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
 * Calculate personal tax
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
    
    if (salary > 12570) {
        const niBasicBand = Math.min(salary, 50270) - 12570;
        nationalInsurance += niBasicBand * 0.12;
        
        if (salary > 50270) {
            const niHigherBand = salary - 50270;
            nationalInsurance += niHigherBand * 0.02;
        }
    }
    
    return salaryTax + dividendTax + nationalInsurance;
}

/**
 * Generate charts for the results tab
 */
function generateCharts() {
    generateIncomeBreakdownChart();
    generateTaxBreakdownChart();
    generateTakeHomeComparisonChart();
}

/**
 * Generate income breakdown chart
 */
function generateIncomeBreakdownChart() {
    const ctx = document.getElementById('income-breakdown-chart');
    
    if (ctx) {
        // Calculate values
        const totalSalaries = calculateTotalSalaries();
        const totalExpenses = calculateTotalExpenses();
        const totalPensions = calculateTotalPensions();
        const taxableProfit = calculatorData.company.income - totalSalaries - totalExpenses - totalPensions;
        const corporationTax = calculateCorporationTax(taxableProfit);
        const availableDividends = taxableProfit - corporationTax;
        
        // Destroy existing chart if it exists
        if (window.incomeBreakdownChart) {
            window.incomeBreakdownChart.destroy();
        }
        
        // Create new chart
        window.incomeBreakdownChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Salaries', 'Expenses', 'Pension Contributions', 'Corporation Tax', 'Available Dividends'],
                datasets: [{
                    data: [totalSalaries, totalExpenses, totalPensions, corporationTax, availableDividends],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc',
                        '#e74a3b',
                        '#f6c23e'
                    ]
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
        const totalSalaries = calculateTotalSalaries();
        const totalExpenses = calculateTotalExpenses();
        const totalPensions = calculateTotalPensions();
        const taxableProfit = calculatorData.company.income - totalSalaries - totalExpenses - totalPensions;
        const corporationTax = calculateCorporationTax(taxableProfit);
        const availableDividends = taxableProfit - corporationTax;
        
        // Calculate personal tax for each director
        let totalPersonalTax = 0;
        let totalIncomeTax = 0;
        let totalDividendTax = 0;
        let totalNationalInsurance = 0;
        
        calculatorData.directors.forEach(director => {
            const dividendAmount = (director.shareholding / 100) * availableDividends;
            
            // Simplified calculation for demonstration
            const personalAllowance = 12570;
            const basicRateLimit = 37700;
            
            // Income tax on salary
            let salaryTaxableAmount = Math.max(0, director.salary - personalAllowance);
            let incomeTax = 0;
            
            if (salaryTaxableAmount > 0) {
                incomeTax = Math.min(salaryTaxableAmount, basicRateLimit) * 0.2;
                // Higher rates would be calculated here
            }
            
            // Dividend tax
            const dividendAllowance = 1000;
            let dividendTaxableAmount = Math.max(0, dividendAmount - dividendAllowance);
            let dividendTax = 0;
            
            // Determine which tax bands the dividends fall into
            let remainingBasicBand = basicRateLimit;
            
            // Adjust bands based on salary
            if (director.salary > personalAllowance) {
                remainingBasicBand -= Math.min(director.salary - personalAllowance, basicRateLimit);
            }
            
            // Calculate dividend tax
            if (dividendTaxableAmount > 0) {
                dividendTax = Math.min(dividendTaxableAmount, remainingBasicBand) * 0.0875;
                // Higher rates would be calculated here
            }
            
            // National Insurance
            let nationalInsurance = 0;
            if (director.salary > 12570) {
                nationalInsurance = Math.min(director.salary, 50270) - 12570 * 0.12;
                // Higher rate would be calculated here
            }
            
            totalIncomeTax += incomeTax;
            totalDividendTax += dividendTax;
            totalNationalInsurance += nationalInsurance;
            totalPersonalTax += incomeTax + dividendTax + nationalInsurance;
        });
        
        // Destroy existing chart if it exists
        if (window.taxBreakdownChart) {
            window.taxBreakdownChart.destroy();
        }
        
        // Create new chart
        window.taxBreakdownChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Corporation Tax', 'Income Tax', 'Dividend Tax', 'National Insurance'],
                datasets: [{
                    data: [corporationTax, totalIncomeTax, totalDividendTax, totalNationalInsurance],
                    backgroundColor: [
                        '#e74a3b',
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc'
                    ]
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
 * Generate take-home comparison chart
 */
function generateTakeHomeComparisonChart() {
    const ctx = document.getElementById('take-home-comparison-chart');
    
    if (ctx) {
        // Calculate values
        const totalSalaries = calculateTotalSalaries();
        const totalExpenses = calculateTotalExpenses();
        const totalPensions = calculateTotalPensions();
        const taxableProfit = calculatorData.company.income - totalSalaries - totalExpenses - totalPensions;
        const corporationTax = calculateCorporationTax(taxableProfit);
        const availableDividends = taxableProfit - corporationTax;
        
        // Calculate take-home pay for each director
        const directorNames = [];
        const takeHomePay = [];
        const totalTax = [];
        
        calculatorData.directors.forEach(director => {
            directorNames.push(director.name);
            
            const dividendAmount = (director.shareholding / 100) * availableDividends;
            const personalTax = calculatePersonalTax(director.salary, dividendAmount);
            const takeHome = director.salary + dividendAmount - personalTax;
            
            takeHomePay.push(takeHome);
            totalTax.push(personalTax + (director.shareholding / 100) * corporationTax);
        });
        
        // Destroy existing chart if it exists
        if (window.takeHomeComparisonChart) {
            window.takeHomeComparisonChart.destroy();
        }
        
        // Create new chart
        window.takeHomeComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: directorNames,
                datasets: [
                    {
                        label: 'Take-Home Pay',
                        data: takeHomePay,
                        backgroundColor: '#1cc88a'
                    },
                    {
                        label: 'Total Tax',
                        data: totalTax,
                        backgroundColor: '#e74a3b'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            callback: function(value) {
                                return '£' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${formatCurrency(value)}`;
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

/**
 * Load example scenario if requested in URL
 */
function loadExampleIfRequested() {
    const urlParams = new URLSearchParams(window.location.search);
    const example = urlParams.get('example');
    
    if (example) {
        fetch(`examples/${example}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Example not found');
                }
                return response.json();
            })
            .then(data => {
                // Load example data
                calculatorData = data;
                
                // Update form fields
                updateFormFields();
                
                // Update summary panel
                updateSummaryPanel();
            })
            .catch(error => {
                console.error('Error loading example:', error);
            });
    }
}

/**
 * Update form fields with current data
 */
function updateFormFields() {
    // Company tab
    const companyIncomeInput = document.getElementById('company-income');
    if (companyIncomeInput) {
        companyIncomeInput.value = calculatorData.company.income;
    }
    
    const vatRegisteredSelect = document.getElementById('vat-registered');
    if (vatRegisteredSelect) {
        vatRegisteredSelect.value = calculatorData.company.vatRegistered;
    }
    
    const vatSchemeSelect = document.getElementById('vat-scheme');
    if (vatSchemeSelect) {
        vatSchemeSelect.value = calculatorData.company.vatScheme;
    }
    
    const flatRateInput = document.getElementById('flat-rate-percentage');
    if (flatRateInput) {
        flatRateInput.value = calculatorData.company.flatRatePercentage;
    }
    
    const accountingPeriodSelect = document.getElementById('accounting-period');
    if (accountingPeriodSelect) {
        accountingPeriodSelect.value = calculatorData.company.accountingPeriod;
    }
    
    // Update interdependent fields
    updateInterdependentFields();
    
    // Directors tab
    // This would require dynamically creating director sections
    // For simplicity, we'll just update the first director
    const directorNameInput = document.querySelector('.director-name');
    const directorSalaryInput = document.querySelector('.director-salary');
    const directorShareholdingInput = document.querySelector('.director-shareholding');
    const directorPensionInput = document.querySelector('.director-pension');
    
    if (directorNameInput && calculatorData.directors[0]) {
        directorNameInput.value = calculatorData.directors[0].name;
    }
    
    if (directorSalaryInput && calculatorData.directors[0]) {
        directorSalaryInput.value = calculatorData.directors[0].salary;
    }
    
    if (directorShareholdingInput && calculatorData.directors[0]) {
        directorShareholdingInput.value = calculatorData.directors[0].shareholding;
    }
    
    if (directorPensionInput && calculatorData.directors[0]) {
        directorPensionInput.value = calculatorData.directors[0].pensionContribution;
    }
    
    // Expenses tab
    const officeRentInput = document.getElementById('office-rent');
    if (officeRentInput) {
        officeRentInput.value = calculatorData.expenses.officeRent;
    }
    
    const utilitiesInput = document.getElementById('utilities');
    if (utilitiesInput) {
        utilitiesInput.value = calculatorData.expenses.utilities;
    }
    
    const insuranceInput = document.getElementById('insurance');
    if (insuranceInput) {
        insuranceInput.value = calculatorData.expenses.insurance;
    }
    
    const travelInput = document.getElementById('travel');
    if (travelInput) {
        travelInput.value = calculatorData.expenses.travel;
    }
    
    const equipmentInput = document.getElementById('equipment');
    if (equipmentInput) {
        equipmentInput.value = calculatorData.expenses.equipment;
    }
    
    const softwareInput = document.getElementById('software');
    if (softwareInput) {
        softwareInput.value = calculatorData.expenses.software;
    }
    
    const marketingInput = document.getElementById('marketing');
    if (marketingInput) {
        marketingInput.value = calculatorData.expenses.marketing;
    }
    
    const otherInput = document.getElementById('other-expenses');
    if (otherInput) {
        otherInput.value = calculatorData.expenses.other;
    }
}
