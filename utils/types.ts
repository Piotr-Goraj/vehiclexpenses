import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ************** UI types ************** \\
export type ColorIntensity = {
  color: 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'magenta' | 'grey';
  intensity: 30 | 60 | 80 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
};

// ************** navigators types ************** \\

export type RootStackParamList = {
  VehiclesNav: undefined;
  VehiclesList: undefined;
  VehicleDetails: {
    vehicleId: number;
    vehicleName: string;
    vehicleModel: string;
  };

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

// ************** SQLite tables types ************** \\

export interface ExpenseTypeTab {
  id: number;
  type_name: string;
}

export interface ExpensesTab {
  id: number;
  vehicle_id: number;
  name: string;
  type: number;
  price: number;
  date: string;
}

export interface FaultsTab {
  id: number;
  vehicle_id: number;
  is_repaired: 0 | 1;
  fault_title: string;
}

export interface FuelTypeTab {
  id: number;
  type_name: string;
}

export interface GasTankTab {
  id: number;
  vehicle_id: number;
  gas_station: string;
  fuel_type: number;
  price_per_liter: number;
  capacity: number;
  mileage_before: number;
  mileage_after: number;
  buy_date: string;
}

export interface MileagesTab {
  id: number;
  vehicle_id: number;
  year: number;
  mileage: number;
}

export interface SettingsTab {
  id: number;
  key: string;
  value: string;
}

export interface VehiclesTab {
  id: number;
  name: string;
  model: string;
  image?: string;
  producted_year: number;
  buy_date: string;
  buy_price: number;
  buy_mileage: number;
  is_sold: 0 | 1;
  sold_date?: string;
  sold_price?: number;
  current_mileage: number;
}
