import React, { useState, useEffect, useReducer } from 'react';
import {
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
  View,
} from 'react-native';

import { inputNewVehicle } from '../../store/Database/queriesSQLite';

import PrimaryInput from '../ui/inputs/PrimaryInput';
import DateSelect from '../ui/inputs/DateSelect';
import PrimaryButton from '../ui/buttons/PrimaryButton';

import useOpenDatabase from '../../hooks/useOpenDatabase';

const db = useOpenDatabase({ dbName: 'vehiclexpenses.sqlite' });

interface NewVehicleModalProps {
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
}

interface FormState {
  vehicleNameValue: string;
  vehicleNameValid: boolean | null;
  vehicleModelValue: string;
  vehicleModelValid: boolean | null;
  buyDateValue: string;
  buyDateValid: boolean | null;
  buyPriceValue: string;
  buyPriceValid: boolean | null;
  mileageValue: string;
  mileageValid: boolean | null;
}

type FormAction =
  | { type: 'SET_VEHICLE_NAME'; value: string }
  | { type: 'SET_VEHICLE_MODEL'; value: string }
  | { type: 'SET_BUY_DATE'; value: string }
  | { type: 'SET_BUY_PRICE'; value: string }
  | { type: 'SET_MILEAGE'; value: string }
  | { type: 'RESET_STATE' };

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_VEHICLE_NAME':
      return {
        ...state,
        vehicleNameValue: action.value,
        vehicleNameValid: action.value.length >= 3,
      };
    case 'SET_VEHICLE_MODEL':
      return {
        ...state,
        vehicleModelValue: action.value,
        vehicleModelValid: action.value.length > 0,
      };
    case 'SET_BUY_DATE':
      return {
        ...state,
        buyDateValue: action.value,
        buyDateValid: action.value.length > 0,
      };
    case 'SET_BUY_PRICE':
      return {
        ...state,
        buyPriceValue: action.value,
        buyPriceValid: parseFloat(action.value) >= 0,
      };
    case 'SET_MILEAGE':
      return {
        ...state,
        mileageValue: action.value,
        mileageValid: parseFloat(action.value) >= 0,
      };
    case 'RESET_STATE':
      return {
        vehicleNameValue: '',
        vehicleNameValid: null,
        vehicleModelValue: '',
        vehicleModelValid: null,
        buyDateValue: '',
        buyDateValid: null,
        buyPriceValue: '0',
        buyPriceValid: null,
        mileageValue: '0',
        mileageValid: null,
      };
    default:
      return state;
  }
};

export default function NewVehicleModal({
  isModalVisible,
  onModal,
}: NewVehicleModalProps) {
  const [formState, dispatchForm] = useReducer(formReducer, {
    vehicleNameValue: '',
    vehicleNameValid: null,
    vehicleModelValue: '',
    vehicleModelValid: null,
    buyDateValue: '',
    buyDateValid: null,
    buyPriceValue: '0',
    buyPriceValid: null,
    mileageValue: '0',
    mileageValid: null,
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const translateY = new Animated.Value(500);

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

  const showAnimation = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideAnimation = () => {
    Animated.timing(translateY, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => closeModal());
  };

  useEffect(() => {
    if (isVisible) {
      showAnimation();
    } else {
      hideAnimation();
    }
  }, [isVisible]);

  const saveVehicle = async () => {
    const {
      vehicleNameValue: name,
      vehicleModelValue: model,
      buyDateValue: buyDate,
      buyPriceValue: buyPrice,
      mileageValue: mileage,
    } = formState;
    const isSold = 0;

    // console.log(name, model, buyDate, buyPrice, isSold, mileage);

    try {
      const result = await inputNewVehicle(
        db,
        name,
        model,
        'NULL',
        buyDate,
        parseFloat(buyPrice),
        isSold,
        'NULL',
        'NULL',
        parseFloat(mileage)
      );

      if (result.isVehicleAdded) {
        hideAnimation();
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType='fade'
    >
      <TouchableOpacity
        style={styles.modalBackground}
        activeOpacity={1}
      >
        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
        >
          <ScrollView style={styles.contentContainerRoot}>
            <View style={styles.contentContainer}>
              <Text style={styles.titleText}>NEW VEHICLE</Text>
              <PrimaryInput
                placeholder='Vehicle name...'
                value={formState.vehicleNameValue}
                isValid={formState.vehicleNameValid}
                onTextChange={(text) => {
                  dispatchForm({
                    type: 'SET_VEHICLE_NAME',
                    value: text,
                  });
                }}
              />
              <PrimaryInput
                placeholder='Vehicle model...'
                value={formState.vehicleModelValue}
                isValid={formState.vehicleModelValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_VEHICLE_MODEL',
                    value: text,
                  })
                }
              />

              <DateSelect
                isValid={formState.buyDateValid}
                onDateChange={(date) => {
                  dispatchForm({
                    type: 'SET_BUY_DATE',
                    value: date,
                  });
                }}
              />

              <PrimaryInput
                placeholder='Buy price...'
                inputMode='decimal'
                keyboardType='number-pad'
                value={formState.buyPriceValue}
                isValid={formState.buyPriceValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_BUY_PRICE',
                    value: text,
                  })
                }
              />
              <PrimaryInput
                placeholder='Mileage...'
                inputMode='decimal'
                keyboardType='number-pad'
                value={formState.mileageValue}
                isValid={formState.mileageValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_MILEAGE',
                    value: text,
                  })
                }
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title='Close'
              onPress={hideAnimation}
            />
            <PrimaryButton
              title='Confirm'
              onPress={saveVehicle}
              btnColor='green'
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
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
});
