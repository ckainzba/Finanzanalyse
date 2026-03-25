// ===== FÖRDER-VERGLEICHSRECHNER =====
let foerderRechnerInitialized = false;

function initFoerderRechner() {
  if (foerderRechnerInitialized) return;
  foerderRechnerInitialized = true;

// State management
const state = {
    income: 45000,
    maritalStatus: 'single',
    childrenBefore2008: 0,
    childrenAfter2008: 0,
    contribution: 1200,
    startAge: 30,
    retirementAge: 67,
    riesterReturn: 3.0,
    avReturn: 3.0
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
    riesterReturnSlider: document.getElementById('riester-return-slider'),
    riesterReturnDisplay: document.getElementById('riester-return-display'),
    avReturnSlider: document.getElementById('av-return-slider'),
    avReturnDisplay: document.getElementById('av-return-display'),

    // Outputs
    riesterReturnTitle: document.getElementById('riester-return-title'),
    avReturnTitle: document.getElementById('av-return-title'),
    headerMonthlyPension: document.getElementById('header-monthly-pension'),
    subsidyRate: document.getElementById('subsidy-rate'),
    basicSubsidy: document.getElementById('basic-subsidy'),
    childSubsidy: document.getElementById('child-subsidy'),
    childSubsidyRow: document.getElementById('child-subsidy-row'),
    totalAllowances: document.getElementById('total-allowances'),
    warningCard: document.getElementById('warning-card'),
    minimumRequired: document.getElementById('minimum-required'),
    taxSavings: document.getElementById('tax-savings'),
    guenstigerpruefungText: document.getElementById('guenstigerpruefung-text'),
    duration: document.getElementById('duration'),
    annualPayment: document.getElementById('annual-payment'),
    endCapital: document.getElementById('end-capital'),
    monthlyPension: document.getElementById('monthly-pension'),
    // Riester Summary Outputs
    summarySubsidies: document.getElementById('summary-subsidies'),
    summaryTax: document.getElementById('summary-tax'),
    summaryTotal: document.getElementById('summary-total'),

    // AV-Depot Outputs
    avHeaderMonthlyPension: document.getElementById('av-header-monthly-pension'),
    avSubsidyRate: document.getElementById('av-subsidy-rate'),
    avGrundzulageTotal: document.getElementById('av-grundzulage-total'),
    avChildSubsidy: document.getElementById('av-child-subsidy'),
    avChildSubsidyRow: document.getElementById('av-child-subsidy-row'),
    avTotalAllowances: document.getElementById('av-total-allowances'),
    avWarningCard: document.getElementById('av-warning-card'),
    avMinimumRequired: document.getElementById('av-minimum-required'),
    avTaxSavings: document.getElementById('av-tax-savings'),
    avGuenstigerpruefungText: document.getElementById('av-guenstigerpruefung-text'),
    avDuration: document.getElementById('av-duration'),
    avAnnualPayment: document.getElementById('av-annual-payment'),
    avEndCapital: document.getElementById('av-end-capital'),
    avMonthlyPension: document.getElementById('av-monthly-pension'),
    // AV-Depot Summary Outputs
    avSummarySubsidies: document.getElementById('av-summary-subsidies'),
    avSummaryTax: document.getElementById('av-summary-tax'),
    avSummaryTotal: document.getElementById('av-summary-total'),

    // Comparison Outputs
    comparisonSubsidiesDiff: document.getElementById('comparison-subsidies-diff'),
    comparisonTaxDiff: document.getElementById('comparison-tax-diff'),
    comparisonTotalDiff: document.getElementById('comparison-total-diff'),
    comparisonCapitalDiff: document.getElementById('comparison-capital-diff'),
    comparisonRecommendation: document.getElementById('comparison-recommendation'),
    riesterColumn: document.getElementById('riester-column'),
    avDepotColumn: document.getElementById('av-depot-column')

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
    // 4% of gross income minus FULL subsidies, minimum 60€
    const totalSubsidies = calculateTotalSubsidies();
    const fourPercent = state.income * 0.04;
    const minimum = Math.max(60, fourPercent - totalSubsidies);

    // Cap total contribution (own + subsidies) at 2100€
    const maxOwnContribution = 2100 - totalSubsidies;
    return Math.min(minimum, maxOwnContribution);
}

function calculateActualSubsidies() {
    // Calculate full subsidies
    const fullSubsidies = calculateTotalSubsidies();
    const mindesteigenbeitrag = calculateMindesteigenbeitrag();

    // If contribution is below minimum, subsidies are reduced proportionally
    if (state.contribution < mindesteigenbeitrag) {
        const ratio = state.contribution / mindesteigenbeitrag;
        return fullSubsidies * ratio;
    }

    return fullSubsidies;
}

function calculateActualGrundzulage() {
    // Get the actual proportional basic subsidy
    const fullGrundzulage = calculateGrundzulage();
    const fullSubsidies = calculateTotalSubsidies();
    const actualSubsidies = calculateActualSubsidies();

    if (fullSubsidies === 0) return 0;

    // Apply the same reduction ratio
    return (fullGrundzulage / fullSubsidies) * actualSubsidies;
}

function calculateActualKinderzulage() {
    // Get the actual proportional child subsidy
    const fullKinderzulage = calculateKinderzulage();
    const fullSubsidies = calculateTotalSubsidies();
    const actualSubsidies = calculateActualSubsidies();

    if (fullSubsidies === 0) return 0;

    // Apply the same reduction ratio
    return (fullKinderzulage / fullSubsidies) * actualSubsidies;
}

function calculateTaxableIncome(grossIncome, maritalStatus) {
    // Calculate "zu versteuerndes Einkommen" (zvE) from gross income
    // This is a simplified calculation using standard deductions

    // 1. Arbeitnehmer-Pauschbetrag (employee lump sum for work-related expenses)
    const werbungskostenPauschbetrag = 1230;

    // 2. Sonderausgaben-Pauschbetrag (special expenses lump sum)
    const sonderausgabenPauschbetrag = maritalStatus === 'married' ? 72 : 36;

    // 3. Vorsorgepauschale (pension/insurance contributions - simplified as ~11% of gross)
    const vorsorgepauschale = grossIncome * 0.11;

    // Calculate taxable income
    const taxableIncome = grossIncome - werbungskostenPauschbetrag - sonderausgabenPauschbetrag - vorsorgepauschale;

    // Ensure it's not negative
    return Math.max(0, taxableIncome);
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
    const actualSubsidies = calculateActualSubsidies();

    // Maximum deductible amount is 2,100€ (Eigenbeitrag + Zulagen)
    const totalPayment = state.contribution + actualSubsidies;
    const deductibleAmount = Math.min(totalPayment, 2100);

    // Calculate taxable income from gross income with standard deductions
    const taxableIncome = calculateTaxableIncome(state.income, state.maritalStatus);

    // For married couples, use Ehegattensplitting (half the taxable income for tax calculation)
    const taxableIncomeForBracket = state.maritalStatus === 'married' ? taxableIncome / 2 : taxableIncome;
    const marginalTaxRate = calculateTaxBracket(taxableIncomeForBracket) / 100;

    // Tax benefit from deducting the full amount (contribution + subsidies)
    const taxBenefit = deductibleAmount * marginalTaxRate;

    // Additional tax savings beyond the subsidies already received
    // Only positive if tax benefit exceeds the subsidies
    const additionalSavings = Math.max(0, taxBenefit - actualSubsidies);

    return additionalSavings;
}

function calculateTotalAnnualSubsidy() {
    const subsidies = calculateActualSubsidies();
    const taxSavings = calculateGuenstigerpruefung();
    return subsidies + taxSavings;
}

function calculateSubsidyRate() {
    const actualSubsidies = calculateActualSubsidies();
    const taxSavings = calculateGuenstigerpruefung();
    const totalPayment = state.contribution + actualSubsidies;

    if (totalPayment === 0) return 0;

    // Förderquote = (Zulagen + Steuerersparnis) / (Eigenbeitrag + Zulagen) × 100
    return ((actualSubsidies + taxSavings) / totalPayment) * 100;
}

function getLifeExpectancy(currentAge) {
    // Simple linear approximation based on an expected lifespan of 93 for a 30-year-old.
    // e.g. Age 30 -> 93 years total, Age 40 -> 92 years total
    return 96 - (currentAge * 0.1);
}

function calculateForecast() {
    const years = state.retirementAge - state.startAge;
    const annualPayment = state.contribution + calculateActualSubsidies();
    const rate = state.riesterReturn / 100;

    if (years <= 0) {
        return {
            years: 0,
            annualPayment: annualPayment,
            endCapital: 0,
            monthlyPension: 0
        };
    }

    let endCapital = 0;
    if (rate === 0) {
        endCapital = annualPayment * years;
    } else {
        // Future value of annuity formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
        endCapital = annualPayment * (((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate));
    }

    // Estimated monthly pension based on start age and life expectancy
    const lifeExpectancy = getLifeExpectancy(state.startAge);
    const payoutYears = Math.max(10, lifeExpectancy - state.retirementAge); // At least 10 years to be safe
    const payoutMonths = payoutYears * 12;
    const monthlyPension = endCapital / payoutMonths;

    return {
        years: years,
        annualPayment: annualPayment,
        endCapital: endCapital,
        monthlyPension: monthlyPension
    };
}

// AV-Depot Calculation Functions

function calculateAVGrundzulageStufe1() {
    // 0,50 € pro Euro Eigenbeitrag auf die ersten 360 € (max. 180 €)
    const tier1Threshold = 360;
    const tier1Rate = 0.50;
    const tier1Contribution = Math.min(state.contribution, tier1Threshold);
    return tier1Contribution * tier1Rate;
}

function calculateAVGrundzulageStufe2() {
    // 0,25 € pro Euro Eigenbeitrag für 361 € bis 1.800 € (max. 360 €)
    if (state.contribution <= 360) return 0;

    const tier2Start = 360;
    const tier2Max   = 1800;
    const tier2Rate  = 0.25;

    const tier2Contribution = Math.min(state.contribution - tier2Start, tier2Max - tier2Start);
    return Math.max(0, tier2Contribution * tier2Rate);
}

function calculateAVGrundzulageTotal() {
    return calculateAVGrundzulageStufe1() + calculateAVGrundzulageStufe2();
}

function calculateAVKinderzulage() {
    // 1 € Kinderzulage pro eingezahltem Euro Eigenbeitrag, max. 300 € pro Kind
    const totalChildren = state.childrenBefore2008 + state.childrenAfter2008;
    if (totalChildren === 0) return 0;

    const perChildSubsidy = Math.min(state.contribution, 300);
    return perChildSubsidy * totalChildren;
}

function calculateAVTotalSubsidies() {
    return calculateAVGrundzulageTotal() + calculateAVKinderzulage();
}

function calculateAVMindesteigenbeitrag() {
    // Fixed minimum: 120€ per year
    return 120;
}

function calculateAVActualSubsidies() {
    const mindesteigenbeitrag = calculateAVMindesteigenbeitrag();

    // If contribution is below minimum (120€), no subsidies are granted
    if (state.contribution < mindesteigenbeitrag) {
        return 0;
    }

    // Otherwise return full subsidies
    const fullSubsidies = calculateAVTotalSubsidies();
    return fullSubsidies;
}

function calculateAVGuenstigerpruefung() {
    const mindesteigenbeitrag = calculateAVMindesteigenbeitrag();

    // If contribution is below minimum (120€), no tax benefits are granted
    if (state.contribution < mindesteigenbeitrag) {
        return 0;
    }

    const actualSubsidies = calculateAVActualSubsidies();
    // Max deductible: 1,800€ contribution + subsidies
    const maxDeductible = 1800;
    const totalContribution = Math.min(state.contribution + actualSubsidies, maxDeductible + actualSubsidies);

    // Calculate taxable income from gross income with standard deductions
    const taxableIncome = calculateTaxableIncome(state.income, state.maritalStatus);

    // For married couples, use Ehegattensplitting (half the taxable income for tax calculation)
    const taxableIncomeForBracket = state.maritalStatus === 'married' ? taxableIncome / 2 : taxableIncome;
    const marginalTaxRate = calculateTaxBracket(taxableIncomeForBracket) / 100;

    // Tax deduction value (only on contribution up to 1,800€)
    const deductibleContribution = Math.min(state.contribution, maxDeductible);
    const taxDeduction = (deductibleContribution + actualSubsidies) * marginalTaxRate;

    // Additional tax savings beyond subsidies
    const additionalSavings = Math.max(0, taxDeduction - actualSubsidies);

    return additionalSavings;
}

function calculateAVTotalAnnualSubsidy() {
    const subsidies = calculateAVActualSubsidies();
    const taxSavings = calculateAVGuenstigerpruefung();
    return subsidies + taxSavings;
}

function calculateAVSubsidyRate() {
    const actualSubsidies = calculateAVActualSubsidies();
    const taxSavings = calculateAVGuenstigerpruefung();
    const totalPayment = state.contribution + actualSubsidies;

    if (totalPayment === 0) return 0;

    // Förderquote = (Zulagen + Steuerersparnis) / (Eigenbeitrag + Zulagen) × 100
    return ((actualSubsidies + taxSavings) / totalPayment) * 100;
}

function calculateAVForecast() {
    const years = state.retirementAge - state.startAge;
    const annualPayment = state.contribution + calculateAVActualSubsidies();
    const rate = state.avReturn / 100;

    if (years <= 0) {
        return {
            years: 0,
            annualPayment: annualPayment,
            endCapital: 0,
            monthlyPension: 0
        };
    }

    let endCapital = 0;
    if (rate === 0) {
        endCapital = annualPayment * years;
    } else {
        // Future value of annuity formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
        endCapital = annualPayment * (((Math.pow(1 + rate, years) - 1) / rate) * (1 + rate));
    }

    // Estimated monthly pension based on start age and life expectancy
    const lifeExpectancy = getLifeExpectancy(state.startAge);
    const payoutYears = Math.max(10, lifeExpectancy - state.retirementAge); // At least 10 years to be safe
    const payoutMonths = payoutYears * 12;
    const monthlyPension = endCapital / payoutMonths;

    return {
        years: years,
        annualPayment: annualPayment,
        endCapital: endCapital,
        monthlyPension: monthlyPension
    };
}

// Comparison Functions

function compareProducts() {
    const riesterTotal = calculateTotalAnnualSubsidy();
    const avDepotTotal = calculateAVTotalAnnualSubsidy();
    const riesterCapital = calculateForecast().endCapital;
    const avDepotCapital = calculateAVForecast().endCapital;
    const riesterPension = calculateForecast().monthlyPension;
    const avDepotPension = calculateAVForecast().monthlyPension;

    const subsidyDifference = avDepotTotal - riesterTotal;
    const capitalDifference = avDepotCapital - riesterCapital;
    const pensionDifference = avDepotPension - riesterPension;

    let betterProduct = 'equal';
    if (Math.abs(pensionDifference) > 0.005) { // Tolerance of 0.005€ (half a cent)
        betterProduct = pensionDifference > 0 ? 'av-depot' : 'riester';
    }

    return {
        betterProduct: betterProduct,
        subsidyDifference: subsidyDifference,
        capitalDifference: capitalDifference,
        pensionDifference: pensionDifference,
        riesterTotal: riesterTotal,
        avDepotTotal: avDepotTotal
    };
}

// Update Functions

function formatCurrency(value) {
    return value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
    return value.toLocaleString('de-DE');
}

// Helper function to update slider progress fill
function updateSliderProgress(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const value = parseFloat(slider.value) || 0;
    const percentage = ((value - min) / (max - min)) * 100;
    slider.style.setProperty('--range-progress', `${percentage}%`);
}

function updateResults() {
    // Update Return Rate Labels
    if (elements.riesterReturnTitle) {
        elements.riesterReturnTitle.textContent = state.riesterReturn.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    if (elements.avReturnTitle) {
        elements.avReturnTitle.textContent = state.avReturn.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    // Calculate all Riester values
    const grundzulage = calculateGrundzulage();
    const fullSubsidies = calculateTotalSubsidies();
    const actualSubsidies = calculateActualSubsidies();
    const actualGrundzulage = calculateActualGrundzulage();
    const actualKinderzulage = calculateActualKinderzulage();
    const mindesteigenbeitrag = calculateMindesteigenbeitrag();
    const taxSavings = calculateGuenstigerpruefung();
    const totalAnnualSubsidy = calculateTotalAnnualSubsidy();
    const subsidyRate = calculateSubsidyRate();
    const forecast = calculateForecast();

    // Calculate all AV-Depot values
    const avGrundzulageStufe1 = calculateAVGrundzulageStufe1();
    const avGrundzulageStufe2 = calculateAVGrundzulageStufe2();
    const avGrundzulageTotal = calculateAVGrundzulageTotal();
    const avKinderzulage = calculateAVKinderzulage();
    const avActualSubsidies = calculateAVActualSubsidies();
    const avMindesteigenbeitrag = calculateAVMindesteigenbeitrag();
    const avTaxSavings = calculateAVGuenstigerpruefung();
    const avTotalAnnualSubsidy = calculateAVTotalAnnualSubsidy();
    const avSubsidyRate = calculateAVSubsidyRate();
    const avForecast = calculateAVForecast();

    // Calculate comparison
    const comparison = compareProducts();

    // Update Riester header card
    elements.headerMonthlyPension.textContent = formatCurrency(forecast.monthlyPension);
    elements.subsidyRate.textContent = formatCurrency(subsidyRate);

    // Update Riester subsidies card
    elements.basicSubsidy.textContent = formatCurrency(actualGrundzulage);
    elements.totalAllowances.textContent = formatCurrency(actualSubsidies);

    // Show/hide Riester child subsidy row
    const kinderzulage = calculateKinderzulage();
    if (kinderzulage > 0) {
        elements.childSubsidyRow.style.display = 'flex';
        elements.childSubsidy.textContent = formatCurrency(actualKinderzulage);
    } else {
        elements.childSubsidyRow.style.display = 'none';
    }

    // Update Riester warning card
    if (state.contribution < mindesteigenbeitrag) {
        elements.warningCard.style.display = 'block';
        elements.minimumRequired.textContent = formatCurrency(mindesteigenbeitrag);
    } else {
        elements.warningCard.style.display = 'none';
    }

    // Update optimal button
    elements.optimalAmount.textContent = formatNumber(Math.round(mindesteigenbeitrag));

    // Update Riester tax savings
    elements.taxSavings.textContent = formatCurrency(taxSavings);
    if (taxSavings > 0) {
        elements.guenstigerpruefungText.textContent = 'Der Sonderausgabenabzug ist für Sie günstiger als die Zulagen. Das Finanzamt erstattet die Differenz.';
    } else {
        elements.guenstigerpruefungText.textContent = 'Die Zulagen sind für Sie günstiger als der Sonderausgabenabzug. Das Finanzamt gewährt automatisch die Zulagen.';
    }

    // Update Riester forecast
    elements.duration.textContent = forecast.years;
    elements.annualPayment.textContent = formatCurrency(forecast.annualPayment);
    elements.endCapital.textContent = formatCurrency(forecast.endCapital);
    elements.monthlyPension.textContent = formatCurrency(forecast.monthlyPension);

    // Update Riester summary card
    elements.summarySubsidies.textContent = formatCurrency(actualSubsidies);
    elements.summaryTax.textContent = formatCurrency(taxSavings);
    elements.summaryTotal.textContent = formatCurrency(totalAnnualSubsidy);

    // Update AV-Depot header card
    elements.avHeaderMonthlyPension.textContent = formatCurrency(avForecast.monthlyPension);
    elements.avSubsidyRate.textContent = formatCurrency(avSubsidyRate);

    // Update AV-Depot subsidies card
    // Show 0 for Grundzulage if contribution is below minimum
    const displayAvGrundzulage = state.contribution < avMindesteigenbeitrag ? 0 : avGrundzulageTotal;
    elements.avGrundzulageTotal.textContent = formatCurrency(displayAvGrundzulage);
    elements.avTotalAllowances.textContent = formatCurrency(avActualSubsidies);

    // Show/hide AV-Depot child subsidy row
    const displayAvKinderzulage = state.contribution < avMindesteigenbeitrag ? 0 : avKinderzulage;
    const totalChildren = state.childrenBefore2008 + state.childrenAfter2008;
    if (totalChildren > 0) {
        elements.avChildSubsidyRow.style.display = 'flex';
        elements.avChildSubsidy.textContent = formatCurrency(displayAvKinderzulage);
    } else {
        elements.avChildSubsidyRow.style.display = 'none';
    }

    // Update AV-Depot warning card
    if (state.contribution < avMindesteigenbeitrag) {
        elements.avWarningCard.style.display = 'block';
        elements.avMinimumRequired.textContent = formatCurrency(avMindesteigenbeitrag);
    } else {
        elements.avWarningCard.style.display = 'none';
    }

    // Update AV-Depot tax savings
    elements.avTaxSavings.textContent = formatCurrency(avTaxSavings);
    if (avTaxSavings > 0) {
        elements.avGuenstigerpruefungText.textContent = 'Der Sonderausgabenabzug ist für Sie günstiger als die Zulagen. Das Finanzamt erstattet die Differenz.';
    } else {
        elements.avGuenstigerpruefungText.textContent = 'Die Zulagen sind für Sie günstiger als der Sonderausgabenabzug. Das Finanzamt gewährt automatisch die Zulagen.';
    }

    // Update AV-Depot forecast
    elements.avDuration.textContent = avForecast.years;
    elements.avAnnualPayment.textContent = formatCurrency(avForecast.annualPayment);
    elements.avEndCapital.textContent = formatCurrency(avForecast.endCapital);
    elements.avMonthlyPension.textContent = formatCurrency(avForecast.monthlyPension);

    // Update AV-Depot summary card
    elements.avSummarySubsidies.textContent = formatCurrency(avActualSubsidies);
    elements.avSummaryTax.textContent = formatCurrency(avTaxSavings);
    elements.avSummaryTotal.textContent = formatCurrency(avTotalAnnualSubsidy);

    // Update comparison section
    const subsidiesDiff = avActualSubsidies - actualSubsidies;
    const taxDiff = avTaxSavings - taxSavings;
    const totalDiff = comparison.subsidyDifference;
    const capitalDiff = comparison.capitalDifference;

    elements.comparisonSubsidiesDiff.textContent = formatCurrency(Math.abs(subsidiesDiff));
    elements.comparisonSubsidiesDiff.className = subsidiesDiff >= 0 ? 'text-green-600' : 'text-red-600';

    elements.comparisonTaxDiff.textContent = formatCurrency(Math.abs(taxDiff));
    elements.comparisonTaxDiff.className = taxDiff >= 0 ? 'text-green-600' : 'text-red-600';

    elements.comparisonTotalDiff.textContent = formatCurrency(Math.abs(totalDiff));
    elements.comparisonTotalDiff.className = totalDiff >= 0 ? 'text-green-600' : 'text-red-600';

    elements.comparisonCapitalDiff.textContent = formatCurrency(Math.abs(capitalDiff));
    elements.comparisonCapitalDiff.className = capitalDiff >= 0 ? 'text-green-600' : 'text-red-600';

    // Update recommendation text
    if (comparison.betterProduct === 'riester') {
        elements.comparisonRecommendation.textContent = 'Riester bietet für Sie die höhere geschätzte Rente!';
        elements.comparisonRecommendation.className = 'text-lg font-semibold text-blue-700';
    } else if (comparison.betterProduct === 'av-depot') {
        elements.comparisonRecommendation.textContent = 'AV-Depot bietet für Sie die höhere geschätzte Rente!';
        elements.comparisonRecommendation.className = 'text-lg font-semibold text-green-700';
    } else {
        elements.comparisonRecommendation.textContent = 'Beide Produkte bieten eine ähnliche geschätzte Rente.';
        elements.comparisonRecommendation.className = 'text-lg font-semibold text-gray-700';
    }

    // Highlight better product column
    elements.riesterColumn.classList.remove('better-product');
    elements.avDepotColumn.classList.remove('better-product');

    if (comparison.betterProduct === 'riester') {
        elements.riesterColumn.classList.add('better-product');
    } else if (comparison.betterProduct === 'av-depot') {
        elements.avDepotColumn.classList.add('better-product');
    }
}

// Event Listeners

elements.incomeSlider.addEventListener('input', (e) => {
    state.income = parseInt(e.target.value);
    elements.incomeDisplay.textContent = formatNumber(state.income) + ' €';
    updateSliderProgress(e.target);
    updateResults();
});

elements.maritalStatus.addEventListener('change', (e) => {
    state.maritalStatus = e.target.value;
    updateResults();
});

elements.childrenBeforeSlider.addEventListener('input', (e) => {
    state.childrenBefore2008 = parseInt(e.target.value);
    elements.childrenBeforeDisplay.textContent = `${state.childrenBefore2008}`;
    updateSliderProgress(e.target);
    updateResults();
});

elements.childrenAfterSlider.addEventListener('input', (e) => {
    state.childrenAfter2008 = parseInt(e.target.value);
    elements.childrenAfterDisplay.textContent = `${state.childrenAfter2008}`;
    updateSliderProgress(e.target);
    updateResults();
});

elements.contributionSlider.addEventListener('input', (e) => {
    state.contribution = parseInt(e.target.value);
    elements.contributionDisplay.textContent = formatNumber(state.contribution) + ' €';
    updateSliderProgress(e.target);
    updateResults();
});

elements.optimalButton.addEventListener('click', () => {
    const optimal = Math.round(calculateMindesteigenbeitrag());
    state.contribution = optimal;
    elements.contributionSlider.value = optimal;
    elements.contributionDisplay.textContent = formatNumber(optimal) + ' €';
    updateSliderProgress(elements.contributionSlider);
    updateResults();
});

elements.startAgeSlider.addEventListener('input', (e) => {
    state.startAge = parseInt(e.target.value);
    elements.startAgeDisplay.textContent = state.startAge;
    updateSliderProgress(e.target);

    // Ensure retirement age is always greater than start age
    if (state.retirementAge <= state.startAge) {
        state.retirementAge = state.startAge + 1;
        elements.retirementAgeSlider.value = state.retirementAge;
        elements.retirementAgeDisplay.textContent = state.retirementAge;
        updateSliderProgress(elements.retirementAgeSlider);
    }

    updateResults();
});

elements.retirementAgeSlider.addEventListener('input', (e) => {
    state.retirementAge = parseInt(e.target.value);
    elements.retirementAgeDisplay.textContent = state.retirementAge;
    updateSliderProgress(e.target);

    // Ensure retirement age is always greater than start age
    if (state.retirementAge <= state.startAge) {
        state.retirementAge = state.startAge + 1;
        elements.retirementAgeSlider.value = state.retirementAge;
        elements.retirementAgeDisplay.textContent = state.retirementAge;
        updateSliderProgress(elements.retirementAgeSlider);
    }

    updateResults();
});

elements.riesterReturnSlider.addEventListener('input', (e) => {
    state.riesterReturn = parseFloat(e.target.value);
    elements.riesterReturnDisplay.textContent = state.riesterReturn.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    updateSliderProgress(e.target);
    updateResults();
});

elements.avReturnSlider.addEventListener('input', (e) => {
    state.avReturn = parseFloat(e.target.value);
    elements.avReturnDisplay.textContent = state.avReturn.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    updateSliderProgress(e.target);
    updateResults();
});

  // Initialize all sliders with progress visualization
  document.querySelectorAll('#page-jeg-foerder input[type="range"]').forEach(slider => {
    updateSliderProgress(slider);
  });

  // Initial calculation
  updateResults();

} // end initFoerderRechner
