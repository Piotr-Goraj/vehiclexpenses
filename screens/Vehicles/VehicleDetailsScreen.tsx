import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { VehicleDetailsProps } from '../../utils/types';
import {
  VehicleProps,
  getVehicleById,
} from '../../store/Database/queriesSQLite';

import useOpenDatabase from '../../hooks/useOpenDatabase';

const db = useOpenDatabase({ dbName: 'vehiclexpenses.sqlite' });

export default function VehicleDetailsScreen({ route }: VehicleDetailsProps) {
  const { vehicleId } = route.params;
  const [vehicleDetails, setVehicleDetails] = useState<VehicleProps>({
    id: 0,
    name: '',
    model: '',
    buy_date: '',
    buy_price: 0,
    is_sold: 0,
    mileage: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleData = await getVehicleById(db, vehicleId);
        setVehicleDetails(vehicleData);
      } catch (error) {
        console.error('Błąd pobierania danych:', error);
      }
    };

    fetchData();
  }, []);

  const isSold = vehicleDetails.is_sold === 1 ? true : false;

  return (
    <View style={styles.container}>
      <Text>Vehicle Details</Text>
      <Text>ID: {vehicleId}</Text>
      <Text>Name: {vehicleDetails.name}</Text>
      <Text>Model: {vehicleDetails.model}</Text>
      <Text>Mileage: {vehicleDetails.mileage}</Text>
      <Text>Buy date: {vehicleDetails.buy_date}</Text>
      <Text>Buy price: {vehicleDetails.buy_price} PLN</Text>
      {isSold && (
        <>
          <Text>SOLD</Text>
          <Text>Sold date: {vehicleDetails.sold_date}</Text>
          <Text>Sold price: {vehicleDetails.sold_price} PLN</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
