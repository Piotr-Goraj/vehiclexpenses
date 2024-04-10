import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View } from 'react-native';

import ModalCard from './ModalCard';

interface VehicleInfoProps {
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
}

export default function VehicleInfoModal({
  isModalVisible,
  onModal,
}: VehicleInfoProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(isModalVisible);
  }, [isModalVisible]);

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={isVisible}
      isConfirm={false}
      // onConfirm={}
    ></ModalCard>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    marginVertical: 64,
    marginHorizontal: 16,
    height: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  contentContainerRoot: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
