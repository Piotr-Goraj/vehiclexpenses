import { StyleSheet, Pressable } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import colors from '../../../utils/colors';

interface EditButtonProps {
  onEditPress: () => void;
}

export default function EditButton({ onEditPress }: EditButtonProps) {
  return (
    <Pressable
      onPress={onEditPress}
      style={({ pressed }) => [
        styles.editBtn,
        pressed && styles.editBtnPressed,
      ]}
    >
      <AntDesign
        name='edit'
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
    borderColor: colors.yellow[300],
  },
  editBtnPressed: {
    opacity: 1,
  },
});
