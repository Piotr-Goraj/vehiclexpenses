import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, LogBox } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import {
  ExpenseTypeTab,
  ExpensesTab,
  PieChartDataProps,
  VehicleColorsProps,
  tablesNames,
} from '../utils/types';
import colors from '../utils/colors';
import { getRandomColor } from '../utils/randomColor';

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

  const pieChartData: PieChartDataProps[] = [];
  expensesTypes.forEach((expenseType) => {
    const expensesOfType = expenses.filter(
      (expense) => expense.type === expenseType.id
    );
    const totalExpenseOfType = expensesOfType.reduce(
      (acc, expense) => acc + expense.price,
      0
    );
    pieChartData.push({
      name: expenseType.type_name,
      value: totalExpenseOfType,
      color:
        expenseType.type_name === 'gas'
          ? colors.red[300]
          : expenseType.type_name === 'mechanic'
          ? colors.blue[200]
          : expenseType.type_name === 'exploitation'
          ? colors.magenta[400]
          : expenseType.type_name === 'visuals'
          ? colors.cyan[200]
          : expenseType.type_name === 'incomes'
          ? colors.green[400]
          : expenseType.type_name === 'fees'
          ? colors.yellow[400]
          : getRandomColor(),
    });
  });

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

      <PieChartCard
        title='Expenses types'
        titlePosition={{ width: 140, left: 110 }}
        data={pieChartData}
        cardColor={{ color: 'cyan', intensity: 500 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
