import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';

import { MileagesTab } from '../../utils/types';
import NewVehicleModal from '../modals/NewVehicleModal';
import { useState } from 'react';
import VehicleInfoTxt from './VehicleInfoTxt';

interface VehicleMileageTxtProps {
  yearlyMileages: MileagesTab[];
}

export default function VehicleMileageTxt({
  yearlyMileages,
}: VehicleMileageTxtProps) {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [yearMileage, setYearMileage] = useState<MileagesTab>();

  const yearHandler = (yearDetails: MileagesTab): void => {
    setIsModalVisible(true);
    setYearMileage(yearDetails);
  };

  return (
    <>
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
