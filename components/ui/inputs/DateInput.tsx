import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import colors from '../../../utils/colors';

interface DateInputProps {
  title: string;
  isValid: boolean | null;
  onDataSet: (data: string) => void;
  defaultDate?: string;
}

export default function DateInput({
  title,
  isValid,
  onDataSet,
  defaultDate = 'DD-MM-YYYY',
}: DateInputProps) {
  const inputRefs = Array.from({ length: 3 }, () =>
    React.createRef<TextInput>()
  );

  const focusNextInput = (index: number) => {
    if (inputRefs[index + 1]) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const defaultYear = parseInt(defaultDate.split('-')[0]);
  const defaultMonth = parseInt(defaultDate.split('-')[1]);
  const defaultDay = parseInt(defaultDate.split('-')[2]);

  const [day, setDay] = useState<number>(defaultDay || 31);
  const [month, setMonth] = useState<number>(defaultMonth || 12);
  const [year, setYear] = useState<number>(defaultYear || 1890);

  const [validDate, setValidDate] = useState<{
    yearValid: boolean | null;
    monthValid: boolean | null;
    dayValid: boolean | null;
  }>({ yearValid: null, monthValid: null, dayValid: null });

  const currentYear = new Date().getFullYear();

  const dateSetHandler = () => {
    const dayToTen = day < 10 ? `0${day}` : day;
    const monthToTen = month < 10 ? `0${month}` : month;

    if (year < 1890 || year > currentYear) {
      setValidDate((prevState) => ({ ...prevState, yearValid: false }));
    } else if (month < 1 || month > 12) {
      setValidDate((prevState) => ({ ...prevState, monthValid: false }));
    } else if (
      day < 1 ||
      day > 31 ||
      (month === 2 && day > 29) ||
      (year % 4 === 0 && month === 2 && day > 28)
    ) {
      setValidDate((prevState) => ({ ...prevState, dayValid: false }));
    } else {
      setValidDate({ yearValid: true, monthValid: true, dayValid: true });
      const date = `${year}-${monthToTen}-${dayToTen}`;
      onDataSet(date);
    }
  };

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <TextInput
            ref={inputRefs[0]}
            style={[
              styles.input,
              (!isValid && isValid != null && styles.inputInvalid) ||
                (!validDate.dayValid &&
                  validDate.dayValid !== null &&
                  styles.inputInvalid),
            ]}
            inputMode='numeric'
            keyboardType='number-pad'
            placeholder={
              defaultDay.toString() === 'NaN' ? 'DD' : defaultDay.toString()
            }
            returnKeyType='next'
            onSubmitEditing={() => focusNextInput(0)}
            maxLength={2}
            onChangeText={(text) => {
              setDay(isNaN(parseInt(text)) ? defaultDay : parseInt(text));
            }}
            onEndEditing={dateSetHandler}
          />
          <Text style={styles.inputBoxText}>DD</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            ref={inputRefs[1]}
            style={[
              styles.input,
              (!isValid && isValid != null && styles.inputInvalid) ||
                (!validDate.monthValid &&
                  validDate.monthValid !== null &&
                  styles.inputInvalid),
            ]}
            inputMode='numeric'
            keyboardType='number-pad'
            placeholder={
              defaultDay.toString() === 'NaN' ? 'MM' : defaultMonth.toString()
            }
            returnKeyType='next'
            onSubmitEditing={() => focusNextInput(1)}
            maxLength={2}
            onChangeText={(text) => {
              setMonth(isNaN(parseInt(text)) ? defaultMonth : parseInt(text));
            }}
            onEndEditing={dateSetHandler}
          />
          <Text style={styles.inputBoxText}>MM</Text>
        </View>

        <View style={styles.inputBox}>
          <TextInput
            ref={inputRefs[2]}
            style={[
              styles.input,
              (!isValid && isValid != null && styles.inputInvalid) ||
                (!validDate.yearValid &&
                  validDate.yearValid !== null &&
                  styles.inputInvalid),
            ]}
            inputMode='numeric'
            keyboardType='number-pad'
            placeholder={
              defaultDay.toString() === 'NaN' ? 'YYYY' : defaultYear.toString()
            }
            returnKeyType='done'
            onSubmitEditing={() => {
              inputRefs[2].current?.blur();
              dateSetHandler();
            }}
            maxLength={4}
            onChangeText={(text) => {
              setYear(isNaN(parseInt(text)) ? defaultYear : parseInt(text));
            }}
            onEndEditing={dateSetHandler}
          />
          <Text style={styles.inputBoxText}>YYYY</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    marginBottom: 6,
    width: 320,
    fontSize: 16,
    color: colors.grey[500],
  },
  container: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 80,
    textAlign: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,

    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey[600],
  },
  inputInvalid: {
    borderColor: colors.red[100],
  },
  inputBox: {
    position: 'relative',
    marginBottom: 8,
  },
  inputBoxText: {
    position: 'absolute',
    bottom: -10,
    right: 35,
    zIndex: 999,

    width: 40,
    height: 20,

    textAlign: 'center',
    color: colors.grey[400],
    backgroundColor: 'white',
  },
});
