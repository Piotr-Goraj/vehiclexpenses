import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import screen from '../../utils/screens-names';

import VehiclesNavigator from './VehiclesNavigator';

import GasScreen from '../../screens/GasScreen';
import SummariseScreen from '../../screens/SummariseScreen';
import SettingsScreen from '../../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName={screen.Vehicles}>
      <Tab.Screen
        name={screen.Vehicles}
        component={VehiclesNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name='car'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={screen.Gas}
        component={GasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='gas-station-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={screen.Summarise}
        component={SummariseScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name='linechart'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={screen.Settings}
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather
              name='settings'
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
