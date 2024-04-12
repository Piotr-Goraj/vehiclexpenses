import * as SQLite from 'expo-sqlite';

const databaseName = 'vehiclexpenses.db';
const databaseVersion = '1.0';
export default databaseName;

export const checkTables = async (dbName: string, readOnly: boolean) => {
  const db = SQLite.openDatabase(dbName, databaseVersion);
  const query = `SELECT name FROM sqlite_master WHERE type='table';`;

  return new Promise<SQLite.ResultSet>((resolve, reject) => {
    db.transactionAsync(async (tx) => {
      try {
        const result = await tx.executeSqlAsync(query, []);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, readOnly);
  });
};
