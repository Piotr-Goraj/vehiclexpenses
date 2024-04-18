import { StyleSheet, FlatList, Pressable } from 'react-native';

import VehicleExpenseDetails from '../Vehicles/VehicleExpenseDetails';
import AddExpenseModal from '../modals/AddExpenseModal';

import DetailsCard from '../ui/cards/DetailsCard';

import { ExpenseTypeTab, ExpensesTab, VehiclesTab } from '../../utils/types';
import { useEffect, useState } from 'react';
import ChangeExpenseModal from '../modals/ChangeExpenseModal';

interface ExpensesContainerProps {
  vehicle?: VehiclesTab;

  expenses: ExpensesTab[];
  expenseTypes: ExpenseTypeTab[];

  isChanged?: (isChanged: boolean) => void;
}

export default function ExpensesContainer({
  vehicle,
  expenses,
  expenseTypes,
  isChanged,
}: ExpensesContainerProps) {
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [modalChangeIsVisible, setModalChangeIsVisible] =
    useState<boolean>(false);
  const [expenseDetails, setExpenseDetails] = useState<ExpensesTab>({
    id: -1,
    vehicle_id: -1,
    name: '',
    type: -1,
    price: -1,
    date: '',
  });

  return (
    <>
      <AddExpenseModal
        vehicle={vehicle}
        onModal={setModalIsVisible}
        isVisible={modalIsVisible}
        isChanged={isChanged}
      />

      <ChangeExpenseModal
        expenseDetails={expenseDetails}
        onModal={setModalChangeIsVisible}
        isVisible={modalChangeIsVisible}
      />

      <DetailsCard
        cardColor={{ color: 'cyan', intensity: 500 }}
        title='Expenses'
        titlePosition={{ width: 100, left: 130 }}
        buttonType='add'
        buttonColor={{ color: 'green', intensity: 400 }}
        onPress={() => {
          setModalIsVisible(true);
        }}
      >
        <FlatList
          nestedScrollEnabled={true}
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setModalChangeIsVisible(true);
                setExpenseDetails(item);
              }}
            >
              <VehicleExpenseDetails
                expenseDetails={item}
                expenseTypes={expenseTypes}
              />
            </Pressable>
          )}
        />
      </DetailsCard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
