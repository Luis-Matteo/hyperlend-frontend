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

function formatUnit(num: number, decimal: number = 2) {
  const sign = Math.sign(num);
  const numAbs = Math.abs(num);

  let formattedNum;
  if (numAbs >= 1e9) {
    formattedNum = `${(numAbs / 1e9).toFixed(decimal)}B`;
  } else if (numAbs >= 1e6) {
    formattedNum = `${(numAbs / 1e6).toFixed(decimal)}M`;
  } else if (numAbs >= 1e3) {
    formattedNum = `${(numAbs / 1e3).toFixed(decimal)}K`;
  } else {
    formattedNum = numAbs.toFixed(decimal);
  }

  return sign < 0 ? `-${formattedNum}` : formattedNum;
}

function formatAddress(inputAddress: string) {
  if (!inputAddress) return '';
  const start = inputAddress.slice(0, 6);
  const end = inputAddress.slice(-3);
  return `${start}...${end}`;
}

export { formatNumber, formatAddress, formatUnit };
