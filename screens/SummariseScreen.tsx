import { StyleSheet, View, Text } from 'react-native';
import ExpensesContainer from '../components/Summarise/ExpensesContainer';

export default function SummariseScreen() {
  return (
    <View style={styles.container}>
      <ExpensesContainer
        expenses={[]}
        expenseTypes={[]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
