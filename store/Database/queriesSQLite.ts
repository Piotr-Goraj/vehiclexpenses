import { SQLiteDatabase } from 'expo-sqlite';

export const createTables = async (db: SQLiteDatabase) => {
  db.transaction((txn) => {
    // vehicles table
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS "vehicles" (
        "id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL,
        "model"	TEXT,
        "buy_date"	TEXT NOT NULL,
        "buy_price"	REAL NOT NULL,
        "is_sold"	INTEGER NOT NULL,
        "sold_date"	TEXT,
        "sold_price"	REAL,
        "mileage"	REAL NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`,
      [],
      (sqlTxn, res) => {
        console.log('vehicles table created.');
      },
      (error) => {
        console.log('Error in create tables.', error);
        return true;
      }
    );

    // gas_tank table
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS "gas_tank" (
        "id"	INTEGER NOT NULL UNIQUE,
        "vehicle_id"	INTEGER NOT NULL,
        "fuel_type"	TEXT NOT NULL,
        "capacity"	REAL NOT NULL,
        "mileage_before"	REAL NOT NULL,
        "price_per_liter"	REAL NOT NULL,
        "gas_station"	TEXT NOT NULL,
        "buy_date"	TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT),
        CONSTRAINT "vehicle_id" FOREIGN KEY("vehicle_id") REFERENCES "vehicles"("id")
      );`,
      [],
      (sqlTxn, res) => {
        console.log('gas_tank table created.');
      },
      (error) => {
        console.log('Error in create tables.', error);
        return true;
      }
    );

    // expense_type table
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS "expense_type" (
        "id"	INTEGER NOT NULL UNIQUE,
        "type_name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`,
      [],
      (sqlTxn, res) => {
        console.log('expense_type table created.');
      },
      (error) => {
        console.log('Error in create tables.', error);
        return true;
      }
    );

    // expenses_summarise table
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS "expenses_summarise" (
        "id"	INTEGER NOT NULL UNIQUE,
        "vehicle_id"	INTEGER NOT NULL,
        "expense_type"	TEXT NOT NULL,
        "price"	REAL NOT NULL,
        "buy_date"	TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT),
        CONSTRAINT "expense_type" FOREIGN KEY("expense_type") REFERENCES "expense_type"("type_name"),
        CONSTRAINT "vehicle_id" FOREIGN KEY("vehicle_id") REFERENCES "vehicles"("id")
      );`,
      [],
      (sqlTxn, res) => {
        console.log('expenses_summarise table created.');
      },
      (error) => {
        console.log('Error in create tables.', error);
        return true;
      }
    );

    // settings table
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS "settings" (
        "id"	INTEGER NOT NULL UNIQUE,
        "key"	TEXT NOT NULL UNIQUE,
        "value"	TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`,
      [],
      (sqlTxn, res) => {
        console.log('settings table created.');
      },
      (error) => {
        console.log('Error in create tables.', error);
        return true;
      }
    );
  });
};

export const checkTablesConsoleLog = async (db: SQLiteDatabase) => {
  db.transaction((txn) => {
    txn.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table';`,
      [],
      (sqlTxn, res) => {
        for (let i = 0; i < res.rows.length; i++) {
          const row = res.rows.item(i);
          console.log('Table name:', row.name);
        }

        if (res.rows.length === 0) {
          console.log('Database has no tables');
        }
      },
      (error) => {
        console.log('Error in checking tables', error);
        return true;
      }
    );
  });
};

export const checkTables = async (db: SQLiteDatabase) => {
  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table';`,
        [],
        (sqlTxn, res) => {
          const tables = [];
          for (let i = 0; i < res.rows.length; i++) {
            const row = res.rows.item(i);
            tables.push(row.name);
          }
          if (tables.length === 0) {
            resolve('EMPTY');
          } else {
            resolve('NOT_EMPTY');
          }
        },
        (error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

export const inputNewVehicle = async (
  db: SQLiteDatabase,
  name: string,
  model: string,
  buyDate: string,
  buyPrice: number,
  isSold: 0 | 1,
  soldDate: string | 'NULL',
  soldPrice: number | 'NULL',
  mileage: number
): Promise<{ isVehicleAdded: boolean }> => {
  return new Promise((resolve, reject) => {
    console.log(db, name, model, buyDate, buyPrice, isSold, mileage);
    db.transaction(
      (txn) => {
        txn.executeSql(
          `INSERT INTO vehicles (name, model, buy_date, buy_price, is_sold, sold_date, sold_price, mileage) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            name,
            model,
            buyDate,
            buyPrice,
            isSold,
            soldDate,
            soldPrice,
            mileage,
          ],
          (sqlTxn, res) => {
            console.log('New vehicle added successfully.');
            resolve({ isVehicleAdded: true });
          },
          (error) => {
            console.log('Error in adding new vehicle:', error);
            reject(error);
            return true;
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
        reject(error);
      },
      () => {
        console.log('Transaction completed successfully.');
      }
    );
  });
};

export const getAllVehicles = async (db: SQLiteDatabase) => {
  return new Promise((resolve, reject) => {
    db.transaction((txn) => {
      txn.executeSql(
        `SELECT * FROM vehicles;`,
        [],
        (sqlTxn, res) => {
          const vehicles = [];
          for (let i = 0; i < res.rows.length; i++) {
            vehicles.push(res.rows.item(i));
          }
          resolve(vehicles);
        },
        (error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};
