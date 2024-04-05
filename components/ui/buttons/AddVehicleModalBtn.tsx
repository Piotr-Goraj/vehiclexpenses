import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import colors from '../../../utils/colors';

interface AddVehicleModalBtnProps extends PressableProps {
  title: string;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const AddVehicleModalBtn: React.FC<AddVehicleModalBtnProps> = ({
  onPress,
  title,
  buttonStyle,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, buttonStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 128,
    height: 128,
    margin: 8,

    padding: 10,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',

    borderColor: colors.blue[300],
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  text: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AddVehicleModalBtn;
