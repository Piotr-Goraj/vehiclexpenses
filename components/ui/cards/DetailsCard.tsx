import { JSX } from 'react';
import { StyleSheet, View, Text, TextStyle, ViewStyle } from 'react-native';

import { ButtonType, ColorIntensity } from '../../../utils/types';
import usePrimaryColors from '../../../hooks/usePrimaryColors';
import ActionButton from '../buttons/ActionButton';

interface DetailsCard {
  children: JSX.Element | JSX.Element[];
  title: string;
  styleCustom?: ViewStyle;
  titlePosition: TextStyle;
  cardColor: ColorIntensity;
  buttonType?: ButtonType;
  buttonColor?: ColorIntensity;
  onPress?: (isModal: boolean) => void;
}

export default function DetailsCard({
  title,
  titlePosition,
  styleCustom,
  children,
  cardColor,
  buttonType,
  buttonColor,
  onPress,
}: DetailsCard) {
  const color = usePrimaryColors(cardColor.color);

  return (
    <View
      style={[
        styles.container,
        { borderColor: color[cardColor.intensity] },
        styleCustom,
      ]}
    >
      {children}
      <Text style={[styles.titleText, titlePosition]}>{title}</Text>

      {buttonType && buttonColor && onPress && (
        <ActionButton
          colorBtn={buttonColor}
          typeButton={buttonType}
          onPress={() => onPress(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',

    marginTop: 20,
    marginBottom: 8,
    marginHorizontal: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,

    width: 360,
    height: 200,

    borderWidth: 2,
    borderRadius: 16,
  },
  titleText: {
    position: 'absolute',

    backgroundColor: 'white',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 2,
    height: 24,

    top: -14,
  },
});
