import { StyleSheet, Pressable } from 'react-native';

import { Entypo } from '@expo/vector-icons';

import colors from '../../../utils/colors';

interface AddButtonProps {
  onAddPress: () => void;
}

export default function AddButton({ onAddPress }: AddButtonProps) {
  return (
    <Pressable
      onPress={onAddPress}
      style={({ pressed }) => [
        styles.editBtn,
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
