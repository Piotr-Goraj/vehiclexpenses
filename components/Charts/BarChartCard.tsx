import { StyleSheet, View, Text, TextStyle } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import DetailsCard from '../ui/cards/DetailsCard';
import { BarDataProps, ColorIntensity, LegendProps } from '../../utils/types';
import Legend from './Legend';

interface BarChartCardProps {
  title: string;
  titlePosition: TextStyle;
  data: BarDataProps[];
  legendData?: LegendProps[];
  cardColor: ColorIntensity;
}

export default function BarChartCard({
  title,
  titlePosition,
  data,
  legendData,
  cardColor,
}: BarChartCardProps) {
  return (
    <DetailsCard
      styleCustom={{ height: 300 }}
      cardColor={cardColor}
      title={title}
      titlePosition={titlePosition}
    >
      <View style={styles.barChartContainer}>
        <BarChart
          width={300}
          height={180}
          data={data}
          initialSpacing={30}
          barWidth={10}
          spacing={8}
          roundedTop
          roundedBottom
          xAxisThickness={0}
          yAxisThickness={0.5}
          yAxisTextStyle={{ color: 'gray' }}
          noOfSections={4}
          showScrollIndicator={true}
        />

        {legendData && (
          <Legend
            legendData={legendData}
            resize={0.75}
          />
        )}
      </View>
    </DetailsCard>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  barChartContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
