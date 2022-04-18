package com.swinesalern;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rt.printerlibrary.bean.BluetoothEdrConfigBean;
import com.rt.printerlibrary.bean.PrinterStatusBean;
import com.rt.printerlibrary.cmd.Cmd;
import com.rt.printerlibrary.cmd.EscFactory;
import com.rt.printerlibrary.connect.PrinterInterface;
import com.rt.printerlibrary.enumerate.BarcodeType;
import com.rt.printerlibrary.enumerate.BmpPrintMode;
import com.rt.printerlibrary.enumerate.CommonEnum;
import com.rt.printerlibrary.enumerate.ConnectStateEnum;
import com.rt.printerlibrary.enumerate.ESCFontTypeEnum;
import com.rt.printerlibrary.enumerate.SettingEnum;
import com.rt.printerlibrary.exception.SdkException;
import com.rt.printerlibrary.factory.cmd.CmdFactory;
import com.rt.printerlibrary.factory.connect.BluetoothFactory;
import com.rt.printerlibrary.factory.connect.PIFactory;
import com.rt.printerlibrary.factory.printer.PrinterFactory;
import com.rt.printerlibrary.factory.printer.UniversalPrinterFactory;
import com.rt.printerlibrary.observer.PrinterObserver;
import com.rt.printerlibrary.observer.PrinterObserverManager;
import com.rt.printerlibrary.printer.RTPrinter;
import com.rt.printerlibrary.setting.BarcodeSetting;
import com.rt.printerlibrary.setting.BitmapSetting;
import com.rt.printerlibrary.setting.CommonSetting;
import com.rt.printerlibrary.setting.TextSetting;
import com.rt.printerlibrary.utils.PrintStatusCmd;
import com.rt.printerlibrary.utils.PrinterStatusPareseUtils;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;


public class RongtaPrinterModule extends ReactContextBaseJavaModule implements PrinterObserver {
    private final String LOG_TAG = "RONGTA_PRINTER";
    private final ReactApplicationContext reactContext;

    private RTPrinter rtPrinter = null;
    private PrinterFactory printerFactory;

    private int bmpPrintWidth = 28;


    private BluetoothAdapter mBluetoothAdapter = null;

    private static final String TAG = "BluetoothManager";



    public static final String EVENT_BLUETOOTH_NOT_SUPPORT = "EVENT_BLUETOOTH_NOT_SUPPORT";
    private static final String PROMISE_SCAN = "SCAN";

    // Return Intent extra
    private static final Map<String, Promise> promiseMap = Collections.synchronizedMap(new HashMap<String, Promise>());


    @NonNull
    @Override
    public String getName() {
        return "RongtaPrinter";
    }

    RongtaPrinterModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        init();
    }

    public void init() {
        printerFactory = new UniversalPrinterFactory();
        rtPrinter = printerFactory.create();
        PrinterObserverManager.getInstance().add(this);

    }

    private void onDeviceChangeStatus(ConnectStateEnum connectStatus) {
        WritableMap payload = Arguments.createMap();
        payload.putString("status", connectStatus.toString());
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onDeviceChangeStatus", payload);
    }

    private String PrinterStatusToStr(PrinterStatusBean StatusBean) {
        StringBuffer str = new StringBuffer("");
        switch (StatusBean.printStatusCmd) {
            case cmd_Print_RPP02N:
                if (StatusBean.blPrintSucc)
                    str.append("Print ok\n");
                else {
                    if (StatusBean.blNoPrinterHead)
                        str.append("No Printer Head\n");
                    if (StatusBean.blPrinting)
                        str.append("Printing...\n");
                    if (StatusBean.blOverHeated)
                        str.append("Higher temperature\n");
                    if (StatusBean.blHighervoltage)
                        str.append("Higher voltage\n");
                    if (StatusBean.blLowPower)
                        str.append("low power\n");
                    if (StatusBean.blNoPaper)
                        str.append("Out of paper\n");
                    if (StatusBean.blNoflash)
                        str.append("No flash\n");
                    if (StatusBean.blPrintReady)
                        str.append("The printer is ready\n");
                }
                break;
        }
        return str.toString();
    }

    @Override
    public void printerObserverCallback(final PrinterInterface printerInterface, final int state) {
        Log.i(LOG_TAG, "in printerObserverCallback");
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
               switch (state) {
                    case CommonEnum.CONNECT_STATE_SUCCESS:
                        Log.i(LOG_TAG, "Device is ");
                        rtPrinter.setPrinterInterface(printerInterface);
                        onDeviceChangeStatus(ConnectStateEnum.Connected);
                        break;
                    case CommonEnum.CONNECT_STATE_INTERRUPTED:
                        if (printerInterface != null && printerInterface.getConfigObject() != null) {
                            Log.i(LOG_TAG, printerInterface.getConfigObject().toString() + "device is dis");
                        } else {
                            Log.i(LOG_TAG, "device is disconnected");
                        }
                        onDeviceChangeStatus(ConnectStateEnum.NoConnect);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    @Override
    public void printerReadMsgCallback(PrinterInterface printerInterface, byte[] bytes) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                PrinterStatusBean StatusBean = PrinterStatusPareseUtils.parsePrinterStatusResult(bytes);
                if (StatusBean.printStatusCmd== PrintStatusCmd.cmd_PrintFinish){
                    if (StatusBean.blPrintSucc){
                        //  Log.e("mydebug","print ok");
                        Log.i(LOG_TAG, "print ok");
                    } else
                    {
                        Log.i(LOG_TAG, "in else print ok");
                    }

                } else  if (StatusBean.printStatusCmd== PrintStatusCmd.cmd_Normal){
                    Log.i(LOG_TAG, "print status："+PrinterStatusPareseUtils.getPrinterStatusStr(StatusBean));

                }  else  if (StatusBean.printStatusCmd== PrintStatusCmd.cmd_Print_RPP02N){
                    String msg= PrinterStatusToStr(StatusBean);
                    if (!msg.isEmpty())
                        Log.i(LOG_TAG, "print status：" + msg);
                }
            }
        });
    }

    @ReactMethod
    public void connectDevice(final String portName, Promise promise) {
        Log.i(LOG_TAG, portName);
        Activity activity = getCurrentActivity();
        try {
            printerFactory = new UniversalPrinterFactory();
            rtPrinter = printerFactory.create();
            BluetoothDevice device = BluetoothAdapter.getDefaultAdapter().getRemoteDevice(portName);
            BluetoothEdrConfigBean bluetoothEdrConfigBean = new BluetoothEdrConfigBean(device);
            PIFactory piFactory = new BluetoothFactory();
            PrinterInterface printerInterface = piFactory.create();
            printerInterface.setConfigObject(bluetoothEdrConfigBean);
            rtPrinter.setPrinterInterface(printerInterface);
            rtPrinter.connect(bluetoothEdrConfigBean);
        } catch (Exception e) {
            Log.e(LOG_TAG,e.getMessage());
            promise.reject("CONNECT_DEVICE_ERROR", e);
        }
    }

    @ReactMethod
    public void disconnectDevice() {
        Log.i(LOG_TAG, "in disconnect");
        if (rtPrinter != null && rtPrinter.getPrinterInterface() != null) {
            rtPrinter.disConnect();
        }
    }

    @ReactMethod
    public void PrintBill(final ReadableArray printCommands) {
        try {
            if (rtPrinter == null) {
                return;
            }
            CmdFactory escFac = new EscFactory();

            Cmd escCmd = escFac.create();
            escCmd.append(escCmd.getHeaderCmd());
            escCmd.setChartsetName("UTF-8");
            appendCommands(escCmd, printCommands);
            rtPrinter.writeMsgAsync(escCmd.getAppendCmds());
        } catch (Exception e) {
            Log.e(LOG_TAG,e.getMessage());
        }
    }

    @ReactMethod
    public void testPrint() {
        Log.i(LOG_TAG, "in test print");
        if (rtPrinter == null) {
            return;
        }
        CmdFactory escFac = new EscFactory();
        Cmd escCmd = escFac.create();
        escCmd.append(escCmd.getHeaderCmd());
        escCmd.setChartsetName("UTF-8");
        CommonSetting commonSetting = new CommonSetting();
        BarcodeSetting barcodeSetting = new BarcodeSetting();
        barcodeSetting.setQrcodeDotSize(5);
        commonSetting.setAlign(CommonEnum.ALIGN_LEFT);
        escCmd.append(escCmd.getCommonSettingCmd(commonSetting));

        TextSetting textSetting = new TextSetting();
        textSetting.setEscFontType(ESCFontTypeEnum.FONT_A_12x24);
        try {
            String preBlank = "";
            textSetting.setAlign(CommonEnum.ALIGN_MIDDLE);
            textSetting.setBold(SettingEnum.Enable);
            try {
                commonSetting.setAlign(CommonEnum.ALIGN_MIDDLE);
                escCmd.append(escCmd.getCommonSettingCmd(commonSetting));
                escCmd.append(escCmd.getBarcodeCmd(BarcodeType.QR_CODE, barcodeSetting, "QRCode"));
                escCmd.append(escCmd.getLFCRCmd());
            } catch (SdkException e) {
                e.printStackTrace();
            }
            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "BEST - Huỳnh Văn Bánh"));
            escCmd.append(escCmd.getLFCRCmd());
            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "470 Huynh Van Banh - Phu Nhuan TP.HCM"));
            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "0283 123 456"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_MIDDLE);
//            textSetting.setBold(SettingEnum.Enable);
//            textSetting.setDoubleHeight(SettingEnum.Enable);//倍高
//            textSetting.setDoubleWidth(SettingEnum.Enable);//倍宽
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "PHIEU THANH TOAN"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setDoubleHeight(SettingEnum.Disable);//倍高
//            textSetting.setDoubleWidth(SettingEnum.Disable);//倍宽
//            textSetting.setBold(SettingEnum.Disable);
//            textSetting.setAlign(CommonEnum.ALIGN_LEFT);
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "NV:DO NGUYEN NGOC TRAN"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "Ngay HD: 05/11/2020 10:00:00"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "Ma so: 21010312470444"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "Ngay in: 05/11/2020 10:05:00"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "Giao hang:DO NGUYEN NGOC TRAN"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_LEFT);
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Ten hang       SL      VAT     D.gia      T.tien"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "THIT NACH"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_RIGHT);
//            escCmd.append(escCmd.getTextCmd(textSetting, "             1.7   Kg   /      102,000   174,420"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_LEFT);
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "SUON NON"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_RIGHT);
//            escCmd.append(escCmd.getTextCmd(textSetting, "             1.4   Kg   /      175,000   243,950"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_LEFT);
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "XUONG SACH"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_RIGHT);
//            escCmd.append(escCmd.getTextCmd(textSetting, "             1.1   Kg   /       25,500    27,795"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_LEFT);
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "DUI GA GOC TU"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_RIGHT);
//            escCmd.append(escCmd.getTextCmd(textSetting, "             0.6   Kg   /       35,700    22,884"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_LEFT);
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "Tong So Luong"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "           4,835 Kg"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, preBlank + "Dong goi:.....Kien....Bich....Thung"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Giam gia :                                67,603"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Chiet khau :                                   -"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Tong tien truoc GTGT :                   536,652"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Tong tien GTGT :                               -"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Tong so tien thanh toan :                536,652"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Tong so tien khach tra :                 469,049"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "Tien thoi lai :                                -"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_MIDDLE);
//            escCmd.append(escCmd.getTextCmd(textSetting, "(Gia tren da bao gom thue GTGT)"));
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_LEFT);
//            escCmd.append(escCmd.getTextCmd(textSetting, "------------------------------------------------"));
//            escCmd.append(escCmd.getLFCRCmd());
//            escCmd.append(escCmd.getLFCRCmd());
//            textSetting.setAlign(CommonEnum.ALIGN_MIDDLE);
//            escCmd.append(escCmd.getTextCmd(textSetting, "Cam on quy khach hen gap lai !"));
            escCmd.append(escCmd.getLFCRCmd());
            escCmd.append(escCmd.getLFCRCmd());
            escCmd.append(escCmd.getLFCRCmd());
            escCmd.append(escCmd.getLFCRCmd());

            rtPrinter.writeMsgAsync(escCmd.getAppendCmds());
        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
            Log.e(LOG_TAG,e.getMessage());
        }
    }

    private void appendCommands(Cmd escCmd, ReadableArray printCommands) {
        String preBlank = "";
        escCmd.append(escCmd.getHeaderCmd());//初始化
        escCmd.setChartsetName("UTF-8");
        CommonSetting commonSetting = new CommonSetting();
        commonSetting.setAlign(CommonEnum.ALIGN_MIDDLE);
        escCmd.append(escCmd.getCommonSettingCmd(commonSetting));
        TextSetting textSetting = new TextSetting();
        textSetting.setEscFontType(ESCFontTypeEnum.FONT_A_12x24);

        try {
            BitmapSetting bitmapSetting = new BitmapSetting();
            bitmapSetting.setBimtapLimitWidth(28 * 8);
            Bitmap mBitmap = BitmapFactory.decodeResource(reactContext.getResources(), R.drawable.japfa_logo);
            escCmd.append(escCmd.getBitmapCmd(bitmapSetting, mBitmap));
        } catch(Exception e) {
            e.printStackTrace();
        }

        for (int i = 0; i < printCommands.size(); i++) {
            ReadableMap command = printCommands.getMap(i);
            Map<String, Object> map = MapUtil.toMap(printCommands.getMap(i));
            String key = "";
            for (String strKey : map.keySet()) {
                key = strKey;
            }
            switch (key) {
                case AppendType.APPEND_ALIGNMENT:
                    commonSetting.setAlign(getAlignment(command.getString(AppendType.APPEND_ALIGNMENT)));
                    escCmd.append(escCmd.getCommonSettingCmd(commonSetting));
                    break;
                case AppendType.APPEND_LARGE_TEXT:
                    textSetting.setDoubleHeight(SettingEnum.Enable);
                    textSetting.setDoubleWidth(SettingEnum.Enable);
                    try {
                        escCmd.append(escCmd.getTextCmd(textSetting, preBlank + command.getString(AppendType.APPEND_LARGE_TEXT)));
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                    textSetting.setDoubleHeight(SettingEnum.Disable);
                    textSetting.setDoubleWidth(SettingEnum.Disable);
                    break;
                case AppendType.APPEND_TEXT:
                    try {
                        Log.i(TAG, preBlank + command.getString(AppendType.APPEND_TEXT));
                        escCmd.append(escCmd.getTextCmd(textSetting, preBlank + command.getString(AppendType.APPEND_TEXT)));
                    } catch (UnsupportedEncodingException e) {
                        e.printStackTrace();
                    }
                    break;
                case AppendType.APPEND_BREAK_LINE:
                    escCmd.append(escCmd.getLFCRCmd());
                    break;
                case AppendType.APPEND_QR_CODE:
                    BarcodeSetting barcodeSetting = new BarcodeSetting();
                    barcodeSetting.setQrcodeDotSize(5);
                    try {
                        commonSetting.setAlign(CommonEnum.ALIGN_MIDDLE);
                        escCmd.append(escCmd.getCommonSettingCmd(commonSetting));
                        escCmd.append(escCmd.getBarcodeCmd(BarcodeType.QR_CODE, barcodeSetting, command.getString(AppendType.APPEND_QR_CODE)));
                        escCmd.append(escCmd.getLFCRCmd());
                    } catch (SdkException e) {
                        e.printStackTrace();
                    }
                    break;
            }
        }
    }

    private int getAlignment(String align) {
        switch (align) {
            case "Left":
                return CommonEnum.ALIGN_LEFT;
            case "Right":
                return CommonEnum.ALIGN_RIGHT;
            case "Center":
                return CommonEnum.ALIGN_MIDDLE;
            default:
                return CommonEnum.ALIGN_BOTH_SIDES;
        }
    }

    @ReactMethod
    public void scanDevices(final Promise promise) {
        BluetoothAdapter adapter = this.getBluetoothAdapter();
        if (adapter == null) {
            promise.reject(EVENT_BLUETOOTH_NOT_SUPPORT);
        } else {
            int permissionChecked = ContextCompat.checkSelfPermission(reactContext, android.Manifest.permission.ACCESS_COARSE_LOCATION);
            if (permissionChecked == PackageManager.PERMISSION_DENIED) {
                ActivityCompat.requestPermissions(reactContext.getCurrentActivity(),
                        new String[]{android.Manifest.permission.ACCESS_COARSE_LOCATION},
                        1);
            }

            WritableArray result = new WritableNativeArray();
            Set<BluetoothDevice> boundDevices = adapter.getBondedDevices();
            for (BluetoothDevice d : boundDevices) {
                try {
                    WritableMap port = new WritableNativeMap();
                    port.putString("portName", d.getName());
                    port.putString("macAddress", d.getAddress());
                    result.pushMap(port);
                } catch (Exception e) {
                    //ignore.
                }
            }
            promise.resolve(result);
        }
    }

    private BluetoothAdapter getBluetoothAdapter() {
        if (mBluetoothAdapter == null) {
            mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        }
        return mBluetoothAdapter;
    }
}

