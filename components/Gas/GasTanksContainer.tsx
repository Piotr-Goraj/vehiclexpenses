import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite/next';

import VehicleGasTankDetails from '../Vehicles/VehicleGasTankDetails';

import DetailsCard from '../ui/cards/DetailsCard';
import ActionButton from '../ui/buttons/ActionButton';
import PrimaryButton from '../ui/buttons/PrimaryButton';

import { FuelTypeTab, GasTankTab, tablesNames } from '../../utils/types';
import ModalCard from '../modals/ModalCard';

interface GasTanksContainerProps {
  gasTanks: GasTankTab[];
  fuelTypes: FuelTypeTab[];
  height?: number;
  onPress?: (onPress: boolean) => void;
  isDeleteBtn?: boolean;
}

export default function GasTanksContainer({
  gasTanks,
  fuelTypes,
  height,
  onPress,
  isDeleteBtn = true,
}: GasTanksContainerProps) {
  const db = useSQLiteContext();

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [gasTanksData, setGasTanksData] = useState<GasTankTab[]>([]);

  useEffect(() => {
    setGasTanksData(gasTanks);
  }, [gasTanks]);

  const deleteHandler = () => {
    db.runSync(`DELETE FROM ${tablesNames.gas_tank} WHERE id = ?`, [
      gasTanks[0].id,
    ]);

    console.log('Latest refueling data deleted.');

    const gasTanksAfter = db.getAllSync<GasTankTab>(
      `SELECT * FROM ${tablesNames.gas_tank}`
    );
    setGasTanksData(gasTanksAfter);
  };

  return (
    <>
      <ModalCard
        isModalVisible={isDeleteModal}
        isConfirm={true}
        onConfirm={() => deleteHandler()}
        confirmColor={{ color: 'red', intensity: 400 }}
        btnTitle='Delete'
        onModal={setIsDeleteModal}
      >
        <Text style={styles.deleteText}>
          You want to delete the last refueling?
        </Text>
        <VehicleGasTankDetails
          tankDetails={gasTanksData[0]}
          fuelTypes={fuelTypes}
          style={{ marginVertical: 24 }}
        />
      </ModalCard>

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
          style={{ bottom: 45, display: isDeleteBtn ? 'flex' : 'none' }}
          colorBtn={{ color: 'red', intensity: 400 }}
          typeButton={'delete'}
          onPress={() => setIsDeleteModal(true)}
        />
      </DetailsCard>
    </>
  );
}

const styles = StyleSheet.create({
  deleteText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
