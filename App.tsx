import * as React from 'react';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite/next';

import databaseName, { checkTables } from './utils/queriesSQLite';

import useOpenDatabase from './hooks/useOpenDatabase';

import BottomTabNavigator from './components/ScreenNavigators/BottomTabNavigator';

export default function App() {
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    const db = useOpenDatabase(databaseName)
      .then(() => setDatabaseReady(true))
      .catch((error) => console.log('Database load error:\n', error));

    const fetchData = async () => {
      try {
        const dbCheckTables = await checkTables(databaseName, true);

        if (dbCheckTables.rows.length === 0) {
          console.log('Database is empty');
        } else {
          const tables: string[] = [];
          dbCheckTables.rows.map((table) => tables.push(table.name));
          console.log('Database has tables: ', tables);
        }
      } catch (error) {
        console.log('Error checking tables:', error);
      }
    };

    fetchData();
  }, []);

  if (!databaseReady) {
    console.log('Database is not ready');
    return;
  }

  return (
    <>
      <StatusBar style='dark' />

      <React.Suspense
        fallback={
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ fontSize: 30 }}>Loading database...</Text>
          </View>
        }
      >
        <SQLiteProvider
          databaseName={databaseName}
          useSuspense
        >
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </SQLiteProvider>
      </React.Suspense>
    </>
  );
}
