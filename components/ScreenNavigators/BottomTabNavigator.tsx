import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import VehiclesNavigator from './VehiclesNavigator';

import GasScreen from '../../screens/GasScreen';
import SummariseScreen from '../../screens/SummariseScreen';
import SettingsScreen from '../../screens/SettingsScreen';

import { RootStackParamList } from '../../utils/types';
import colors from '../../utils/colors';

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={'VehiclesNav'}
      backBehavior='history'
      sceneContainerStyle={{
        backgroundColor: colors.grey[200],
      }}
    >
      <Tab.Screen
        name={'VehiclesNav'}
        component={VehiclesNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name='car'
              size={size}
              color={color}
            />
          ),
          title: 'Vehicle',
        }}
      />
      <Tab.Screen
        name={'Gas'}
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
        name={'Summarise'}
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
        name={'Settings'}
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
