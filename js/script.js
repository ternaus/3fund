const vbtlxBeforeDollars = document.getElementById("vbtlx_before_dollars")
const vtsax_before_dollars = document.getElementById("vtsax_before_dollars")
const vtiax_before_dollars = document.getElementById("vtiax_before_dollars")
const total_before_dollars = document.getElementById("total_before_dollars")

const vbtlx_before_percent = document.getElementById("vbtlx_before_percent")
const vtsax_before_percent = document.getElementById("vtsax_before_percent")
const vtiax_before_percent = document.getElementById("vtiax_before_percent")

const vbtlx_target_percent = document.getElementById("vbtlx_target_percent")
const vtsax_target_percent = document.getElementById("vtsax_target_percent")
const vtiax_target_percent = document.getElementById("vtiax_target_percent")

const total_target_percent = document.getElementById("total_target_percent")
const submit_button = document.getElementById("submit_button")
const investment = document.getElementById("investment")

const vbtlx_to_invest = document.getElementById("vbtlx_to_invest")
const vtsax_to_invest = document.getElementById("vtsax_to_invest")
const vtiax_to_invest = document.getElementById("vtiax_to_invest")

const vbtlx_to_invest_percent = document.getElementById("vbtlx_to_invest_percent")
const vtsax_to_invest_percent = document.getElementById("vtsax_to_invest_percent")
const vtiax_to_invest_percent = document.getElementById("vtiax_to_invest_percent")

const result_investing_dollars = document.getElementById("result_investing_dollars")

function compute_total_dollar_amount() {
    return Number(vbtlxBeforeDollars.value) + Number(vtsax_before_dollars.value) + Number(vtiax_before_dollars.value);
}

function render_total_dollar_amount() {
    total_before_dollars.textContent = "$" + String(compute_total_dollar_amount());
}


function compute_fraction_from_dollars(array_dollar_amounts) {
    array_dollar_amounts = array_dollar_amounts.map(x => Number(x))
    const total_sum = array_dollar_amounts.reduce((a, b) => a + b, 0)

    return array_dollar_amounts.map(x => x / total_sum)
}

function compute_and_render_before_percents() {
    const total_dollar_amount = compute_total_dollar_amount();
    if (total_dollar_amount > 0) {
        const fraction_from_dollars = compute_fraction_from_dollars([vbtlxBeforeDollars.value, vtsax_before_dollars.value, vtiax_before_dollars.value])

        vbtlx_before_percent.textContent = print_percent_from_fraction(fraction_from_dollars[0])
        vtsax_before_percent.textContent = print_percent_from_fraction(fraction_from_dollars[1])
        vtiax_before_percent.textContent = print_percent_from_fraction(fraction_from_dollars[2])
    }
}


function add_handler_before_dollars(x) {
    x.addEventListener("focusout", () => {
        compute_and_render_before_percents();
        render_total_dollar_amount();
    })
}

[vbtlxBeforeDollars, vtsax_before_dollars, vtiax_before_dollars].forEach(add_handler_before_dollars)

function render_total_target_percent() {
    total_target_percent.textContent = String(Number(vbtlx_target_percent.value) + Number(vtsax_target_percent.value) + Number(vtiax_target_percent.value))
}

function add_handler_target_percent(x) {
    x.addEventListener("focusout", () => {
        render_total_target_percent()
    })
}

[vbtlx_target_percent, vtsax_target_percent, vtiax_target_percent].forEach(add_handler_target_percent)

function round(x, precision) {
    const multiplier = Math.pow(10, precision)
    return Math.round((x + Number.EPSILON) * multiplier) / multiplier
}

function compute_deltas(fraction_array, before_dollars_array, investment_dollars, total_dollars) {
    const result = Array(3)

    for (let i = 0; i < result.length; i++) {
        result[i] = fraction_array[i] * (total_dollars + investment_dollars) - before_dollars_array[i]
    }
    return result
}

function add_two_arrays(x, y) {
    const result = Array(x.length)

    for (let i = 0; i < result.length; i++) {
        result[i] = x[i] + y[i]

    }
    return result
}

function print_percent_from_fraction(x) {
    return (100 * x).toFixed(2)
}


function compute_and_render_investments(x) {
    const total_dollars = compute_total_dollar_amount()
    const fraction_array = [vbtlx_target_percent, vtsax_target_percent, vtiax_target_percent].map(x => Number(x.value) / 100)
    const before_dollars = [vbtlxBeforeDollars, vtsax_before_dollars, vtiax_before_dollars].map(x => Number(x.value))
    const investment_value = Number(investment.value)

    const deltas_array = compute_deltas(fraction_array, before_dollars, investment_value, total_dollars)

    const delta_vbtlx = round(deltas_array[0], 2)
    let delta_vtsax = round(deltas_array[1], 2)
    const delta_vtiax = round(deltas_array[2], 2)

    let delta_total = delta_vbtlx + delta_vtsax + delta_vtiax

    const investment_difference = investment_value - delta_total

    delta_vtsax += investment_difference

    vbtlx_to_invest.textContent = String(delta_vbtlx)
    vtsax_to_invest.textContent = String(delta_vtsax)
    vtiax_to_invest.textContent = String(delta_vtiax)

    result_investing_dollars.textContent = delta_vbtlx + delta_vtsax + delta_vtiax

    const final_dollar_allocation_array = add_two_arrays(before_dollars, [delta_vbtlx, delta_vtsax, delta_vtiax])

    const will_be_invested_fractions = compute_fraction_from_dollars(final_dollar_allocation_array)

    vbtlx_to_invest_percent.textContent = print_percent_from_fraction(will_be_invested_fractions[0])
    vtsax_to_invest_percent.textContent = print_percent_from_fraction(will_be_invested_fractions[1])
    vtiax_to_invest_percent.textContent = print_percent_from_fraction(will_be_invested_fractions[2])

}

submit_button.addEventListener("click", (event) => {
    event.preventDefault()
    compute_and_render_investments()
})