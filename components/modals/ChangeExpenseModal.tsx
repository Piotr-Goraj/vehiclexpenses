import { useEffect, useReducer, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import ModalCard from './ModalCard';

import {
  ExpenseTypeTab,
  ExpensesTab,
  VehiclesTab,
  tablesNames,
} from '../../utils/types';
import { expenseReducer } from './modalsReducers/expenseReducer';
import PrimaryButton from '../ui/buttons/PrimaryButton';
import PrimaryInput from '../ui/inputs/PrimaryInput';
import DateInput from '../ui/inputs/DateInput';
import PrimaryDropdown from '../ui/PrimaryDropdown';
import { roundNumber } from '../../utils/roundNumber';
import { useSQLiteContext } from 'expo-sqlite/next';

interface ChangeExpenseModalProps {
  expenseDetails: ExpensesTab;
  expenseTypes: ExpenseTypeTab[];
  isChanged?: (changed: boolean) => void;

  isVisible: boolean;
  onModal: (visible: boolean) => void;
}

export default function ChangeExpenseModal({
  expenseDetails,
  expenseTypes,
  isChanged,
  isVisible,
  onModal,
}: ChangeExpenseModalProps) {
  const [formState, dispatchForm] = useReducer(expenseReducer, {
    selectedVehicle: { id: -1, name: '' },

    nameValue: '',
    nameValid: null,

    expenseType: { id: -1, name: '' },

    priceValue: 0,
    priceValid: null,

    dateValue: '',
    dateValid: null,
  });

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [isDropdownTypesFocus, setIsDropdownTypesFocus] =
    useState<boolean>(false);

  const db = useSQLiteContext();

  useEffect(() => {
    setModalIsVisible(isVisible);

    dispatchForm({ type: 'SET_EXPENSE_NAME', value: expenseDetails.name });
    dispatchForm({
      type: 'SET_EXPENSE_TYPE',
      value: {
        id: expenseDetails.type,
        name:
          expenseTypes.find((type) => type.id === expenseDetails.type)
            ?.type_name || '',
      },
    });
    dispatchForm({ type: 'SET_PRICE', value: expenseDetails.price });
    dispatchForm({ type: 'SET_DATE', value: expenseDetails.date });

    return () => dispatchForm({ type: 'RESET_STATE' });
  }, [isVisible]);

  const closeModal = () => {
    setModalIsVisible(false);
    onModal(false);
  };

  const onDeleteHandler = () => {
    db.runSync(`DELETE FROM ${tablesNames.expenses} WHERE id = ?`, [
      expenseDetails.id,
    ]);
    closeModal();
  };

  const onConfirmHandler = () => {
    const { nameValue, expenseType, priceValue, dateValue } = formState;
    const { nameValid, priceValid, dateValid } = formState;

    const isFormValid =
      nameValid && expenseType.name !== '' && priceValid && dateValid;

    if (isFormValid) {
      db.runSync(
        `UPDATE ${tablesNames.expenses} SET name = ?, type = ?, price = ?, date = ? WHERE id = ?`,
        [nameValue, expenseType.id, priceValue, dateValue, expenseDetails.id]
      );

      closeModal();
    } else {
      console.error('Expense change form invalid');
    }
  };

  return (
    <ModalCard
      isConfirm={true}
      onConfirm={onConfirmHandler}
      isModalVisible={modalIsVisible}
      onModal={onModal}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center', width: 320 }}
      >
        <PrimaryButton
          title='Delete'
          onPress={onDeleteHandler}
          btnColor={{ color: 'red', intensity: 400 }}
        />

        <PrimaryInput
          placeholder={`Expense name: ${formState.nameValue}`}
          isValid={formState.nameValid}
          value={formState.nameValue}
          onTextChange={(text) =>
            dispatchForm({ type: 'SET_EXPENSE_NAME', value: text })
          }
        />

        <PrimaryDropdown
          title='Expense type'
          isDropdownFocus={isDropdownTypesFocus}
          data={expenseTypes}
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
          placeholder={`Price: ${expenseDetails.price} `}
          isValid={formState.priceValid}
          value={formState.priceValue.toString()}
          onTextChange={(text) =>
            dispatchForm({ type: 'SET_PRICE', value: roundNumber(text) })
          }
          inputMode='decimal'
          keyboardType='decimal-pad'
        />

        <DateInput
          title='Expense date'
          isValid={formState.dateValid}
          onDataSet={(date) => dispatchForm({ type: 'SET_DATE', value: date })}
          defaultDate={formState.dateValue}
        />
      </ScrollView>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  container: {},
});
