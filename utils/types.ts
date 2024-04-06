import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  VehiclesNav: undefined;
  VehiclesList: undefined;
  VehicleDetails: { vehicleId: number };

  Gas: undefined;
  Summarise: undefined;
  Settings: undefined;
};

export type VehiclesNavProps = BottomTabScreenProps<
  RootStackParamList,
  'VehiclesNav'
>;

export type VehiclesList = NativeStackScreenProps<
  RootStackParamList,
  'VehiclesList'
>;

export type VehicleDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'VehicleDetails'
>;

export type GasProps = BottomTabScreenProps<RootStackParamList, 'Gas'>;

export type SummariseProps = BottomTabScreenProps<
  RootStackParamList,
  'Summarise'
>;

export type SettingsProps = BottomTabScreenProps<
  RootStackParamList,
  'Settings'
>;
