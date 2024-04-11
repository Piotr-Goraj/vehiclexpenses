import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import { MileagesTab } from '../../utils/types';

import ModalCard from './ModalCard';
import PrimaryInput from '../ui/inputs/PrimaryInput';
import PrimaryButton from '../ui/buttons/PrimaryButton';

interface YearMilageEditModalProps {
  isModalVisible: boolean;
  onModal: (visible: boolean) => void;
  year: MileagesTab;
}

export default function YearMilageEditModal({
  isModalVisible,
  onModal,
  year,
}: YearMilageEditModalProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [mileage, setMileage] = useState<string>(year.mileage.toString());
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    setIsVisible(isModalVisible);

    return () => {
      setMileage('');
      setIsValid(null);
    };
  }, [isModalVisible]);

  const mileageChangeHandler = (text: string): void => {
    setMileage(text);

    const inputNumber = parseFloat(text);

    if (inputNumber >= 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    onModal(false);
  };

  const deleteHandler = async () => {
    await db
      .runAsync(`DELETE FROM mileages WHERE id = ?`, [year.id])
      .then(() => closeModal())
      .catch((error) => console.error(error));
  };

  const changeMileageHandler = async () => {
    await db
      .runAsync(`UPDATE mileages SET mileage = ? WHERE id = ?`, [
        mileage,
        year.id,
      ])
      .then(() => closeModal())
      .catch((error) => console.error(error));
  };

  return (
    <ModalCard
      onModal={onModal}
      isModalVisible={isVisible}
      btnTitle='Change mileage'
      isConfirm={true}
      onConfirm={changeMileageHandler}
    >
      <View style={styles.firstRowWrapper}>
        <Text>{`Mileage year: ${year.year}`}</Text>
        <PrimaryButton
          title='Delete'
          onPress={deleteHandler}
          btnColor={{ color: 'red', intensity: 400 }}
        />
      </View>
      <PrimaryInput
        placeholder={`Current mileage: ${year.mileage}`}
        value={mileage}
        isValid={isValid}
        onTextChange={(text) => mileageChangeHandler(text)}
        inputMode='numeric'
        keyboardType='number-pad'
      />
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  firstRowWrapper: {
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
