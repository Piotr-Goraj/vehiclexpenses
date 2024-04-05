import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

interface PrimaryInputProps {
  onTextChange: (text: string) => void;
  placeholder?: string;
  isValid: boolean | null;
  value: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  inputMode?:
    | 'decimal'
    | 'email'
    | 'none'
    | 'numeric'
    | 'search'
    | 'tel'
    | 'text'
    | 'url';
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
}

export default function PrimaryInput({
  onTextChange,
  placeholder,
  isValid,
  autoCapitalize,
  inputMode,
  keyboardType,
}: PrimaryInputProps) {
  const [inputText, setInputText] = useState('');

  const handleTextChange = (text: string) => {
    setInputText(text);
    onTextChange(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          !isValid && isValid !== null && styles.isInputValid,
        ]}
        value={inputText}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        inputMode={inputMode}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    width: '100%',
  },
  input: {
    height: 45,
    width: '100%',

    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  isInputValid: {
    borderColor: 'red',
  },
});
