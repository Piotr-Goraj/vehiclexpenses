import { StyleSheet, Pressable, Text } from 'react-native';

import colors from '../../utils/colors';

interface Vehicle {
  id: number;
  name: string;
  mileage: number;
  is_sold?: number;
}

interface VehicleBtnProps {
  details: Vehicle;
  onPress?: () => void;
}

export default function VehicleBtn({ details, onPress }: VehicleBtnProps) {
  const isSold = details.is_sold === 1 ? true : false;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed,
      ]}
      onPress={onPress}
    >
      <Text>{details.name}</Text>
      <Text>{details.mileage} km</Text>
      {isSold && <Text style={styles.soldText}>SOLD</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 164,
    height: 164,
    margin: 8,

    padding: 10,
    borderRadius: 8,

    alignItems: 'center',
    justifyContent: 'center',

    borderColor: colors.magenta[600],
    borderWidth: 2,
  },
  containerPressed: {
    backgroundColor: colors.magenta[600],
    opacity: 0.5,
  },
  soldText: {
    fontWeight: 'bold',
    color: colors.yellow[300],
  },
});
