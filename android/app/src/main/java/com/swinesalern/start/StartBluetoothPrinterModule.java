package com.swinesalern.start;

import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.net.Uri;
import android.provider.MediaStore;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.starmicronics.stario.PortInfo;
import com.starmicronics.stario.StarIOPort;
import com.starmicronics.stario.StarIOPortException;
import com.starmicronics.stario.StarPrinterStatus;
import com.starmicronics.starioextension.ConnectionCallback;
import com.starmicronics.starioextension.ICommandBuilder;
import com.starmicronics.starioextension.IConnectionCallback;
import com.starmicronics.starioextension.StarIoExt;
import com.starmicronics.starioextension.StarIoExtManager;
import com.starmicronics.starioextension.StarIoExtManagerListener;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.UnsupportedCharsetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class StartBluetoothPrinterModule extends ReactContextBaseJavaModule {

    private static final String TAG = "StartBluetoothPrinter";

    private static String ENCODING = "UTF-8";

    private static final String BLE_PREFIX = "BT:";
    private static final String PORT_NAME = "portName";
    private static final String MAC_ADDRESS = "macAddress";
    private static final String MODULE_NAME = "moduleName";

    private static final String EMULATION_NAME = "StarPRNT";

    // Error
    private static final String PORT_DISCOVERY_ERROR = "PORT_DISCOVERY_ERROR";


    private final ReactApplicationContext reactContext;
    private StarIoExtManager starIoExtManager;

    StartBluetoothPrinterModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "StartBltPrinter";
    }

    @ReactMethod
    public void portDiscovery(final Promise promise) {
        new Thread(new Runnable() {
            public void run() {
                Log.i(TAG, "run: discovery");
                WritableArray result = new WritableNativeArray();
                try {
                    List<PortInfo> BTPortList = StarIOPort.searchPrinter(BLE_PREFIX);
                    for (PortInfo portInfo : BTPortList) {
                        WritableMap port = new WritableNativeMap();
                        port.putString(PORT_NAME, portInfo.getPortName());
                        port.putString(MAC_ADDRESS, portInfo.getMacAddress());
                        port.putString(MODULE_NAME, portInfo.getModelName());
                        result.pushMap(port);
                    }
                } catch (StarIOPortException exception) {
                    promise.reject(PORT_DISCOVERY_ERROR, exception);
                } finally {
                    promise.resolve(result);
                }
            }
        }).start();
    }

    @ReactMethod
    public void checkStatus(final String portName, final Promise promise) {
        new Thread(new Runnable() {
            public void run() {

                String portSettings = getPortSettingsOption(EMULATION_NAME);

                StarIOPort port = null;
                try {

                    port = StarIOPort.getPort(portName, portSettings, 10000, getReactApplicationContext());

                    // A sleep is used to get time for the socket to completely open
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                    }

                    StarPrinterStatus status;
                    Map<String, String> firmwareInformationMap = port.getFirmwareInformation();
                    status = port.retreiveStatus();


                    WritableNativeMap json = new WritableNativeMap();
                    json.putBoolean("offline", status.offline);
                    json.putBoolean("coverOpen", status.coverOpen);
                    json.putBoolean("cutterError", status.cutterError);
                    json.putBoolean("receiptPaperEmpty", status.receiptPaperEmpty);
                    json.putString("ModelName", firmwareInformationMap.get("ModelName"));
                    json.putString("FirmwareVersion", firmwareInformationMap.get("FirmwareVersion"));

                    promise.resolve(json);


                } catch (StarIOPortException e) {
                    promise.reject("CHECK_STATUS_ERROR", e);
                } finally {

                    if (port != null) {
                        try {
                            StarIOPort.releasePort(port);
                        } catch (StarIOPortException e) {
                            promise.reject("CHECK_STATUS_ERROR", e.getMessage());
                        }
                    }

                }

            }
        }).start();
    }

    @ReactMethod
    public void connect(final String portName, final Boolean hasBarcodeReader, final Promise promise) {
        Context context = getCurrentActivity();
        String portSettings = getPortSettingsOption(EMULATION_NAME);
        if (starIoExtManager != null && starIoExtManager.getPort() != null) {
            starIoExtManager.disconnect((ConnectionCallback) null);
        }
        starIoExtManager = new StarIoExtManager(hasBarcodeReader ? StarIoExtManager.Type.WithBarcodeReader : StarIoExtManager.Type.Standard, portName, portSettings, 10000, context);
        starIoExtManager.setListener(starIoExtManagerListener);
        new Thread(new Runnable() {
            public void run() {

                if (starIoExtManager != null) starIoExtManager.connect(new IConnectionCallback() {
                    @Override
                    public void onConnected(ConnectResult connectResult) {
                        WritableMap objResult = new WritableNativeMap();
                        String isConnected = "isConnected";
                        String message = "message";
                        if (connectResult == ConnectResult.Success || connectResult == ConnectResult.AlreadyConnected) {
                            objResult.putBoolean(isConnected, true);
                            objResult.putString(message, "Printer Connected");
                        } else {
                            objResult.putBoolean(isConnected, false);
                            objResult.putString(message, "Error Connecting to the printer");
                        }
                        promise.resolve(objResult);
                    }

                    @Override
                    public void onDisconnected() {
                        //Do nothing
                    }
                });

            }
        }).start();
    }

    @ReactMethod
    public void disconnect(final Promise promise) {
        new Thread(new Runnable() {
            public void run() {
                if (starIoExtManager != null && starIoExtManager.getPort() != null) {
                    starIoExtManager.disconnect(new IConnectionCallback() {
                        @Override
                        public void onConnected(ConnectResult connectResult) {
                            // nothing
                        }

                        @Override
                        public void onDisconnected() {
                            //sendEvent("printerOffline", null);
                            starIoExtManager.setListener(null); //remove the listener?
                            promise.resolve("Printer Disconnected");
                        }
                    });
                } else {
                    promise.resolve("No printers connected");
                }

            }
        }).start();
    }

    @ReactMethod
    public void print(final String portName, final ReadableArray printCommands, final Promise promise) {
        Log.i(TAG, "BEGIN PRINT");
        final String portSettings = getPortSettingsOption(EMULATION_NAME);
        final StarIoExt.Emulation _emulation = StarIoExt.Emulation.StarPRNT;
        final Context context = getCurrentActivity();
//        new Thread(() -> {
            ICommandBuilder builder = StarIoExt.createCommandBuilder(_emulation);
            builder.beginDocument();
            appendCommands(builder, printCommands, context);
            builder.endDocument();
            byte[] commands = builder.getCommands();
            if (portName == "null") {
                sendCommand(commands, starIoExtManager.getPort(), promise);
            } else {
                sendCommand(context, portName, portSettings, commands, promise);
            }
//        }).start();
    }

    private String getPortSettingsOption(String emulation) { // generate the portsettings depending on the emulation type

        String portSettings = "";

        if (emulation.equals("EscPosMobile")) portSettings += "mini";
        else if (emulation.equals("EscPos")) portSettings += "escpos";
        else //StarLine, StarGraphic, StarDotImpact
            if (emulation.equals("StarPRNT") || emulation.equals("StarPRNTL")) {
                portSettings += "Portable";
                portSettings += ";l"; //retry on
            } else portSettings += "";
        return portSettings;
    }

    private boolean sendCommand(byte[] commands, StarIOPort port, Promise promise) {

        try {
            /*
             * using StarIOPort3.1.jar (support USB Port) Android OS Version: upper 2.2
             */
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
            }
            if (port == null) { //Not connected or port closed
                promise.reject("STARIO_PORT_EXCEPTION", "Unable to Open Port, Please Connect to the printer before sending commands");
                return false;
            }

            /*
             * Using Begin / End Checked Block method When sending large amounts of raster data,
             * adjust the value in the timeout in the "StarIOPort.getPort" in order to prevent
             * "timeout" of the "endCheckedBlock method" while a printing.
             *
             * If receipt print is success but timeout error occurs(Show message which is "There
             * was no response of the printer within the timeout period." ), need to change value
             * of timeout more longer in "StarIOPort.getPort" method.
             * (e.g.) 10000 -> 30000
             */
            StarPrinterStatus status;

            status = port.beginCheckedBlock();

            if (status.offline) {
                throw new StarIOPortException("A printer is offline");
            }

            port.writePort(commands, 0, commands.length);

            port.setEndCheckedBlockTimeoutMillis(30000);// Change the timeout time of endCheckedBlock method.

            status = port.endCheckedBlock();

            if (status.coverOpen) {
                promise.reject("STARIO_PORT_EXCEPTION", "Cover open");
                //sendEvent("printerCoverOpen", null);
                return false;
            } else if (status.receiptPaperEmpty) {
                promise.reject("STARIO_PORT_EXCEPTION", "Empty paper");
                //sendEvent("printerPaperEmpty", null);
                return false;
            } else if (status.offline) {
                promise.reject("STARIO_PORT_EXCEPTION", "Printer offline");
                //sendEvent("printerOffline", null);
                return false;
            }
            promise.resolve("Success!");

        } catch (StarIOPortException e) {
            //sendEvent("printerImpossible", e.getMessage());
            promise.reject("STARIO_PORT_EXCEPTION", e.getMessage());
            return false;
        } finally {
            return true;
        }
    }

    private boolean sendCommand(Context context, String portName, String portSettings, byte[] commands, Promise promise) {

        StarIOPort port = null;
        try {
            /*
             * using StarIOPort3.1.jar (support USB Port) Android OS Version: upper 2.2
             */
            port = StarIOPort.getPort(portName, portSettings, 10000, context);
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
            }

            /*
             * Using Begin / End Checked Block method When sending large amounts of raster data,
             * adjust the value in the timeout in the "StarIOPort.getPort" in order to prevent
             * "timeout" of the "endCheckedBlock method" while a printing.
             *
             * If receipt print is success but timeout error occurs(Show message which is "There
             * was no response of the printer within the timeout period." ), need to change value
             * of timeout more longer in "StarIOPort.getPort" method.
             * (e.g.) 10000 -> 30000
             */
            StarPrinterStatus status = port.beginCheckedBlock();

            if (status.offline) {
                //throw new StarIOPortException("A printer is offline");
                throw new StarIOPortException("A printer is offline");
            }

            port.writePort(commands, 0, commands.length);


            port.setEndCheckedBlockTimeoutMillis(30000);// Change the timeout time of endCheckedBlock method.
            status = port.endCheckedBlock();

            if (status.coverOpen) {
                promise.reject("STARIO_PORT_EXCEPTION", "Cover open");
                return false;
            } else if (status.receiptPaperEmpty) {
                promise.reject("STARIO_PORT_EXCEPTION", "Empty paper");
                return false;
            } else if (status.offline) {
                promise.reject("STARIO_PORT_EXCEPTION", "Printer offline");
                return false;
            }
            promise.resolve("Success!");

        } catch (StarIOPortException e) {
            promise.reject("STARIO_PORT_EXCEPTION", e.getMessage());
        } finally {
            if (port != null) {
                try {
                    StarIOPort.releasePort(port);
                } catch (StarIOPortException e) {
                }
            }
            return true;
        }
    }

    private void appendCommands(ICommandBuilder builder, ReadableArray printCommands, Context context) {
        Charset encoding = Charset.forName(ENCODING);
        builder.appendCodePage(ICommandBuilder.CodePageType.UTF8);
        for (int i = 0; i < printCommands.size(); i++) {
            ReadableMap command = printCommands.getMap(i);
            Map<String, Object> map = MapUtil.toMap(printCommands.getMap(i));
            String key = "";
            for (String strKey : map.keySet()) {
               key = strKey;
            }
            Log.i(TAG, "appendCommands: " + key);

            switch (key) {
                case AppendType.APPEND_ALIGNMENT:
                    builder.appendAlignment(Helpers.getAlignment(command.getString(AppendType.APPEND_ALIGNMENT)));
                    break;
                case AppendType.APPEND:
                    builder.append(command.getString(AppendType.APPEND).getBytes(encoding));
                    break;
                case AppendType.APPEND_MULTIPLE:
                    int w = 2;
                    int h = 2;
                    String value = command.getString(AppendType.APPEND_MULTIPLE);
                    builder.appendMultiple(value.getBytes(encoding), w, h);
                    break;
                case AppendType.APPEND_BARCODE:
                    ICommandBuilder.BarcodeSymbology barcodeSymbology = ICommandBuilder.BarcodeSymbology.Code128;
                    ICommandBuilder.BarcodeWidth barcodeWidth = ICommandBuilder.BarcodeWidth.Mode2;
                    int height = 40;
                    Boolean hri = true;
                    String barcodeData = "{B" + command.getString(AppendType.APPEND_BARCODE);
                    Log.i(TAG, "barcode: " + barcodeData);
                    builder.appendBarcode(barcodeData.getBytes(encoding), barcodeSymbology, barcodeWidth, height, hri);
                    break;
                case AppendType.APPEND_CUT_PAPER:
                    builder.appendCutPaper(ICommandBuilder.CutPaperAction.PartialCutWithFeed);
                    break;
                case AppendType.APPEND_QR_CODE:
                    builder.appendQrCode(command.getString(AppendType.APPEND_QR_CODE).getBytes(encoding), ICommandBuilder.QrCodeModel.No2, ICommandBuilder.QrCodeLevel.L, 4);
                    break;
            }
        }
    }


    private void sendEvent(String dataType, String info) {
        ReactContext reactContext = getReactApplicationContext();
        WritableMap params = new WritableNativeMap();
        params.putString("dataType", dataType);
        if (info != null) params.putString("data", info);
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(TAG, params);
    }

    private StarIoExtManagerListener starIoExtManagerListener = new StarIoExtManagerListener() {
        @Override
        public void onPrinterImpossible() {
            sendEvent("printerImpossible", null);
        }

        @Override
        public void onPrinterOnline() {
            sendEvent("printerOnline", null);
        }

        @Override
        public void onPrinterOffline() {
            sendEvent("printerOffline", null);
        }

        @Override
        public void onPrinterPaperReady() {
            sendEvent("printerPaperReady", null);
        }

        @Override
        public void onPrinterPaperNearEmpty() {
            sendEvent("printerPaperNearEmpty", null);
        }

        @Override
        public void onPrinterPaperEmpty() {
            sendEvent("printerPaperEmpty", null);
        }

        @Override
        public void onPrinterCoverOpen() {
            sendEvent("printerCoverOpen", null);
        }

        @Override
        public void onPrinterCoverClose() {
            sendEvent("printerCoverClose", null);
        }

        //Cash Drawer events
        @Override
        public void onCashDrawerOpen() {
            sendEvent("cashDrawerOpen", null);
        }

        @Override
        public void onCashDrawerClose() {
            sendEvent("cashDrawerClose", null);
        }

        @Override
        public void onBarcodeReaderImpossible() {
            sendEvent("barcodeReaderImpossible", null);
        }

        @Override
        public void onBarcodeReaderConnect() {
            sendEvent("barcodeReaderConnect", null);
        }

        @Override
        public void onBarcodeReaderDisconnect() {
            sendEvent("barcodeReaderDisconnect", null);
        }

        @Override
        public void onBarcodeDataReceive(byte[] data) {
            sendEvent("barcodeDataReceive", new String(data));
        }

    };
}