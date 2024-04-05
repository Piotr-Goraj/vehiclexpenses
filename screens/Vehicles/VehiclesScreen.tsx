import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AddVehicleModalBtn from '../../components/ui/buttons/AddVehicleModalBtn';
import { getAllVehicles } from '../../store/Database/queriesSQLite';
import NewVehicleModal from '../../components/modals/NewVehicleModal';

import useOpenDatabase from '../../hooks/useOpenDatabase';
import VehicleBtn from '../../components/Vehicles/VehicleBtn';

import screen from '../../utils/screens-names';

interface Vehicle {
  id: number;
  name: string;
  model: string;
  buyDate: string;
  buyPrice: number;
  isSold: 0 | 1;
  soldDate: string | 'NULL';
  soldPrice: number | 'NULL';
  mileage: number;
}

const db = useOpenDatabase({ dbName: 'vehiclexpenses.sqlite' });

export default function VehiclesScreen() {
  const navigation = useNavigation();

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
                  navigation.navigate(screen.VehicleDetails, { vehicle })
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
