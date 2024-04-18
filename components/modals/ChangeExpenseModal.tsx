import { useEffect, useReducer, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import ModalCard from './ModalCard';

import { ExpensesTab, VehiclesTab } from '../../utils/types';
import { expenseReducer } from './modalsReducers/expenseReducer';
import PrimaryButton from '../ui/buttons/PrimaryButton';
import PrimaryInput from '../ui/inputs/PrimaryInput';

interface ChangeExpenseModalProps {
  expenseDetails: ExpensesTab;
  isChanged?: (changed: boolean) => void;

  isVisible: boolean;
  onModal: (visible: boolean) => void;
}

export default function ChangeExpenseModal({
  expenseDetails,
  isChanged,
  isVisible,
  onModal,
}: ChangeExpenseModalProps) {
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

  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log(expenseDetails);

    setModalIsVisible(isVisible);
  }, [isVisible]);

  const closeModal = () => {
    setModalIsVisible(false);
    onModal(false);
  };

  return (
    <ModalCard
      isConfirm={true}
      isModalVisible={modalIsVisible}
      onModal={onModal}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: 'center', width: 320 }}
      >
        <PrimaryButton
          title='Delete'
          onPress={() => {}}
          btnColor={{ color: 'red', intensity: 400 }}
        />

        <PrimaryInput placeholder={`Expense name: `} />
      </ScrollView>
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  container: {},
});
