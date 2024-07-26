function formatNumber(inputNumber : number) {
  const formattedNumber = inputNumber.toLocaleString('en-US', { minimumFractionDigits: 0 });
  return formattedNumber;
}
export { formatNumber };
