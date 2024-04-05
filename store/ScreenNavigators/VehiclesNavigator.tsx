import { StyleSheet, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VehiclesScreen from '../../screens/Vehicles/VehiclesScreen';
import VehicleDetailsScreen from '../../screens/Vehicles/VehicleDetailsScreen';

import screen from '../../utils/screens-names';

const Stack = createNativeStackNavigator();

export default function VehiclesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={screen.VehiclesList}
        component={VehiclesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={screen.VehicleDetails}
        component={VehicleDetailsScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
