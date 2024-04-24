import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, DevSettings, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import PrimaryDropdown from '../components/ui/PrimaryDropdown';
import PrimaryButton from '../components/ui/buttons/PrimaryButton';
import { useSQLiteContext } from 'expo-sqlite/next';
import { VehiclesTab, tablesNames } from '../utils/types';

import App from '../App';

interface PickVehicleDelete
  extends Pick<VehiclesTab, 'id' | 'name' | 'model'> {}

export default function SettingsScreen() {
  const themeData: { id: number; theme: string }[] = [
    { id: 1, theme: 'light' },
    { id: 2, theme: 'dark' },
  ];

  const languageData: { id: number; lang: string }[] = [
    { id: 1, lang: 'polish' },
    { id: 2, lang: 'english' },
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
  const [isDeletePressed, setIsDeletePressed] = useState<boolean>(false);
  const [isLangFocus, setIsLangFocus] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<{
    id: number;
    lang: string;
  }>({ id: 2, lang: 'english' });

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
  }, [db, selectedVehicle]);

  const changeThemeHandler = () => {
    db.runSync(`UPDATE ${tablesNames.settings} SET value = ? WHERE key = ?`, [
      selectedTheme.theme,
      'theme',
    ]);

    // console.log(db.getAllSync(`SELECT * FROM ${tablesNames.settings}`));
  };

  const changeLangHandler = () => {
    db.runSync(`UPDATE ${tablesNames.settings} SET value = ? WHERE key = ?`, [
      selectedTheme.theme,
      'language',
    ]);
  };

  const dleteButtonHandler = () => {
    if (selectedVehicle.id !== -1) {
      setIsDeletePressed(true);
    } else {
      setSelectedVehicle({ id: -1, name: 'Choose vehicle' });
    }
  };

  const deleteVehicleHandler = () => {
    db.withTransactionSync(() => {
      db.runSync(`DELETE FROM ${tablesNames.expenses} WHERE vehicle_id = ?;`, [
        selectedVehicle.id,
      ]);
      db.runSync(`DELETE FROM ${tablesNames.faults} WHERE vehicle_id = ?;`, [
        selectedVehicle.id,
      ]);
      db.runSync(`DELETE FROM ${tablesNames.gas_tank} WHERE vehicle_id = ?;`, [
        selectedVehicle.id,
      ]);
      db.runSync(`DELETE FROM ${tablesNames.mileages} WHERE vehicle_id = ?;`, [
        selectedVehicle.id,
      ]);
      db.runSync(`DELETE FROM ${tablesNames.vehicles} WHERE id = ?;`, [
        selectedVehicle.id,
      ]);
    });

    setSelectedVehicle({ id: -1, name: '' });
    setIsDeletePressed(false);
  };

  const importDatabaseHandler = async () => {
    const dbName = 'vehiclexpenses.db';

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets.length > 0) {
      console.log('success');

      const selectedDatabaseURI = result.assets[0].uri;

      if (
        (
          await FileSystem.getInfoAsync(
            `${FileSystem.documentDirectory}SQLite/${dbName}`
          )
        ).exists
      ) {
        console.log('db exist');

        // Usuwanie istniejącej bazy danych, jeśli istnieje
        await FileSystem.deleteAsync(
          `${FileSystem.documentDirectory}SQLite/${dbName}`,
          { idempotent: true }
        );
      }

      if (
        !(
          await FileSystem.getInfoAsync(
            `${FileSystem.documentDirectory}SQLite/${dbName}`
          )
        ).exists
      ) {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}SQLite`,
          { intermediates: true }
        )
          .then(async () => {
            await FileSystem.copyAsync({
              from: selectedDatabaseURI,
              to: `${FileSystem.documentDirectory}SQLite/${dbName}`,
            });
          })
          .then(() => {
            // Note that this method does not work in production!
            DevSettings.reload();
          });
      }
    }
  };

  const exportDatabaseHandler = async () => {
    if (Platform.OS === 'android') {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + 'SQLite/vehiclexpenses.db',
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          'vehiclexpenses.db',
          'application/octet-stream'
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            alert('Database successfuly exported!');
          })
          .catch((e) => console.log(e));
      } else {
        console.log('Permission not granted');
      }
    } else {
      await Sharing.shareAsync(
        FileSystem.documentDirectory + 'SQLite/vehiclexpenses.db'
      );
    }
  };

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
          onPress={changeThemeHandler}
          btnColor={{ color: 'grey', intensity: 400 }}
        />
      </View>

      <View style={styles.settingChange}>
        <PrimaryDropdown
          isLabel={false}
          title=''
          style={{ width: '50%' }}
          isDropdownFocus={isLangFocus}
          data={languageData}
          valueField='id'
          labelField='lang'
          selectedPlaceholder={selectedLang.lang}
          value={selectedLang.id.toString()}
          onFocus={() => setIsLangFocus(true)}
          onBlur={() => () => setIsLangFocus(false)}
          onChange={(item) => {
            setSelectedLang({ id: item.id, lang: item.lang });
            setIsLangFocus(false);
          }}
        />
        <PrimaryButton
          title='Change language'
          onPress={changeLangHandler}
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
        {!isDeletePressed && (
          <PrimaryButton
            title='Delete vehicle'
            onPress={dleteButtonHandler}
            btnColor={{ color: 'red', intensity: 400 }}
          />
        )}
        {isDeletePressed && (
          <PrimaryButton
            title='Are you sure?'
            onPress={deleteVehicleHandler}
            btnColor={{ color: 'yellow', intensity: 300 }}
          />
        )}
      </View>

      <View style={styles.impExpDatabase}>
        <Text style={{ textAlign: 'center', color: 'red' }}>WARNING!</Text>
        <Text style={{ textAlign: 'center' }}>
          Import database will erease your current app data!
        </Text>
        <PrimaryButton
          title='Import database'
          onPress={importDatabaseHandler}
          btnColor={{ color: 'grey', intensity: 400 }}
          style={{ width: '100%' }}
        />
        <PrimaryButton
          title='Export database'
          onPress={exportDatabaseHandler}
          btnColor={{ color: 'grey', intensity: 400 }}
          style={{ width: '100%' }}
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
  impExpDatabase: {
    marginVertical: 16,
    width: '90%',
  },
});
