import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Modal, View, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import PrimaryButton from '../ui/buttons/PrimaryButton';
import PrimaryInput from '../ui/inputs/PrimaryInput';

interface VehicleMileageProps {
  vehicleId: number;
  maxMileage: number;
  vehicle: { name: string; model: string; buyDate: string };
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
}

interface FormReducerState {
  yearValue: string;
  yearValid: boolean | null;
  mileageValue: string;
  mileageValid: boolean | null;
}

type FormReducerAction =
  | { type: 'SET_YEAR'; value: string }
  | { type: 'SET_MILEAGE'; value: string }
  | { type: 'RESET_STATE' };

const formReducer = (state: FormReducerState, action: FormReducerAction) => {
  switch (action.type) {
    case 'SET_YEAR':
      return {
        ...state,
        yearValue: action.value.trim(),
        yearValid: parseInt(action.value) >= 1900,
      };
    case 'SET_MILEAGE':
      return {
        ...state,
        mileageValue: action.value.trim(),
        mileageValid: parseFloat(action.value) >= 0,
      };
    case 'RESET_STATE':
      return {
        yearValue: '',
        yearValid: null,
        mileageValue: '',
        mileageValid: null,
      };
    default:
      return state;
  }
};

export default function VehicleMileageModal({
  vehicleId,
  maxMileage,
  vehicle = { name: 'NAME', model: 'MODEL', buyDate: '' },
  isModalVisible,
  onModal,
}: VehicleMileageProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [formState, dispatchForm] = useReducer(formReducer, {
    yearValue: '',
    yearValid: null,
    mileageValue: '',
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

    const year = parseInt(yearValue);
    const mileage = parseFloat(mileageValue);

    const isFormValid: boolean | null =
      formState.yearValid && formState.mileageValid;

    if (!isFormValid) {
      dispatchForm({ type: 'SET_YEAR', value: year.toString() });
      dispatchForm({ type: 'SET_MILEAGE', value: mileage.toString() });

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

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType='fade'
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text>{`Add yearly mileage for ${vehicle.name} ${vehicle.model}`}</Text>
          <PrimaryInput
            placeholder='Year'
            value={formState.yearValue}
            isValid={formState.yearValid}
            onTextChange={(text) =>
              dispatchForm({ type: 'SET_YEAR', value: text })
            }
            inputMode='numeric'
            keyboardType='numeric'
          />
          <PrimaryInput
            placeholder='Mileage'
            value={formState.mileageValue}
            isValid={formState.mileageValid}
            onTextChange={(text) =>
              dispatchForm({ type: 'SET_MILEAGE', value: text })
            }
            inputMode='numeric'
            keyboardType='numeric'
          />

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title='Close'
              onPress={closeModal}
            />
            <PrimaryButton
              title='Confirm'
              onPress={addYearlyMileage}
              btnColor='green'
            />
          </View>
        </View>
      </View>
    </Modal>
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
