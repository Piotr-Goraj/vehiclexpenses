import React, { useState, useEffect, useReducer } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import ModalCard from './ModalCard';
import { VehiclesTab } from '../../utils/types';

import PrimaryInput from '../ui/inputs/PrimaryInput';
import IsVehicleSoldButton from '../ui/buttons/IsVehicleSoldButton';
import DateInput from '../ui/inputs/DateInput';

interface FormState {
  productionYearValue: number;
  productionYearValid: boolean | null;

  vehicleNameValue: string;
  vehicleNameValid: boolean | null;

  vehicleModelValue: string;
  vehicleModelValid: boolean | null;

  buyDateValue: string;
  buyDateValid: boolean | null;

  buyPriceValue: number;
  buyPriceValid: boolean | null;

  buyMileageValue: number;
  buyMileageValid: boolean | null;

  currentMileageValue: number;
  currentMileageValid: boolean | null;

  soldDateValue: string;
  soldDateValid: boolean | null;

  soldPriceValue: number;
  soldPriceValid: boolean | null;
}

type FormAction =
  | { type: 'SET_PRODUCTION_YEAR'; value: number }
  | { type: 'SET_VEHICLE_NAME'; value: string }
  | { type: 'SET_VEHICLE_MODEL'; value: string }
  | { type: 'SET_BUY_DATE'; value: string }
  | { type: 'SET_BUY_PRICE'; value: number }
  | { type: 'SET_BUY_MILEAGE'; value: number }
  | { type: 'SET_CURRENT_MILEAGE'; value: number }
  | { type: 'SET_SOLD_DATE'; value: string }
  | { type: 'SET_SOLD_PRICE'; value: number }
  | { type: 'RESET_STATE' };

const currentYear = new Date().getFullYear();

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case 'SET_PRODUCTION_YEAR':
      return {
        ...state,
        productionYearValue: action.value,
        productionYearValid: action.value > 1890 && action.value <= currentYear,
      };
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
        buyPriceValue: action.value,
        buyPriceValid: action.value >= 0,
      };
    case 'SET_BUY_MILEAGE':
      return {
        ...state,
        buyMileageValue: action.value,
        buyMileageValid: action.value >= 0,
      };
    case 'SET_CURRENT_MILEAGE':
      return {
        ...state,
        currentMileageValue: action.value,
        currentMileageValid: action.value >= state.buyMileageValue,
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
        soldPriceValue: action.value,
        soldPriceValid: action.value >= 0,
      };
    case 'RESET_STATE':
      return {
        productionYearValue: -1,
        productionYearValid: null,

        vehicleNameValue: '',
        vehicleNameValid: null,

        vehicleModelValue: '',
        vehicleModelValid: null,

        buyDateValue: '',
        buyDateValid: null,

        buyPriceValue: -1,
        buyPriceValid: null,

        buyMileageValue: -1,
        buyMileageValid: null,

        currentMileageValue: -1,
        currentMileageValid: null,

        soldDateValue: '',
        soldDateValid: null,

        soldPriceValue: -1,
        soldPriceValid: null,
      };
    default:
      return state;
  }
};

interface VehicleInfoProps {
  vehicle: VehiclesTab;
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
    productionYearValue: -1,
    productionYearValid: null,

    vehicleNameValue: '',
    vehicleNameValid: null,

    vehicleModelValue: '',
    vehicleModelValid: null,

    buyDateValue: '',
    buyDateValid: null,

    buyPriceValue: -1,
    buyPriceValid: null,

    buyMileageValue: -1,
    buyMileageValid: null,

    currentMileageValue: -1,
    currentMileageValid: null,

    soldDateValue: '',
    soldDateValid: null,

    soldPriceValue: -1,
    soldPriceValid: null,
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSold, setIsSold] = useState<boolean>(
    vehicle.is_sold === 0 ? false : true
  );

  useEffect(() => {
    setIsVisible(isModalVisible);

    dispatchForm({
      type: 'SET_PRODUCTION_YEAR',
      value: vehicle.producted_year,
    });
    dispatchForm({ type: 'SET_VEHICLE_NAME', value: vehicle.name });
    dispatchForm({ type: 'SET_VEHICLE_MODEL', value: vehicle.model });
    dispatchForm({ type: 'SET_BUY_DATE', value: vehicle.buy_date });
    dispatchForm({
      type: 'SET_BUY_PRICE',
      value: vehicle.buy_price,
    });
    dispatchForm({
      type: 'SET_BUY_MILEAGE',
      value: vehicle.buy_mileage,
    });
    dispatchForm({
      type: 'SET_CURRENT_MILEAGE',
      value: vehicle.current_mileage,
    });

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
      dispatchForm({ type: 'SET_SOLD_PRICE', value: -1 });
      dispatchForm({ type: 'SET_SOLD_DATE', value: '' });
    }
  };

  const updateVehicleInfo = async () => {
    const {
      productionYearValue,
      vehicleNameValue,
      vehicleModelValue,
      buyDateValue,
      buyPriceValue,
      buyMileageValue,
      currentMileageValue,
      soldPriceValue,
      soldDateValue,
    } = formState;

    const {
      productionYearValid,
      vehicleNameValid,
      vehicleModelValid,
      buyDateValid,
      buyPriceValid,
      buyMileageValid,
      currentMileageValid,
      soldPriceValid,
      soldDateValid,
    } = formState;

    const vehicleIsSold = isSold === true ? 1 : 0;

    const notSoldUpdate =
      productionYearValid &&
      vehicleNameValid &&
      vehicleModelValid &&
      buyDateValid &&
      buyPriceValid &&
      buyMileageValid &&
      currentMileageValid;

    const soldUpdate = soldPriceValid && soldDateValid;

    if (isSold && !soldUpdate) {
      dispatchForm({ type: 'SET_SOLD_DATE', value: soldDateValue });
      dispatchForm({ type: 'SET_SOLD_PRICE', value: soldPriceValue });
    } else if (isSold && soldUpdate && !notSoldUpdate) {
      dispatchForm({ type: 'SET_PRODUCTION_YEAR', value: productionYearValue });
      dispatchForm({ type: 'SET_VEHICLE_NAME', value: vehicleNameValue });
      dispatchForm({ type: 'SET_VEHICLE_MODEL', value: vehicleModelValue });
      dispatchForm({ type: 'SET_BUY_DATE', value: buyDateValue });
      dispatchForm({ type: 'SET_BUY_PRICE', value: buyPriceValue });
      dispatchForm({ type: 'SET_BUY_MILEAGE', value: buyMileageValue });
      dispatchForm({ type: 'SET_CURRENT_MILEAGE', value: currentMileageValue });
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
          `UPDATE vehicles SET producted_year = ?, name = ?, model = ?, buy_date = ?, buy_price = ?, buy_mileage = ?, current_mileage = ?, is_sold = ?, sold_price = ?, sold_date = ?  WHERE id = ?;`,
          [
            productionYearValue,
            vehicleNameValue,
            vehicleModelValue,
            buyDateValue,
            buyPriceValue,
            buyMileageValue,
            currentMileageValue,
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
            placeholder={`Year of production: ${vehicle.producted_year}`}
            value={formState.productionYearValue.toString()}
            isValid={formState.productionYearValid}
            onTextChange={(text) =>
              dispatchForm({
                type: 'SET_PRODUCTION_YEAR',
                value: parseInt(text),
              })
            }
            inputMode='numeric'
            keyboardType='number-pad'
          />

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
            placeholder={`Buy mileage: ${vehicle.buy_mileage}`}
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

          <PrimaryInput
            placeholder={`Current mileage: ${vehicle.current_mileage}`}
            inputMode='decimal'
            keyboardType='number-pad'
            value={formState.currentMileageValue.toString()}
            isValid={formState.currentMileageValid}
            onTextChange={(text) =>
              dispatchForm({
                type: 'SET_CURRENT_MILEAGE',
                value: parseFloat(text),
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
                value={formState.soldPriceValue.toString()}
                isValid={formState.soldPriceValid}
                onTextChange={(text) =>
                  dispatchForm({
                    type: 'SET_SOLD_PRICE',
                    value: parseFloat(text),
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
