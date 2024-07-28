function formatNumber(inputNumber: number, decimal: number) {
  const num = Number(inputNumber);
  if (inputNumber % 1 === 0) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
    });
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
}

function formatAddress(inputAddress: string) {
  if (!inputAddress) return '';
  const start = inputAddress.slice(0, 6);
  const end = inputAddress.slice(-3);
  return `${start}...${end}`;
}

export { formatNumber, formatAddress };
