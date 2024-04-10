import { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite/next';

import {
  GasTankTab,
  MileagesTab,
  VehicleDetailsProps,
  VehicleProps,
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
  const [vehicleDetails, setVehicleDetails] = useState<VehicleProps>({
    id: 0,
    name: '',
    model: '',
    buy_date: '',
    buy_price: 0,
    is_sold: 0,
    mileage: 0,
  });
  const [yearlyMileages, setYearlyMileages] = useState<MileagesTab[]>([]);

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
    const result = await db.getAllAsync<VehicleProps>(
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
    // console.log('Gas: ', result);
  }

  async function getMeleagesVehicleId(id: number) {
    const result = await db.getAllAsync<MileagesTab>(
      `SELECT * FROM mileages WHERE vehicle_id = ? ORDER BY year DESC;`,
      [id]
    );
    setYearlyMileages(result);
  }

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getVehiclesById(vehicleId);
      await getGasByVehicleId(vehicleId);
      await getMeleagesVehicleId(vehicleId);
    });
  }, [
    isImageModalVisible,
    isMileageModalVisible,
    isInfoModalVisible,
    isGasTankAddModalVisible,
    changeMileageModalVisible,
  ]);

  const isSold = vehicleDetails.is_sold === 1 ? true : false;

  return (
    <>
      <VehicleImageModal
        isModalVisible={isImageModalVisible}
        onModal={setIsImageModalVisible}
        vehicleId={vehicleId}
      />
      <VehicleMileageModal
        vehicleId={vehicleId}
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
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${vehicleDetails.image}` }}
              style={styles.imagePhoto}
            />
            <EditButton
              onEditPress={() => {
                setIsImageModalVisible(true);
              }}
            />
          </View>

          <VehiclesInfoBox>
            <VehicleInfoTxt
              text={`Mileage: ${vehicleDetails.mileage} km`}
              textColor='light'
            />
            <VehicleMileageTxt
              changeMileageModalVisible={setChangeMileageModalVisible}
              yearlyMileages={yearlyMileages}
              vehicleDetails={vehicleDetails}
            />

            <AddButton
              onAddPress={() => {
                setIsMileageModalVisible(true);
              }}
            />
          </VehiclesInfoBox>

          <VehiclesInfoBox
            boxColor='magenta'
            intensityColor={600}
          >
            <VehicleInfoTxt
              text={`Buy date: ${vehicleDetails.buy_date}`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <VehicleInfoTxt
              text={`Buy price: ${vehicleDetails.buy_price} PLN`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <VehicleInfoTxt
              text={`Sold date: ${
                isSold ? vehicleDetails.sold_date : 'NOT SOLD'
              }`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <VehicleInfoTxt
              text={`Sold price: ${
                isSold ? `${vehicleDetails.sold_price} PLN` : 'NOT SOLD'
              }`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <VehicleInfoTxt
              text={`Traveled: ${vehicleDetails.mileage} km`}
              textColor='light'
              boxColor={{ color: 'magenta', intensity: 600 }}
            />

            <EditButton
              onEditPress={() => {
                setIsInfoModalVisible(true);
              }}
            />
          </VehiclesInfoBox>

          <View style={styles.gasTanksContainer}>
            <AddButton
              onAddPress={() => {
                setIsGasTankAddModalVisible(true);
              }}
            />
            <Text>Gas tanks</Text>
          </View>

          <View style={styles.expensesContainer}>
            <AddButton onAddPress={() => {}} />
            <Text>Expenses</Text>
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
  gasTanksContainer: {
    position: 'relative',

    marginVertical: 8,

    width: 360,
    height: 200,

    borderColor: colors.red[400],
    borderWidth: 2,
    borderRadius: 16,
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
