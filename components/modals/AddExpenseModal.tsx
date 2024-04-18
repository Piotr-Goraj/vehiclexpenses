import { StyleSheet, View, Text, ScrollView } from 'react-native';
import ModalCard from './ModalCard';
import { useEffect, useReducer, useState } from 'react';

import PrimaryInput from '../ui/inputs/PrimaryInput';
import DateInput from '../ui/inputs/DateInput';
import { expenseReducer } from './modalsReducers/expenseReducer';
import { roundNumber } from '../../utils/roundNumber';
import { ExpenseTypeTab, VehiclesTab, tablesNames } from '../../utils/types';
import PrimaryDropdown from '../ui/PrimaryDropdown';
import { useSQLiteContext } from 'expo-sqlite/next';

interface AddExpenseModalProps {
  vehicle?: VehiclesTab;
  isChanged?: (changed: boolean) => void;

  isVisible: boolean;
  onModal: (visible: boolean) => void;
}

export default function AddExpenseModal({
  vehicle,
  isChanged,
  onModal,
  isVisible,
}: AddExpenseModalProps) {
  const [formState, dispatchForm] = useReducer(expenseReducer, {
    selectedVehicle: { id: -1, name: '' },

    nameValue: '',
    nameValid: null,

    expenseType: { id: -1, name: '' },

    priceValue: -1,
    priceValid: null,

    dateValue: '',
    dateValid: null,
  });

  interface VehiclesUseState {
    id: number;
    label: string;
  }
  const [vehicles, setVehicles] = useState<VehiclesUseState[]>([]);
  const [types, setTypes] = useState<ExpenseTypeTab[]>([]);
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [isDropdownVehicleFocus, setIsDropdownVehicleFocus] =
    useState<boolean>(false);
  const [isDropdownTypesFocus, setIsDropdownTypesFocus] =
    useState<boolean>(false);

  const closeModal = () => {
    setModalIsVisible(false);
    onModal(false);
  };

  const db = useSQLiteContext();

  useEffect(() => {
    setModalIsVisible(isVisible);

    return () => {
      dispatchForm({ type: 'RESET_STATE' });
    };
  }, [isVisible]);

  const getVehicles = () => {
    const result = db.getAllSync<VehiclesTab>(
      `SELECT * FROM ${tablesNames.vehicles}`,
      []
    );

    const vehicleTable = [];
    for (const key of result) {
      vehicleTable.push({
        id: key.id,
        label: `${key.name} ${key.model}`,
      });
    }

    setVehicles(vehicleTable);
  };

  const getExpenseTypes = () => {
    const result = db.getAllSync<ExpenseTypeTab>(
      `SELECT * FROM ${tablesNames.expense_type}`
    );

    setTypes(result);
  };

  useEffect(() => {
    db.withTransactionSync(() => {
      getVehicles();
      getExpenseTypes();
    });
  }, []);

  const expenseConfirmHandler = () => {
    const { selectedVehicle, nameValue, expenseType, priceValue, dateValue } =
      formState;

    const { dateValid, nameValid, priceValid } = formState;

    const isFormValid =
      dateValid &&
      nameValid &&
      priceValid &&
      (vehicle || selectedVehicle.id !== -1);

    if (isFormValid) {
      db.runSync(
        `INSERT INTO ${tablesNames.expenses} (vehicle_id, name, type, price, date) VALUES (?, ?, ?, ?, ?)`,
        [
          vehicle ? vehicle.id : selectedVehicle.id,
          nameValue,
          expenseType.id,
          priceValue,
          dateValue,
        ]
      );
      if (isChanged) isChanged(true);
      closeModal();
    } else {
      dispatchForm({ type: 'SET_DATE', value: dateValue });
      dispatchForm({ type: 'SET_EXPENSE_NAME', value: nameValue });
      dispatchForm({ type: 'SET_EXPENSE_TYPE', value: expenseType });
      dispatchForm({ type: 'SET_PRICE', value: priceValue });
      dispatchForm({ type: 'SET_VEHICLE', value: selectedVehicle });

      console.error('New expanse form is invalid!');
    }
  };

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={modalIsVisible}
      isConfirm={true}
      onConfirm={expenseConfirmHandler}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {vehicle && (
          <Text>{`Add expense for ${vehicle.name} ${vehicle.model} `}</Text>
        )}

        {!vehicle && (
          <PrimaryDropdown
            title='Vehicle'
            isDropdownFocus={isDropdownVehicleFocus}
            data={vehicles}
            labelField='label'
            valueField='id'
            selectedPlaceholder={formState.selectedVehicle.name}
            value={formState.selectedVehicle.id.toString()}
            onFocus={() => setIsDropdownVehicleFocus(true)}
            onBlur={() => () => setIsDropdownVehicleFocus(false)}
            onChange={(item) => {
              dispatchForm({
                type: 'SET_VEHICLE',
                value: {
                  id: item.id,
                  name: item.label,
                },
              });
              setIsDropdownVehicleFocus(false);
            }}
          />
        )}

        <PrimaryInput
          placeholder='Expense name'
          isValid={formState.nameValid}
          value={formState.nameValue}
          onTextChange={(text) =>
            dispatchForm({ type: 'SET_EXPENSE_NAME', value: text })
          }
        />

        <PrimaryDropdown
          title='Expense type'
          isDropdownFocus={isDropdownTypesFocus}
          data={types}
          labelField='type_name'
          valueField='id'
          selectedPlaceholder={formState.expenseType.name}
          value={formState.expenseType.id.toString()}
          onFocus={() => setIsDropdownTypesFocus(true)}
          onBlur={() => () => setIsDropdownTypesFocus(false)}
          onChange={(item) => {
            dispatchForm({
              type: 'SET_EXPENSE_TYPE',
              value: {
                id: item.id,
                name: item.type_name,
              },
            });
            setIsDropdownTypesFocus(false);
          }}
        />

        <PrimaryInput
          placeholder='How much it cost?'
          isValid={formState.priceValid}
          value={formState.priceValue.toString()}
          onTextChange={(text) =>
            dispatchForm({
              type: 'SET_PRICE',
              value: roundNumber(parseFloat(text)),
            })
          }
          inputMode='decimal'
          keyboardType='decimal-pad'
        />

        <DateInput
          title='Buy date'
          isValid={formState.dateValid}
          onDataSet={(data) => dispatchForm({ type: 'SET_DATE', value: data })}
        />
      </ScrollView>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  container: {},
});
