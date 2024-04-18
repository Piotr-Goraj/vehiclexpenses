import { ReactNode } from 'react';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, View } from 'react-native';

import PrimaryButton from '../ui/buttons/PrimaryButton';

import { ColorIntensity } from '../../utils/types';

interface ModalCardProps {
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;

  children?: ReactNode;

  isConfirm: boolean;
  confirmColor?: ColorIntensity;
  onConfirm?: () => void;
  btnTitle?: string;
}

export default function ModalCard({
  children,
  isModalVisible,
  onModal,
  onConfirm = () => {},
  isConfirm,
  confirmColor,
  btnTitle = 'Confirm',
}: ModalCardProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(isModalVisible);
  }, [isModalVisible]);

  const closeModal = () => {
    setIsVisible(false);
    onModal(false);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType='fade'
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {children}

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title='Close'
              onPress={closeModal}
            />
            {isConfirm && (
              <PrimaryButton
                title={btnTitle}
                onPress={onConfirm}
                btnColor={confirmColor || { color: 'green', intensity: 400 }}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    marginVertical: 64,
    marginHorizontal: 16,
    height: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
