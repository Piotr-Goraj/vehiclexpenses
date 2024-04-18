import { StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../../utils/colors';

interface PrimaryDropdownProps {
  title: string;
  isDropdownFocus: boolean;
  data: any[];
  labelField: string;
  valueField: string;
  selectedPlaceholder: string;
  value: string;
  onFocus: (focus: boolean) => void;
  onBlur: (blur: boolean) => void;
  onChange: (item: any) => void;
}

export default function PrimaryDropdown({
  title,
  data,
  isDropdownFocus,
  labelField,
  valueField,
  selectedPlaceholder,
  value,
  onFocus,
  onBlur,
  onChange,
}: PrimaryDropdownProps) {
  return (
    <>
      <Text style={styles.label}>{title}</Text>
      <Dropdown
        style={[
          styles.dropdown,
          isDropdownFocus && { borderColor: colors.blue[400] },
        ]}
        data={data}
        labelField={labelField}
        valueField={valueField}
        placeholder={!isDropdownFocus ? selectedPlaceholder : '...'}
        searchPlaceholder='Search...'
        value={value}
        onFocus={() => onFocus}
        onBlur={() => onBlur}
        onChange={(item) => onChange(item)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    width: 320,

    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 16,

    paddingHorizontal: 8,
  },
  label: {
    color: colors.fontDark,
    width: '100%',
    textAlign: 'left',
    marginVertical: 4,
  },
});
