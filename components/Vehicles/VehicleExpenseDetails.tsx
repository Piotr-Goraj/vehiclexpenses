import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { ExpenseTypeTab, ExpensesTab } from '../../utils/types';
import colors from '../../utils/colors';

interface VehicleExpenseDetailsProps {
  expenseDetails: ExpensesTab;
  expenseTypes: ExpenseTypeTab[];
}

export default function VehicleExpenseDetails({
  expenseDetails,
  expenseTypes,
}: VehicleExpenseDetailsProps) {
  const db = useSQLiteContext();

  interface ColorsProps {
    id: Number;
    color: string;
  }
  const [vehiclesColors, setVehiclesColors] = useState<ColorsProps[]>([]);

  useEffect(() => {
    const colors = db.getAllSync<ColorsProps>(`SELECT id, color FROM vehicles`);
    setVehiclesColors(colors);
    console.log(colors);
  }, []);

  return (
    <View style={[styles.outerContainer, {}]}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{expenseDetails.name}</Text>
        <Text style={styles.text}>{`${
          expenseTypes.find((type) => type.id === expenseDetails.type)
            ?.type_name
        }`}</Text>
        <Text style={styles.text}>{`${expenseDetails.price.toFixed(
          2
        )} PLN`}</Text>
        <Text style={styles.text}>{expenseDetails.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginVertical: 2,

    paddingVertical: 4,
    paddingHorizontal: 8,

    backgroundColor: colors.cyan[500],
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginVertical: 2,
  },
  text: {
    color: colors.fontLight,
    width: '25%',
    textAlign: 'center',
  },
});
