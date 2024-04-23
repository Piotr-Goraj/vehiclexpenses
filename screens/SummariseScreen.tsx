import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, LogBox, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import {
  BarDataProps,
  ExpenseTypeTab,
  ExpensesTab,
  LegendProps,
  PieChartDataProps,
  VehicleColorsProps,
  tablesNames,
} from '../utils/types';
import colors from '../utils/colors';
import { getRandomColor } from '../utils/randomColor';

import ExpensesContainer from '../components/Summarise/ExpensesContainer';
import PieChartCard from '../components/Charts/PieChartCard';
import BarChartCard from '../components/Charts/BarChartCard';

export default function SummariseScreen() {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const db = useSQLiteContext();

  const [expenses, setExpenses] = useState<ExpensesTab[]>([]);
  const [expensesTypes, setExpensesTypes] = useState<ExpenseTypeTab[]>([]);
  const [vehicleColors, setVehicleColors] = useState<VehicleColorsProps[]>([]);
  const [expensesChanged, setExpensesChanged] = useState<boolean>(false);

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
  }, [db, expensesChanged]);

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

  const barData: BarDataProps[] = [];

  const monthlyExpenses: {
    [month: string]: { price: number; vehicle_id: number }[];
  } = {};

  expenses.forEach((expense) => {
    const [year, month] = expense.date.split('-').slice(0, 2);
    const dateKey = `${year}-${month}`;

    if (!monthlyExpenses[dateKey]) {
      monthlyExpenses[dateKey] = [];
    }

    // Check if there is already an entry for the same vehicle in a given month
    const existingExpenseIndex = monthlyExpenses[dateKey].findIndex(
      (item) => item.vehicle_id === expense.vehicle_id
    );

    if (existingExpenseIndex !== -1) {
      // If exists, update the price value
      monthlyExpenses[dateKey][existingExpenseIndex].price += expense.price;
    } else {
      // If it does not exist, add a new entry
      monthlyExpenses[dateKey].push({
        price: expense.price,
        vehicle_id: expense.vehicle_id,
      });
    }
  });

  for (const month in monthlyExpenses) {
    const [{ price, vehicle_id }] = monthlyExpenses[month];

    if (monthlyExpenses[month].length === 1) {
      barData.push({
        value: price,
        label: month,
        labelTextStyle: {
          color: colors.grey[500],
          transform: [{ rotate: '30deg' }],
          marginTop: 2,
        },
        labelWidth: monthlyExpenses[month].length * 18,
        topLabelComponent: () => (
          <Text style={styles.topLabelComponent}>{price.toFixed(2)}</Text>
        ),
        spacing: 50,
        frontColor:
          vehicleColors.find((color) => color.id === vehicle_id)?.color ||
          'black',
      });
    } else if (monthlyExpenses[month].length === 2) {
      barData.push(
        {
          value: monthlyExpenses[month][0].price,
          label: month,
          labelTextStyle: {
            color: colors.grey[500],
            transform: [{ rotate: '30deg' }],
            marginTop: 2,
          },
          labelWidth: monthlyExpenses[month].length * 25,
          topLabelComponent: () => (
            <Text style={styles.topLabelComponent}>
              {monthlyExpenses[month][0].price.toFixed(2)}
            </Text>
          ),
          frontColor:
            vehicleColors.find(
              (color) => color.id === monthlyExpenses[month][0].vehicle_id
            )?.color || 'black',
        },
        {
          value: monthlyExpenses[month][1].price,
          frontColor:
            vehicleColors.find(
              (color) => color.id === monthlyExpenses[month][1].vehicle_id
            )?.color || 'black',
          spacing: 50,
          topLabelComponent: () => (
            <Text style={styles.topLabelComponent}>
              {monthlyExpenses[month][1].price.toFixed(2)}
            </Text>
          ),
        }
      );
    } else {
      // Dodawanie pierwszego obiektu
      barData.push({
        value: monthlyExpenses[month][0].price,
        label: month,
        labelTextStyle: {
          color: colors.grey[500],
          transform: [{ rotate: '30deg' }],
          marginTop: 2,
        },
        labelWidth: monthlyExpenses[month].length * 18,
        topLabelComponent: () => (
          <Text style={styles.topLabelComponent}>
            {monthlyExpenses[month][0].price.toFixed(2)}
          </Text>
        ),
        frontColor:
          vehicleColors.find(
            (color) => color.id === monthlyExpenses[month][0].vehicle_id
          )?.color || 'black',
      });

      // Dodawanie obiektów pomiędzy pierwszym a ostatnim
      for (let i = 1; i < monthlyExpenses[month].length - 1; i++) {
        barData.push({
          value: monthlyExpenses[month][i].price,
          frontColor:
            vehicleColors.find(
              (color) => color.id === monthlyExpenses[month][i].vehicle_id
            )?.color || 'black',
          topLabelComponent: () => (
            <Text style={styles.topLabelComponent}>
              {monthlyExpenses[month][i].price.toFixed(2)}
            </Text>
          ),
        });
      }

      // Dodawanie ostatniego obiektu
      barData.push({
        value: monthlyExpenses[month][monthlyExpenses[month].length - 1].price,
        frontColor:
          vehicleColors.find(
            (color) =>
              color.id ===
              monthlyExpenses[month][monthlyExpenses[month].length - 1]
                .vehicle_id
          )?.color || 'black',
        spacing: 50,
        topLabelComponent: () => (
          <Text style={styles.topLabelComponent}>
            {monthlyExpenses[month][
              monthlyExpenses[month].length - 1
            ].price.toFixed(2)}
          </Text>
        ),
      });
    }
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
    >
      <ExpensesContainer
        expenses={expenses}
        expenseTypes={expensesTypes}
        isChanged={setExpensesChanged}
        height={300}
        vehiclesColors={vehicleColors}
      />

      <PieChartCard
        title='Expenses types'
        titlePosition={{ width: 140, left: 110 }}
        data={pieChartData}
        cardColor={{ color: 'cyan', intensity: 500 }}
      />

      <BarChartCard
        title='Monthly expenses'
        cardColor={{ color: 'cyan', intensity: 500 }}
        titlePosition={{ width: 140, left: 110 }}
        data={barData}
        legendData={vehicleColors}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  topLabelComponent: {
    color: colors.grey[500],
    fontSize: 12,
    marginBottom: 2,
    width: 60,
    height: 14,
    textAlign: 'center',
  },
});
