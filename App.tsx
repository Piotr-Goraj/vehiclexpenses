import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

import {
  createTables,
  checkTables,
  checkTablesConsoleLog,
} from './store/Database/queriesSQLite';

import BottomTabNavigator from './store/ScreenNavigators/BottomTabNavigator';

const dbName = 'vehiclexpenses.sqlite';
const db: SQLiteDatabase = SQLite.openDatabase(dbName);

export default function App() {
  useEffect(() => {
    const fetchData = async () => {
      const dbEmpty = await checkTables(db);
      checkTablesConsoleLog(db);
      if (dbEmpty === 'EMPTY') {
        createTables(db);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <StatusBar style='dark' />

      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
