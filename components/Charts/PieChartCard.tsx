import { StyleSheet, View, Text, TextStyle, Pressable } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';

import {
  ColorIntensity,
  LegendProps,
  PieChartDataProps,
} from '../../utils/types';
import usePrimaryColors from '../../hooks/usePrimaryColors';
import Legend from './Legend';
import DetailsCard from '../ui/cards/DetailsCard';
import { useState } from 'react';
import colors from '../../utils/colors';

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

  const [isValuesShown, setIsValuesShown] = useState<boolean>(false);

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
      <>
        <Pressable
          onPressIn={() => setIsValuesShown(true)}
          onPressOut={() => setIsValuesShown(false)}
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
        </Pressable>

        {isValuesShown && (
          <View style={styles.valuesContainer}>
            {data.map((data, index) => (
              <View
                key={index}
                style={styles.valueWrapper}
              >
                <View
                  style={[styles.valueDot, { backgroundColor: data.color }]}
                />
                <Text style={styles.valueText}>{data.name}</Text>
                <Text style={styles.valueText}>{`${data.value.toFixed(
                  2
                )} PLN`}</Text>
              </View>
            ))}
            <View style={styles.valueWrapper}>
              <Text style={styles.valueText}>All costs</Text>
              <Text style={styles.valueText}>{`${data
                .reduce((acc, expense) => acc + expense.value, 0)
                .toFixed(2)} PLN`}</Text>
            </View>
          </View>
        )}
      </>
    </DetailsCard>
  );
}

const styles = StyleSheet.create({
  withLegend: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  valuesContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',

    width: '104%',
    height: '102%',

    backgroundColor: '#0000006a',
    borderRadius: 14,
  },
  valueWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
    padding: 4,
    margin: 4,

    backgroundColor: colors.grey[200],
    borderRadius: 16,
  },
  valueDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  valueText: {
    color: colors.fontDark,
  },
});
