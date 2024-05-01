import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import colors from '../../../utils/colors';

interface PrimaryInputProps {
  onTextChange: (text: string) => void;
  placeholder?: string;
  title?: string;
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
  multiline?: boolean;
  maxHeight?: number;
}

export default function PrimaryInput({
  onTextChange,
  placeholder,
  title,
  maxHeight,
  isValid,
  autoCapitalize,
  inputMode,
  keyboardType,
  multiline = false,
}: PrimaryInputProps) {
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState<number>();

  const handleTextChange = (text: string) => {
    setInputText(text);
    onTextChange(text);
  };

  const contentSizeHandler = (event: any) => {
    const { height } = event.nativeEvent.contentSize;

    maxHeight ? setInputHeight(Math.min(maxHeight, height)) : null;
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TextInput
        style={[
          styles.input,
          { height: maxHeight ? inputHeight : 45 },
          !isValid && isValid !== null && styles.inputInvalid,
        ]}
        value={inputText}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        autoCapitalize={autoCapitalize}
        inputMode={inputMode}
        keyboardType={keyboardType}
        multiline={multiline}
        onContentSizeChange={contentSizeHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    width: '100%',
  },
  title: {
    marginVertical: 4,
    color: colors.grey[400],
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    width: '100%',

    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 12,
    padding: 10,
  },
  inputInvalid: {
    borderColor: 'red',
  },
});
