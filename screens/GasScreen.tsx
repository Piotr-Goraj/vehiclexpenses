import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, LogBox } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import GasTankModal from '../components/modals/GasTankModal';
import GasTanksContainer from '../components/Gas/GasTanksContainer';

import {
  BarDataProps,
  FuelTypeTab,
  GasTankTab,
  VehicleColorsProps,
  tablesNames,
} from '../utils/types';
import colors from '../utils/colors';
import BarChartCard from '../components/Charts/BarChartCard';

export default function GasScreen() {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

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
      `SELECT id, color, name FROM ${tablesNames.vehicles};`
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

  const barData: BarDataProps[] = [];

  const monthlyGasTank: {
    [month: string]: { price: number; vehicle_id: number }[];
  } = {};

  gasTanksTable.forEach((gasTank) => {
    const [year, month] = gasTank.buy_date.split('-').slice(0, 2);
    const dateKey = `${year}-${month}`;

    if (!monthlyGasTank[dateKey]) {
      monthlyGasTank[dateKey] = [];
    }

    // Check if there is already an entry for the same vehicle in a given month
    const existingExpenseIndex = monthlyGasTank[dateKey].findIndex(
      (item) => item.vehicle_id === gasTank.vehicle_id
    );

    if (existingExpenseIndex !== -1) {
      // If exists, update the price value
      monthlyGasTank[dateKey][existingExpenseIndex].price +=
        gasTank.capacity * gasTank.price_per_liter;
    } else {
      // If it does not exist, add a new entry
      monthlyGasTank[dateKey].push({
        price: gasTank.capacity * gasTank.price_per_liter,
        vehicle_id: gasTank.vehicle_id,
      });
    }
  });

  for (const month in monthlyGasTank) {
    const [{ price, vehicle_id }] = monthlyGasTank[month];

    if (monthlyGasTank[month].length === 1) {
      barData.push({
        value: price,
        label: month,
        labelTextStyle: {
          color: colors.grey[400],
          transform: [{ rotate: '30deg' }],
          marginTop: 2,
        },
        labelWidth: monthlyGasTank[month].length * 18,
        spacing: 50,
        frontColor:
          vehicleColors.find((color) => color.id === vehicle_id)?.color ||
          'black',
      });
    } else if (monthlyGasTank[month].length === 2) {
      barData.push(
        {
          value: monthlyGasTank[month][0].price,
          label: month,
          labelTextStyle: {
            color: colors.grey[400],
            transform: [{ rotate: '30deg' }],
            marginTop: 2,
          },
          labelWidth: monthlyGasTank[month].length * 25,
          frontColor:
            vehicleColors.find(
              (color) => color.id === monthlyGasTank[month][0].vehicle_id
            )?.color || 'black',
        },
        {
          value: monthlyGasTank[month][1].price,
          frontColor:
            vehicleColors.find(
              (color) => color.id === monthlyGasTank[month][1].vehicle_id
            )?.color || 'black',
          spacing: 50,
        }
      );
    } else {
      // Dodawanie pierwszego obiektu
      barData.push({
        value: monthlyGasTank[month][0].price,
        label: month,
        labelTextStyle: {
          color: colors.grey[400],
          transform: [{ rotate: '30deg' }],
          marginTop: 2,
        },
        labelWidth: monthlyGasTank[month].length * 18,
        frontColor:
          vehicleColors.find(
            (color) => color.id === monthlyGasTank[month][0].vehicle_id
          )?.color || 'black',
      });

      // Dodawanie obiektów pomiędzy pierwszym a ostatnim
      for (let i = 1; i < monthlyGasTank[month].length - 1; i++) {
        barData.push({
          value: monthlyGasTank[month][i].price,
          frontColor:
            vehicleColors.find(
              (color) => color.id === monthlyGasTank[month][i].vehicle_id
            )?.color || 'black',
        });
      }

      // Dodawanie ostatniego obiektu
      barData.push({
        value: monthlyGasTank[month][monthlyGasTank[month].length - 1].price,
        frontColor:
          vehicleColors.find(
            (color) =>
              color.id ===
              monthlyGasTank[month][monthlyGasTank[month].length - 1].vehicle_id
          )?.color || 'black',
        spacing: 50,
      });
    }
  }

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

        <BarChartCard
          cardColor={{ color: 'red', intensity: 400 }}
          title='Monthly refueling'
          titlePosition={{ width: 140, left: 110 }}
          data={barData}
          legendData={vehicleColors}
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
