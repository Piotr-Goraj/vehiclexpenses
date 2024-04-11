import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import usePrimaryColors from '../../hooks/usePrimaryColors';

interface VehiclesInfoBoxProps {
  children: ReactNode;
  boxColor?: 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'magenta';
  intensityColor?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  customStyle?: ViewStyle;
}

export default function VehiclesInfoBox({
  children,
  boxColor = 'blue',
  intensityColor = 500,
  customStyle,
}: VehiclesInfoBoxProps) {
  const color = usePrimaryColors(boxColor);

  return (
    <View
      style={[
        styles.container,
        { borderColor: color[intensityColor] },
        customStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',

    alignItems: 'center',
    justifyContent: 'center',

    width: 172,
    height: 172,

    borderRadius: 16,
    borderWidth: 2,

    margin: 8,
    paddingVertical: 5,
  },
});
