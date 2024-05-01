import { Pressable, Text } from 'react-native';
import { FaultsTab, tablesNames } from '../../utils/types';

import VehicleInfoTxt from './VehicleInfoTxt';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useEffect, useState } from 'react';
import FaultModal from '../modals/FaultModal';

interface FaultBox {
  details: FaultsTab;
  isChanged: (changed: boolean) => void;
}

export default function FaultBox({ details, isChanged }: FaultBox) {
  const db = useSQLiteContext();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isRepaired, setIsRepaired] = useState<0 | 1>();

  useEffect(() => {
    setIsRepaired(details.is_repaired);
  }, []);

  const repairedChengeHandler = () => {
    // db.runSync(`UPDATE ${tablesNames.faults} SET is_repaired = ? WHERE id = ?`, [])
    setIsModalVisible(true);
  };

  return (
    <>
      <FaultModal
        isModalVisible={isModalVisible}
        onModal={setIsModalVisible}
        vehicleId={details.vehicle_id}
        faultEdit={(details.fault_title, details.is_repaired, details.id)}
      />

      <Pressable onPress={repairedChengeHandler}>
        <VehicleInfoTxt
          text={`${details.fault_title}\n\nRepaired: ${
            details.is_repaired === 0 ? 'NO' : 'YES'
          }`}
          boxColor={
            details.is_repaired === 1
              ? { color: 'yellow', intensity: 400 }
              : { color: 'red', intensity: 500 }
          }
          textColor='light'
          customTxtStyle={{ textAlign: 'justify' }}
        />
      </Pressable>
    </>
  );
}
