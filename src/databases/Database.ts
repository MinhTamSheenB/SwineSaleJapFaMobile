/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/camelcase */
import SQLite, {ResultSet} from 'react-native-sqlite-storage';
import {DatabaseInitialization} from './DatabaseInitialization';

const DATABASE_NAME = 'SQLite.db';

let databaseInstance: SQLite.SQLiteDatabase | undefined;

const openDb = async (): Promise<SQLite.SQLiteDatabase> => {
  SQLite.DEBUG(true);
  SQLite.enablePromise(true);

  if (databaseInstance) {
    return databaseInstance;
  }
  const db = await SQLite.openDatabase({
    location: 'default',
    name: DATABASE_NAME,
    createFromLocation: `~www/${DATABASE_NAME}`,
  });

  const initialization = new DatabaseInitialization(db);
  await initialization.updateDatabaseTables();

  databaseInstance = db;
  return db;
};

const closeDb = async (): Promise<void> => {
  if (databaseInstance === undefined) return;
  await databaseInstance.close();
  databaseInstance = undefined;
};

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (databaseInstance !== undefined) return Promise.resolve(databaseInstance);
  return openDb();
};

export async function handleExecuteSql(
  statement: string,
  values: Array<any>,
): Promise<ResultSet | undefined> {
  return getDatabase()
    .then((db) => db.executeSql(statement, values))
    .then(([results]) => {
      return results;
    });
}
