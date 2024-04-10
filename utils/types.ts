import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ************** UI types ************** \\
export type ColorIntensity = {
  color: 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'magenta';
  intensity: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
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

// ************** SQLite types ************** \\

export interface VehiclesTab {
  id: number;
  name: string;
  model: string;
  image: Uint8Array;
  buy_date: string;
  buy_price: number;
  is_sold: 0 | 1;
  sold_date: string;
  sold_price: number;
  mileage: number;
}

export interface GasTankTab {
  id: number;
  vehicle_id: number;
  fuel_type: string;
  capacity: number;
  mileage_before: number;
  price_per_liter: number;
  gas_station: string;
  buy_date: string;
}

export interface MileagesTab {
  id: number;
  vehicle_id: number;
  year: number;
  mileage: number;
}

export interface ExpensesTypeTab {
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

export interface SettingsTab {
  id: number;
  key: string;
  value: string;
}

export interface InputNewVehicleProps {
  dbName: string;
  name: string;
  model: string;
  image: Uint8Array | null;
  buyDate: string;
  buyPrice: number;
  isSold: 0 | 1;
  soldDate: string | null;
  soldPrice: number | null;
  mileage: number;
}

export interface VehicleProps {
  id: number;
  name: string;
  model: string;
  image?: string;
  buy_date: string;
  buy_price: number;
  is_sold: 0 | 1;
  sold_date?: string;
  sold_price?: number;
  mileage: number;
}
