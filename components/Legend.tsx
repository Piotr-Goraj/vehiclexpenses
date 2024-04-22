import { StyleSheet, View, Text } from 'react-native';

import { LegendProps } from '../utils/types';

interface LegendPropsVal {
  legendData: LegendProps[];
}

export default function Legend({ legendData }: LegendPropsVal) {
  return (
    <View style={styles.container}>
      {legendData.map((item) => (
        <View
          key={item.id}
          style={styles.colorWrapper}
        >
          <View
            style={[styles.legendColor, { backgroundColor: item.color }]}
          ></View>
          <Text>{item.name}</Text>
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

    marginVertical: 8,
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
