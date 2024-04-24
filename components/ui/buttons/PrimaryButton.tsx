import { useState } from 'react';
import { StyleSheet, Text, Pressable, ViewStyle } from 'react-native';

import usePrimaryColors from '../../../hooks/usePrimaryColors';

import { ColorIntensity } from '../../../utils/types';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  btnColor?: ColorIntensity;
  style?: ViewStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  btnColor = { color: 'blue', intensity: 400 },
  style,
}: PrimaryButtonProps) {
  const color = usePrimaryColors(btnColor.color);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.button,
        style,
        {
          borderColor: color[btnColor.intensity],
        },
        pressed && {
          backgroundColor: color[btnColor.intensity],
          borderWidth: 0,
        },
      ]}
    >
      <Text style={{ color: isPressed ? '#fff' : '#000' }}>{title}</Text>
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
