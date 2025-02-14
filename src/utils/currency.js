const EXCHANGE_RATE = 1000;

export const convertCurrency = (amount, fromCurrency) => {
  if (fromCurrency === "CLP") {
    const usdAmount = amount / EXCHANGE_RATE;
    return {
      clp: amount,
      usd: usdAmount.toFixed(0),
      formatted: {
        clp: `${amount.toLocaleString("es-CL")}`,
        usd: `${Math.round(usdAmount).toLocaleString("en-US")}`,
      },
    };
  } else {
    const clpAmount = amount * EXCHANGE_RATE;
    return {
      clp: clpAmount,
      usd: amount,
      formatted: {
        clp: `${clpAmount.toLocaleString("es-CL")}`,
        usd: `${Math.round(amount).toLocaleString("en-US")}`,
      },
    };
  }
};
