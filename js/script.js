const vbtlxBeforeDollars = document.getElementById('vbtlx_before_dollars');
const vtsaxBeforeDollars = document.getElementById('vtsax_before_dollars');
const vtiaxBeforeDollars = document.getElementById('vtiax_before_dollars');
const totalBeforeDollars = document.getElementById('total_before_dollars');

const vbtlxBeforePercent = document.getElementById('vbtlx_before_percent');
const vtsaxBeforePercent = document.getElementById('vtsax_before_percent');
const vtiaxBeforePercent = document.getElementById('vtiax_before_percent');

const vbtlxTargetPercent = document.getElementById('vbtlx_target_percent');
const vtsaxTargetPercent = document.getElementById('vtsax_target_percent');
const vtiaxTargetPercent = document.getElementById('vtiax_target_percent');
const totalTargetPercent = document.getElementById('total_target_percent');

const investment = document.getElementById('investment');
const submitButton = document.getElementById('submit_button');
const errorMessage = document.getElementById('error_message');

const vbtlxToInvest = document.getElementById('vbtlx_to_invest');
const vtsaxToInvest = document.getElementById('vtsax_to_invest');
const vtiaxToInvest = document.getElementById('vtiax_to_invest');
const vbtlxToInvestPercent = document.getElementById('vbtlx_to_invest_percent');
const vtsaxToInvestPercent = document.getElementById('vtsax_to_invest_percent');
const vtiaxToInvestPercent = document.getElementById('vtiax_to_invest_percent');
const resultInvestingDollars = document.getElementById('result_investing_dollars');

const vbtlxAfterInvestment = document.getElementById('vbtlx_after_investment');
const vtsaxAfterInvestment = document.getElementById('vtsax_after_investment');
const vtiaxAfterInvestment = document.getElementById('vtiax_after_investment');
const totalAfterInvestment = document.getElementById('total_after_investment');

const PRECISION = 1;

function currencyFormat(num) {
  // eslint-disable-next-line prefer-named-capture-group
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/gu, '$1,');
}

function sumArray(arrayToSum) {
  // eslint-disable-next-line no-magic-numbers
  return arrayToSum.reduce((ta, tb) => ta + tb, 0);
}

function computeTotalDollarAmount() {
  return sumArray([vbtlxBeforeDollars,
    vtsaxBeforeDollars,
    vtiaxBeforeDollars].map((tx) => Number(tx.value)));
}

function renderTotalDollarAmount() {
  totalBeforeDollars.textContent = currencyFormat(computeTotalDollarAmount());
}

const computeFractionFromDollars = (arrayDollarAmountsString) => {
  const arrayDollarAmounts = arrayDollarAmountsString.map(Number);
  const totalSum = sumArray(arrayDollarAmounts);
  return arrayDollarAmounts.map((tx) => tx / totalSum);
};

function printPercentFromFraction(fraction) {
  // eslint-disable-next-line no-magic-numbers
  return (100 * fraction).toFixed(PRECISION);
}

function computeAndRenderBeforePercents() {
  const totalDollarAmount = computeTotalDollarAmount();
  // eslint-disable-next-line no-magic-numbers
  if (totalDollarAmount > 0) {
    const fractionFromDollars = computeFractionFromDollars([vbtlxBeforeDollars.value,
      vtsaxBeforeDollars.value,
      vtiaxBeforeDollars.value]);

    vbtlxBeforePercent.textContent = printPercentFromFraction(fractionFromDollars[0]);
    vtsaxBeforePercent.textContent = printPercentFromFraction(fractionFromDollars[1]);
    vtiaxBeforePercent.textContent = printPercentFromFraction(fractionFromDollars[2]);
  }
}

const addHandlerBeforeDollars = (beforeDollarsField) => {
  beforeDollarsField.addEventListener('focusout', () => {
    computeAndRenderBeforePercents();
    renderTotalDollarAmount();
  });
};

[vbtlxBeforeDollars,
  vtsaxBeforeDollars,
  vtiaxBeforeDollars].forEach(addHandlerBeforeDollars);

// eslint-disable-next-line func-style
function renderTotalTargetPercent() {
  totalTargetPercent.textContent = sumArray([vbtlxTargetPercent,
    vtsaxTargetPercent,
    vtiaxTargetPercent].map((tx) => Number(tx.value))).toFixed(1);
}

const addHandlerTargetPercent = (targetPercentField) => {
  targetPercentField.addEventListener('focusout', () => {
    renderTotalTargetPercent();
  });
};

[vbtlxTargetPercent,
  vtsaxTargetPercent,
  vtiaxTargetPercent].forEach(addHandlerTargetPercent);

// eslint-disable-next-line func-style,max-params
function computeDeltas(fractionArray, beforeDollarsArray, investmentDollars, totalDollars) {
  const resultDollars = totalDollars + investmentDollars;
  return fractionArray.map((num, idx) => num * resultDollars - beforeDollarsArray[idx]);
}

function addTwoArrays(arrayA, arrayB) {
  return arrayA.map((num, idx) => num + arrayB[idx]);
}

function percentToFraction(number) {
  // eslint-disable-next-line no-magic-numbers
  return number / 100;
}

function assignToInvest(deltasArray) {
  vbtlxToInvest.textContent = String(deltasArray[0]);
  vtsaxToInvest.textContent = String(deltasArray[1]);
  vtiaxToInvest.textContent = String(deltasArray[2]);
  resultInvestingDollars.textContent = sumArray(deltasArray);
}

function assignToInvestPercent(willBeInvestedFractions) {
  vbtlxToInvestPercent.textContent = printPercentFromFraction(willBeInvestedFractions[0]);
  vtsaxToInvestPercent.textContent = printPercentFromFraction(willBeInvestedFractions[1]);
  vtiaxToInvestPercent.textContent = printPercentFromFraction(willBeInvestedFractions[2]);
}

function assignToInvestDollars(willBeInvestedDollars) {
  vbtlxAfterInvestment.textContent = currencyFormat(willBeInvestedDollars[0]);
  vtsaxAfterInvestment.textContent = currencyFormat(willBeInvestedDollars[1]);
  vtiaxAfterInvestment.textContent = currencyFormat(willBeInvestedDollars[2]);
  totalAfterInvestment.textContent = currencyFormat(sumArray(willBeInvestedDollars));
}

function renormalizeDeltas(deltasArray, investmentValue) {
  let deltasArrayNormalized = Array(deltasArray.length);
  if (investmentValue > 0) {
    deltasArrayNormalized = deltasArray.map((tx) => Math.max(tx, 0));
  } else if (investmentValue < 0) {
    deltasArrayNormalized = deltasArray.map((tx) => Math.min(tx, 0));
  }
  const normalizationConstant = Math.abs(investmentValue / sumArray(deltasArrayNormalized));
  return deltasArrayNormalized.map((tx) => tx * normalizationConstant);
}

function postProcessDeltas(deltasArray, investmentValue) {
  // Take care of the case when deltas have opposite values.
  const result = renormalizeDeltas(deltasArray, investmentValue).map(Math.trunc);
  // Fix for rounding error. We invest in integer dollars => we need to account for this.
  const gap = investmentValue - sumArray(result);
  result[1] += gap;
  return result;
}

function computeAndRenderInvestments() {
  const totalDollarsBefore = computeTotalDollarAmount();
  const fractionArray = [vbtlxTargetPercent,
    vtsaxTargetPercent,
    vtiaxTargetPercent].map((tx) => percentToFraction(tx.value));
  const beforeDollars = [vbtlxBeforeDollars,
    vtsaxBeforeDollars,
    vtiaxBeforeDollars].map((tx) => Number(tx.value));
  const investmentValue = Number(investment.value);

  let deltasArray = computeDeltas(fractionArray, beforeDollars, investmentValue, totalDollarsBefore);

  deltasArray = postProcessDeltas(deltasArray, investmentValue);
  assignToInvest(deltasArray);

  const finalDollarAllocationArray = addTwoArrays(beforeDollars, deltasArray);
  assignToInvestDollars(finalDollarAllocationArray);
  assignToInvestPercent(computeFractionFromDollars(finalDollarAllocationArray));
}

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (investment.value === '0' || investment.value === '') {
    errorMessage.textContent = 'Investment should be nonzero!';
    return;
  }

  if (Number(totalTargetPercent.textContent) !== 100) {
    errorMessage.textContent = 'Target percent should be equal to 100!';
    return;
  }

  errorMessage.textContent = '';
  computeAndRenderInvestments();
});
