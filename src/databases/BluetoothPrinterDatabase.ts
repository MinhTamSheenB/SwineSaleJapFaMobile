/* eslint-disable import/prefer-default-export */
import {handleExecuteSql} from './Database';
import {IBluetoothPrinter, IStarDevice} from './DatabaseType';

const checkDeviceIsExist = async (macAddress: string): Promise<boolean> => {
  const rs = await handleExecuteSql(
    `select * from BLUETOOTH_PRINTER WHERE MAC_ADDRESS = ?;`,
    [macAddress],
  );
  return !!(rs && rs.rows.length > 0);
};

const addNewDevice = async (device: IStarDevice): Promise<boolean> => {
  const isExist = await checkDeviceIsExist(device.macAddress);
  if (isExist) return true;
  const rs = await handleExecuteSql(
    `INSERT INTO BLUETOOTH_PRINTER 
  (MAC_ADDRESS, NAME, REMIND_NAME, IS_DEFAULT, TYPE) VALUES (?, ?, ?, ?, ?)`,
    [
      device.macAddress,
      device.portName,
      device.remindName,
      device.isDefault ? 1 : 0,
      device.type,
    ],
  );
  return !!(rs && rs.insertId > 0);
};
const deleteDevice = async (macAddress: string): Promise<boolean> => {
  const rs = await handleExecuteSql(
    `DELETE FROM BLUETOOTH_PRINTER WHERE MAC_ADDRESS = '?';`,
    [macAddress],
  );
  return !!(rs && rs.rowsAffected > 0);
};
const getList = async (): Promise<IStarDevice[]> => {
  const rs = await handleExecuteSql(`SELECT * FROM BLUETOOTH_PRINTER`, []);
  const devices: IStarDevice[] = [];
  if (rs === undefined) return devices;
  for (let i = 0; i < rs.rows.length; i += 1) {
    const row = rs?.rows.item(i);
    const device: IStarDevice = {
      macAddress: row.MAC_ADDRESS,
      portName: row.NAME,
      isDefault: row.IS_DEFAULT === 1,
      remindName: row.REMIND_NAME,
      type: row.TYPE,
    };
    devices.push(device);
  }
  return devices;
};

const setDefault = async (macAddress: string): Promise<boolean> => {
  await handleExecuteSql(`UPDATE BLUETOOTH_PRINTER SET IS_DEFAULT = 0`, []);

  const rs = await handleExecuteSql(
    `UPDATE BLUETOOTH_PRINTER SET IS_DEFAULT = 1 WHERE MAC_ADDRESS = ?`,
    [macAddress],
  );
  return !!(rs && rs.rowsAffected > 0);
};

const getDefaultPrinter = async (): Promise<IStarDevice | undefined> => {
  const rs = await handleExecuteSql(
    `select * from BLUETOOTH_PRINTER WHERE IS_DEFAULT = 1`,
    [],
  );
  if (!rs || rs.rows.length < 1) return undefined;
  const row = rs.rows.item(0);
  const device: IStarDevice = {
    macAddress: row.MAC_ADDRESS,
    portName: row.NAME,
    isDefault: row.IS_DEFAULT === 1,
    remindName: row.REMIND_NAME,
    type: row.TYPE,
  };
  return device;
};

export const bluetoothPrinterDatabase: IBluetoothPrinter = {
  addNewDevice,
  getList,
  deleteDevice,
  setDefault,
  getDefaultPrinter,
};
