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
const submitButton = document.getElementById('submit_button');
const investment = document.getElementById('investment');
const vbtlxToInvest = document.getElementById('vbtlx_to_invest');
const vtsaxToInvest = document.getElementById('vtsax_to_invest');
const vtiaxToInvest = document.getElementById('vtiax_to_invest');
const vbtlxToInvestPercent = document.getElementById('vbtlx_to_invest_percent');
const vtsaxToInvestPercent = document.getElementById('vtsax_to_invest_percent');
const vtiaxToInvestPercent = document.getElementById('vtiax_to_invest_percent');
const resultInvestingDollars = document.getElementById('result_investing_dollars');
const PRECISION = 2;

// eslint-disable-next-line no-magic-numbers
const sumArray = (arrayToSum) => arrayToSum.reduce((ta, tb) => ta + tb, 0);

const computeTotalDollarAmount = () => sumArray([vbtlxBeforeDollars,
  vtsaxBeforeDollars,
  vtiaxBeforeDollars].map((dollarValueString) => Number(dollarValueString.value)));

const renderTotalDollarAmount = () => {
  totalBeforeDollars.textContent = `$${String(computeTotalDollarAmount())}`;
};

const computeFractionFromDollars = (arrayDollarAmountsString) => {
  const arrayDollarAmounts = arrayDollarAmountsString.map((tx) => Number(tx));
  const totalSum = sumArray(arrayDollarAmounts);
  return arrayDollarAmounts.map((tx) => tx / totalSum);
};

// eslint-disable-next-line no-magic-numbers
const printPercentFromFraction = (fraction) => (100 * fraction).toFixed(PRECISION);

const computeAndRenderBeforePercents = () => {
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
};

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
  totalTargetPercent.textContent = String([vbtlxTargetPercent,
    vtsaxTargetPercent,
    vtiaxTargetPercent].map((tx) => Number(tx.value)));
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

const addTwoArrays = (arrayA, arrayB) => arrayA.map((num, idx) => num + arrayB[idx]);

// eslint-disable-next-line no-magic-numbers
const percentToFraction = (number) => number / 100;

function assignToInvest(deltasArray) {
  vbtlxToInvest.textContent = String(deltasArray[0]);
  vtsaxToInvest.textContent = String(deltasArray[1]);
  vtiaxToInvest.textContent = String(deltasArray[2]);
}

function assignToInvestPercent(willBeInvestedFractions) {
  vbtlxToInvestPercent.textContent = printPercentFromFraction(willBeInvestedFractions[0]);
  vtsaxToInvestPercent.textContent = printPercentFromFraction(willBeInvestedFractions[1]);
  vtiaxToInvestPercent.textContent = printPercentFromFraction(willBeInvestedFractions[2]);
}

function computeAndRenderInvestments() {
  const totalDollars = computeTotalDollarAmount();
  const fractionArray = [vbtlxTargetPercent,
    vtsaxTargetPercent,
    vtiaxTargetPercent].map((tx) => percentToFraction(tx.value));
  const beforeDollars = [vbtlxBeforeDollars,
    vtsaxBeforeDollars,
    vtiaxBeforeDollars].map((tx) => Number(tx.value));
  const investmentValue = Number(investment.value);

  const deltasArray = computeDeltas(fractionArray,
    beforeDollars,
    investmentValue,
    totalDollars).map((tx) => Math.round(tx));

  // Fix for rounding error. We invest in integer dollars => we need to account for this.
  deltasArray[1] += investmentValue - sumArray(deltasArray);

  assignToInvest(deltasArray);

  resultInvestingDollars.textContent = sumArray(deltasArray);

  const finalDollarAllocationArray = addTwoArrays(beforeDollars, deltasArray);

  assignToInvestPercent(computeFractionFromDollars(finalDollarAllocationArray));
}

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  computeAndRenderInvestments();
});
