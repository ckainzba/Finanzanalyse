// State management
const state = {
    income: 45000,
    maritalStatus: 'single',
    childrenBefore2008: 0,
    childrenAfter2008: 0,
    contribution: 1200,
    startAge: 30,
    retirementAge: 67
};

// DOM Elements
const elements = {
    // Inputs
    incomeSlider: document.getElementById('income-slider'),
    incomeDisplay: document.getElementById('income-display'),
    maritalStatus: document.getElementById('marital-status'),
    childrenBeforeSlider: document.getElementById('children-before-slider'),
    childrenBeforeDisplay: document.getElementById('children-before-display'),
    childrenAfterSlider: document.getElementById('children-after-slider'),
    childrenAfterDisplay: document.getElementById('children-after-display'),
    contributionSlider: document.getElementById('contribution-slider'),
    contributionDisplay: document.getElementById('contribution-display'),
    optimalButton: document.getElementById('optimal-button'),
    optimalAmount: document.getElementById('optimal-amount'),
    startAgeSlider: document.getElementById('start-age-slider'),
    startAgeDisplay: document.getElementById('start-age-display'),
    retirementAgeSlider: document.getElementById('retirement-age-slider'),
    retirementAgeDisplay: document.getElementById('retirement-age-display'),

    // Outputs
    totalSubsidy: document.getElementById('total-subsidy'),
    subsidyRate: document.getElementById('subsidy-rate'),
    basicSubsidy: document.getElementById('basic-subsidy'),
    totalAllowances: document.getElementById('total-allowances'),
    warningCard: document.getElementById('warning-card'),
    minimumRequired: document.getElementById('minimum-required'),
    taxSavings: document.getElementById('tax-savings'),
    duration: document.getElementById('duration'),
    annualPayment: document.getElementById('annual-payment'),
    endCapital: document.getElementById('end-capital'),
    monthlyPension: document.getElementById('monthly-pension'),
    summarySubsidies: document.getElementById('summary-subsidies'),
    summaryTax: document.getElementById('summary-tax')
};

// Calculation Functions

function calculateGrundzulage() {
    // 175€ per person per year
    return 175;
}

function calculateKinderzulage() {
    const before2008 = state.childrenBefore2008 * 185;
    const after2008 = state.childrenAfter2008 * 300;
    return before2008 + after2008;
}

function calculateTotalSubsidies() {
    return calculateGrundzulage() + calculateKinderzulage();
}

function calculateMindesteigenbeitrag() {
    // 4% of gross income minus subsidies, minimum 60€
    const totalSubsidies = calculateTotalSubsidies();
    const fourPercent = state.income * 0.04;
    const minimum = Math.max(60, fourPercent - totalSubsidies);

    // Cap total contribution (own + subsidies) at 2100€
    const maxOwnContribution = 2100 - totalSubsidies;
    return Math.min(minimum, maxOwnContribution);
}

function calculateTaxBracket(income) {
    // Simplified German tax brackets 2026
    if (income <= 11604) return 0;
    if (income <= 17005) {
        const base = 14;
        const progressive = ((income - 11604) / 5401) * 9.66;
        return base + progressive;
    }
    if (income <= 66760) {
        const base = 23.66;
        const progressive = ((income - 17005) / 49755) * 18.34;
        return base + progressive;
    }
    if (income <= 277825) return 42;
    return 45;
}

function calculateGuenstigerpruefung() {
    const totalSubsidies = calculateTotalSubsidies();
    const totalContribution = Math.min(state.contribution + totalSubsidies, 2100);
    const marginalTaxRate = calculateTaxBracket(state.income) / 100;

    // Tax deduction value
    const taxDeduction = totalContribution * marginalTaxRate;

    // Additional tax savings beyond subsidies
    const additionalSavings = Math.max(0, taxDeduction - totalSubsidies);

    return additionalSavings;
}

function calculateTotalAnnualSubsidy() {
    const subsidies = calculateTotalSubsidies();
    const taxSavings = calculateGuenstigerpruefung();
    return subsidies + taxSavings;
}

function calculateSubsidyRate() {
    const totalAnnualSubsidy = calculateTotalAnnualSubsidy();
    const totalContribution = state.contribution + calculateTotalSubsidies();

    if (totalContribution === 0) return 0;

    return (totalAnnualSubsidy / totalContribution) * 100;
}

function calculateForecast() {
    const years = state.retirementAge - state.startAge;
    const annualPayment = state.contribution + calculateTotalSubsidies();
    const rate = 0.03; // 3% annual return

    if (years <= 0) {
        return {
            years: 0,
            annualPayment: annualPayment,
            endCapital: 0,
            monthlyPension: 0
        };
    }

    // Future value of annuity formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
    const endCapital = annualPayment * (((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate));

    // Estimated monthly pension over 20 years (240 months)
    const monthlyPension = endCapital / 240;

    return {
        years: years,
        annualPayment: annualPayment,
        endCapital: endCapital,
        monthlyPension: monthlyPension
    };
}

// Update Functions

function formatCurrency(value) {
    return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
    return value.toLocaleString('de-DE');
}

function updateResults() {
    // Calculate all values
    const grundzulage = calculateGrundzulage();
    const totalSubsidies = calculateTotalSubsidies();
    const mindesteigenbeitrag = calculateMindesteigenbeitrag();
    const taxSavings = calculateGuenstigerpruefung();
    const totalAnnualSubsidy = calculateTotalAnnualSubsidy();
    const subsidyRate = calculateSubsidyRate();
    const forecast = calculateForecast();

    // Update header card
    elements.totalSubsidy.textContent = formatCurrency(totalAnnualSubsidy);
    elements.subsidyRate.textContent = formatCurrency(subsidyRate);

    // Update subsidies card
    elements.basicSubsidy.textContent = formatCurrency(grundzulage);
    elements.totalAllowances.textContent = formatCurrency(totalSubsidies);

    // Update warning card
    if (state.contribution < mindesteigenbeitrag) {
        elements.warningCard.style.display = 'block';
        elements.minimumRequired.textContent = formatCurrency(mindesteigenbeitrag);
    } else {
        elements.warningCard.style.display = 'none';
    }

    // Update optimal button
    elements.optimalAmount.textContent = formatNumber(Math.round(mindesteigenbeitrag));

    // Update tax savings
    elements.taxSavings.textContent = formatCurrency(taxSavings);

    // Update forecast
    elements.duration.textContent = forecast.years;
    elements.annualPayment.textContent = formatCurrency(forecast.annualPayment);
    elements.endCapital.textContent = formatCurrency(forecast.endCapital);
    elements.monthlyPension.textContent = formatCurrency(forecast.monthlyPension);

    // Update summary
    elements.summarySubsidies.textContent = formatCurrency(totalSubsidies);
    elements.summaryTax.textContent = formatCurrency(taxSavings);
}

// Event Listeners

elements.incomeSlider.addEventListener('input', (e) => {
    state.income = parseInt(e.target.value);
    elements.incomeDisplay.textContent = formatNumber(state.income) + ' €';
    updateResults();
});

elements.maritalStatus.addEventListener('change', (e) => {
    state.maritalStatus = e.target.value;
    updateResults();
});

elements.childrenBeforeSlider.addEventListener('input', (e) => {
    state.childrenBefore2008 = parseInt(e.target.value);
    elements.childrenBeforeDisplay.textContent = `${state.childrenBefore2008} (je 185 € Zulage)`;
    updateResults();
});

elements.childrenAfterSlider.addEventListener('input', (e) => {
    state.childrenAfter2008 = parseInt(e.target.value);
    elements.childrenAfterDisplay.textContent = `${state.childrenAfter2008} (je 300 € Zulage)`;
    updateResults();
});

elements.contributionSlider.addEventListener('input', (e) => {
    state.contribution = parseInt(e.target.value);
    elements.contributionDisplay.textContent = formatNumber(state.contribution) + ' €';
    updateResults();
});

elements.optimalButton.addEventListener('click', () => {
    const optimal = Math.round(calculateMindesteigenbeitrag());
    state.contribution = optimal;
    elements.contributionSlider.value = optimal;
    elements.contributionDisplay.textContent = formatNumber(optimal) + ' €';
    updateResults();
});

elements.startAgeSlider.addEventListener('input', (e) => {
    state.startAge = parseInt(e.target.value);
    elements.startAgeDisplay.textContent = state.startAge;

    // Ensure retirement age is always greater than start age
    if (state.retirementAge <= state.startAge) {
        state.retirementAge = state.startAge + 1;
        elements.retirementAgeSlider.value = state.retirementAge;
        elements.retirementAgeDisplay.textContent = state.retirementAge;
    }

    updateResults();
});

elements.retirementAgeSlider.addEventListener('input', (e) => {
    state.retirementAge = parseInt(e.target.value);
    elements.retirementAgeDisplay.textContent = state.retirementAge;

    // Ensure retirement age is always greater than start age
    if (state.retirementAge <= state.startAge) {
        state.retirementAge = state.startAge + 1;
        elements.retirementAgeSlider.value = state.retirementAge;
        elements.retirementAgeDisplay.textContent = state.retirementAge;
    }

    updateResults();
});

// Initial calculation
updateResults();
