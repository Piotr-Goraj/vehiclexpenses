import { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PrimaryDropdown from '../components/ui/PrimaryDropdown';
import PrimaryButton from '../components/ui/buttons/PrimaryButton';
import { useSQLiteContext } from 'expo-sqlite/next';
import { VehiclesTab, tablesNames } from '../utils/types';

interface PickVehicleDelete
  extends Pick<VehiclesTab, 'id' | 'name' | 'model'> {}

export default function SettingsScreen() {
  const themeData: { id: number; theme: string }[] = [
    { id: 1, theme: 'light' },
    { id: 2, theme: 'dark' },
  ];

  const db = useSQLiteContext();

  const [isThemeFocus, setIsThemeFocus] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<{
    id: number;
    theme: string;
  }>({ id: 1, theme: 'light' });
  const [isVehicleFocus, setIsVehicleFocus] = useState<boolean>(false);
  const [vehiclesData, setVehiclesData] = useState<
    Omit<PickVehicleDelete, 'model'>[]
  >([]);
  const [selectedVehicle, setSelectedVehicle] = useState<{
    id: number;
    name: string;
  }>({ id: -1, name: '' });

  const getVehicles = () => {
    const request = db.getAllSync<PickVehicleDelete>(
      `SELECT id, name, model FROM ${tablesNames.vehicles}`
    );

    const vehiclesRequestData: Omit<PickVehicleDelete, 'model'>[] = [];

    request.map((item: PickVehicleDelete) => {
      vehiclesRequestData.push({
        id: item.id,
        name: `${item.name} ${item.model}`,
      });
    });
    setVehiclesData(vehiclesRequestData);
  };

  useEffect(() => {
    getVehicles();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.settingChange}>
        <PrimaryDropdown
          isLabel={false}
          title=''
          style={{ width: '50%' }}
          isDropdownFocus={isThemeFocus}
          data={themeData}
          valueField='id'
          labelField='theme'
          selectedPlaceholder={selectedTheme.theme}
          value={selectedTheme.id.toString()}
          onFocus={() => setIsThemeFocus(true)}
          onBlur={() => () => setIsThemeFocus(false)}
          onChange={(item) => {
            setSelectedTheme({ id: item.id, theme: item.theme });
            setIsThemeFocus(false);
          }}
        />
        <PrimaryButton
          title='Change theme'
          onPress={() => {}}
          btnColor={{ color: 'grey', intensity: 400 }}
        />
      </View>

      <View style={styles.settingChange}>
        <PrimaryDropdown
          isLabel={false}
          title=''
          style={{ width: '50%' }}
          isDropdownFocus={isVehicleFocus}
          data={vehiclesData}
          valueField='id'
          labelField='name'
          selectedPlaceholder={selectedVehicle.name}
          value={selectedVehicle.id.toString()}
          onFocus={() => setIsVehicleFocus(true)}
          onBlur={() => () => setIsVehicleFocus(false)}
          onChange={(item) => {
            setSelectedVehicle({
              id: item.id,
              name: item.name,
            });
            setIsVehicleFocus(false);
          }}
        />
        <PrimaryButton
          title='Delete vehicle'
          onPress={() => {}}
          btnColor={{ color: 'red', intensity: 400 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  settingChange: {
    marginVertical: 4,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
