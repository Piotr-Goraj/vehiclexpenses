import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite/next';

import VehicleGasTankDetails from '../Vehicles/VehicleGasTankDetails';

import DetailsCard from '../ui/cards/DetailsCard';
import ActionButton from '../ui/buttons/ActionButton';

import {
  FuelTypeTab,
  GasTankTab,
  VehicleColorsProps,
  VehiclesTab,
  tablesNames,
} from '../../utils/types';
import ModalCard from '../modals/ModalCard';
import Legend from '../Charts/Legend';
import GasTankEditModal from '../modals/GasTankEditModal';

interface GasTanksContainerProps {
  gasTanks: GasTankTab[];
  fuelTypes: FuelTypeTab[];
  height?: number;
  onPress?: (onPress: boolean) => void;

  isDeleteBtn?: boolean;
  vehicleDetails?: VehiclesTab;
  vehiclesColors?: VehicleColorsProps[];
  isChanged?: (isChanged: boolean) => void;
}

export default function GasTanksContainer({
  gasTanks,
  fuelTypes,
  height,
  onPress,

  isDeleteBtn = true,
  vehicleDetails,
  vehiclesColors,
  isChanged,
}: GasTanksContainerProps) {
  const db = useSQLiteContext();

  const [isDeleteModal, setIsDeleteModal] = useState<boolean>(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [gasTanksData, setGasTanksData] = useState<GasTankTab[]>([]);
  const [chosenToEdit, setChosenToEdit] = useState<
    Pick<GasTankTab, 'id' | 'buy_date' | 'gas_station'>
  >({ id: -1, buy_date: '', gas_station: '' });

  useEffect(() => {
    setGasTanksData(gasTanks);
  }, [gasTanks]);

  const deleteHandler = () => {
    if (isDeleteBtn && vehicleDetails && isChanged) {
      db.runSync(
        `UPDATE ${tablesNames.vehicles} SET current_mileage = ? WHERE id = ?`,
        [gasTanks[0].mileage_before, vehicleDetails.id]
      );

      db.runSync(`DELETE FROM ${tablesNames.gas_tank} WHERE id = ?`, [
        gasTanks[0].id,
      ]);

      const gasTanksAfter = db.getAllSync<GasTankTab>(
        `SELECT * FROM ${tablesNames.gas_tank}`
      );

      setGasTanksData(gasTanksAfter);
      isChanged(true);
    } else {
      console.error('Vehicle details has not been passed.');
    }
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
        {gasTanksData.length !== 0 && (
          <VehicleGasTankDetails
            onModal={() => {}}
            tankDetails={gasTanksData[0]}
            fuelTypes={fuelTypes}
            style={{ marginVertical: 24 }}
          />
        )}
      </ModalCard>

      <GasTankEditModal
        tankDetails={chosenToEdit}
        isModalVisible={isEditModal}
        onModal={setIsEditModal}
        isChanged={isChanged}
      />

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
              onModal={(onModal) => {
                setIsEditModal(onModal);
                setChosenToEdit(item);
              }}
              tankDetails={item}
              fuelTypes={fuelTypes}
              {...(vehiclesColors && {
                vehicleColor: vehiclesColors.find(
                  (color) => color.id === item.vehicle_id
                )?.color,
              })}
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

      {vehiclesColors && <Legend legendData={vehiclesColors} />}
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
