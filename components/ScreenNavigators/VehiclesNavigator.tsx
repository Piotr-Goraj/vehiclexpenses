import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VehiclesScreen from '../../screens/Vehicles/VehiclesScreen';
import VehicleDetailsScreen from '../../screens/Vehicles/VehicleDetailsScreen';

import { RootStackParamList, VehiclesNavProps } from '../../utils/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function VehiclesNavigator({}: VehiclesNavProps) {
  return (
    <Stack.Navigator initialRouteName='VehiclesList'>
      <Stack.Screen
        name={'VehiclesList'}
        component={VehiclesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'VehicleDetails'}
        component={VehicleDetailsScreen}
      />
    </Stack.Navigator>
  );
}
