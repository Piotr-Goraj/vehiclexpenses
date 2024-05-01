import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import ModalCard from './ModalCard';
import { useSQLiteContext } from 'expo-sqlite/next';
import PrimaryInput from '../ui/inputs/PrimaryInput';
import { FaultsTab, tablesNames } from '../../utils/types';

interface FaultModalProps {
  vehicleId: number;
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
  faultEdit: Omit<FaultsTab, 'vehicle_id'>;
}

export default function FaultModal({
  vehicleId,
  isModalVisible,
  onModal,
}: FaultModalProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [faultTxt, setFaultTxt] = useState<string>(() => '');

  const db = useSQLiteContext();

  useEffect(() => {
    setIsVisible(isModalVisible);
  }, [isModalVisible]);

  const closeModal = () => {
    setIsVisible(false);
    onModal(false);
  };

  const onConfirmHandler = () => {
    db.runSync(
      `INSERT INTO ${tablesNames.faults} (vehicle_id, is_repaired, fault_title) VALUES (?, ?, ?)`,
      [vehicleId, 0, faultTxt]
    );
    closeModal();
  };

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={isVisible}
      isConfirm={true}
      onConfirm={onConfirmHandler}
    >
      <PrimaryInput
        title='Fault description'
        isValid={faultTxt.trim().length > 0}
        onTextChange={(txt) => setFaultTxt(txt)}
        value={faultTxt}
        multiline={true}
        maxHeight={200}
      />
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  container: {},
});
