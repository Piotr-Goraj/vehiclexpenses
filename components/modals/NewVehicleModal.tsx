import React, { useState, useEffect, useReducer } from 'react';
import { StyleSheet, Text, Modal, ScrollView, View } from 'react-native';

import { useSQLiteContext } from 'expo-sqlite/next';

import PrimaryInput from '../ui/inputs/PrimaryInput';
import DateInput from '../ui/inputs/DateInput';
import PrimaryButton from '../ui/buttons/PrimaryButton';

interface NewVehicleModalProps {
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
}

interface FormState {
  vehicleNameValue: string;
  vehicleNameValid: boolean | null;

  vehicleModelValue: string;
  vehicleModelValid: boolean | null;

  productedYearValue: number;
  productedYearValid: boolean | null;

  buyDateValue: string;
  buyDateValid: boolean | null;

  buyPriceValue: number;
  buyPriceValid: boolean | null;

  buyMileageValue: number;
  buyMileageValid: boolean | null;
}

type FormAction =
  | { type: 'SET_VEHICLE_NAME'; value: string }
  | { type: 'SET_VEHICLE_MODEL'; value: string }
  | { type: 'SET_PRODUCTED_YEAR'; value: number }
  | { type: 'SET_BUY_DATE'; value: string }
  | { type: 'SET_BUY_PRICE'; value: number }
  | { type: 'SET_BUY_MILEAGE'; value: number }
  | { type: 'RESET_STATE' };

const currentYear = new Date().getFullYear();

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_VEHICLE_NAME':
      const trimmedValue = action.value.trim();

      return {
        ...state,
        vehicleNameValue: action.value.trim(),
        vehicleNameValid: trimmedValue.length >= 3,
      };
    case 'SET_VEHICLE_MODEL':
      const trimmedModel = action.value.trim();
      return {
        ...state,
        vehicleModelValue: action.value.trim(),
        vehicleModelValid: trimmedModel.length > 0,
      };
    case 'SET_PRODUCTED_YEAR':
      return {
        ...state,
        productedYearValue: action.value,
        productedYearValid: action.value > 1890 && action.value <= currentYear,
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
        buyPriceValid: action.value >= 0,
      };
    case 'SET_BUY_MILEAGE':
      return {
        ...state,
        buyMileageValue: action.value,
        buyMileageValid: action.value >= 0,
      };
    case 'RESET_STATE':
      return {
        vehicleNameValue: '',
        vehicleNameValid: null,

        vehicleModelValue: '',
        vehicleModelValid: null,

        productedYearValue: -1,
        productedYearValid: null,

        buyDateValue: '',
        buyDateValid: null,

        buyPriceValue: -1,
        buyPriceValid: null,

        buyMileageValue: -1,
        buyMileageValid: null,
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

    productedYearValue: -1,
    productedYearValid: null,

    buyDateValue: '',
    buyDateValid: null,

    buyPriceValue: -1,
    buyPriceValid: null,

    buyMileageValue: -1,
    buyMileageValid: null,
  });

  const db = useSQLiteContext();
  const [isVisible, setIsVisible] = useState<boolean>(false);

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

  const saveVehicle = async () => {
    const {
      vehicleNameValue: name,
      vehicleModelValue: model,
      productedYearValue: productedYear,
      buyDateValue: buyDate,
      buyPriceValue: buyPrice,
      buyMileageValue: buyMileage,
    } = formState;

    const isFormValid: boolean | null =
      formState.vehicleNameValid &&
      formState.vehicleModelValid &&
      formState.buyPriceValid &&
      formState.buyMileageValid;

    if (!isFormValid) {
      dispatchForm({ type: 'SET_VEHICLE_NAME', value: name });
      dispatchForm({ type: 'SET_VEHICLE_MODEL', value: model });
      dispatchForm({ type: 'SET_PRODUCTED_YEAR', value: productedYear });
      dispatchForm({ type: 'SET_BUY_DATE', value: buyDate });
      dispatchForm({ type: 'SET_BUY_PRICE', value: buyPrice });
      dispatchForm({ type: 'SET_BUY_MILEAGE', value: buyMileage });

      console.log(name, model, buyPrice, buyMileage);
    } else {
      db.withTransactionAsync(async () => {
        await db
          .runAsync(
            `INSERT INTO vehicles (name, model, producted_year, buy_date, buy_price, is_sold, buy_mileage, current_mileage) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              name,
              model,
              productedYear,
              buyDate,
              buyPrice,
              0,
              buyMileage,
              buyMileage,
            ]
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

              <PrimaryInput
                placeholder='Year of production...'
                value={formState.productedYearValue.toString()}
                isValid={formState.productedYearValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_PRODUCTED_YEAR',
                    value: parseInt(text),
                  })
                }
                inputMode='numeric'
                keyboardType='number-pad'
              />

              <DateInput
                title='Buy date'
                isValid={formState.buyDateValid}
                onDataSet={(data) =>
                  dispatchForm({ type: 'SET_BUY_DATE', value: data })
                }
              />

              <PrimaryInput
                placeholder='Buy price...'
                inputMode='decimal'
                keyboardType='number-pad'
                value={formState.buyPriceValue.toString()}
                isValid={formState.buyPriceValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_BUY_PRICE',
                    value: parseFloat(text),
                  })
                }
              />
              <PrimaryInput
                placeholder='Mileage...'
                inputMode='decimal'
                keyboardType='number-pad'
                value={formState.buyMileageValue.toString()}
                isValid={formState.buyMileageValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_BUY_MILEAGE',
                    value: parseFloat(text),
                  })
                }
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title='Close'
              onPress={closeModal}
            />
            <PrimaryButton
              title='Confirm'
              onPress={saveVehicle}
              btnColor={{ color: 'green', intensity: 400 }}
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
