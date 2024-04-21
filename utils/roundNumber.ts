export const roundNumber = (number: number | string): number => {
  if (typeof number === 'string')
    return parseFloat(parseFloat(number).toFixed(2));

  return parseFloat(number.toFixed(2));
};
