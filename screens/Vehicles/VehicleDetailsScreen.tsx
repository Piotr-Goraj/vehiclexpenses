import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { VehicleDetailsProps, VehicleProps } from '../../utils/types';

export default function VehicleDetailsScreen({
  route,
  navigation,
}: VehicleDetailsProps) {
  const { vehicleId } = route.params;
  const tabNav = navigation.getParent();

  useFocusEffect(
    useCallback(() => {
      tabNav?.setOptions({ headerShown: false });
      return () => {
        tabNav?.setOptions({ headerShown: true });
      };
    }, [])
  );

  const [vehicleDetails, setVehicleDetails] = useState<VehicleProps>({
    id: 0,
    name: '',
    model: '',
    buy_date: '',
    buy_price: 0,
    is_sold: 0,
    mileage: 0,
  });

  const db = useSQLiteContext();

  async function getVehiclesById(id: number) {
    const result = await db.getAllAsync<VehicleProps>(
      `SELECT * FROM vehicles WHERE id = ?;`,
      [id]
    );
    console.log(result);
    setVehicleDetails(result[0]);
  }

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getVehiclesById(vehicleId);
    });
  }, []);

  const isSold = vehicleDetails.is_sold === 1 ? true : false;

  return (
    <View style={styles.container}>
      <Text>Vehicle Details</Text>
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
