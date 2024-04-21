import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import GasTankModal from '../components/modals/GasTankModal';
import GasTanksContainer from '../components/Gas/GasTanksContainer';

import {
  FuelTypeTab,
  GasTankTab,
  VehicleColorsProps,
  tablesNames,
} from '../utils/types';
import colors from '../utils/colors';

export default function GasScreen() {
  const db = useSQLiteContext();

  const [isGasTankAddModalVisible, setIsGasTankAddModalVisible] =
    useState<boolean>(false);
  const [gasTanksTable, setGasTanksTable] = useState<GasTankTab[]>([]);
  const [fuelTypes, setFuelTypes] = useState<FuelTypeTab[]>([]);

  const [vehicleColors, setVehicleColors] = useState<VehicleColorsProps[]>([]);

  const getTanksTable = () => {
    const gasData = db.getAllSync<GasTankTab>(
      `SELECT * FROM ${tablesNames.gas_tank} ORDER BY buy_date DESC;`
    );

    setGasTanksTable(gasData);
  };

  const getFuelTypes = () => {
    const result = db.getAllSync<FuelTypeTab>(
      `SELECT * FROM ${tablesNames.fuel_type};`
    );

    setFuelTypes(result);
  };

  const getVehicleColors = () => {
    const result = db.getAllSync<VehicleColorsProps>(
      `SELECT id, color FROM ${tablesNames.vehicles};`
    );

    setVehicleColors(result);
  };

  useEffect(() => {
    db.withTransactionSync(() => {
      getTanksTable();
      getFuelTypes();
      getVehicleColors();
    });
  }, [db]);

  return (
    <>
      <GasTankModal
        isModalVisible={isGasTankAddModalVisible}
        onModal={setIsGasTankAddModalVisible}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
      >
        <GasTanksContainer
          gasTanks={gasTanksTable}
          fuelTypes={fuelTypes}
          onPress={setIsGasTankAddModalVisible}
          height={300}
          isDeleteBtn={false}
          vehiclesColors={vehicleColors}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tanksList: {
    position: 'relative',

    marginVertical: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,

    width: 360,
    height: 300,

    borderColor: colors.red[500],
    borderWidth: 2,
    borderRadius: 16,
  },
});
