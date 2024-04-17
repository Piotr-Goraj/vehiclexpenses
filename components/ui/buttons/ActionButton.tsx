import { StyleSheet, Pressable, ViewStyle } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import colors from '../../../utils/colors';
import { ButtonType, ColorIntensity } from '../../../utils/types';
import usePrimaryColors from '../../../hooks/usePrimaryColors';
import useButtonType from '../../../hooks/useButtonType';

interface ActionButtonProps {
  style?: ViewStyle;
  colorBtn: ColorIntensity;
  typeButton: ButtonType;
  onPress: () => void;
}

export default function ActionButton({
  style,
  colorBtn,
  typeButton,
  onPress,
}: ActionButtonProps) {
  const color = usePrimaryColors(colorBtn.color);
  const Icon = useButtonType(typeButton);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.editBtn,
        style,
        {
          borderColor: color[colorBtn.intensity],
        },
        pressed && styles.editBtnPressed,
      ]}
    >
      <Icon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  editBtn: {
    position: 'absolute',
    bottom: -10,
    right: -13,

    opacity: 0.7,

    padding: 10,
    backgroundColor: 'white',

    borderRadius: 25,
    borderWidth: 2,
  },
  editBtnPressed: {
    opacity: 1,
  },
});
