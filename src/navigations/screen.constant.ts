const ScreenType = {
  Main: {
    Test: 'TestScreen',
    Login: 'Login.Screen',
    Home: 'Home.Screen',
    Dashboard: 'Dashboard.Screen',
    Office: 'Office.Screen',
    WebView: 'WebView.Screen',
    PassCode: 'PassCode.Screen',
    Start: 'Start.Screen',
    SetUpPassCode: 'Setup.PassCode.Screen',
    ConfirmSetUpPassCode: 'Confirm.Setup.PassCode.Screen',
    PdfViewer: 'Pdf.Viewer.Screen',
    CustomerBalance: 'CustomerBalanceScreen',
  },
  SO: {
    List: 'SO.LIST.SCREEN',
    CREATE_CUSTOMER: 'SO.CREATE.CUSTOMER',
    CREATE_RECEPT: 'SO.CREATE.RECEPT',
    PRODUCT_LIST: 'SO.PRODUCT.LIST',
    ADD_PRODUCT: 'SO.PRODUCT.ADD',
    DISCOUNT: 'SO.DISCOUNT.SCREEN',
    SUMMARY: 'SO.SUMMARY',
  },
  DO: {
    LIST: 'DO.LIST.SCREEN',
    CREATE_ORDER: 'DO.CREATE.ORDER',
    RECEPT: 'DO.RECEPT.SCREEN',
    PRODUCTS: 'DO.PRODUCTS.SCREEN',
    ADD_PRODUCT: 'DO.PRODUCTS.ADD',
    SUMMARY: 'DO.SUMMARY',
  },
  InternalTransfer: {
    LIST: 'INTERNAL_TRANSFER_LIST.SCREEN',
  },
  Invoice: {
    LIST: 'INVOICE.LIST.SCREEN',
    DETAIL: 'INVOICE.DETAIL.SCREEN',
  },
  Scale: {
    LIST: 'SCALE.LIST.SCREEN',
    DO_LIST: 'SCALE.DO.LIST.SCREEN',
    ADD_SCALE: 'SCALE.ADD.SCREEN',
    ADD_SCALE_DETAIL: 'SCALE.ADD_DETAIL.SCREEN',
  },
  Discount: {
    LIST: 'DISCOUNT.LIST.SCREEN',
    DETAIL: 'DISCOUNT.DETAIL.SCREEN',
  },
  Cndn: {
    LIST: 'CNDN.LIST.SCREEN',
    CREATE: 'CNDN.CREATE.SCREEN',
    ACCOUNT: 'CNDN.CREATE.ACCOUNT.SCREEN',
    ORDER: 'CNDN.CREATE.ORDER.SCREEN',
    SUMMARY: 'CNDN.SUMMARY.SCREEN',
    PRODUCTS: 'CNDN.PRODUCTS.SCREEN',
    ADD_PRODUCT: 'CNDN.ADD.PRODUCT.SCREEN',
    TOTAL_PAYMENT: 'CNDN.TOTAL.PAYMENT.SCREEN',
  },
  Credit: {
    LIST: 'CREDIT.LIST.SCREEN',
    CREATE: 'CREDIT.CREATE.SCREEN',
    DETAIL: 'CREDIT.DETAIL.SCREEN',
  },
  WeighingGoods: {
    DO_LIST: 'WEIGHING_GOODS_DO_LIST',
    CREATE: 'WEIGHING_GOODS_CREATE',
    DO_LIST_OFFLINE: 'DO_LIST_OFFLINE',
    CREATE_OFFLINE: 'WeighingGoodsCreateOfflineScreen',
  },
  Setting: {
    BLUETOOTH_SEARCH: 'SETTING_BLUETOOTH_SEARCH',
    DEVICES: 'SETTING_DEVICES',
  },
  Approval: {
    DISCOUNT: 'APPROVAL_DISCOUNT',
    CNDN: 'APPROVAL_CNDN',
  },
  ScaleNoteDown: {
    List: 'ScaleNoteDownListScreen',
    DO_LIST: 'ScaleNoteDownDoListScreen',
    EDIT: 'ScaleNoteDownEditScreen',
    EDIT_DETAIL: 'ScaleNoteDownEditDetailScreen',
    SUMMARY: 'ScaleNoteDownSummaryScreen',
  },
  DoRelease: {
    LIST: 'DoReleaseListScreen',
    SUMMARY: 'DoReleaseSummaryScreen',
  },
  Monitoring: {
    DailySale: 'DailySaleMonitoringScreen',
    Results: 'ResultsMonitoringScreen',
    Credit: 'CreditMonitoringScreen',
  },
};

export default ScreenType;
