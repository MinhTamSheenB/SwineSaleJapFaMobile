package com.swinesalern.start;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Typeface;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;

import com.starmicronics.starioextension.ICommandBuilder;

import java.nio.charset.Charset;
import java.nio.charset.UnsupportedCharsetException;

public class Helpers {

    public static Charset getEncoding(String encoding) {

        if (encoding.equals("US-ASCII")) return Charset.forName("US-ASCII"); //English
        else if (encoding.equals("Windows-1252")) {
            try {
                return Charset.forName("Windows-1252"); //French, German, Portuguese, Spanish
            } catch (UnsupportedCharsetException e) { //not supported using UTF-8 Instead
                return Charset.forName("UTF-8");
            }
        } else if (encoding.equals("Shift-JIS")) {
            try {
                return Charset.forName("Shift-JIS"); //Japanese
            } catch (UnsupportedCharsetException e) { //not supported using UTF-8 Instead
                return Charset.forName("UTF-8");
            }
        } else if (encoding.equals("Windows-1251")) {
            try {
                return Charset.forName("Windows-1251"); //Russian
            } catch (UnsupportedCharsetException e) { //not supported using UTF-8 Instead
                return Charset.forName("UTF-8");
            }
        } else if (encoding.equals("GB2312")) {
            try {
                return Charset.forName("GB2312"); // Simplified Chinese
            } catch (UnsupportedCharsetException e) { //not supported using UTF-8 Instead
                return Charset.forName("UTF-8");
            }
        } else if (encoding.equals("Big5")) {
            try {
                return Charset.forName("Big5"); // Traditional Chinese
            } catch (UnsupportedCharsetException e) { //not supported using UTF-8 Instead
                return Charset.forName("UTF-8");
            }
        } else if (encoding.equals("UTF-8")) return Charset.forName("UTF-8"); // UTF-8
        else return Charset.forName("US-ASCII");
    }

    public static Bitmap createBitmapFromText(String printText, int textSize, int printWidth, Typeface typeface) {
        Paint paint = new Paint();
        Bitmap bitmap;
        Canvas canvas;

        paint.setTextSize(textSize);
        paint.setTypeface(typeface);
        paint.getTextBounds(printText, 0, printText.length(), new Rect());

        TextPaint textPaint = new TextPaint(paint);
        android.text.StaticLayout staticLayout = new StaticLayout(printText, textPaint, printWidth, Layout.Alignment.ALIGN_NORMAL, 1, 0, false);

        // Create bitmap
        bitmap = Bitmap.createBitmap(staticLayout.getWidth(), staticLayout.getHeight(), Bitmap.Config.ARGB_8888);

        // Create canvas
        canvas = new Canvas(bitmap);
        canvas.drawColor(Color.WHITE);
        canvas.translate(0, 0);
        staticLayout.draw(canvas);

        return bitmap;
    }

    //ICommandBuilder Constant Functions
    public static ICommandBuilder.InternationalType getInternational(String international) {
        if (international.equals("UK")) return ICommandBuilder.InternationalType.UK;
        else if (international.equals("USA")) return ICommandBuilder.InternationalType.USA;
        else if (international.equals("France")) return ICommandBuilder.InternationalType.France;
        else if (international.equals("Germany")) return ICommandBuilder.InternationalType.Germany;
        else if (international.equals("Denmark")) return ICommandBuilder.InternationalType.Denmark;
        else if (international.equals("Sweden")) return ICommandBuilder.InternationalType.Sweden;
        else if (international.equals("Italy")) return ICommandBuilder.InternationalType.Italy;
        else if (international.equals("Spain")) return ICommandBuilder.InternationalType.Spain;
        else if (international.equals("Japan")) return ICommandBuilder.InternationalType.Japan;
        else if (international.equals("Norway")) return ICommandBuilder.InternationalType.Norway;
        else if (international.equals("Denmark2"))
            return ICommandBuilder.InternationalType.Denmark2;
        else if (international.equals("Spain2")) return ICommandBuilder.InternationalType.Spain2;
        else if (international.equals("LatinAmerica"))
            return ICommandBuilder.InternationalType.LatinAmerica;
        else if (international.equals("Korea")) return ICommandBuilder.InternationalType.Korea;
        else if (international.equals("Ireland")) return ICommandBuilder.InternationalType.Ireland;
        else if (international.equals("Legal")) return ICommandBuilder.InternationalType.Legal;
        else return ICommandBuilder.InternationalType.USA;
    }

    public static ICommandBuilder.AlignmentPosition getAlignment(String alignment) {
        if (alignment.equals("Left")) return ICommandBuilder.AlignmentPosition.Left;
        else if (alignment.equals("Center")) return ICommandBuilder.AlignmentPosition.Center;
        else if (alignment.equals("Right")) return ICommandBuilder.AlignmentPosition.Right;
        else return ICommandBuilder.AlignmentPosition.Left;
    }

    public static ICommandBuilder.BarcodeSymbology getBarcodeSymbology(String barcodeSymbology) {
        if (barcodeSymbology.equals("Code128")) return ICommandBuilder.BarcodeSymbology.Code128;
        else if (barcodeSymbology.equals("Code39")) return ICommandBuilder.BarcodeSymbology.Code39;
        else if (barcodeSymbology.equals("Code93")) return ICommandBuilder.BarcodeSymbology.Code93;
        else if (barcodeSymbology.equals("ITF")) return ICommandBuilder.BarcodeSymbology.ITF;
        else if (barcodeSymbology.equals("JAN8")) return ICommandBuilder.BarcodeSymbology.JAN8;
        else if (barcodeSymbology.equals("JAN13")) return ICommandBuilder.BarcodeSymbology.JAN13;
        else if (barcodeSymbology.equals("NW7")) return ICommandBuilder.BarcodeSymbology.NW7;
        else if (barcodeSymbology.equals("UPCA")) return ICommandBuilder.BarcodeSymbology.UPCA;
        else if (barcodeSymbology.equals("UPCE")) return ICommandBuilder.BarcodeSymbology.UPCE;
        else return ICommandBuilder.BarcodeSymbology.Code128;
    }

    public static ICommandBuilder.BarcodeWidth getBarcodeWidth(String barcodeWidth) {
        if (barcodeWidth.equals("Mode1")) return ICommandBuilder.BarcodeWidth.Mode1;
        if (barcodeWidth.equals("Mode2")) return ICommandBuilder.BarcodeWidth.Mode2;
        if (barcodeWidth.equals("Mode3")) return ICommandBuilder.BarcodeWidth.Mode3;
        if (barcodeWidth.equals("Mode4")) return ICommandBuilder.BarcodeWidth.Mode4;
        if (barcodeWidth.equals("Mode5")) return ICommandBuilder.BarcodeWidth.Mode5;
        if (barcodeWidth.equals("Mode6")) return ICommandBuilder.BarcodeWidth.Mode6;
        if (barcodeWidth.equals("Mode7")) return ICommandBuilder.BarcodeWidth.Mode7;
        if (barcodeWidth.equals("Mode8")) return ICommandBuilder.BarcodeWidth.Mode8;
        if (barcodeWidth.equals("Mode9")) return ICommandBuilder.BarcodeWidth.Mode9;
        return ICommandBuilder.BarcodeWidth.Mode2;
    }

    public static ICommandBuilder.FontStyleType getFontStyle(String fontStyle) {
        if (fontStyle.equals("A")) return ICommandBuilder.FontStyleType.A;
        if (fontStyle.equals("B")) return ICommandBuilder.FontStyleType.B;
        return ICommandBuilder.FontStyleType.A;
    }

    public static ICommandBuilder.LogoSize getLogoSize(String logoSize) {
        if (logoSize.equals("Normal")) return ICommandBuilder.LogoSize.Normal;
        else if (logoSize.equals("DoubleWidth")) return ICommandBuilder.LogoSize.DoubleWidth;
        else if (logoSize.equals("DoubleHeight")) return ICommandBuilder.LogoSize.DoubleHeight;
        else if (logoSize.equals("DoubleWidthDoubleHeight"))
            return ICommandBuilder.LogoSize.DoubleWidthDoubleHeight;
        else return ICommandBuilder.LogoSize.Normal;
    }

    public static ICommandBuilder.CutPaperAction getCutPaperAction(String cutPaperAction) {
        if (cutPaperAction.equals("FullCut")) return ICommandBuilder.CutPaperAction.FullCut;
        else if (cutPaperAction.equals("FullCutWithFeed"))
            return ICommandBuilder.CutPaperAction.FullCutWithFeed;
        else if (cutPaperAction.equals("PartialCut"))
            return ICommandBuilder.CutPaperAction.PartialCut;
        else if (cutPaperAction.equals("PartialCutWithFeed"))
            return ICommandBuilder.CutPaperAction.PartialCutWithFeed;
        else return ICommandBuilder.CutPaperAction.PartialCutWithFeed;
    }

    public static ICommandBuilder.PeripheralChannel getPeripheralChannel(int peripheralChannel) {
        if (peripheralChannel == 1) return ICommandBuilder.PeripheralChannel.No1;
        else if (peripheralChannel == 2) return ICommandBuilder.PeripheralChannel.No2;
        else return ICommandBuilder.PeripheralChannel.No1;
    }

    public static ICommandBuilder.QrCodeModel getQrCodeModel(String qrCodeModel) {
        if (qrCodeModel.equals("No1")) return ICommandBuilder.QrCodeModel.No1;
        else if (qrCodeModel.equals("No2")) return ICommandBuilder.QrCodeModel.No2;
        else return ICommandBuilder.QrCodeModel.No1;
    }

    public static ICommandBuilder.QrCodeLevel getQrCodeLevel(String qrCodeLevel) {
        if (qrCodeLevel.equals("H")) return ICommandBuilder.QrCodeLevel.H;
        else if (qrCodeLevel.equals("L")) return ICommandBuilder.QrCodeLevel.L;
        else if (qrCodeLevel.equals("M")) return ICommandBuilder.QrCodeLevel.M;
        else if (qrCodeLevel.equals("Q")) return ICommandBuilder.QrCodeLevel.Q;
        else return ICommandBuilder.QrCodeLevel.H;
    }

    public static ICommandBuilder.BitmapConverterRotation getConverterRotation(String converterRotation) {
        if (converterRotation.equals("Normal"))
            return ICommandBuilder.BitmapConverterRotation.Normal;
        else if (converterRotation.equals("Left90"))
            return ICommandBuilder.BitmapConverterRotation.Left90;
        else if (converterRotation.equals("Right90"))
            return ICommandBuilder.BitmapConverterRotation.Right90;
        else if (converterRotation.equals("Rotate180"))
            return ICommandBuilder.BitmapConverterRotation.Rotate180;
        else return ICommandBuilder.BitmapConverterRotation.Normal;
    }

    public static ICommandBuilder.BlackMarkType getBlackMarkType(String blackMarkType) {
        if (blackMarkType.equals("Valid")) return ICommandBuilder.BlackMarkType.Valid;
        else if (blackMarkType.equals("Invalid")) return ICommandBuilder.BlackMarkType.Invalid;
        else if (blackMarkType.equals("ValidWithDetection"))
            return ICommandBuilder.BlackMarkType.ValidWithDetection;
        else return ICommandBuilder.BlackMarkType.Valid;
    }

    public static ICommandBuilder.CodePageType getCodePageType(String codePageType) {
        if (codePageType.equals("CP437")) return ICommandBuilder.CodePageType.CP437;
        else if (codePageType.equals("CP737")) return ICommandBuilder.CodePageType.CP737;
        else if (codePageType.equals("CP772")) return ICommandBuilder.CodePageType.CP772;
        else if (codePageType.equals("CP774")) return ICommandBuilder.CodePageType.CP774;
        else if (codePageType.equals("CP851")) return ICommandBuilder.CodePageType.CP851;
        else if (codePageType.equals("CP852")) return ICommandBuilder.CodePageType.CP852;
        else if (codePageType.equals("CP855")) return ICommandBuilder.CodePageType.CP855;
        else if (codePageType.equals("CP857")) return ICommandBuilder.CodePageType.CP857;
        else if (codePageType.equals("CP858")) return ICommandBuilder.CodePageType.CP858;
        else if (codePageType.equals("CP860")) return ICommandBuilder.CodePageType.CP860;
        else if (codePageType.equals("CP861")) return ICommandBuilder.CodePageType.CP861;
        else if (codePageType.equals("CP862")) return ICommandBuilder.CodePageType.CP862;
        else if (codePageType.equals("CP863")) return ICommandBuilder.CodePageType.CP863;
        else if (codePageType.equals("CP864")) return ICommandBuilder.CodePageType.CP864;
        else if (codePageType.equals("CP865")) return ICommandBuilder.CodePageType.CP866;
        else if (codePageType.equals("CP869")) return ICommandBuilder.CodePageType.CP869;
        else if (codePageType.equals("CP874")) return ICommandBuilder.CodePageType.CP874;
        else if (codePageType.equals("CP928")) return ICommandBuilder.CodePageType.CP928;
        else if (codePageType.equals("CP932")) return ICommandBuilder.CodePageType.CP932;
        else if (codePageType.equals("CP999")) return ICommandBuilder.CodePageType.CP999;
        else if (codePageType.equals("CP1001")) return ICommandBuilder.CodePageType.CP1001;
        else if (codePageType.equals("CP1250")) return ICommandBuilder.CodePageType.CP1250;
        else if (codePageType.equals("CP1251")) return ICommandBuilder.CodePageType.CP1251;
        else if (codePageType.equals("CP1252")) return ICommandBuilder.CodePageType.CP1252;
        else if (codePageType.equals("CP2001")) return ICommandBuilder.CodePageType.CP2001;
        else if (codePageType.equals("CP3001")) return ICommandBuilder.CodePageType.CP3001;
        else if (codePageType.equals("CP3002")) return ICommandBuilder.CodePageType.CP3002;
        else if (codePageType.equals("CP3011")) return ICommandBuilder.CodePageType.CP3011;
        else if (codePageType.equals("CP3012")) return ICommandBuilder.CodePageType.CP3012;
        else if (codePageType.equals("CP3021")) return ICommandBuilder.CodePageType.CP3021;
        else if (codePageType.equals("CP3041")) return ICommandBuilder.CodePageType.CP3041;
        else if (codePageType.equals("CP3840")) return ICommandBuilder.CodePageType.CP3840;
        else if (codePageType.equals("CP3841")) return ICommandBuilder.CodePageType.CP3841;
        else if (codePageType.equals("CP3843")) return ICommandBuilder.CodePageType.CP3843;
        else if (codePageType.equals("CP3845")) return ICommandBuilder.CodePageType.CP3845;
        else if (codePageType.equals("CP3846")) return ICommandBuilder.CodePageType.CP3846;
        else if (codePageType.equals("CP3847")) return ICommandBuilder.CodePageType.CP3847;
        else if (codePageType.equals("CP3848")) return ICommandBuilder.CodePageType.CP3848;
        else if (codePageType.equals("UTF8")) return ICommandBuilder.CodePageType.UTF8;
        else if (codePageType.equals("Blank")) return ICommandBuilder.CodePageType.Blank;
        else return ICommandBuilder.CodePageType.CP998;
    }


}
