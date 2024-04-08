// import { useEffect, useState } from 'react';
// import { SQLiteDatabase } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';

// interface useOpenDatabaseProps {
//   dbName: string;
// }

async function useOpenDatabase(
  // pathToDatabaseFile: string,
  dbName: string
): Promise<SQLite.SQLiteDatabase> {
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
    );

    await FileSystem.downloadAsync(
      Asset.fromModule(require('../assets/vehiclexpenses.db')).uri,
      FileSystem.documentDirectory + `SQLite/${dbName}`
    );
  }

  return SQLite.openDatabase(dbName);
}

export default useOpenDatabase;
