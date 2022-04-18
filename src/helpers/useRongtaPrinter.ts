import {useCallback, useEffect, useState} from 'react';
import {NativeModules, DeviceEventEmitter} from 'react-native';

const {RongtaPrinter} = NativeModules;
const LINE_STRING = '------------------------------------------------\n';

export enum Align {
  Left = 'Left',
  Center = 'Center',
  Right = 'Right',
}

const useRongtaPrinter = (macAddress: string) => {
  const [address] = useState<string>(macAddress);
  const [commands, setCommands] = useState<object[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const onDeviceChangeStatus = (event) => {
    const isCheck = event.status === 'Connected';
    setIsConnected(isCheck);
  };

  const connectRongtaPrinter = useCallback(() => {
    try {
      RongtaPrinter.connectDevice(address);
    } catch (er) {
      console.log({er});
    }
  }, [address]);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'onDeviceChangeStatus',
      onDeviceChangeStatus,
    );
  }, []);

  useEffect(() => {
    connectRongtaPrinter();
  }, [connectRongtaPrinter, macAddress]);

  const addAlign = (align = Align.Left) => {
    setCommands((commands1) => [...commands1, {appendAlignment: align}]);
  };
  const addBreakLine = () => {
    setCommands((commands1) => [...commands1, {appendBreakLine: true}]);
  };

  const addTitle = (data: string, breakLine = true) => {
    setCommands((commands1) => [...commands1, {appendLargeText: data}]);
    if (breakLine) addBreakLine();
  };

  const addRow = (data: string, breakLine = true) => {
    setCommands((commands1) => [...commands1, {appendText: data}]);
    if (breakLine) addBreakLine();
  };

  const addLine = (breakLine = true) => {
    setCommands((commands1) => [...commands1, {appendText: LINE_STRING}]);
    if (breakLine) addBreakLine();
  };

  const addQrCode = (value, breakLine = true) => {
    setCommands((commands1) => [...commands1, {appendQrCode: value}]);
    if (breakLine) addBreakLine();
  };

  const printTest = async () => {
    await RongtaPrinter.testPrint();
  };

  const printReceipt = () => {
    RongtaPrinter.PrintBill(commands);
  };

  const disconnectRongtaPrinter = async () => {
    await RongtaPrinter.disconnectDevice();
  };

  return {
    connectRongtaPrinter,
    disconnectRongtaPrinter,
    addLine,
    addRow,
    addAlign,
    addBreakLine,
    addTitle,
    addQrCode,
    printTest,
    printReceipt,
    isConnected,
  };
};

export default useRongtaPrinter;
