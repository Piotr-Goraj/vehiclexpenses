import { StyleSheet, Pressable, Text, View, Image } from 'react-native';

import colors from '../../utils/colors';
import { VehicleProps } from '../../utils/types';

interface VehicleBtnProps {
  details: VehicleProps;
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
      {details.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${details.image}` }}
            style={styles.imagePhoto}
          />
        </View>
      )}
      <Text>{details.name}</Text>
      <Text>{details.mileage} km</Text>
      {isSold && <Text style={styles.soldText}>SOLD</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',

    width: 164,
    height: 164,
    margin: 8,

    paddingHorizontal: 10,
    paddingBottom: 5,
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
  imageContainer: {
    flex: 1,
  },
  imagePhoto: {
    width: 160,
    height: '100%',

    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  soldText: {
    position: 'absolute',
    top: 10,
    left: 20,

    fontWeight: 'bold',
    fontSize: 48,
    backgroundColor: '#00000071',
    borderRadius: 16,

    color: colors.yellow[300],
  },
});
