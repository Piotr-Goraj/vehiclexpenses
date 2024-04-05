import { StyleSheet, Text, Pressable } from 'react-native';

import colors from '../../../utils/colors';
import usePrimaryColors from '../../../hooks/usePrimaryColors';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  btnColor?: 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'magenta';
}

export default function PrimaryButton({
  title,
  onPress,
  btnColor = 'blue',
}: PrimaryButtonProps) {
  const color = usePrimaryColors(btnColor);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: color[300],
        },
        pressed && {
          backgroundColor: color[100],
        },
      ]}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '40%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    margin: 4,
    borderWidth: 2,
    borderRadius: 8,
  },
});
