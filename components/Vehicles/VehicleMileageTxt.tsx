import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';

import { MileagesTab, VehicleProps } from '../../utils/types';
import { useEffect, useState } from 'react';
import VehicleInfoTxt from './VehicleInfoTxt';
import YearMilageEditModal from '../modals/YearMilageEditModal';

interface VehicleMileageTxtProps {
  yearlyMileages: MileagesTab[];
  vehicleDetails: VehicleProps;
  changeMileageModalVisible: (isVisible: boolean) => void;
}

export default function VehicleMileageTxt({
  yearlyMileages,
  vehicleDetails,
  changeMileageModalVisible,
}: VehicleMileageTxtProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [yearMileage, setYearMileage] = useState<MileagesTab>({
    id: -1,
    vehicle_id: -1,
    year: -1,
    mileage: -1,
  });

  useEffect(() => {
    changeMileageModalVisible(isModalVisible);
  }, [isModalVisible]);

  const yearHandler = (yearDetails: MileagesTab): void => {
    setIsModalVisible(true);
    setYearMileage(yearDetails);
  };

  return (
    <>
      <YearMilageEditModal
        isModalVisible={isModalVisible}
        onModal={setIsModalVisible}
        year={yearMileage}
      />

      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            // height: 125,
          }}
        >
          {yearlyMileages.map((year) => (
            <Pressable
              key={year.id}
              onPress={() => yearHandler(year)}
            >
              <VehicleInfoTxt
                text={`${year.year}:    ${year.mileage} km`}
                textColor='light'
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});
