import { StyleSheet, View, Text, ViewStyle, Pressable } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { FuelTypeTab, GasTankTab, VehicleColorsProps } from '../../utils/types';
import colors from '../../utils/colors';
import { roundNumber } from '../../utils/roundNumber';
import { ModalCardProps } from '../modals/ModalCard';

interface VehicleGasTankDetailsProps extends Pick<ModalCardProps, 'onModal'> {
  tankDetails: GasTankTab;
  fuelTypes: FuelTypeTab[];
  style?: ViewStyle;
  vehicleColor?: string;
}

export default function VehicleGasTankDetails({
  tankDetails,
  fuelTypes,
  style,
  vehicleColor,
  onModal,
}: VehicleGasTankDetailsProps) {
  const db = useSQLiteContext();

  const traveled = tankDetails.mileage_after - tankDetails.mileage_before;
  const consumption = (100 * tankDetails.capacity) / traveled;

  return (
    <>
      <Pressable
        style={[styles.outerContainer, style]}
        onPress={() => onModal(true)}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.text}>{`${tankDetails.gas_station}`}</Text>
          <Text style={styles.text}>{`${
            fuelTypes.find((type) => type.id === tankDetails.fuel_type)
              ?.type_name
          }`}</Text>
          <Text style={styles.text}>{`${tankDetails.capacity.toFixed(
            2
          )} l`}</Text>
          <Text
            style={styles.text}
          >{`${tankDetails.price_per_liter} PLN`}</Text>
          <Text style={styles.text}>{`${tankDetails.buy_date}`}</Text>
        </View>

        <View
          style={[styles.innerContainer, { justifyContent: 'space-evenly' }]}
        >
          <Text style={styles.text}>{`Traveled: ${roundNumber(
            traveled
          )} km`}</Text>
          <Text style={styles.text}>{`Consumption: ${consumption.toFixed(
            2
          )}/100 km`}</Text>
        </View>

        <View
          style={[
            styles.color,
            vehicleColor ? { backgroundColor: vehicleColor } : null,
          ]}
        />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',

    width: '100%',
    marginVertical: 2,

    paddingVertical: 4,
    paddingHorizontal: 8,

    backgroundColor: colors.red[400],
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginVertical: 2,
  },
  text: {
    color: colors.fontLight,
  },
  color: {
    position: 'absolute',
    bottom: -2,
    left: -0,

    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
