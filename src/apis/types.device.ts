export enum DeviceType {
  SCALE = 0,
  PRINTER = 1,
}

export interface IDeviceDTO {
  UPDATEBY?: string;
  UPDATETIME?: string;
  STATUS: 0 | 1;
  MacAddress?: string;
  DeviceName?: string;
  FarmId?: string;
  Enabled: 0 | 1;
  Type: DeviceType;
  Characteristics?: string;
  AUTOID: number;
}

export interface IDeviceModel extends IDeviceDTO {
  REGIONID?: string;
  OFFICEID?: number;
  UNITID?: string;
  DEPTID?: number;
}
