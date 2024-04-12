import { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import GasTankModal from '../components/modals/GasTankModal';

export default function GasScreen() {
  const [isGasTankAddModalVisible, setIsGasTankAddModalVisible] =
    useState<boolean>(false);

  return (
    <>
      <GasTankModal
        isModalVisible={isGasTankAddModalVisible}
        onModal={setIsGasTankAddModalVisible}
      />

      <View style={styles.container}>
        <Button
          title='modal on'
          onPress={() => setIsGasTankAddModalVisible(true)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
