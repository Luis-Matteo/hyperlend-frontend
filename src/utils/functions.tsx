import { BigNumber } from 'bignumber.js';

function formatNumber(
  inputNumber: number,
  decimal: number,
  replaceNaN: boolean = false,
) {
  const num = Number(inputNumber);

  if (isNaN(num) && replaceNaN) return '0';

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
  const end = inputAddress.slice(-5);
  return `${start}...${end}`;
}

export function capitalizeString(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function calculateApy(currentRate: BigInt) {
  let rateBN = new BigNumber(currentRate.toString());
  let rateDecimal = Number(rateBN.div(1e27));
  let apy = Math.pow(Math.E, rateDecimal) - 1;
  return apy * 100;
}

export function decodeConfig(configNumber: bigint) {
  // bit 0-15: LTV
  // bit 16-31: Liquidation threshold
  // bit 32-47: Liquidation bonus
  // bit 48-55: Decimals
  // bit 56: reserve is active
  // bit 57: reserve is frozen
  // bit 58: borrowing is enabled
  // bit 59: stable rate borrowing enabled
  // bit 60: asset is paused
  // bit 61: borrowing in isolation mode is enabled
  // bit 62-63: reserved
  // bit 64-79: reserve factor
  // bit 80-115: borrow cap in whole tokens, 0 ⇒ no cap
  // bit 116-151: supply cap in whole tokens, 0 ⇒ no cap
  // bit 152-167: liquidation protocol fee
  // bit 168-175: eMode category
  // bit 176-211: unbacked mint cap in whole tokens, 0 ⇒ no cap
  // bit 212-251: debt ceiling for isolation mode with decimals
  // bit 252-255: unused

  const ltv = Number(extractBits(configNumber, 0, 16));
  const liquidationThreshold = Number(extractBits(configNumber, 16, 16));
  const liquidationBonus = Number(extractBits(configNumber, 32, 16));
  const decimals = Number(extractBits(configNumber, 48, 8));
  const reserveIsActive = extractBits(configNumber, 56, 1) === BigInt(1);
  const reserveIsFrozen = extractBits(configNumber, 57, 1) === BigInt(1);
  const borrowingIsEnabled = extractBits(configNumber, 58, 1) === BigInt(1);
  const stableRateBorrowingEnabled =
    extractBits(configNumber, 59, 1) === BigInt(1);
  const assetIsPaused = extractBits(configNumber, 60, 1) === BigInt(1);
  const borrowingInIsolationModeEnabled =
    extractBits(configNumber, 61, 1) === BigInt(1);
  const reserved = Number(extractBits(configNumber, 62, 2));
  const reserveFactor = Number(extractBits(configNumber, 64, 16));
  const borrowCap = Number(extractBits(configNumber, 80, 36));
  const supplyCap = Number(extractBits(configNumber, 116, 36));
  const liquidationProtocolFee = Number(extractBits(configNumber, 152, 16));
  const eModeCategory = Number(extractBits(configNumber, 168, 8));
  const unbackedMintCap = Number(extractBits(configNumber, 176, 36));
  const debtCeiling = Number(extractBits(configNumber, 212, 40));

  return {
    reserveIsActive,
    reserveIsFrozen,
    borrowingIsEnabled,
    stableRateBorrowingEnabled,
    borrowingInIsolationModeEnabled,
    assetIsPaused,
    reserved,
    ltv,
    liquidationThreshold,
    liquidationBonus,
    decimals,
    reserveFactor,
    borrowCap,
    supplyCap,
    debtCeiling,
    eModeCategory,
    unbackedMintCap,
    liquidationProtocolFee,
  };
}

function extractBits(number: any, offset: any, size: any) {
  const mask = (BigInt(1) << BigInt(size)) - BigInt(1);
  return (number >> BigInt(offset)) & mask;
}

export function filterString(inputString: string, searchPhrase: string) {
  return inputString.toLowerCase().includes(searchPhrase.toLowerCase());
}

export function padArray(arr: any, x: any, defaultValue: any) {
  const paddingNeeded = x - arr.length;

  if (paddingNeeded > 0) {
    const paddingArray = new Array(paddingNeeded).fill(defaultValue);
    return arr.concat(paddingArray);
  }
  return arr;
}

const copyToClipboard = (text: string): void => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Text copied to clipboard successfully!');
      },
      (err) => {
        console.error('Failed to copy text to clipboard', err);
      },
    );
  } else {
    // Fallback method if clipboard API is not supported
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Text copied to clipboard successfully!');
    } catch (err) {
      console.error('Failed to copy text to clipboard', err);
    }
    document.body.removeChild(textArea);
  }
};

const normalizeDecimalsAmount = (
  x: number,
  token: string,
  tokenDecimalsMap: any,
) => {
  return Number(x) / Math.pow(10, tokenDecimalsMap[token]);
};

type DailyData = {
  date: string;
  value: number;
};

export type WeeklyData = {
  date: string;
  value: number;
};

function getWeeklyData(dailyData: DailyData[]): WeeklyData[] {
  const weeklyData: WeeklyData[] = [];

  let weekStartDate: string | null = null;
  let weeklyValue = 0;
  let currentWeekDay = 0;

  for (let i = 0; i < dailyData.length; i++) {
    const dayData = dailyData[i];
    const currentDate = new Date(dayData.date);

    if (currentWeekDay === 0) {
      if (weekStartDate !== null) {
        weeklyData.push({
          date: weekStartDate,
          value: weeklyValue,
        });
      }

      weekStartDate = currentDate.toISOString().split('T')[0];
      weeklyValue = 0; // Reset the weekly sum
    }

    weeklyValue += dayData.value;

    currentWeekDay = (currentWeekDay + 1) % 7;
  }

  if (weekStartDate !== null) {
    weeklyData.push({
      date: weekStartDate,
      value: weeklyValue,
    });
  }

  return weeklyData;
}

export {
  formatNumber,
  formatAddress,
  formatUnit,
  calculateApy,
  copyToClipboard,
  normalizeDecimalsAmount,
  getWeeklyData,
};
