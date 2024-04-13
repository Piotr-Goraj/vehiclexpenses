import { StyleSheet, View, Text, FlatList } from 'react-native';

import DetailsCard from '../ui/cards/DetailsCard';
import VehicleGasTankDetails from '../Vehicles/VehicleGasTankDetails';
import { FuelTypeTab, GasTankTab } from '../../utils/types';
import { useState } from 'react';

interface GasTanksContainerProps {
  gasTanks: GasTankTab[];
  fuelTypes: FuelTypeTab[];
  height?: number;
  onPress?: (onPress: boolean) => void;
}

export default function GasTanksContainer({
  gasTanks,
  fuelTypes,
  height,
  onPress,
}: GasTanksContainerProps) {
  return (
    <DetailsCard
      title='Gas tanks'
      titlePosition={{ width: 100, left: 130 }}
      cardColor={{ color: 'red', intensity: 400 }}
      styleCustom={{ height: height }}
      buttonColor={{ color: 'green', intensity: 400 }}
      buttonType='add'
      onPress={onPress ? () => onPress(true) : () => {}}
    >
      <FlatList
        nestedScrollEnabled={true}
        data={gasTanks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VehicleGasTankDetails
            tankDetails={item}
            fuelTypes={fuelTypes}
          />
        )}
      />
    </DetailsCard>
  );
}

const styles = StyleSheet.create({});
