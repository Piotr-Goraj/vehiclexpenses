import { StyleSheet, View, Text } from 'react-native';

import { ColorIntensity } from '../utils/types';
import usePrimaryColors from '../hooks/usePrimaryColors';

interface PieChartCardProps {
  cardColor: ColorIntensity;
}

export default function PieChartCard({ cardColor }: PieChartCardProps) {
  const color = usePrimaryColors(cardColor.color);

  return (
    <View
      style={[styles.container, { borderColor: color[cardColor.intensity] }]}
    >
      <Text>ReactNativeTemplate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',

    marginVertical: 16,

    borderWidth: 2,
    borderRadius: 16,
  },
});
