import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import ExpensesContainer from '../components/Summarise/ExpensesContainer';
import { ExpenseTypeTab, ExpensesTab, tablesNames } from '../utils/types';

export default function SummariseScreen() {
  const db = useSQLiteContext();

  const [expenses, setExpenses] = useState<ExpensesTab[]>([]);
  const [expensesTypes, setExpensesTypes] = useState<ExpenseTypeTab[]>([]);

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

  useEffect(() => {
    getExpenses();
  }, []);

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
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
