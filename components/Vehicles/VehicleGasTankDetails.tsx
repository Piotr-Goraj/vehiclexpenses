import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { FuelTypeTab, GasTankTab } from '../../utils/types';

interface VehicleGasTankDetailsProps {
  tankDetails: GasTankTab;
  fuelTypes: FuelTypeTab[];
}

export default function VehicleGasTankDetails({
  tankDetails,
  fuelTypes,
}: VehicleGasTankDetailsProps) {
  const db = useSQLiteContext();

  console.log(tankDetails.id);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text>{`${tankDetails.gas_station}`}</Text>
        <Text>{`${
          fuelTypes.find((type) => type.id === tankDetails.fuel_type)?.type_name
        }`}</Text>
        <Text>{`${tankDetails.capacity} l`}</Text>
        <Text>{`${tankDetails.price_per_liter} PLN`}</Text>
        <Text>{`${tankDetails.buy_date}`}</Text>
      </View>

      <View style={[styles.innerContainer, { justifyContent: 'space-evenly' }]}>
        <Text>{`Traveled: ${
          tankDetails.mileage_after - tankDetails.mileage_before
        } km`}</Text>
        <Text>{`Consumption: ${'4.38 l/100 km'}`}</Text>
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

    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginVertical: 2,
  },
});
