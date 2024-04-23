import { useEffect, useReducer, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

import ModalCard, { ModalCardProps } from './ModalCard';
import { GasTankTab, tablesNames } from '../../utils/types';
import PrimaryInput from '../ui/inputs/PrimaryInput';
import DateInput from '../ui/inputs/DateInput';
import { formReducer, defaultData } from './modalsReducers/gasTankReducer';

interface GasTankEditModalProps
  extends Pick<ModalCardProps, 'isModalVisible' | 'onModal'> {
  tankDetails: Pick<GasTankTab, 'id' | 'buy_date' | 'gas_station'>;

  isChanged?: (isChanged: boolean) => void;
}

export default function GasTankEditModal({
  isModalVisible,
  onModal,
  tankDetails,
  isChanged,
}: GasTankEditModalProps) {
  const db = useSQLiteContext();

  const [formState, dispatchForm] = useReducer(formReducer, defaultData);
  const [isEditModal, setIsEditModal] = useState<boolean>(isModalVisible);

  useEffect(() => {
    setIsEditModal(isModalVisible);

    dispatchForm({ type: 'SET_GAS_STATION', value: tankDetails.gas_station });
    dispatchForm({ type: 'SET_BUY_DATE', value: tankDetails.buy_date });

    return () => dispatchForm({ type: 'RESET_STATE' });
  }, [isModalVisible]);

  const closeModal = () => {
    setIsEditModal(false);
    onModal(false);
  };

  const onEditHandler = () => {
    const { gasStationValue, buyDateValue } = formState;
    const { gasStationValid, buyDateValid } = formState;

    if (gasStationValid && buyDateValid) {
      db.runSync(
        `UPDATE ${tablesNames.gas_tank} SET gas_station = ?, buy_date = ? WHERE id = ?`,
        [gasStationValue, buyDateValue, tankDetails.id]
      );

      closeModal();
      isChanged && isChanged(true);
    } else {
      dispatchForm({ type: 'SET_GAS_STATION', value: gasStationValue });
      dispatchForm({ type: 'SET_BUY_DATE', value: buyDateValue });
    }
  };

  return (
    <ModalCard
      isModalVisible={isEditModal}
      isConfirm={true}
      onConfirm={onEditHandler}
      confirmColor={{ color: 'green', intensity: 400 }}
      btnTitle='Edit'
      onModal={onModal}
    >
      <PrimaryInput
        placeholder={`${tankDetails.gas_station}`}
        isValid={formState.gasStationValid}
        onTextChange={(text) =>
          dispatchForm({ type: 'SET_GAS_STATION', value: text })
        }
        value={formState.gasStationValue}
      />

      <DateInput
        title='Refuel date'
        defaultDate={tankDetails.buy_date}
        isValid={formState.buyDateValid}
        onDataSet={(date) =>
          dispatchForm({ type: 'SET_BUY_DATE', value: date })
        }
      />
    </ModalCard>
  );
}

const styles = StyleSheet.create({
  container: {},
});
