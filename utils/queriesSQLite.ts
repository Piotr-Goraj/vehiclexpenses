import * as SQLite from 'expo-sqlite';
import { VehicleProps } from './types';

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

// export const getAllVehicles = async (db: SQLiteDatabase) => {
// const result = await db.getAllAsync(`SELECT * FROM vehicles;`)
// };

// export const createTables = async (db: SQLiteDatabase) => {
//   return new Promise((resolve, reject) => {
//     db.transaction(
//       (txn) => {
//         // Zapytanie SQL tworzące tabelę "vehicles"
//         txn.executeSql(
//           `CREATE TABLE IF NOT EXISTS "vehicles" (
//             "id"	INTEGER NOT NULL UNIQUE,
//             "name"	TEXT NOT NULL,
//             "model"	TEXT,
//             "image"	BLOB,
//             "buy_date"	TEXT NOT NULL,
//             "buy_price"	REAL NOT NULL,
//             "is_sold"	INTEGER NOT NULL,
//             "sold_date"	TEXT,
//             "sold_price"	REAL,
//             "mileage"	REAL NOT NULL,
//             PRIMARY KEY("id" AUTOINCREMENT)
//           );`,
//           [],
//           () => {},
//           (error) => {
//             console.log('Error in creating "vehicles" table:', error);
//             reject(error);
//             return true;
//           }
//         );

//         // Zapytanie SQL tworzące tabelę "gas_tank"
//         txn.executeSql(
//           `CREATE TABLE IF NOT EXISTS "gas_tank" (
//             "id"	INTEGER NOT NULL UNIQUE,
//             "vehicle_id"	INTEGER NOT NULL,
//             "fuel_type"	TEXT NOT NULL,
//             "capacity"	REAL NOT NULL,
//             "mileage_before"	REAL NOT NULL,
//             "price_per_liter"	REAL NOT NULL,
//             "gas_station"	TEXT NOT NULL,
//             "buy_date"	TEXT NOT NULL,
//             PRIMARY KEY("id" AUTOINCREMENT),
//             CONSTRAINT "vehicle_id" FOREIGN KEY("vehicle_id") REFERENCES "vehicles"("id")
//           );`,
//           [],
//           () => {},
//           (error) => {
//             console.log('Error in creating "gas_tank" table:', error);
//             reject(error);
//             return true;
//           }
//         );

//         // Zapytanie SQL tworzące tabelę "expense_type"
//         txn.executeSql(
//           `CREATE TABLE IF NOT EXISTS "expense_type" (
//             "id"	INTEGER NOT NULL UNIQUE,
//             "type_name"	TEXT NOT NULL UNIQUE,
//             PRIMARY KEY("id" AUTOINCREMENT)
//           );`,
//           [],
//           () => {}, // Pusta funkcja zwrotna dla sukcesu
//           (error) => {
//             console.log('Error in creating "expense_type" table:', error);
//             reject(error);
//             return true;
//           }
//         );

//         // Zapytanie SQL tworzące tabelę "expenses_summarise"
//         txn.executeSql(
//           `CREATE TABLE IF NOT EXISTS "expenses_summarise" (
//             "id"	INTEGER NOT NULL UNIQUE,
//             "vehicle_id"	INTEGER NOT NULL,
//             "expense_type"	TEXT NOT NULL,
//             "price"	REAL NOT NULL,
//             "buy_date"	TEXT NOT NULL,
//             PRIMARY KEY("id" AUTOINCREMENT),
//             CONSTRAINT "expense_type" FOREIGN KEY("expense_type") REFERENCES "expense_type"("type_name"),
//             CONSTRAINT "vehicle_id" FOREIGN KEY("vehicle_id") REFERENCES "vehicles"("id")
//           );`,
//           [],
//           () => {},
//           (error) => {
//             console.log('Error in creating "expenses_summarise" table:', error);
//             reject(error);
//             return true;
//           }
//         );

//         // Zapytanie SQL tworzące tabelę "settings"
//         txn.executeSql(
//           `CREATE TABLE IF NOT EXISTS "settings" (
//             "id"	INTEGER NOT NULL UNIQUE,
//             "key"	TEXT NOT NULL UNIQUE,
//             "value"	TEXT NOT NULL,
//             PRIMARY KEY("id" AUTOINCREMENT)
//           );`,
//           [],
//           () => {},
//           (error) => {
//             console.log('Error in creating "settings" table:', error);
//             reject(error);
//             return true;
//           }
//         );
//       },
//       (error) => {
//         console.log('Transaction error:', error);
//         reject(error);
//       },
//       () => {
//         console.log('All tables created successfully.');
//         // resolve();
//       }
//     );
//   });
// };

// export const inputNewVehicle = async (
//   // db: SQLiteDatabase,
//   name: string,
//   model: string,
//   image: string | null,
//   buyDate: string,
//   buyPrice: number,
//   isSold: 0 | 1,
//   soldDate: string | 'NULL',
//   soldPrice: number | 'NULL',
//   mileage: number
// ): Promise<{ isVehicleAdded: boolean }> => {
//   return new Promise((resolve, reject) => {
//     console.log(
//       '\nDatabase: ',
//       '\n\n',
//       db,
//       '\n\n',
//       name,
//       model,
//       buyDate,
//       buyPrice,
//       isSold,
//       mileage
//     );
//     db.transaction(
//       (txn) => {
//         txn.executeSql(
//           `INSERT INTO vehicles (name, model, image, buy_date, buy_price, is_sold, sold_date, sold_price, mileage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
//           [
//             name,
//             model,
//             image,
//             buyDate,
//             buyPrice,
//             isSold,
//             soldDate,
//             soldPrice,
//             mileage,
//           ],
//           (sqlTxn, res) => {
//             console.log('New vehicle added successfully.');
//             resolve({ isVehicleAdded: true });
//           },
//           (error) => {
//             console.log('Error in adding new vehicle:', error);
//             reject('Reject error: ' + error);
//             return true;
//           }
//         );
//       },
//       (error) => {
//         console.log('Transaction error:', error);
//         reject(error);
//       },
//       () => {
//         console.log('Transaction completed successfully.');
//       }
//     );
//   });
// };

// export const getAllVehicles = async (db: SQLiteDatabase) => {
//   console.log(db);

//   return new Promise((resolve, reject) => {
//     db.transaction(
//       (txn) => {
//         console.log('Transaction started');
//         txn.executeSql(
//           `SELECT * FROM vehicles;`,
//           [],
//           (sqlTxn, res) => {
//             console.log('SQL query executed successfully');
//             const vehicles: any = [];

//             for (let i = 0; i < res.rows.length; i++) {
//               vehicles.push(res.rows.item(i));
//             }

//             console.log('Received vehicles:');
//             console.log(vehicles);
//             resolve(vehicles);
//           },
//           (error) => {
//             console.log('Error executing SQL:', error);
//             reject(error);
//             return true;
//           }
//         );
//       },
//       (error) => {
//         console.log('Transaction error:', error);
//         reject(error);
//       },
//       () => {
//         console.log('Transaction completed successfully');
//       }
//     );
//   });
// };

// export interface VehicleProps {
//   id: number;
//   name: string;
//   model: string;
//   image?: string;
//   buy_date: string;
//   buy_price: number;
//   is_sold: 0 | 1;
//   sold_date?: string;
//   sold_price?: number;
//   mileage: number;
// }

// export const getVehicleById = async (
//   db: SQLiteDatabase,
//   id: number
// ): Promise<VehicleProps> => {
//   return new Promise((resolve, reject) => {
//     db.transaction((txn) => {
//       txn.executeSql(
//         `SELECT * FROM vehicles WHERE id = ?;`,
//         [id],
//         (sqlTxn, res) => {
//           if (res.rows.length > 0) {
//             const vehicle = res.rows.item(0);
//             resolve(vehicle as VehicleProps); // Rzutowanie wyniku na typ Vehicle
//           } else {
//             reject(new Error('Nie znaleziono pojazdu o podanym id'));
//           }
//         },
//         (error) => {
//           reject(error);
//           return true;
//         }
//       );
//     });
//   });
// };
