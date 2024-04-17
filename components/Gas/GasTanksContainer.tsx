import { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite/next';

import VehicleGasTankDetails from '../Vehicles/VehicleGasTankDetails';

import DetailsCard from '../ui/cards/DetailsCard';
import ActionButton from '../ui/buttons/ActionButton';

import { FuelTypeTab, GasTankTab, tablesNames } from '../../utils/types';

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
  const db = useSQLiteContext();

  const [gasTanksData, setGasTanksData] = useState<GasTankTab[]>(gasTanks);

  const deleteHandler = () => {
    db.runSync(`DELETE FROM ${tablesNames.gas_tank} WHERE id = ?`, [
      gasTanks[0].id,
    ]);

    const gasTanksAfter = db.getAllSync<GasTankTab>(
      `SELECT * FROM ${tablesNames.gas_tank}`
    );
    setGasTanksData(gasTanksAfter);
  };

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
        data={gasTanksData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VehicleGasTankDetails
            tankDetails={item}
            fuelTypes={fuelTypes}
          />
        )}
      />

      <ActionButton
        style={{ bottom: 45 }}
        colorBtn={{ color: 'red', intensity: 400 }}
        typeButton={'delete'}
        onPress={deleteHandler}
      />
    </DetailsCard>
  );
}

const styles = StyleSheet.create({});
