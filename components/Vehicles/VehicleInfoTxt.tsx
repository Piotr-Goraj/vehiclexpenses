import { StyleSheet, View, Text, TextStyle } from 'react-native';

import usePrimaryColors from '../../hooks/usePrimaryColors';

import colors from '../../utils/colors';

interface VehiclesInfoTxtProps {
  text: string;
  textColor?: 'light' | 'dark';
  boxColor?: {
    color: 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'magenta';
    intensity: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  };
}

export default function VehicleInfoTxt({
  text,
  textColor = 'dark',
  boxColor = { color: 'blue', intensity: 100 },
}: VehiclesInfoTxtProps) {
  const color = usePrimaryColors(boxColor.color);
  const fontColor = textColor === 'dark' ? colors.fontDark : colors.fontLight;

  return (
    <View
      style={[styles.container, { backgroundColor: color[boxColor.intensity] }]}
    >
      <Text style={{ color: fontColor }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 155,
    padding: 5,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 12,

    marginVertical: 1,
  },
});
