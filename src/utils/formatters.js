/**
 * Currency, percentage, and number formatters.
 */

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyDetailFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-US');

export function formatCurrency(value) {
  return currencyFormatter.format(value);
}

export function formatCurrencyDetailed(value) {
  return currencyDetailFormatter.format(value);
}

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function formatPercent(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatSalaryRange(min, max) {
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}
