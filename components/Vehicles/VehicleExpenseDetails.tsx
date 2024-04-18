import { StyleSheet, View, Text } from 'react-native';

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
  return (
    <View style={styles.outerContainer}>
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
    // borderWidth: 2,
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginVertical: 2,
  },
  text: {
    color: colors.fontLight,
  },
});
