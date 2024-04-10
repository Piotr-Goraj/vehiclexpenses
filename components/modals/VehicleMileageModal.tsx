import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Modal, View, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { MileagesTab, VehicleProps } from '../../utils/types';

import PrimaryInput from '../ui/inputs/PrimaryInput';

import ModalCard from './ModalCard';

interface FormReducerState {
  yearValue: number;
  yearValid: boolean | null;
  mileageValue: number;
  mileageValid: boolean | null;
}

type FormReducerAction =
  | { type: 'SET_YEAR'; value: number }
  | { type: 'SET_MILEAGE'; value: number }
  | { type: 'RESET_STATE' };

const formReducer = (state: FormReducerState, action: FormReducerAction) => {
  switch (action.type) {
    case 'SET_YEAR':
      return {
        ...state,
        yearValue: action.value,
        yearValid: action.value >= 1900,
      };
    case 'SET_MILEAGE':
      return {
        ...state,
        mileageValue: action.value,
        mileageValid: action.value >= 0,
      };
    case 'RESET_STATE':
      return {
        yearValue: -1,
        yearValid: null,
        mileageValue: -1,
        mileageValid: null,
      };
    default:
      return state;
  }
};

interface VehicleMileageProps {
  vehicleId: number;
  vehicle: VehicleProps;
  yearlyMileages: MileagesTab[];
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
}

export default function VehicleMileageModal({
  vehicleId,
  vehicle,
  yearlyMileages,
  isModalVisible,
  onModal,
}: VehicleMileageProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formState, dispatchForm] = useReducer(formReducer, {
    yearValue: -1,
    yearValid: null,
    mileageValue: -1,
    mileageValid: null,
  });

  const db = useSQLiteContext();

  useEffect(() => {
    setIsVisible(isModalVisible);

    return () => {
      dispatchForm({ type: 'RESET_STATE' });
    };
  }, [isModalVisible]);

  const closeModal = () => {
    setIsVisible(false);
    onModal(false);
  };

  const addYearlyMileage = async () => {
    const { yearValue, mileageValue } = formState;

    const year = yearValue;
    const mileage = mileageValue;

    const isFormValid: boolean | null =
      formState.yearValid && formState.mileageValid;

    if (!isFormValid) {
      dispatchForm({ type: 'SET_YEAR', value: year });
      dispatchForm({ type: 'SET_MILEAGE', value: mileage });

      console.log(year, mileage);
    } else {
      db.withTransactionAsync(async () => {
        await db
          .runAsync(
            `INSERT INTO mileages (vehicle_id, year, mileage) VALUES (?, ?, ?);`,
            [vehicleId, year, mileage]
          )
          .then(() => closeModal())
          .catch((error) => console.error(error));
      });
    }
  };

  const maxYear = new Date().getFullYear();
  const minYear = parseInt(vehicle.buy_date.split('-')[2]);

  const yearInputHandler = (text: string) => {
    const yearInput = parseInt(text);

    if (yearInput >= minYear && yearInput <= maxYear) {
      dispatchForm({ type: 'SET_YEAR', value: yearInput });
    } else {
      dispatchForm({ type: 'SET_YEAR', value: -1 });
    }
  };

  const yearlyMileagesSum = yearlyMileages.reduce(
    (accumulator, year) => accumulator + year.mileage,
    0
  );
  const maxMileages = vehicle.mileage - yearlyMileagesSum;

  const mileageInputHandler = (text: string) => {
    const inputMileage = parseFloat(text);

    if (inputMileage <= maxMileages) {
      dispatchForm({ type: 'SET_MILEAGE', value: inputMileage });
    } else {
      dispatchForm({ type: 'SET_MILEAGE', value: -1 });
    }
  };

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={isVisible}
      isConfirm={true}
      onConfirm={addYearlyMileage}
    >
      <Text
        style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 32 }}
      >{`Add yearly mileage for ${vehicle.name} ${vehicle.model}`}</Text>
      <PrimaryInput
        placeholder='Year'
        value={formState.yearValue.toString()}
        isValid={formState.yearValid}
        onTextChange={(text) => yearInputHandler(text)}
        inputMode='numeric'
        keyboardType='numeric'
      />
      <PrimaryInput
        placeholder='Mileage'
        value={formState.mileageValue.toString()}
        isValid={formState.mileageValid}
        onTextChange={(text) => mileageInputHandler(text)}
        inputMode='numeric'
        keyboardType='numeric'
      />
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',

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
});
