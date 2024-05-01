export default function useDateDelta(date: string) {
  const [year, month, day] = date.split('-').map(Number);

  const givenDate = new Date(year, month - 1, day);
  const currentDate = new Date();

  const dateDelta = currentDate.getTime() - givenDate.getTime();

  const differenceInDays = dateDelta / (1000 * 60 * 60 * 24);
  const differenceInMonths =
    currentDate.getMonth() -
    givenDate.getMonth() +
    12 * (currentDate.getFullYear() - givenDate.getFullYear());
  const differenceInYears = currentDate.getFullYear() - givenDate.getFullYear();

  return [differenceInDays, differenceInMonths, differenceInYears];
}
