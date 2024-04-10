import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VehiclesScreen from '../../screens/Vehicles/VehiclesScreen';
import VehicleDetailsScreen from '../../screens/Vehicles/VehicleDetailsScreen';

import { RootStackParamList, VehiclesNavProps } from '../../utils/types';
import colors from '../../utils/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function VehiclesNavigator({}: VehiclesNavProps) {
  return (
    <Stack.Navigator
      initialRouteName='VehiclesList'
      screenOptions={{ contentStyle: { backgroundColor: colors.grey[200] } }}
    >
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
        options={({ route }) => {
          const { vehicleName, vehicleModel } = route.params;

          return {
            title: `${vehicleName} ${vehicleModel}`,
          };
        }}
      />
    </Stack.Navigator>
  );
}
