import colors from '../utils/colors';

export default function usePrimaryColors(chosenColor: string) {
  const color =
    chosenColor === 'cyan'
      ? colors.cyan
      : chosenColor === 'green'
      ? colors.green
      : chosenColor === 'red'
      ? colors.red
      : chosenColor === 'yellow'
      ? colors.yellow
      : chosenColor === 'magenta'
      ? colors.magenta
      : chosenColor === 'grey'
      ? colors.grey
      : colors.blue;

  return color;
}
