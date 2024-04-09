import { ReactNode } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';

import usePrimaryColors from '../../hooks/usePrimaryColors';
import EditButton from '../ui/buttons/EditButton';

interface VehiclesInfoBoxProps {
  children: ReactNode;
  boxColor?: 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'magenta';
  intensityColor?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

export default function VehiclesInfoBox({
  children,
  boxColor = 'blue',
  intensityColor = 500,
}: VehiclesInfoBoxProps) {
  const color = usePrimaryColors(boxColor);

  return (
    <View style={[styles.container, { borderColor: color[intensityColor] }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',

    alignItems: 'center',
    justifyContent: 'center',

    width: (360 - 16) / 2,
    height: (360 - 16) / 2,

    borderRadius: 16,
    borderWidth: 2,

    margin: 8,
    paddingVertical: 5,
  },
});
