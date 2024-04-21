import { StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../../utils/colors';

interface DropdownItem {
  name: string;
  value: string;
}

interface PrimaryDropdownProps {
  title: string;
  isDropdownFocus: boolean;
  data: any[];
  labelField: string;
  valueField: string;
  selectedPlaceholder?: string;
  value: string;
  onFocus: (focus: boolean) => void;
  onBlur: (blur: boolean) => void;
  onChange: (item: any) => void;
  style?: ViewStyle;
  isLabel?: boolean;
  renderItem?: (item: DropdownItem) => JSX.Element;
  maxHeight?: number;
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
  style,
  isLabel = true,
  renderItem,
  maxHeight,
}: PrimaryDropdownProps) {
  return (
    <>
      <Text style={[styles.label, !isLabel && { display: 'none' }]}>
        {title}
      </Text>
      {renderItem ? (
        <Dropdown
          style={[
            styles.dropdown,
            style,
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
          renderItem={(item) => renderItem(item)}
          {...(maxHeight && { maxHeight })}
        />
      ) : (
        <Dropdown
          style={[
            styles.dropdown,
            style,
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
          {...(maxHeight && { maxHeight })}
        />
      )}
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
