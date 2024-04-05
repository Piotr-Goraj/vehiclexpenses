import { SQLiteDatabase } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';

interface useOpenDatabaseProps {
  dbName: string;
}

export default function useOpenDatabase({ dbName }: useOpenDatabaseProps) {
  const db: SQLiteDatabase = SQLite.openDatabase(dbName);

  return db;
}
