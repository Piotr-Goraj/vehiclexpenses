import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { getAllVehicles } from '../../store/Database/queriesSQLite';

import { VehiclesList } from '../../utils/types';

import useOpenDatabase from '../../hooks/useOpenDatabase';

import VehicleBtn from '../../components/Vehicles/VehicleBtn';
import NewVehicleModal from '../../components/modals/NewVehicleModal';
import AddVehicleModalBtn from '../../components/ui/buttons/AddVehicleModalBtn';

interface Vehicle {
  id: number;
  name: string;
  model: string;
  image: string;
  buyDate: string;
  buyPrice: number;
  isSold: 0 | 1;
  soldDate: string | 'NULL';
  soldPrice: number | 'NULL';
  mileage: number;
}

const db = useOpenDatabase({ dbName: 'vehiclexpenses.sqlite' });

export default function VehiclesScreen({ navigation }: VehiclesList) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const vehiclesTab = await getAllVehicles(db);
      setVehicles(vehiclesTab as Vehicle[]);
      console.log(vehiclesTab);
    };

    fetchData();
  }, [isModalVisible]);

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
  },
  container: {
    width: 288,

    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
