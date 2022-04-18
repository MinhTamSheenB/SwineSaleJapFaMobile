/* eslint-disable prettier/prettier */
import {NativeModules} from 'react-native';
import {IWeighingGoodsDetailDTO, IWeighingGoodsModel} from '~/apis/types.service';
import { IStarDevice } from '~/databases/DatabaseType';
import { convertStringDateToDdMmYyyy, formatDateToDdMmYyyy } from './DatetimeHelpers';
import { doubleFormat, numberFormat, removeUnicode } from './UtilitiesHelper';

const {StartBltPrinter} = NativeModules;
const LINE_STRING = '------------------------------------------------\n';

export const TOTAL_PRINT = 'Lien:{0}/{1}';

export const Align = {
  Left: 'Left',
  Center: 'Center',
  Right: 'Right',
};

export default class StarPrinterServices {
  commands: Array<object>;

  macAddress: string;

  constructor(macAddress) {
    this.commands = [];
    this.macAddress = macAddress;
  }

  async checkStatus() {
    if (!this.macAddress) {
      throw new Error('Mac address invalid');
    }
    await StartBltPrinter.checkStatus(this.macAddress);
  }

  addAlign(align = Align.Left) {
    this.commands.push({appendAlignment: align});
  }

  addTitle(data) {
    this.commands.push({appendMultiple: data});
  }

  addRow(data) {
    this.commands.push({append: data});
  }

  addLine() {
    this.commands.push({append: LINE_STRING});
  }

  addBarcode(value) {
    this.commands.push({appendBarcode: value});
  }

  addQrCode(value) {
    this.commands.push({appendQrCode: value});
  }

  cutPage() {
    this.commands.push({appendCutPaper: true});
  }

  scantDevices = async (): Promise<IStarDevice[]> => {
    const devices: IStarDevice[] = await StartBltPrinter.portDiscovery();
    return devices;
  };

  async printReceipt(macAddress) {
    if (macAddress) {
      this.macAddress = macAddress;
    }
    await StartBltPrinter.print(this.macAddress, this.commands);
  }
}

const getKmString = (value: number | undefined): string => {
  if (value === undefined) return `    `;
  if (value < 10) return `  ${value}  `;
  if (value < 100) return ` ${value} `
  return `${value}`;
}

export const StarScaleTempTemplate = (
  model: IWeighingGoodsModel,
  details: IWeighingGoodsDetailDTO[],
  macAddress: string,
  printer: StarPrinterServices,
  isOnline = true,
) => {
  printer.addAlign(Align.Center);
  printer.addTitle('PHIEU CAN\n');
  printer.addRow(`(${formatDateToDdMmYyyy(new Date(), true)})\n`);
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addAlign(Align.Left);
  printer.addRow(`Ma phieu can    : ${model.TEMP_WS_NO ?? ''}\n`);
  printer.addRow(`Don hang        : ${model.DONO}\n`);
  printer.addRow(
    `Khach hang      : ${removeUnicode(model.CUSTNAME).toUpperCase()}\n`,
  );
  printer.addRow(`So xe           : ${model.TRUCKNO}\n`); 
  printer.addRow(`Ngay xuat       : ${convertStringDateToDdMmYyyy(model.CREATEDDATE!, 'date')}\n`);
  printer.addRow(`Nhan vien can   : ${model.WEIGHMAN}\n`);
  printer.addRow(`So seal         : ${model.SEALNUMBER ?? ''}\n`);
  printer.addRow(`Tinh trang seal : ${model.SEALCONDITION ?? ''}\n`);
  printer.addRow('Km den      KM di      Gio vao      Gio ra\n');
  if (!isOnline) {
    printer.addRow(`${getKmString(model.KMSTART)}        ${getKmString(model.KMARRIVED)}       ${model.ARRIVALTIME}        ${model.DEPARTTIME}`);
  } else {
    printer.addRow(`${getKmString(model.KMSTART)}       ${getKmString(model.KMARRIVED)}       ${convertStringDateToDdMmYyyy(model.ARRIVALTIME, 'time')}        ${convertStringDateToDdMmYyyy(model.DEPARTTIME, 'time')}`);
  }
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('Ten hang      Sl       KL tong             KLBQ\n');
  printer.addLine();

  details.forEach((item) => {
    printer.addAlign(Align.Left);
    printer.addRow(`${removeUnicode(item.PRODUCTNAME).toLocaleUpperCase()}\n`);
    printer.addAlign(Align.Right);
    printer.addRow(`${numberFormat(item.QTY, 'con')}    ${doubleFormat(item.GWEIGHT,'kg')}            ${doubleFormat(item.AVGBW, 'kg')}   \n`);
    printer.addRow('');
  });
  printer.addRow('\n');
  printer.addRow('Nguoi lap       Nguoi kiem dem       Nguoi duyet\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('-------         -----------          -----------\n');
  printer.addRow('Nv can          Nv san xuat          Truong trai\n');

  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('Nguoi van chuyen                     Nguoi nhan\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.addRow('----------------                     -----------\n');
  printer.addRow('    Lai xe                           Khach hang\n');
  printer.addRow('\n');
  printer.addRow('\n');
  printer.cutPage();
  printer.printReceipt(macAddress);
};
