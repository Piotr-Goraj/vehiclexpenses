import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { VehiclesList, VehicleProps } from '../../utils/types';

import VehicleBtn from '../../components/Vehicles/VehicleBtn';
import NewVehicleModal from '../../components/modals/NewVehicleModal';
import AddVehicleModalBtn from '../../components/ui/buttons/AddVehicleModalBtn';

export default function VehiclesScreen({ navigation }: VehiclesList) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);

  const db = useSQLiteContext();

  async function getAllVehicles() {
    const result = await db.getAllAsync<VehicleProps>(
      `SELECT * FROM vehicles ORDER BY buy_date DESC;`
    );
    console.log(result);
    setVehicles(result);
  }

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getAllVehicles();
    });
  }, [isModalVisible, db]);

  return (
    <>
      <NewVehicleModal
        isModalVisible={isModalVisible}
        onModal={setIsModalVisible}
      />

      <ScrollView style={styles.containerRoot}>
        <View style={styles.containerList}>
          <View style={styles.container}>
            {vehicles.map((vehicle) => (
              <VehicleBtn
                key={vehicle.id}
                details={vehicle}
                onPress={() =>
                  navigation.navigate('VehicleDetails', {
                    vehicleId: vehicle.id,
                  })
                }
              />
            ))}

            <AddVehicleModalBtn
              title='Add new vehicle'
              onPress={() => {
                setIsModalVisible(true);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  containerRoot: {
    flex: 1,
  },
  containerList: {
    width: '100%',
    alignItems: 'center',

    marginTop: 16,
  },
  container: {
    width: 360,

    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
