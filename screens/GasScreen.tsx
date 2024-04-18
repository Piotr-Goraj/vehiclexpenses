import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import GasTankModal from '../components/modals/GasTankModal';
import GasTanksContainer from '../components/Gas/GasTanksContainer';

import { FuelTypeTab, GasTankTab, tablesNames } from '../utils/types';
import colors from '../utils/colors';

export default function GasScreen() {
  const db = useSQLiteContext();

  const [isGasTankAddModalVisible, setIsGasTankAddModalVisible] =
    useState<boolean>(false);
  const [gasTanksTable, setGasTanksTable] = useState<GasTankTab[]>([]);
  const [fuelTypes, setFuelTypes] = useState<FuelTypeTab[]>([]);

  const getTanksTable = async () => {
    const gasData = await db.getAllAsync<GasTankTab>(
      `SELECT * FROM ${tablesNames.gas_tank} ORDER BY buy_date DESC;`
    );

    setGasTanksTable(gasData);
  };

  async function getFuelTypes() {
    const result = await db.getAllAsync<FuelTypeTab>(
      `SELECT * FROM ${tablesNames.fuel_type};`
    );

    setFuelTypes(result);
  }

  useEffect(() => {
    db.withTransactionAsync(async () => {
      getTanksTable();
      getFuelTypes();
    });
  }, []);

  return (
    <>
      <GasTankModal
        isModalVisible={isGasTankAddModalVisible}
        onModal={setIsGasTankAddModalVisible}
      />

      <View style={styles.container}>
        <GasTanksContainer
          gasTanks={gasTanksTable}
          fuelTypes={fuelTypes}
          onPress={setIsGasTankAddModalVisible}
          height={300}
          isDeleteBtn={false}
        />
      </View>
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
