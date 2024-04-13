import { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import GasTankModal from '../components/modals/GasTankModal';
import colors from '../utils/colors';
import GasTanksContainer from '../components/Gas/GasTanksContainer';
import { useSQLiteContext } from 'expo-sqlite/next';

export default function GasScreen() {
  const db = useSQLiteContext();

  const [isGasTankAddModalVisible, setIsGasTankAddModalVisible] =
    useState<boolean>(false);

  return (
    <>
      <GasTankModal
        isModalVisible={isGasTankAddModalVisible}
        onModal={setIsGasTankAddModalVisible}
      />

      <View style={styles.container}>
        <GasTanksContainer
          gasTanks={[]}
          fuelTypes={[]}
          onPress={setIsGasTankAddModalVisible}
          height={300}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tanksList: {
    position: 'relative',

    marginVertical: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,

    width: 360,
    height: 300,

    borderColor: colors.red[500],
    borderWidth: 2,
    borderRadius: 16,
  },
});
