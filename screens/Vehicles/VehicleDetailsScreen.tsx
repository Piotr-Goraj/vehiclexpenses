import { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  LogBox,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite/next';

import {
  ExpenseTypeTab,
  ExpensesTab,
  FuelTypeTab,
  GasTankTab,
  MileagesTab,
  VehicleDetailsProps,
  VehiclesTab,
  tablesNames,
} from '../../utils/types';
import { roundNumber } from '../../utils/roundNumber';

import useDateDelta from '../../hooks/useDateDelta';

import VehiclesInfoBox from '../../components/Vehicles/VehiclesInfoBox';
import VehicleInfoTxt from '../../components/Vehicles/VehicleInfoTxt';
import EditButton from '../../components/ui/buttons/EditButton';
import AddButton from '../../components/ui/buttons/AddButton';
import VehicleImageModal from '../../components/modals/VehicleImageModal';
import VehicleInfoModal from '../../components/modals/VehicleInfoModal';
import VehicleMileageModal from '../../components/modals/VehicleMileageModal';
import GasTankModal from '../../components/modals/GasTankModal';
import VehicleMileageTxt from '../../components/Vehicles/VehicleMileageTxt';
import VehicleGasTankDetails from '../../components/Vehicles/VehicleGasTankDetails';
import VehicleExpenseDetails from '../../components/Vehicles/VehicleExpenseDetails';
import GasTanksContainer from '../../components/Gas/GasTanksContainer';
import DetailsCard from '../../components/ui/cards/DetailsCard';

export default function VehicleDetailsScreen({
  route,
  navigation,
}: VehicleDetailsProps) {
  const { vehicleId } = route.params;
  const tabNav = navigation.getParent();

  const [isImageModalVisible, setIsImageModalVisible] =
    useState<boolean>(false);
  const [isMileageModalVisible, setIsMileageModalVisible] =
    useState<boolean>(false);
  const [changeMileageModalVisible, setChangeMileageModalVisible] =
    useState<boolean>(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);
  const [isGasTankAddModalVisible, setIsGasTankAddModalVisible] =
    useState<boolean>(false);

  const [vehicleDetails, setVehicleDetails] = useState<VehiclesTab>({
    id: 0,
    name: '',
    model: '',
    image: '',
    producted_year: 1890,
    buy_date: '',
    buy_price: 0,
    buy_mileage: 1980,
    is_sold: 0,
    current_mileage: 0,
  });
  const [detailsChanged, setDetailsChanged] = useState<boolean>(false);
  const [yearlyMileages, setYearlyMileages] = useState<MileagesTab[]>([]);
  const [traveledMileage, setTraveledMileage] = useState<number>(0);
  const [gasTanks, setGasTanks] = useState<GasTankTab[]>([]);
  const [fuelTypes, setFuelTypes] = useState<FuelTypeTab[]>([]);
  const [expenses, setExpenses] = useState<ExpensesTab[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<ExpenseTypeTab[]>([]);
  const [isSold, setIsSold] = useState<boolean>(false);
  const [consumption, setConsumption] = useState<number>(0.0);
  const [fullCosts, setFullCosts] = useState<number>();

  const [differenceInDays, differenceInMonths, differenceInYears] =
    useDateDelta(vehicleDetails.buy_date);

  useFocusEffect(
    useCallback(() => {
      tabNav?.setOptions({ headerShown: false });
      return () => {
        tabNav?.setOptions({ headerShown: true });
      };
    }, [])
  );

  const db = useSQLiteContext();

  function getVehiclesById(id: number) {
    const result = db.getAllSync<VehiclesTab>(
      `SELECT * FROM vehicles WHERE id = ?;`,
      [id]
    );
    setVehicleDetails(result[0]);
  }

  function getGasByVehicleId(id: number) {
    const result = db.getAllSync<GasTankTab>(
      `SELECT * FROM ${tablesNames.gas_tank} WHERE vehicle_id = ? ORDER BY buy_date DESC;`,
      [id]
    );
    setGasTanks(result);
  }

  const meanConsumption = () => {
    if (traveledMileage != 0) {
      const firstRefuel = gasTanks[gasTanks.length - 1].capacity;

      const fullTankCapacity = gasTanks.reduce(
        (accumulator, tank) => accumulator + tank.capacity,
        -firstRefuel
      );

      const mean = roundNumber((100 * fullTankCapacity) / traveledMileage);

      setConsumption(mean);
    }
  };

  const sumExpenses = () => {
    const sumExpense = expenses.reduce(
      (accumulator, expense) => accumulator + expense.price,
      0.0
    );
    setFullCosts(sumExpense + vehicleDetails.buy_price);
  };

  function getMeleagesVehicle(id: number) {
    const result = db.getAllSync<MileagesTab>(
      `SELECT * FROM mileages WHERE vehicle_id = ? ORDER BY year DESC;`,
      [id]
    );
    setYearlyMileages(result);
  }

  function getExpensesVehicle(id: number) {
    const result = db.getAllSync<ExpensesTab>(
      `SELECT * FROM expenses WHERE vehicle_id = ? ORDER BY date DESC;`,
      [id]
    );
    setExpenses(result);
  }

  function getExpenseTypes() {
    const result = db.getAllSync<FuelTypeTab>(
      `SELECT * FROM expense_type;`,
      []
    );
    setExpenseTypes(result);
  }

  function getFuelTypes() {
    const result = db.getAllSync<FuelTypeTab>(`SELECT * FROM fuel_type;`, []);
    setFuelTypes(result);
  }

  useEffect(() => {
    db.withTransactionSync(() => {
      getVehiclesById(vehicleId);
      getGasByVehicleId(vehicleId);
      getMeleagesVehicle(vehicleId);
      getExpensesVehicle(vehicleId);
      getExpenseTypes();
      getFuelTypes();
    });
  }, [
    isImageModalVisible,
    isMileageModalVisible,
    isInfoModalVisible,
    isGasTankAddModalVisible,
    changeMileageModalVisible,
    detailsChanged,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSold(vehicleDetails.is_sold === 1 ? true : false);
      setTraveledMileage(
        vehicleDetails.current_mileage - vehicleDetails.buy_mileage
      );
      meanConsumption();
      sumExpenses();
    }, 500);

    return () => clearTimeout(timeout);
  }, [yearlyMileages, expenses, traveledMileage]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <>
      <VehicleImageModal
        isModalVisible={isImageModalVisible}
        onModal={setIsImageModalVisible}
        vehicleId={vehicleId}
      />
      <VehicleMileageModal
        vehicle={vehicleDetails}
        yearlyMileages={yearlyMileages}
        isModalVisible={isMileageModalVisible}
        onModal={setIsMileageModalVisible}
      />
      <VehicleInfoModal
        isModalVisible={isInfoModalVisible}
        onModal={setIsInfoModalVisible}
        vehicle={vehicleDetails}
      />
      <GasTankModal
        vehicle={vehicleDetails}
        isModalVisible={isGasTankAddModalVisible}
        onModal={setIsGasTankAddModalVisible}
        isFirstTank={gasTanks.length === 0 ? true : false}
      />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* ------------------ IMAGE BOX ---------------- */}

          <DetailsCard
            styleCustom={{ paddingHorizontal: 0, paddingVertical: 0 }}
            cardColor={{ color: 'red', intensity: 400 }}
            title='Image'
            titlePosition={{ width: 80, left: 140 }}
            buttonType='edit'
            buttonColor={{ color: 'yellow', intensity: 400 }}
            onPress={() => {
              setIsImageModalVisible(true);
            }}
          >
            <Image
              source={{ uri: `data:image/jpeg;base64,${vehicleDetails.image}` }}
              style={styles.imagePhoto}
            />
          </DetailsCard>

          {/* ------------------ MILEAGE BOX & FAULTS BOX---------------- */}
          <View style={styles.twoInfoBox}>
            <DetailsCard
              styleCustom={{ height: 160, width: 172, marginBottom: 12 }}
              cardColor={{ color: 'blue', intensity: 400 }}
              title='Mileages'
              titlePosition={{ width: 80, left: 46 }}
              buttonType='add'
              buttonColor={{ color: 'green', intensity: 400 }}
              onPress={() => {
                setIsMileageModalVisible(true);
              }}
            >
              <VehicleInfoTxt
                text={`Mileage: ${vehicleDetails.current_mileage} km`}
                textColor='light'
              />
              <VehicleMileageTxt
                changeMileageModalVisible={setChangeMileageModalVisible}
                yearlyMileages={yearlyMileages}
                vehicleDetails={vehicleDetails}
              />
            </DetailsCard>

            <DetailsCard
              styleCustom={{
                height: 160,
                width: 172,
                marginTop: 12,
                marginBottom: 20,
              }}
              cardColor={{ color: 'yellow', intensity: 400 }}
              title='Faults'
              titlePosition={{ width: 80, left: 46 }}
              buttonType='add'
              buttonColor={{ color: 'green', intensity: 400 }}
              onPress={() => {}}
            >
              <Text> </Text>
            </DetailsCard>
          </View>

          {/* ------------------ INFO BOX ---------------- */}
          <DetailsCard
            styleCustom={{
              height: 344,
              width: 172,
              justifyContent: 'flex-start',
            }}
            cardColor={{ color: 'magenta', intensity: 600 }}
            title='Info'
            titlePosition={{ width: 50, left: 61 }}
            buttonType='edit'
            buttonColor={{ color: 'yellow', intensity: 400 }}
            onPress={() => setIsInfoModalVisible(true)}
          >
            <ScrollView
              nestedScrollEnabled={true}
              style={{ flex: 1 }}
            >
              <VehicleInfoTxt
                text={`Production year: ${vehicleDetails.producted_year}`}
                textColor='light'
                boxColor={{ color: 'magenta', intensity: 600 }}
                customStyle={{ marginBottom: 7 }}
              />

              <VehicleInfoTxt
                text={`Buy: ${vehicleDetails.buy_date}`}
                textColor='light'
                boxColor={{ color: 'magenta', intensity: 600 }}
              />

              <VehicleInfoTxt
                text={`Price: ${roundNumber(vehicleDetails.buy_price)} PLN`}
                textColor='light'
                boxColor={{ color: 'magenta', intensity: 600 }}
              />

              <VehicleInfoTxt
                text={`Mileage: ${roundNumber(vehicleDetails.buy_mileage)} km`}
                textColor='light'
                boxColor={{ color: 'magenta', intensity: 600 }}
              />

              <VehicleInfoTxt
                text={`Sold: ${isSold ? vehicleDetails.sold_date : 'NOT YET'}`}
                textColor='light'
                boxColor={
                  isSold
                    ? { color: 'yellow', intensity: 400 }
                    : { color: 'magenta', intensity: 600 }
                }
                customStyle={{ marginTop: 7 }}
              />

              <VehicleInfoTxt
                text={`Sold price: ${
                  isSold ? `${vehicleDetails.sold_price} PLN` : 'NOT SOLD'
                }`}
                textColor='light'
                boxColor={
                  isSold
                    ? { color: 'yellow', intensity: 400 }
                    : { color: 'grey', intensity: 300 }
                }
                customStyle={{ marginBottom: 7 }}
              />

              <VehicleInfoTxt
                text={`Traveled: ${roundNumber(traveledMileage)} km`}
                textColor='light'
                boxColor={{ color: 'red', intensity: 400 }}
              />

              <VehicleInfoTxt
                text={`Mean consumption: ${roundNumber(consumption)} l/100 km`}
                textColor='light'
                boxColor={{ color: 'red', intensity: 400 }}
              />
              <VehicleInfoTxt
                text={`Full cost: ${roundNumber(fullCosts || 0)} PLN`}
                textColor='light'
                boxColor={{ color: 'red', intensity: 400 }}
                customStyle={{ marginBottom: 7 }}
              />

              <VehicleInfoTxt
                text={`${Math.ceil(
                  vehicleDetails.buy_price / differenceInYears
                )} PLN / year`}
                textColor='light'
                boxColor={{ color: 'magenta', intensity: 600 }}
              />
              <VehicleInfoTxt
                text={`${Math.ceil(
                  vehicleDetails.buy_price / differenceInMonths
                )} PLN / month`}
                textColor='light'
                boxColor={{ color: 'magenta', intensity: 600 }}
              />
              <VehicleInfoTxt
                text={`${Math.ceil(
                  vehicleDetails.buy_price / differenceInDays
                )} PLN / day`}
                textColor='light'
                boxColor={{ color: 'magenta', intensity: 600 }}
              />
            </ScrollView>
          </DetailsCard>

          {/* ------------------ GAS TANKS BOX ---------------- */}
          <GasTanksContainer
            vehicleDetails={vehicleDetails}
            isChanged={setDetailsChanged}
            gasTanks={gasTanks}
            fuelTypes={fuelTypes}
            onPress={setIsGasTankAddModalVisible}
            height={240}
            isDeleteBtn={gasTanks.length === 0 ? false : true}
          />

          {/* ------------------ EXPENSES BOX ---------------- */}

          <DetailsCard
            // styleCustom={{ paddingHorizontal: 0, paddingVertical: 0 }}
            cardColor={{ color: 'cyan', intensity: 500 }}
            title='Expenses'
            titlePosition={{ width: 100, left: 130 }}
            buttonType='add'
            buttonColor={{ color: 'green', intensity: 400 }}
            onPress={() => {}}
          >
            <FlatList
              nestedScrollEnabled={true}
              data={expenses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <VehicleExpenseDetails
                  expenseDetails={item}
                  expenseTypes={expenseTypes}
                />
              )}
            />
          </DetailsCard>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  twoInfoBox: {
    // backgroundColor: 'red',

    height: 344,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },

  mileageText: {
    width: 80,
    left: 46,
  },
  expensesText: {
    width: 100,
    left: 130,
  },
  // expensesContainer: {
  //   position: 'relative',

  //   marginVertical: 8,
  //   paddingHorizontal: 7,
  //   paddingVertical: 3,

  //   width: 360,
  //   height: 200,

  //   borderColor: colors.cyan[500],
  //   borderWidth: 2,
  //   borderRadius: 16,
  // },
});
