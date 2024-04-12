import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { FuelTypeTab, GasTankTab } from '../../utils/types';
import colors from '../../utils/colors';

interface VehicleGasTankDetailsProps {
  tankDetails: GasTankTab;
  fuelTypes: FuelTypeTab[];
}

export default function VehicleGasTankDetails({
  tankDetails,
  fuelTypes,
}: VehicleGasTankDetailsProps) {
  const db = useSQLiteContext();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{`${tankDetails.gas_station}`}</Text>
        <Text style={styles.text}>{`${
          fuelTypes.find((type) => type.id === tankDetails.fuel_type)?.type_name
        }`}</Text>
        <Text style={styles.text}>{`${tankDetails.capacity} l`}</Text>
        <Text style={styles.text}>{`${tankDetails.price_per_liter} PLN`}</Text>
        <Text style={styles.text}>{`${tankDetails.buy_date}`}</Text>
      </View>

      <View style={[styles.innerContainer, { justifyContent: 'space-evenly' }]}>
        <Text style={styles.text}>{`Traveled: ${
          tankDetails.mileage_after - tankDetails.mileage_before
        } km`}</Text>
        <Text style={styles.text}>{`Consumption: ${'4.38 l/100 km'}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginVertical: 2,

    paddingVertical: 4,
    paddingHorizontal: 8,

    backgroundColor: colors.red[400],
    // borderWidth: 2,
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginVertical: 2,
  },
  text: {
    color: colors.fontLight,
  },
});
