import { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite/next';

import {
  FuelTypeTab,
  GasTankTab,
  MileagesTab,
  VehicleDetailsProps,
  VehiclesTab,
} from '../../utils/types';
import colors from '../../utils/colors';

import VehiclesInfoBox from '../../components/Vehicles/VehiclesInfoBox';
import VehicleInfoTxt from '../../components/Vehicles/VehicleInfoTxt';
import EditButton from '../../components/ui/buttons/EditButton';
import AddButton from '../../components/ui/buttons/AddButton';
import VehicleImageModal from '../../components/modals/VehicleImageModal';
import VehicleInfoModal from '../../components/modals/VehicleInfoModal';
import VehicleMileageModal from '../../components/modals/VehicleMileageModal';
import VehicleGasTankAddModal from '../../components/modals/VehicleGasTankAddModal';
import VehicleMileageTxt from '../../components/Vehicles/VehicleMileageTxt';
import useDateDelta from '../../hooks/useDateDelta';
import VehicleGasTankDetails from '../../components/Vehicles/VehicleGasTankDetails';

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
  const [yearlyMileages, setYearlyMileages] = useState<MileagesTab[]>([]);
  const [traveledMileage, setTraveledMileage] = useState<number>(0);
  const [gasTanks, setGasTanks] = useState<GasTankTab[]>([
    {
      id: 0,
      vehicle_id: 0,
      gas_station: 'Shell',
      fuel_type: 2,
      price_per_liter: 6.52,
      capacity: 6.74,
      mileage_before: 51000,
      mileage_after: 51136,
      buy_date: '14-03-2024',
    },
    {
      id: 1,
      vehicle_id: 1,
      gas_station: 'Orlen',
      fuel_type: 1,
      price_per_liter: 6.72,
      capacity: 2.32,
      mileage_before: 51136,
      mileage_after: 51240,
      buy_date: '16-03-2024',
    },
  ]);
  const [fuelTypes, setFuelTypes] = useState<FuelTypeTab[]>([]);
  const [isSold, setIsSold] = useState<boolean>(false);

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

  async function getVehiclesById(id: number) {
    const result = await db.getAllAsync<VehiclesTab>(
      `SELECT * FROM vehicles WHERE id = ?;`,
      [id]
    );
    setVehicleDetails(result[0]);
  }

  async function getGasByVehicleId(id: number) {
    const result = await db.getAllAsync<GasTankTab>(
      `SELECT * FROM gas_tank WHERE vehicle_id = ?;`,
      [id]
    );
    setGasTanks(result);
  }

  async function getMeleagesVehicleId(id: number) {
    const result = await db.getAllAsync<MileagesTab>(
      `SELECT * FROM mileages WHERE vehicle_id = ? ORDER BY year DESC;`,
      [id]
    );
    setYearlyMileages(result);
  }

  async function getFuelTypes() {
    const result = await db.getAllAsync<FuelTypeTab>(
      `SELECT * FROM fuel_type;`,
      []
    );
    setFuelTypes(result);
  }

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getVehiclesById(vehicleId);
      // await getGasByVehicleId(vehicleId);
      await getMeleagesVehicleId(vehicleId);
      await getFuelTypes();
    });

    setIsSold(vehicleDetails.is_sold === 1 ? true : false);
  }, [
    isImageModalVisible,
    isMileageModalVisible,
    isInfoModalVisible,
    isGasTankAddModalVisible,
    changeMileageModalVisible,
  ]);

  useEffect(() => {
    let maxMileage = 0;
    for (const key of yearlyMileages) {
      if (key.mileage > maxMileage) {
        maxMileage = key.mileage;
      }
    }

    setTraveledMileage(maxMileage - vehicleDetails.current_mileage);
  }, [yearlyMileages]);

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
      <VehicleGasTankAddModal
        isModalVisible={isGasTankAddModalVisible}
        onModal={setIsGasTankAddModalVisible}
      />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* ------------------ IMAGE BOX ---------------- */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${vehicleDetails.image}` }}
              style={styles.imagePhoto}
            />
            <Text style={[styles.titleText, styles.imageText]}>Image</Text>
            <EditButton
              onEditPress={() => {
                setIsImageModalVisible(true);
              }}
            />
          </View>

          {/* ------------------ MILEAGE BOX & FAULTS BOX---------------- */}
          <View style={styles.twoInfoBox}>
            <VehiclesInfoBox>
              <VehicleInfoTxt
                text={`Mileage: ${vehicleDetails.current_mileage} km`}
                textColor='light'
              />
              <VehicleMileageTxt
                changeMileageModalVisible={setChangeMileageModalVisible}
                yearlyMileages={yearlyMileages}
                vehicleDetails={vehicleDetails}
              />

              <Text style={[styles.titleText, styles.mileageText]}>
                Mileage
              </Text>
              <AddButton
                onAddPress={() => {
                  setIsMileageModalVisible(true);
                }}
              />
            </VehiclesInfoBox>

            <VehiclesInfoBox
              boxColor='yellow'
              intensityColor={400}
              customStyle={{ height: 155 }}
            >
              <Text style={[styles.titleText, styles.faultsText]}>Faults</Text>
            </VehiclesInfoBox>
          </View>

          {/* ------------------ INFO BOX ---------------- */}
          <VehiclesInfoBox
            boxColor='magenta'
            intensityColor={600}
            customStyle={{ height: 344, justifyContent: 'flex-start' }}
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
              text={`Price: ${vehicleDetails.buy_price} PLN`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <VehicleInfoTxt
              text={`Mileage: ${vehicleDetails.buy_mileage} km`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <VehicleInfoTxt
              text={`Sold: ${isSold ? vehicleDetails.sold_date : 'NOT YET'}`}
              textColor='light'
              boxColor={
                isSold
                  ? { color: 'magenta', intensity: 600 }
                  : { color: 'yellow', intensity: 400 }
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
                  ? { color: 'magenta', intensity: 600 }
                  : { color: 'grey', intensity: 300 }
              }
              customStyle={{ marginBottom: 7 }}
            />

            <VehicleInfoTxt
              text={`Traveled: ${traveledMileage} km`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <VehicleInfoTxt
              text={`${(vehicleDetails.buy_price / differenceInYears).toFixed(
                0
              )} PLN / year`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />
            <VehicleInfoTxt
              text={`${(vehicleDetails.buy_price / differenceInMonths).toFixed(
                0
              )} PLN / month`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />
            <VehicleInfoTxt
              text={`${(vehicleDetails.buy_price / differenceInDays).toFixed(
                0
              )} PLN / day`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <Text style={[styles.titleText, styles.infoText]}>Info</Text>
            <EditButton
              onEditPress={() => {
                setIsInfoModalVisible(true);
              }}
            />
          </VehiclesInfoBox>

          {/* ------------------ GAS TANKS BOX ---------------- */}
          <View style={styles.gasTanksContainer}>
            {gasTanks.map((tankDetails) => (
              <VehicleGasTankDetails
                key={tankDetails.id}
                tankDetails={tankDetails}
                fuelTypes={fuelTypes}
              />
            ))}

            <Text style={[styles.titleText, styles.gasTanksText]}>
              Gas tanks
            </Text>
            <AddButton
              onAddPress={() => {
                setIsGasTankAddModalVisible(true);
              }}
            />
          </View>

          {/* ------------------ EXPENSES BOX ---------------- */}
          <View style={styles.expensesContainer}>
            <Text style={[styles.titleText, styles.expensesText]}>
              Expenses
            </Text>
            <AddButton onAddPress={() => {}} />
          </View>
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
  imageContainer: {
    position: 'relative',

    marginVertical: 16,

    width: 360,
    height: 240,
  },
  imagePhoto: {
    width: '100%',
    height: '100%',

    borderColor: colors.red[400],
    borderWidth: 2,
    borderRadius: 16,
  },
  twoInfoBox: {
    height: 344,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  gasTanksContainer: {
    position: 'relative',

    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,

    width: 360,
    height: 200,

    borderColor: colors.red[400],
    borderWidth: 2,
    borderRadius: 16,
  },
  titleText: {
    position: 'absolute',

    backgroundColor: 'white',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 2,
    height: 24,

    top: -14,
  },
  imageText: {
    width: 80,
    left: 140,
  },
  mileageText: {
    width: 80,
    left: 46,
  },
  faultsText: {
    width: 80,
    left: 46,
  },
  infoText: {
    width: 50,
    left: 61,
  },
  gasTanksText: {
    width: 100,
    left: 130,
  },
  expensesText: {
    width: 100,
    left: 130,
  },
  expensesContainer: {
    position: 'relative',

    marginVertical: 8,

    width: 360,
    height: 200,

    borderColor: colors.cyan[400],
    borderWidth: 2,
    borderRadius: 16,
  },
});
