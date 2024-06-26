import { StyleSheet, View, Text, ViewStyle } from 'react-native';

import usePrimaryColors from '../../hooks/usePrimaryColors';

import colors from '../../utils/colors';
import { ColorIntensity } from '../../utils/types';

interface VehiclesInfoTxtProps {
  text: string;
  textColor?: 'light' | 'dark';
  boxColor?: ColorIntensity;
  customStyle?: ViewStyle;
}

export default function VehicleInfoTxt({
  text,
  textColor = 'dark',
  boxColor = { color: 'blue', intensity: 100 },
  customStyle,
}: VehiclesInfoTxtProps) {
  const color = usePrimaryColors(boxColor.color);
  const fontColor = textColor === 'dark' ? colors.fontDark : colors.fontLight;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color[boxColor.intensity] },
        customStyle,
      ]}
    >
      <Text style={{ color: fontColor, textAlign: 'center' }}>{text}</Text>
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
