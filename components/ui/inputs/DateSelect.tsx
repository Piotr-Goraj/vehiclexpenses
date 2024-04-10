import React, { useState, useEffect } from 'react';
import { View, Pressable, Platform, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import colors from '../../../utils/colors';

interface DateSelectProps {
  isValid: boolean | null;
  onDateChange: (date: string) => void;
}

export default function DateSelect({ isValid, onDateChange }: DateSelectProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (selectedDate) {
        setSelectedDate(selectedDate);
        const formattedDate = formatDate(selectedDate);
        onDateChange(formattedDate);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      onDateChange(formattedDate);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const maxDate = new Date(); // Pobranie aktualnej daty
  maxDate.setHours(23, 59, 59, 999); // Ustawienie godziny na koniec dnia

  return (
    <View style={styles.container}>
      <Pressable
        onPress={showDatepicker}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Select date</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          testID='dateTimePicker'
          value={selectedDate}
          mode='date'
          is24Hour={true}
          display='default'
          maximumDate={maxDate}
          onChange={handleDateChange}
          style={[!isValid && isValid !== null && styles.isInvalid]}
        />
      )}
      {Platform.OS === 'android' && (
        <View
          style={[
            styles.datePicked,
            !isValid && isValid !== null && styles.isInvalid,
          ]}
        >
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: '40%',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    margin: 4,
    borderColor: colors.blue[300],
    borderWidth: 2,
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: colors.blue[300],
  },
  buttonText: {
    fontSize: 16,
  },
  datePicked: {
    width: '60%',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
  },
  isInvalid: {
    borderColor: 'red',
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 8,
    marginHorizontal: 4,
  },
});
