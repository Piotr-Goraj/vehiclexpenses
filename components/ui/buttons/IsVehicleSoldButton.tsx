import React, { useState } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import colors from '../../../utils/colors';

interface IsVehicleSoldButtonProps {
  onSold: (isSold: boolean) => void;
  isSold: boolean;
}

export default function IsVehicleSoldButton({
  onSold,
  isSold,
}: IsVehicleSoldButtonProps) {
  const [animation] = useState(new Animated.Value(0));

  const toggleSold = () => {
    onSold(!isSold);
    Animated.timing(animation, {
      toValue: isSold ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.green[500], colors.yellow[300]],
  });

  const textColorInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.green[500], colors.yellow[300]],
  });

  const buttonText = isSold ? 'SOLD' : 'NOT SOLD';

  return (
    <TouchableOpacity
      onPress={toggleSold}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.container,
          { borderColor: backgroundColorInterpolation },
        ]}
      >
        <Animated.Text
          style={[styles.buttonText, { color: textColorInterpolation }]}
        >
          {buttonText}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 40,
    marginVertical: 16,

    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    margin: 4,

    borderWidth: 2,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
