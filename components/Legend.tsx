import { StyleSheet, View, Text } from 'react-native';

import { VehicleColorsProps } from '../utils/types';

interface LegendProps {
  vehiclesColors: VehicleColorsProps[];
}

export default function Legend({ vehiclesColors }: LegendProps) {
  return (
    <View style={styles.container}>
      {vehiclesColors.map((color) => (
        <View
          key={color.id}
          style={styles.colorWrapper}
        >
          <View
            style={[styles.legendColor, { backgroundColor: color.color }]}
          ></View>
          <Text>{color.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  colorWrapper: {
    flexDirection: 'row',
  },
  legendColor: {
    marginHorizontal: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
