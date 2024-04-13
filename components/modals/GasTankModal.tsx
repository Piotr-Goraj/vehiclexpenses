import React, { useState, useEffect, useReducer } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSQLiteContext } from 'expo-sqlite/next';

import { FuelTypeTab, VehiclesTab } from '../../utils/types';

import ModalCard from './ModalCard';
import PrimaryInput from '../ui/inputs/PrimaryInput';
import colors from '../../utils/colors';
import DateInput from '../ui/inputs/DateInput';

interface FormState {
  selectedVehicle: { id: number; name: string; mileageBefore: number };

  gasStationValue: string;
  gasStationValid: boolean | null;

  selectedFuelType: { id: number; name: string };

  pricePerLiterValue: number;
  pricePerLiterValid: boolean | null;

  capacityValue: number;
  capacityValid: boolean | null;

  mileageAfterValue: number;
  mileageAfterValid: boolean | null;

  buyDateValue: string;
  buyDateValid: boolean | null;
}

type FormAction =
  | {
      type: 'SET_VEHICLE';
      value: { id: number; name: string; mileageBefore: number };
    }
  | { type: 'SET_GAS_STATION'; value: string }
  | { type: 'SET_FUEL_TYPE'; value: { id: number; name: string } }
  | { type: 'SET_LITER_PRICE'; value: number }
  | { type: 'SET_CAPACITY'; value: number }
  | { type: 'SET_MILEAGE_AFTER'; value: number }
  | { type: 'SET_BUY_DATE'; value: string }
  | { type: 'RESET_STATE' };

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_VEHICLE':
      return {
        ...state,
        selectedVehicle: {
          id: action.value.id,
          name: action.value.name,
          mileageBefore: action.value.mileageBefore,
        },
      };
    case 'SET_GAS_STATION':
      return {
        ...state,
        gasStationValue: action.value.trim(),
        gasStationValid: action.value.length > 0,
      };
    case 'SET_LITER_PRICE':
      return {
        ...state,
        pricePerLiterValue: action.value,
        pricePerLiterValid: action.value > 0,
      };
    case 'SET_CAPACITY':
      return {
        ...state,
        capacityValue: action.value,
        capacityValid: action.value > 0,
      };
    case 'SET_MILEAGE_AFTER':
      return {
        ...state,
        mileageAfterValue: action.value,
        mileageAfterValid: action.value > state.selectedVehicle.mileageBefore,
      };
    case 'SET_BUY_DATE':
      return {
        ...state,
        buyDateValue: action.value.trim(),
        buyDateValid: action.value.length === 10,
      };
    case 'SET_FUEL_TYPE':
      return {
        ...state,
        selectedFuelType: { id: action.value.id, name: action.value.name },
      };
    case 'RESET_STATE':
      return {
        selectedVehicle: { id: -1, name: '', mileageBefore: -1 },

        gasStationValue: '',
        gasStationValid: null,

        selectedFuelType: { id: -1, name: '' },

        pricePerLiterValue: -1,
        pricePerLiterValid: null,

        capacityValue: -1,
        capacityValid: null,

        mileageAfterValue: -1,
        mileageAfterValid: null,

        buyDateValue: '',
        buyDateValid: null,
      };
    default:
      return state;
  }
};

interface VehicleGasTankAddProps {
  vehicle?: VehiclesTab;
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
}

export default function GasTankModal({
  vehicle,
  isModalVisible,
  onModal,
}: VehicleGasTankAddProps) {
  const db = useSQLiteContext();

  const [formState, dispatchForm] = useReducer(formReducer, {
    selectedVehicle: { id: -1, name: '', mileageBefore: -1 },

    gasStationValue: '',
    gasStationValid: null,

    selectedFuelType: { id: -1, name: '' },

    pricePerLiterValue: -1,
    pricePerLiterValid: null,

    capacityValue: -1,
    capacityValid: null,

    mileageAfterValue: -1,
    mileageAfterValid: null,

    buyDateValue: '',
    buyDateValid: null,
  });

  const [vehicles, setVehicles] = useState<
    { id: number; label: string; currentMileage: number }[]
  >([]);
  const [fuelTypes, setFuelTypes] = useState<FuelTypeTab[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDropdownVehicleFocus, setIsDropdownVehicleFocus] = useState(false);
  const [isDropdownFuelTypeFocus, setIsDropdownFuelTypeFocus] = useState(false);

  useEffect(() => {
    setIsVisible(isModalVisible);

    if (vehicle) {
      dispatchForm({
        type: 'SET_VEHICLE',
        value: {
          id: vehicle.id,
          name: `${vehicle.name} ${vehicle.model}`,
          mileageBefore: vehicle.current_mileage,
        },
      });
    }

    return () => {
      dispatchForm({ type: 'RESET_STATE' });
    };
  }, [isModalVisible]);

  function getVehicles() {
    const result = db.getAllSync<VehiclesTab>(`SELECT * FROM vehicles`, []);

    const vehicleTable = [];
    for (const key of result) {
      vehicleTable.push({
        id: key.id,
        label: `${key.name} ${key.model}`,
        currentMileage: key.current_mileage,
      });
    }

    setVehicles(vehicleTable);
  }

  function getFuelTypes() {
    const result = db.getAllSync<FuelTypeTab>(`SELECT * FROM fuel_type;`, []);
    setFuelTypes(result);
  }

  useEffect(() => {
    db.withTransactionSync(() => {
      getVehicles();
      getFuelTypes();
    });
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    onModal(false);
  };

  const saveTank = () => {
    const {
      selectedVehicle,
      gasStationValue,
      selectedFuelType,
      pricePerLiterValue,
      capacityValue,
      mileageAfterValue,
      buyDateValue,
    } = formState;

    const {
      gasStationValid,
      pricePerLiterValid,
      capacityValid,
      mileageAfterValid,
      buyDateValid,
    } = formState;

    const isFormValid =
      gasStationValid &&
      selectedFuelType.name !== '' &&
      pricePerLiterValid &&
      capacityValid &&
      mileageAfterValid &&
      buyDateValid;

    const dispatchValidate = () => {
      dispatchForm({ type: 'SET_VEHICLE', value: selectedVehicle });
      dispatchForm({ type: 'SET_GAS_STATION', value: gasStationValue });
      dispatchForm({ type: 'SET_FUEL_TYPE', value: selectedFuelType });
      dispatchForm({ type: 'SET_LITER_PRICE', value: pricePerLiterValue });
      dispatchForm({ type: 'SET_CAPACITY', value: capacityValue });
      dispatchForm({ type: 'SET_MILEAGE_AFTER', value: mileageAfterValue });
      dispatchForm({ type: 'SET_BUY_DATE', value: buyDateValue });
    };

    if (vehicle) {
      console.log('Vehicle is a prop.');

      if (isFormValid) {
        console.log(
          vehicle.id,
          gasStationValue,
          selectedFuelType.id,
          pricePerLiterValue,
          capacityValue,
          vehicle.current_mileage,
          mileageAfterValue,
          buyDateValue
        );

        db.withTransactionAsync(async () => {
          await db
            .runAsync(
              `INSERT INTO gas_tank (vehicle_id, gas_station, fuel_type, price_per_liter, capacity, mileage_before, mileage_after, buy_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
              [
                vehicle.id,
                gasStationValue,
                selectedFuelType.id,
                pricePerLiterValue,
                capacityValue,
                vehicle.current_mileage,
                mileageAfterValue,
                buyDateValue,
              ]
            )
            .then(async () => {
              await db
                .runAsync(
                  `UPDATE vehicles SET current_mileage = ? WHERE id = ?`,
                  [mileageAfterValue, vehicle.id]
                )
                .catch((error) => console.error(error));
            })
            .then(async () => {
              db.runAsync(
                `INSERT INTO expenses (vehicle_id, name, type, price, date) VALUES (?, ?, ?, ?, ?)`,
                [
                  vehicle.id,
                  'Fuel tank',
                  1, // in expense_tab table it is id for "gas"
                  pricePerLiterValue * capacityValue,
                  buyDateValue,
                ]
              );
            })
            .then(() => closeModal())
            .catch((error) => console.error(error));
        });
      } else {
        dispatchValidate();
      }
    } else {
      console.log('Vehicle is not found as a prop.');
      if (isFormValid && selectedVehicle.name !== '') {
        console.log(
          selectedVehicle.id,
          gasStationValue,
          selectedFuelType.id,
          pricePerLiterValue,
          capacityValue,
          selectedVehicle.mileageBefore,
          mileageAfterValue,
          buyDateValue
        );

        db.withTransactionAsync(async () => {
          await db
            .runAsync(
              `INSERT INTO gas_tank (vehicle_id, gas_station, fuel_type, price_per_liter, capacity, mileage_before, mileage_after, buy_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
              [
                selectedVehicle.id,
                gasStationValue,
                selectedFuelType.id,
                pricePerLiterValue,
                capacityValue,
                selectedVehicle.mileageBefore,
                mileageAfterValue,
                buyDateValue,
              ]
            )
            .then(async () => {
              await db
                .runAsync(
                  `UPDATE vehicles SET current_mileage = ? WHERE id = ?`,
                  [mileageAfterValue, selectedVehicle.id]
                )
                .catch((error) => console.error(error));
            })
            .then(async () => {
              db.runAsync(
                `INSERT INTO expenses (vehicle_id, name, type, price, date) VALUES (?, ?, ?, ?, ?)`,
                [
                  selectedVehicle.id,
                  'Fuel tank',
                  1, // in expense_tab table it is id for "gas"
                  pricePerLiterValue * capacityValue,
                  buyDateValue,
                ]
              );
            })
            .then(() => closeModal())
            .catch((error) => console.error(error));
        });
      } else {
        dispatchValidate();
      }
    }
  };

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={isVisible}
      isConfirm={true}
      onConfirm={saveTank}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: 320, alignItems: 'center' }}>
          {!vehicle && (
            <>
              <Text style={styles.label}>Vehicle</Text>
              <Dropdown
                style={[
                  styles.dropdown,
                  isDropdownVehicleFocus && { borderColor: colors.blue[400] },
                ]}
                data={vehicles}
                labelField={'label'}
                valueField='id'
                placeholder={
                  !isDropdownVehicleFocus
                    ? formState.selectedVehicle.name
                    : '...'
                }
                searchPlaceholder='Search...'
                value={formState.selectedVehicle.id.toString()}
                onFocus={() => setIsDropdownVehicleFocus(true)}
                onBlur={() => setIsDropdownVehicleFocus(false)}
                onChange={(item) => {
                  dispatchForm({
                    type: 'SET_VEHICLE',
                    value: {
                      id: item.id,
                      name: item.label,
                      mileageBefore: item.currentMileage,
                    },
                  });
                  setIsDropdownVehicleFocus(false);
                }}
              />
            </>
          )}

          <PrimaryInput
            value={formState.gasStationValue}
            isValid={formState.gasStationValid}
            onTextChange={(text) =>
              dispatchForm({ type: 'SET_GAS_STATION', value: text })
            }
            placeholder='Gas station'
          />

          <Text style={styles.label}>Fuel type</Text>
          <Dropdown
            style={[
              styles.dropdown,
              formState.selectedFuelType.name === '' && {
                borderColor: colors.red[100],
              },
              isDropdownFuelTypeFocus && { borderColor: colors.blue[400] },
            ]}
            data={fuelTypes}
            labelField='type_name'
            valueField='id'
            placeholder={
              !isDropdownFuelTypeFocus ? formState.selectedFuelType.name : '...'
            }
            searchPlaceholder='Search...'
            value={formState.selectedFuelType.id.toString()}
            onFocus={() => setIsDropdownFuelTypeFocus(true)}
            onBlur={() => setIsDropdownFuelTypeFocus(false)}
            onChange={(item) => {
              dispatchForm({
                type: 'SET_FUEL_TYPE',
                value: { id: item.id, name: item.type_name },
              });
              setIsDropdownFuelTypeFocus(false);
            }}
          />

          <PrimaryInput
            value={formState.pricePerLiterValue.toString()}
            isValid={formState.pricePerLiterValid}
            onTextChange={(text) =>
              dispatchForm({ type: 'SET_LITER_PRICE', value: parseFloat(text) })
            }
            placeholder='Price per liter'
            inputMode='numeric'
            keyboardType='number-pad'
          />

          <PrimaryInput
            value={formState.capacityValue.toString()}
            isValid={formState.capacityValid}
            onTextChange={(text) =>
              dispatchForm({ type: 'SET_CAPACITY', value: parseFloat(text) })
            }
            placeholder='Tanked capacity [liter]'
            inputMode='numeric'
            keyboardType='number-pad'
          />

          <PrimaryInput
            value={formState.mileageAfterValue.toString()}
            isValid={formState.mileageAfterValid}
            onTextChange={(text) =>
              dispatchForm({
                type: 'SET_MILEAGE_AFTER',
                value: parseFloat(text),
              })
            }
            placeholder={`Mileage before tanked > ${
              vehicle
                ? vehicle.current_mileage
                : formState.selectedVehicle.mileageBefore
            } km`}
            inputMode='numeric'
            keyboardType='number-pad'
          />

          <DateInput
            isValid={formState.buyDateValid}
            title='Tank date'
            onDataSet={(text) =>
              dispatchForm({
                type: 'SET_BUY_DATE',
                value: text,
              })
            }
          />
        </View>
      </ScrollView>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    marginVertical: 64,
    marginHorizontal: 16,
    height: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  contentContainerRoot: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dropdown: {
    height: 50,
    width: 320,

    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 16,

    paddingHorizontal: 8,
  },
  label: {
    color: colors.fontDark,
    width: '100%',
    textAlign: 'left',
    marginVertical: 4,
  },
});
