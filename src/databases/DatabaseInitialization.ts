/* eslint-disable import/prefer-default-export */
import SQLite from 'react-native-sqlite-storage';

export class DatabaseInitialization {
  database: SQLite.SQLiteDatabase;

  public constructor(database: SQLite.SQLiteDatabase) {
    this.database = database;
  }

  public async updateDatabaseTables(isDropAllTables = false): Promise<void> {
    if (isDropAllTables) {
      await this.database.transaction(this.dropAllTable);
    }
    await this.database.transaction(this.createTables);

    await this.database.transaction(this.alterTable);
  }

  private getCurrentVersionDb = async (): Promise<number> => {
    const rs = await this.database.executeSql(`SELECT * FROM DB_VERSION`, []);
    if (rs === undefined || rs[0].rows.length < 1) {
      await this.database.executeSql(
        `INSERT INTO DB_VERSION(CURRENT_VERSION) VALUES(0);`,
        [],
      );
      return 0;
    }
    return rs[0].rows.item(0).CURRENT_VERSION;
  };

  private createTables = async (transaction: SQLite.Transaction) => {
    transaction.executeSql(`CREATE TABLE IF NOT EXISTS DB_VERSION (
      CURRENT_VERSION INTEGER DEFAULT 0 NOT NULL
    );`);
    transaction.executeSql(`CREATE TABLE IF NOT EXISTS  PRODUCT_STOCK(
      PRODUCTID TEXT PRIMARY KEY NOT NULL,
      NAME_VN TEXT,
      NAME_EN TEXT,
      MEASURECODE TEXT,
      DESCRIPTION TEXT,
      PRODTYPE INTEGER,
      ACTIVE INTEGER,
      VAT NUMERIC,
      USERCREATE TEXT,
      CREATEDATE TEXT
    );`);

    transaction.executeSql(`CREATE TABLE IF NOT EXISTS SCALE_HEADER (
      SCALEID INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,
      SCALEDATE  TEXT,
      DONO TEXT NOT NULL UNIQUE,
      TRUCKNO TEXT,
      ARRIVALTIME TEXT,
      DEPARTTIME TEXT,
      KMSTART NUMERIC,
      KMARRIVED NUMERIC,
      WEIGHMAN TEXT NOT NULL,
      REMAKS TEXT,
      USERNAME TEXT NOT NULL,
      CREATEDBY TEXT NOT NULL,
      UNITID TEXT,
      CUSTID TEXT,
      CUSTNAME TEXT,
      CUSTADD TEXT,
      WEIGHTTYPE INTEGER,
      SEALNUMBER TEXT,
      SEALCONDITION TEXT,
      EVENIFEXCESSCO INTEGER DEFAULT 0 NOT NULL, -- VUOT TRONG LUONG

      SUM_WEIGHT NUMERIC,
      SUM_QTY NUMERIC,
      LOCATIONNAME TEXT,

      IS_UPLOADED INTEGER DEFAULT 0 NOT NULL,
      IS_LOCKED NUMBER DEFAULT 0,
      SCALE_ONLINE_ID NUMBER,
      DATE_TO_UPLOADED TEXT
    );`);

    transaction.executeSql(`CREATE TABLE IF NOT EXISTS SCALE_DETAIL (
        ID INTEGER NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT,
        SCALEID  INTEGER NOT NULL,
        PRODUCTCODE TEXT NOT NULL,
        PRODUCTNAME TEXT,
        FLOCKID TEXT,
        FLOCKNAME  TEXT,
        MEASURE TEXT,
        QTY INTEGER,
        PWEIGHT NUMERIC,
        GWEIGHT NUMERIC,
        NWEIGHT NUMERIC,
        AVGBW NUMERIC,	
        REMARKS TEXT,
        WHID INTEGER,
        CREATEDBY TEXT,
        WEIGHTCONNECTID INTEGER,	
        PRODUCTDOWN INTEGER,
        PRODUCTDOWNDESC TEXT,
        EARTAG1 TEXT,
        FOREIGN KEY (SCALEID) REFERENCES SCALE_HEADER(SCALEID)
      );`);

    transaction.executeSql(`CREATE TABLE IF NOT EXISTS DELIVERY_ORDER (
        DONO TEXT NOT NULL UNIQUE PRIMARY KEY,
        DODATE TEXT,
        SONO TEXT,
        UNITID TEXT,
        CUSTNAME TEXT,
        CUSTID TEXT,
        CUSTADDRESS TEXT,
        TRUCK_NO TEXT,
        BW_TOTAL NUMERIC,
        TOTALQTY NUMERIC,
        LOCATIONNAME TEXT,
        IS_HAS_SCALE_TEMP INTEGER DEFAULT 0,
        CREATED_BY TEXT
    );`);

    transaction.executeSql(`CREATE TABLE IF NOT EXISTS  BLUETOOTH_PRINTER(
      MAC_ADDRESS TEXT PRIMARY KEY NOT NULL UNIQUE,
      NAME TEXT,
      REMIND_NAME TEXT,
      IS_DEFAULT INTEGER DEFAULT 0,
      TYPE TEXT  DEFAULT 'START' -- STAR, ETC
    );`);
  };

  private dropAllTable = (transaction: SQLite.Transaction) => {
    transaction.executeSql('DROP TABLE IF EXISTS PRODUCT_STOCK');
    transaction.executeSql('DROP TABLE IF EXISTS SCALE_HEADER');
    transaction.executeSql('DROP TABLE IF EXISTS SCALE_DETAIL');
  };

  private updateVersion = async (version: number): Promise<boolean> => {
    const rs = await this.database.executeSql(
      `UPDATE DB_VERSION SET CURRENT_VERSION = ?`,
      [version],
    );
    return !!(rs && rs[0].rowsAffected > 0);
  };

  private alterTable = async () => {
    const scaleHeaderExist = await this.checkTableExists('SCALE_HEADER');
    if (scaleHeaderExist) {
      const scaleNoIsExist = await this.isFieldExist('SCALE_HEADER', 'SCALENO');
      if (!scaleNoIsExist) {
        this.database.executeSql(`ALTER TABLE SCALE_HEADER ADD SCALENO TEXT;`);
      }
      const isSoNoExist = await this.isFieldExist('SCALE_HEADER', 'SONO');
      if (!isSoNoExist) {
        this.database.executeSql(`ALTER TABLE SCALE_HEADER ADD SONO TEXT;`);
      }
    }
    const doTableExist = await this.checkTableExists('DELIVERY_ORDER');
    if (doTableExist) {
      const soNoExist = await this.isFieldExist('DELIVERY_ORDER', 'SONO');
      if (!soNoExist) {
        this.database.executeSql(`ALTER TABLE DELIVERY_ORDER ADD SONO TEXT;`);
      }
    }
    const scaleDetailExist = await this.checkTableExists('SCALE_DETAIL');
    if (scaleDetailExist) {
      const earTagIsExist = await this.isFieldExist('SCALE_DETAIL', 'EARTAG1');
      if (!earTagIsExist) {
        this.database.executeSql(`ALTER TABLE SCALE_DETAIL ADD EARTAG1 TEXT;`);
      }
    }

    //
  };

  private checkTableExists = async (table: string): Promise<boolean> => {
    try {
      await this.database.executeSql(`SELECT * FROM ${table}`);
      return true;
    } catch (e) {
      return false;
    }
  };

  private isFieldExist = async (
    tableName: string,
    fieldName: string,
  ): Promise<boolean> => {
    try {
      await this.database.executeSql(`SELECT ${fieldName} FROM ${tableName}`);
      return true;
    } catch (e) {
      return false;
    }
  };
}
