import React, { useState, useEffect, useReducer } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import ModalCard from './ModalCard';
import { VehicleProps } from '../../utils/types';

import PrimaryInput from '../ui/inputs/PrimaryInput';
import IsVehicleSoldButton from '../ui/buttons/IsVehicleSoldButton';
import DateInput from '../ui/inputs/DateInput';

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
  soldDateValue: string;
  soldDateValid: boolean | null;
  soldPriceValue: string;
  soldPriceValid: boolean | null;
}

type FormAction =
  | { type: 'SET_VEHICLE_NAME'; value: string }
  | { type: 'SET_VEHICLE_MODEL'; value: string }
  | { type: 'SET_BUY_DATE'; value: string }
  | { type: 'SET_BUY_PRICE'; value: string }
  | { type: 'SET_MILEAGE'; value: string }
  | { type: 'SET_SOLD_DATE'; value: string }
  | { type: 'SET_SOLD_PRICE'; value: string }
  | { type: 'RESET_STATE' };

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
    case 'SET_BUY_DATE':
      return {
        ...state,
        buyDateValue: action.value,
        buyDateValid: action.value.length > 0,
      };
    case 'SET_BUY_PRICE':
      return {
        ...state,
        buyPriceValue: action.value.trim(),
        buyPriceValid: parseFloat(action.value) >= 0,
      };
    case 'SET_MILEAGE':
      return {
        ...state,
        mileageValue: action.value.trim(),
        mileageValid: parseFloat(action.value) >= 0,
      };
    case 'SET_SOLD_DATE':
      return {
        ...state,
        soldDateValue: action.value,
        soldDateValid: action.value.length > 0,
      };
    case 'SET_SOLD_PRICE':
      return {
        ...state,
        soldPriceValue: action.value.trim(),
        soldPriceValid: parseFloat(action.value) >= 0,
      };
    case 'RESET_STATE':
      return {
        vehicleNameValue: '',
        vehicleNameValid: null,
        vehicleModelValue: '',
        vehicleModelValid: null,
        buyDateValue: '',
        buyDateValid: null,
        buyPriceValue: '',
        buyPriceValid: null,
        mileageValue: '',
        mileageValid: null,
        soldDateValue: '',
        soldDateValid: null,
        soldPriceValue: '',
        soldPriceValid: null,
      };
    default:
      return state;
  }
};

interface VehicleInfoProps {
  vehicle: VehicleProps;
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
}

export default function VehicleInfoModal({
  vehicle,
  isModalVisible,
  onModal,
}: VehicleInfoProps) {
  const db = useSQLiteContext();

  const [formState, dispatchForm] = useReducer(formReducer, {
    vehicleNameValue: '',
    vehicleNameValid: null,
    vehicleModelValue: '',
    vehicleModelValid: null,
    buyDateValue: '',
    buyDateValid: null,
    buyPriceValue: '',
    buyPriceValid: null,
    mileageValue: '',
    mileageValid: null,
    soldDateValue: '',
    soldDateValid: null,
    soldPriceValue: '',
    soldPriceValid: null,
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSold, setIsSold] = useState<boolean>(
    vehicle.is_sold === 0 ? false : true
  );

  useEffect(() => {
    setIsVisible(isModalVisible);

    dispatchForm({ type: 'SET_VEHICLE_NAME', value: vehicle.name });
    dispatchForm({ type: 'SET_VEHICLE_MODEL', value: vehicle.model });
    dispatchForm({ type: 'SET_BUY_DATE', value: vehicle.buy_date });
    dispatchForm({
      type: 'SET_BUY_PRICE',
      value: vehicle.buy_price.toString(),
    });
    dispatchForm({ type: 'SET_MILEAGE', value: vehicle.mileage.toString() });

    return () => {
      setIsSold(vehicle.is_sold === 0 ? false : true);
      dispatchForm({ type: 'RESET_STATE' });
    };
  }, [isModalVisible, vehicle]);

  const closeModal = () => {
    setIsVisible(false);
    onModal(false);
  };

  const onSoldChangeHandler = (isSold: boolean) => {
    setIsSold(isSold);

    if (!isSold) {
      dispatchForm({ type: 'SET_SOLD_PRICE', value: '' });
      dispatchForm({ type: 'SET_SOLD_DATE', value: '' });
    }
  };

  const updateVehicleInfo = async () => {
    const {
      vehicleNameValue,
      vehicleModelValue,
      buyDateValue,
      buyPriceValue,
      mileageValue,
      soldPriceValue,
      soldDateValue,
    } = formState;

    const {
      vehicleNameValid,
      vehicleModelValid,
      buyDateValid,
      buyPriceValid,
      mileageValid,
      soldPriceValid,
      soldDateValid,
    } = formState;

    const vehicleIsSold = isSold === true ? 1 : 0;

    const notSoldUpdate =
      vehicleNameValid &&
      vehicleModelValid &&
      buyDateValid &&
      buyPriceValid &&
      mileageValid;

    const soldUpdate = soldPriceValid && soldDateValid;

    if (isSold && !soldUpdate) {
      dispatchForm({ type: 'SET_SOLD_DATE', value: soldDateValue });
      dispatchForm({ type: 'SET_SOLD_PRICE', value: soldPriceValue });
    } else if (isSold && soldUpdate && !notSoldUpdate) {
      dispatchForm({ type: 'SET_VEHICLE_NAME', value: vehicleNameValue });
      dispatchForm({ type: 'SET_VEHICLE_MODEL', value: vehicleModelValue });
      dispatchForm({ type: 'SET_BUY_DATE', value: buyDateValue });
      dispatchForm({ type: 'SET_BUY_PRICE', value: buyPriceValue });
      dispatchForm({ type: 'SET_MILEAGE', value: mileageValue });
    } else {
      // console.log(
      // vehicleNameValue,
      // vehicleModelValue,
      // buyDateValue,
      // buyPriceValue,
      // mileageValue,
      // vehicleIsSold,
      // soldPriceValue,
      // soldDateValue
      // );

      await db
        .runAsync(
          `UPDATE vehicles SET name = ?, model = ?, buy_date = ?, buy_price = ?, mileage = ?, is_sold = ?, sold_price = ?, sold_date = ?  WHERE id = ?;`,
          [
            vehicleNameValue,
            vehicleModelValue,
            buyDateValue,
            buyPriceValue,
            mileageValue,
            vehicleIsSold,
            soldPriceValue,
            soldDateValue,
            vehicle.id,
          ]
        )
        .then(() => closeModal())
        .catch((error) => console.error(error));
    }
  };

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={isVisible}
      isConfirm={true}
      onConfirm={updateVehicleInfo}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: 320, alignItems: 'center' }}>
          <PrimaryInput
            placeholder={`Name: ${vehicle.name}`}
            value={formState.vehicleNameValue}
            isValid={formState.vehicleNameValid}
            onTextChange={(text) =>
              dispatchForm({ type: 'SET_VEHICLE_NAME', value: text })
            }
          />
          <PrimaryInput
            placeholder={`Model: ${vehicle.model}`}
            value={formState.vehicleModelValue}
            isValid={formState.vehicleModelValid}
            onTextChange={(text) =>
              dispatchForm({
                type: 'SET_VEHICLE_MODEL',
                value: text,
              })
            }
          />

          <DateInput
            title='Buy date'
            isValid={formState.buyDateValid}
            onDataSet={(date) => {
              dispatchForm({ type: 'SET_BUY_DATE', value: date });
            }}
            defaultDate={vehicle.buy_date}
          />

          <PrimaryInput
            placeholder={`Buy price: ${vehicle.buy_price} PLN`}
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
            placeholder={`Mileage: ${vehicle.mileage}`}
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

          <IsVehicleSoldButton
            onSold={onSoldChangeHandler}
            isSold={isSold}
          />
          {isSold && (
            <>
              <DateInput
                title='Sold date'
                isValid={formState.soldDateValid}
                onDataSet={(date) => {
                  dispatchForm({ type: 'SET_SOLD_DATE', value: date });
                }}
                defaultDate={vehicle.sold_date || vehicle.buy_date}
              />

              <PrimaryInput
                placeholder={`Sold price: ${vehicle.sold_price} PLN`}
                inputMode='decimal'
                keyboardType='number-pad'
                value={formState.soldPriceValue}
                isValid={formState.soldPriceValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_SOLD_PRICE',
                    value: text,
                  })
                }
              />
            </>
          )}
        </View>
      </ScrollView>
    </ModalCard>
  );
}

const styles = StyleSheet.create({});
