import { StyleSheet, Pressable, ViewStyle } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import colors from '../../../utils/colors';

interface AddButtonProps {
  onAddPress: () => void;
  absolutePosition?: ViewStyle;
}

export default function AddButton({
  onAddPress,
  absolutePosition,
}: AddButtonProps) {
  return (
    <Pressable
      onPress={onAddPress}
      style={({ pressed }) => [
        styles.editBtn,
        absolutePosition,
        pressed && styles.editBtnPressed,
      ]}
    >
      <Entypo
        name='add-to-list'
        size={24}
        color='black'
      />
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
    borderColor: colors.green[500],
  },
  editBtnPressed: {
    opacity: 1,
  },
});
