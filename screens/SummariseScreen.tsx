import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, LogBox } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import {
  ExpenseTypeTab,
  ExpensesTab,
  VehicleColorsProps,
  tablesNames,
} from '../utils/types';

import ExpensesContainer from '../components/Summarise/ExpensesContainer';
import PieChartCard from '../components/PieChartCard';

export default function SummariseScreen() {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const db = useSQLiteContext();

  const [expenses, setExpenses] = useState<ExpensesTab[]>([]);
  const [expensesTypes, setExpensesTypes] = useState<ExpenseTypeTab[]>([]);
  const [vehicleColors, setVehicleColors] = useState<VehicleColorsProps[]>([]);

  const getExpenses = () => {
    const expenses = db.getAllSync<ExpensesTab>(
      `SELECT * FROM ${tablesNames.expenses}  ORDER BY date DESC;`
    );
    const expensesTypes = db.getAllSync<ExpenseTypeTab>(
      `SELECT * FROM ${tablesNames.expense_type};`
    );

    setExpenses(expenses);
    setExpensesTypes(expensesTypes);
  };

  const getVehicleColors = () => {
    const result = db.getAllSync<VehicleColorsProps>(
      `SELECT id, color, name FROM ${tablesNames.vehicles};`
    );

    setVehicleColors(result);
  };

  useEffect(() => {
    getExpenses();
    getVehicleColors();
  }, [db]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
    >
      <ExpensesContainer
        expenses={expenses}
        expenseTypes={expensesTypes}
        isChanged={() => {}}
        height={300}
        vehiclesColors={vehicleColors}
      />

      <PieChartCard cardColor={{ color: 'cyan', intensity: 500 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
