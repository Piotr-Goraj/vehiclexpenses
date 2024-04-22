import { StyleSheet, View, Text, Dimensions, TextStyle } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

import { ColorIntensity, LegendProps, PieChartDataProps } from '../utils/types';
import usePrimaryColors from '../hooks/usePrimaryColors';
import Legend from './Legend';
import DetailsCard from './ui/cards/DetailsCard';

interface PieChartCardProps {
  title: string;
  titlePosition: TextStyle;
  data: PieChartDataProps[];
  legendData?: LegendProps[];
  cardColor: ColorIntensity;
}

export default function PieChartCard({
  title,
  titlePosition,
  data,
  legendData,
  cardColor,
}: PieChartCardProps) {
  const color = usePrimaryColors(cardColor.color);

  const chartConfig: AbstractChartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <DetailsCard
      styleCustom={{ height: 300 }}
      cardColor={cardColor}
      title={title}
      titlePosition={titlePosition}
    >
      <View style={legendData ? styles.withLegend : {}}>
        <PieChart
          data={data}
          width={legendData ? 320 : 400}
          height={legendData ? 240 : 280}
          chartConfig={chartConfig}
          accessor={'value'}
          backgroundColor={'transparent'}
          paddingLeft={'0'}
          center={[legendData ? 80 : 12, 0]}
          hasLegend={legendData ? false : true}
        />

        {legendData && <Legend legendData={legendData} />}
      </View>
    </DetailsCard>
  );
}

const styles = StyleSheet.create({
  withLegend: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
