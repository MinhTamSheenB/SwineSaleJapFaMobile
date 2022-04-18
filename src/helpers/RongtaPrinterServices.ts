/* eslint-disable prettier/prettier */
/* eslint-disable class-methods-use-this */
import {
  NativeModules,
  Alert,
  NativeEventEmitter,
} from 'react-native';
import {
  IWeighingGoodsDetailDTO,
  IWeighingGoodsModel,
} from '~/apis/types.service';
import {IStarDevice} from '~/databases/DatabaseType';
import {formatDate, formatDateToDdMmYyyy} from './DatetimeHelpers';
import {
  doubleFormat,
  isIos,
  numberFormat,
  removeUnicode,
} from './UtilitiesHelper';

const {RongtaPrinter} = NativeModules;
const LINE_STRING = '------------------------------------------------\n';
const EMPTY_LINE = '------';

export const TOTAL_PRINT = 'Lien:{0}/{1}';

export enum Align {
  Left = 'Left',
  Center = 'Center',
  Right = 'Right',
}

export default class RongtaPrinterServices {
  macAddress: string;

  commands: object[];

  isConnected: boolean;

  constructor(macAddress) {
    this.commands = [];
    this.macAddress = macAddress;
    this.isConnected = false;
    this.onDeviceChangeStatus();
  }

  onDeviceChangeStatus() {
    const eventEmitter = new NativeEventEmitter(RongtaPrinter);
    eventEmitter.addListener('onDeviceChangeStatus', (event) => {
      console.log({event});
    });
  }

  addAlign(align = Align.Left) {
    this.commands.push({appendAlignment: align});
  }

  addBreakLine() {
    this.commands.push({appendBreakLine: true});
  }

  addTitle(data: string, breakLine = true) {
    this.commands.push({appendLargeText: data});
    if (breakLine) this.addBreakLine();
  }

  addRow(data: string, breakLine = true) {
    this.commands.push({appendText: data});
    if (breakLine) this.addBreakLine();
  }

  addLine(breakLine = true) {
    this.commands.push({appendText: LINE_STRING});
    if (breakLine) this.addBreakLine();
  }

  addQrCode(value, breakLine = true) {
    this.commands.push({appendQrCode: value});
    if (breakLine) this.addBreakLine();
  }

  async printTest() {
    await RongtaPrinter.testPrint();
  }

  async printReceipt(macAddress: string, numberOfCopy = 4) {
    if (macAddress) {
      this.macAddress = macAddress;
    }
    for (let i = 0; i < numberOfCopy; i += 1) {
      RongtaPrinter.PrintBill(this.commands);
    }

    this.commands = [];
  }

  async connectRongtaPrinter(macAddress: string): Promise<boolean> {
    if (!macAddress) return false;
    try {
      await RongtaPrinter.connectDevice(macAddress);
      return true;
      // return this.onDeviceChangeStatus;
    } catch (er) {
      console.log({er});
      return false;
    }
  }

  async disconnectRongtaPrinter() {
    await RongtaPrinter.disconnectDevice();
  }

  async scanDevices(): Promise<IStarDevice[]> {
    const devices: IStarDevice[] = await RongtaPrinter.scanDevices();
    return devices;
  }
}

const getKmString = (value: number | undefined): string => {
  if (value === undefined) return `    `;
  if (value < 10) return `  ${value}  `;
  if (value < 100) return ` ${value} `;
  return `${value}`;
};


const getProductName = (PRODUCTNAME?: string, PRODUCTDOWN: boolean, PRODUCTDOWNDESC?: string): string => {
  const productDown = PRODUCTDOWN && PRODUCTDOWNDESC ? ` (${PRODUCTDOWNDESC})` : '';
  return removeUnicode(`${PRODUCTNAME}${productDown}`).toLocaleUpperCase();
};

export const rongtaPrintReceptTemplate = (
  print: RongtaPrinterServices,
  wGoodModel: IWeighingGoodsModel,
  items: IWeighingGoodsDetailDTO[],
  macAddress: string,
  isOffline = false,
  numberOfCopy = 4,
) => {
  if (isIos()) {
    Alert.alert('Máy in Rongta chưa được hỗ trợ trên nền tảng IOS.');
    return;
  }

  print?.addAlign(Align.Center);
  print?.addBreakLine();
  print?.addTitle('PHIEU CAN');
  print?.addRow(`(${formatDateToDdMmYyyy(new Date(), true)})`);
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addAlign(Align.Left);
  print?.addRow(`Ma phieu can    : ${wGoodModel?.SCALENO}`);
  print?.addRow(`Don hang        : ${wGoodModel?.SONO}`);
  print?.addRow(`Phieu xuat kho  : ${wGoodModel?.DONO}`);
  print?.addRow(
    `Khach hang      : ${removeUnicode(wGoodModel?.CUSTNAME).toUpperCase()}`,
  );
  print?.addRow(`So xe           : ${wGoodModel?.TRUCKNO}`);

  print?.addRow(`Trai xuat       : ${wGoodModel.LOCATION_NAME ? removeUnicode(wGoodModel?.LOCATION_NAME) : EMPTY_LINE}`);
  print?.addRow(`Ngay xuat       : ${formatDateToDdMmYyyy(wGoodModel?.CREATEDDATE)}`);
  print?.addRow(`Nhan vien can   : ${removeUnicode(wGoodModel?.WEIGHMAN)}`);
  print?.addRow(`So seal         : ${wGoodModel?.SEALNUMBER ?? EMPTY_LINE}`);
  print?.addRow(`Tinh trang seal : ${removeUnicode(wGoodModel?.SEALCONDITION ?? EMPTY_LINE)}`);

  print?.addRow('Km den         KM di      Gio vao       Gio ra');
  if (isOffline) {
    print?.addRow(`${getKmString(wGoodModel.KMSTART)}           ${getKmString(wGoodModel.KMARRIVED)}       ${wGoodModel.ARRIVALTIME}        ${wGoodModel.DEPARTTIME}`);
  } else {
    print?.addRow(`${getKmString(wGoodModel.KMSTART)}           ${getKmString(wGoodModel.KMARRIVED)}        ${formatDate(wGoodModel.ARRIVALTIME, 'time')}        ${formatDate(wGoodModel?.DEPARTTIME, 'time')}`);
  }

  print?.addBreakLine();
  print?.addBreakLine();
  print?.addRow('Ten hang      Sl       KL tong            KLBQ\n', false);
  print?.addLine();

  items.forEach((item) => {
    print?.addAlign(Align.Left);
    print?.addRow(`${getProductName(item.PRODUCTNAME ?? '', item.PRODUCTDOWN, item.PRODUCTDOWNDESC)}`);
    print?.addAlign(Align.Right);
    print?.addRow(`${numberFormat(item.QTY, 'con')}    ${doubleFormat(item.GWEIGHT,'kg')}            ${doubleFormat(item.AVGBW, 'kg')} `);
    print?.addBreakLine();
  });
  const totalKg = items.reduce((total, item) => total + (item.GWEIGHT ?? 0), 0);
  const totalQtyTemp = items.reduce((total, item) => total + (item.QTY ?? 0), 0);
  print?.addLine();
  print?.addAlign(Align.Left);
  print?.addRow(`Tong so luong           : ${totalQtyTemp} con`);
  print?.addRow(`Tong trong luong        : ${doubleFormat(totalKg, 'kg')}`);
  print?.addRow(`Trong luong binh quan   : ${doubleFormat(totalKg / totalQtyTemp, 'kg')}`);

  print?.addLine(false);
  print?.addAlign(Align.Left);

  print?.addRow('Nguoi lap       Nguoi kiem dem       Nguoi duyet');
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addRow('-------         -----------          -----------');
  print?.addRow('Nv can          Nv san xuat          Truong trai');

  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addRow('Nguoi van chuyen                     Nguoi nhan');
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addRow('----------------                     -----------');
  print?.addRow('    Lai xe                           Khach hang');
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();
  print?.addBreakLine();

  print?.printReceipt(macAddress, numberOfCopy);
};
