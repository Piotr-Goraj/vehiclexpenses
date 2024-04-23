import { StyleSheet, View, Text } from 'react-native';

import { LegendProps } from '../../utils/types';

interface LegendPropsVal {
  legendData: LegendProps[];
  resize?: number;
}

export default function Legend({ legendData, resize }: LegendPropsVal) {
  return (
    <View style={styles.container}>
      {legendData.map((item) => (
        <View
          key={item.id}
          style={styles.colorWrapper}
        >
          <View
            style={[
              styles.legendColor,
              {
                backgroundColor: item.color,
                width: resize ? 20 * resize : 20,
                height: resize ? 20 * resize : 20,
              },
            ]}
          ></View>
          <Text style={{ fontSize: resize ? 14 * resize : 14 }}>
            {item.name}
          </Text>
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
    borderRadius: 10,
  },
});
