/* eslint-disable spaced-comment */

export type Feature = 'SCALE_TEMP_HEADER' | 'SCALE_TEMP_DETAIL';
export type ActionLog = 'CREATE' | 'UPDATE' | 'DELETE' | 'SELECT';

export interface ILog {
  userName: string;
  feature: Feature;
  action: ActionLog;
  content: string;
  createdOn: number;
  createdOnLocal: string;
}

export interface IPasscodeAuth {
  passcode?: string;
  appType: 'SWINE_SALE' | undefined;
}

export interface IAuthResponse {
  code?: string;
  message?: string;
  result: boolean;
}

export interface ISearchCommon {
  label: string;
  value: string | number;
  keySearch: string;
}

export interface IMasterCommon {
  id: string;
  idNum: number;
  name: string;
  status: string;
  link: string;
  icon: string;
  check: string;
}

export interface IMasterMenuLevel2 {
  common: IMasterCommon;
  menulv3: IMasterCommon[];
}

export interface IMasterMenu {
  common: IMasterCommon;
  menulv2: IMasterMenuLevel2[];
}

export interface IMasterLoginDTO {
  UserIDInApp?: number;
  userID?: number;
  userID_old?: string;
  userName?: string;
  phoneNumber?: string;
  positionName?: string;
  positionID?: number;
  authenCode?: number;
  sapID?: string;
  rule?: string;
  ruleString?: string;
  accessToken: string;
}

export interface IAnimal {
  id: number;
  vnName: string;
  enName: string;
}

export interface IHttpStatus {
  code: number;
  message: string;
}

//#region  COMMON

export enum OrderStatus {
  Deleted = 0,
  New = 1,
  Posted = 2, // đơn hàng đã chốt
  Canceled = 3, // đơn hàng đã hủy
  Paymented = 4, // đơn hàng đã thanh toán
}

export enum DeliveryOrderStatus {
  Deleted = 0,
  New = 1,
  Finish = 2,
  InvoiceIssued = 3,
  NoExist = -1,
}

export enum WeightTempStatus {
  NoExist = -1,
  Deleted = 0,
  New = 1,
  Posted = 2,
}

export enum InvoiceStatus {
  Deleted = 0,
  New = 1,
  Published = 2,
  Canceled = 3,
}

export enum InvoiceItemStatus {
  Deleted = 0,
  New = 1,
}

export enum ScaleStatus {
  Deleted = 0,
  New = 1,
  Finish = 2,
}

export enum DiscountStatus {
  Deleted = 0,
  New = 1,
  Approved = 2,
}

export enum CnDnStatus {
  Deleted = 0,
  New = 1,
  Approved = 2,
  InvoiceIssued = 3,
  Rejected = 4,
}

export enum YesNoResult {
  Yes = 'Y',
  No = 'N',
}

export interface ISuccess {
  code: string;
}

export enum SaleSearch {
  GetAll = 0,
  BySingleValue = 1,
  ByRange = 2,
  ByList = 3,
}

export enum WeighingGoodsStatus {
  UnUpload = 1,
  Uploaded = 2,
}

export const CndnStatusName = {
  1: 'Chưa duyệt',
  2: 'Đã duyệt',
  3: 'Đã lập hoá đơn',
  4: 'Từ chối duyệt',
};

export interface IGlobalModel {
  regionId?: string;
  officeId?: number;
  unitId?: string;
  deptId?: number;
  userId?: string;
  loadDetail?: boolean;
}

export interface IGoodsDTO extends ISearchCommon {
  PRICEGROUP: string;
  SCALENAME: string;
  SCALENAME_NO_ZERO: string;
  TOTALWEIGHTORD?: number;
  MainGoodID?: string;
  Measure?: string;
  EXTPRODNAME?: string;
  GoodID?: string;
  GoodName: string;

  PRICE1: number;
  PRICE2: number;
  QTYORD?: number | undefined;
}

export interface ISoDoDetailCommon {
  CREATEDBY: string;
  CREATEDATE: string;
  CUSTBAL_BF: number;
  CUSTID: string;
  CUSTNAME: string;
  CUSTADDRESS?: string;
  DEPTID: number;
  DISCOUNT: number;
  DISCOUNTNOTE: string;
  GEN_CUSTINFOID: number;
  LOCATIONID: string;
  LOCATIONNAME: string;
  OFFICEID: number;
  PLACEDELIVERY: string;
  PLACEDELIVERYEID?: string;
  PRINTNUM: number;
  RECEIVEHOUR?: string;
  RECEIVERNAME?: string;
  RECEIVERPHONE?: string;
  REGIONID: string;
  REMARKS?: string;
  SALEMAN?: string;
  SALESPV?: string;
  SODATE: string;
  SONO: string;
  TOTALAMT: number;
  TOTALAMTAFTERVAT: number;
  TOTALQTY: number;
  TRUCK_NO?: string;
  UNITID: string;
  UPDATEDATE?: string;
  UPDATEDBY?: string;
  VAT?: number;
  BW_TOTAL?: number;
}

export interface ISoDoDetailItemModel {
  REGIONID?: string;
  OFFICEID?: number;
  DEPTID?: number;
  PRODUCTID?: string;
  PRODUCTNAME?: string;
  MEASURE?: string;
  QTY?: number;
  BW_AVG?: number;
  BW_TOTAL?: number;
  AMOUNT?: number;
  REMARKS?: string;
  SALEOFF_ID?: string;
  PRICEGROUP?: string;
  PRICEGROUP_DESCRIPTION?: string;
  REDUCEPRICE1?: number;
  REDUCEPRICE2?: number;
  PRICE1?: number;
  PRICE2?: number;
  UPDATEDBY: string;
  UPDATEDATE?: string;
  CREATEDDATE?: string;
  CREATEDBY?: string;
  STATUS?: OrderStatus;
  UNITID: string;
  PRICEGROUPUNIT?: string;
}

export interface ISoDoHeaderModelCommon {
  REGIONID: string;
  OFFICEID: number;
  UNITID: string;
  SONO: string;
  SODATE?: string;
  LOCATIONID: string;
  PLACEDELIVERYEID?: string;
  CUSTID: string;
  CUSTBAL_BF?: number;
  TRUCK_NO?: string;
  RECEIVEHOUR?: string;
  DISCOUNT?: number;
  DISCOUNTNOTE?: string;
  CREATEBY?: string;
  SALEMAN?: string;
  SALESPV?: string;
  GEN_CUSTINFOID?: number;
  CREATEDATE?: string;
  VAT?: number;
  DEPTID: number;
  PLACEDELIVERY?: string;
  RECEIVERNAME?: string;
  RECEIVERPHONE?: string;
  TOTALQTY?: number;
  TOTALAMT?: number;
  TOTALAMTAFTERVAT?: number;
  PRINTNUM?: number;
  REMARKS?: string;
  UPDATEDBY?: string;
}

//#endregion

//#region  ============= BEGIN  Master model ====================
export interface IBusinessInfo {
  CUSTOMERID: string;
  COMPANYNAME: string;
  TAXCODE?: string;
  TEL?: string;
  FAX?: string;
  ADDRESS?: string;
  BANKNAME?: string;
  BANKACCOUNT?: string;
  REPRESENTATIVE?: string;
  REGION_ID?: number;
}

export interface IUnit extends ISearchCommon {
  UNITID: string;
  SHORTNAME?: string;
  NOSIGNSHORTNAME?: string;
  DESCRIPTION?: string;
  ACTIVE: string;
  USERCREATE?: string;
  CREATEDATE?: Date;
  REGION_ID: string;
  LOCATIONS?: ILocation[];
  UNITWITHNAME?: string;
}

export interface ICustomerInfo extends ISearchCommon {
  CUSTOMERID: string;
  CUSTNAME: string;
  NOSIGNCUSTNAME?: string;
  ADDRESS: string;
  TEL: string;
  IDCARD: string;
  IDCARDDATE: Date;
  BANKNAME?: string;
  BANKACCOUNT?: string;
  ISBUSINESS: string;
  BUSINESSINFOS?: IBusinessInfo;
  ISGENERAL?: string;
  USERCREATE: string;
  CREATEDATE: Date;
  ACTIVE: string;
  EMAILADDRESS: string;
  NOTRECEIVEINVOICE: string;
  REGION_ID?: number;
  UNITS?: IUnit[];
}

export interface ICustomerBalance {
  UNITGRP?: string;
  DEPTGRP?: string;
  CUSTGRP?: string;
  UNITNAME?: string;
  CUSTID?: string;
  CMONTH?: string;
  CYEAR?: string;
  BEGINBALANCE?: number;
  OPENBALANCE?: number;
  OPENCASH?: number;
  PAYMENTS?: number;
  ENDBALANCE?: number;
  ENDBALANCEDISCOUNT?: number;
  ENDBALANCEMIX?: number;
  ACTIVE?: string;
  INMONEY?: number;
  OUTMONEY?: number;
  IN_ADJ?: number;
  OUT_ADJ?: number;
  MONTHLYLOCK?: string;
  DEPOSIT?: number;
  WITHDRAW?: number;
  NOTE?: string;
  WRITEOFF?: number;
  RETURNCUSTOMER?: number;
  CUSTNAME?: string;
  ADDRESS?: string;
  TEL?: string;
  IDCARD?: string;
  IDCARDDATE?: string;
  BANKNAME?: string;
  BANKACCOUNT?: string;
  ISBUSINESS?: string;
  ISGENERAL?: string;
  USERCREATE?: string;
  CREATEDATE?: string;
  EMAILADDRESS?: string;
  NOTRECEIVEINVOICE?: string;
  REGION_ID?: number;
  UNITID?: string;
  SHORTNAME?: string;
  DESCRIPTION?: string;
  D_BEGINDISBAL?: number;
  D_OPENBALANCE?: number;
  D_OUTDIS?: number;
  D_USAGEDIS?: number;
  D_CLOSINGDISBAL?: number;
  D_INDISCOUNT?: number;
  D_OUTDISCOUNT?: number;
  D_WRITEOFF?: number;
  D_IN_ADJ?: number;
  D_OUT_ADJ?: number;
}

// Location is Farm/ Warehouse
export interface ILocation extends ISearchCommon {
  LOCATIONID?: string;
  LOCATIONNAME?: string;
  CREATEDDATE?: Date;
  USERCREATE?: string;
  ACTIVE: number;
  LOCATIONADDRESS?: string;
  PROVINCEID: string;
  TELL?: string;
  FAX?: string;
  EMAIL?: string;
  ID?: string;
  UNITID?: string;
  UNITNAME?: string;
}

export interface IMasterResponseCommon extends ISearchCommon {
  ID: string;
  IDNumber: number;
  Name: string;
  Name2?: string;
  UnitPrice: number;
  BESTBEFOREDAYS?: number;
  UnitID?: string;
  BusinessUnit?: string;
  RegionID?: string;
}

export interface IPriceModel {
  groupCode?: string;
  customerId: string;
  productId: string;
  unitId: string;
  qty?: number;
  doDate: string;
  doTime: string;
}

export interface IPrice {
  CUSTNO: string;
  PRODUCTID: string;
  BEGINDATE: Date;
  ENDDATE?: Date;
  PRICE: number;
  PRICE2: number;
  USERID?: string;
  GRPCODE?: string;
  UNITID: string;
  ACTIVE: number;
  BEGINTIME: string;
  ENDTIME?: string;
  UPDATEDBY?: string;
  CREATEDDATE: Date;
  CREATEDTIME: string;
  BW: number;
  BYRANGE: number;
  BWOPERATOR: string;
  ISMAIN: number;
  COMPAREBY: number;
  ISPROGRESSIVE: number;
  LOCATIONID?: string;
  EXTPRODNAME?: string;
}

export interface IPriceSwine extends ISearchCommon {
  Status: IHttpStatus;
  priceLogs: IPrice[];
}

//#endregion master

//#region  BEGIN  SO Interface */

export interface ISoFilterModel extends IGlobalModel {
  fromDate?: string | null;
  toDate?: string | null;
  custId?: Date | null;
  status?: OrderStatus | null;
  soCode?: string | null;
}

// so header delete
export interface ISoHeaderCommon extends IGlobalModel {
  soNo: string;
  creditFlag?: boolean;
}

export interface ISoDetailDeleteModel extends ISoHeaderCommon {
  sodtID: number;
}

export interface ISoDetail extends ISoDoDetailCommon {
  CONO?: string;
  DELIVERYDATE: string;
  POSTEDBY: string;
  POSTEDDATE: Date;
  SA_INVOICE_DT?: string;
  STATUS: OrderStatus;
  SODETAILS?: ISoDetailModel[];
  key: string;
  TOTAL_MUST_COLLECT: number;
  PIT_FLAG: boolean;
  PIT: number;
  P_USAGEDIS: number;
  S_USAGEDIS: number;
}

export interface ISoHeaderModel extends ISoDoHeaderModelCommon {
  DELIVERYDATE?: string;
  CONO?: string;
  STATUS?: OrderStatus;
  PIT_FLAG: boolean;
  PIT: number;
  P_USAGEDIS: number;
  S_USAGEDIS: number;
  SUM_ACTAMOUNT: number;
  TOTAL_MUST_COLLECT: number;
}

// Model add product so
export interface ISoDetailModel extends ISoDoDetailItemModel {
  SODTID: number;
  SONO?: string;
}

//#endregion

//#region  ===================== BEGIN DO ==============================

export interface IDoFilterModel extends IGlobalModel {
  fromDate?: string;
  toDate?: string;
  custId?: string;
  status?: DeliveryOrderStatus;
  doCode?: string;
  loadScaleHeader: boolean;
  loadDoDetail?: boolean;
  WeightTempStatus?: WeightTempStatus;
  loadDoRel?: boolean;
}

export interface IDoItem extends ISoDoDetailCommon {
  DONO: string;
  DODATE: string;
  STATUS: DeliveryOrderStatus;
  SKIP_SCALE_QTY_VALID: boolean;
  DODETAILS?: IDoItemDetailModel[];
  key?: string;
}

export interface IDoItemDetailModel extends ISoDoDetailItemModel {
  //  SCALEHEADERS (Array[ViewAdvScaleNoteHd_DTO], optional),
  PRODSETS?: IProdSettingDTO;
  DODTID: number;
  DONO: string;
  PLUSAMOUNT1: number;
  PLUSAMOUNT2: number;
  SUBAMOUNT1: number;
  SUBAMOUNT2: number;
  ROWSTATUS: number;
}

export interface IProdSettingDTO {
  PRODSETTING_ID?: number;
  PROD_ID?: string;
  GRPID?: string;
  SUBGRPID?: string;
  WEIGHT_MIN?: number;
  WEIGHT_MAX?: number;
  IS_PROMOTION?: number;
  COSTPERPRODUCT?: number;
  COSTPERWEIGHT?: number;
  APPLIED_DATE_START?: string;
  APPLIED_DATE_END?: string;
  REGION_ID?: string;
  WEIGHT_STD?: number;
  STDBW?: number;
  FORMULARID?: string;
  STATUS?: string;
  SUBMEASURE?: string;
}

export interface IDoHeaderCommon extends IGlobalModel {
  doNo: string;
  isPostConfirm?: boolean;
}

// Chỉ dùng cho xóa detail
export interface IDoDetailDelete extends IDoHeaderCommon {
  dodtID: number;
}

export interface IDoHeaderModel extends ISoDoHeaderModelCommon {
  DONO: string;
  DODATE: string;
  STATUS?: DeliveryOrderStatus;
  UPDATEDATE?: string;
  LOCATIONNAME?: string;
  LOCATIONADDRESS?:string;
  CUSTNAME: string;
  TOTALAMTAFTERVAT: number;
  SKIP_SCALE_QTY_VALID: boolean;
  UNITIDTO?: string;
  BW_TOTAL?:string;
}

//#endregion

//#region INVOICE
export interface IInvoiceModelCommon {
  regionId: string;
  deptId: number;
  officeId: number;
  invNo: string;
}

export interface IInvoiceFilterModel extends IGlobalModel {
  fromDate?: string;
  toDate?: string;
  custId?: string;
  status?: InvoiceStatus;
  invCode?: string;
  loadInvDetail?: boolean;
}

export interface IInvoicePublishModel {
  username: string;
  inv_date: string;
  invs: string[];
}

export interface IInvoicePublicDTO {
  location: string;
  username: string;
  inv_date: Date;
  total_request: number;
  total_published: number;
}

export interface IInvoiceHeaderDetail {
  REGIONID: string;
  OFFICEID: number;
  DEPTID: number;
  UNITID: string;
  INVNO: string;
  INVDATE: Date;
  CUSTNO: string;
  CUSTNAME: string;
  CUSTADDRESS: string;
  CUSTTAXCODE?: string;
  SONO: string;
  DONO: string;
  DODATE: Date;
  TRUCKNO: string;
  PAYMODEL: string;
  CURRENCY: string;
  INVNOTES?: string;
  TOTALQTY: number;
  TOTALAMT: number;
  DISCOUNTAMT: number;
  DISCOUNTDESC?: string;
  VATRATE?: number;
  VATAMT: number;
  SUBTOTALAMT: number;
  TOTALPAYMENT: number;
  TOTALPAYMENTINWORDS: string;
  SALEMAN: string;
  SALESPV?: string;
  STATUS: InvoiceStatus;
  STATUS_DESCRIPTION?: string;
  PRINTED: number;
  PRINTEDDATE: Date;
  CREATEDBY: string;
  CREATEDDATE: Date;
  UPDATEDBY?: string;
  UPDATEDDATE?: Date;
  EINV_INVNO: string;
  EINV_SERIALNO: string;
  EINV_PATTERN: string;
  EINV_PUBLISHEDDATE?: Date;
  EINV_PUBLISHEDBY?: string;
  EINV_CONVERTEDDATE?: Date;
  EINV_CONVERTEDBY?: string;
  EINV_BRNO: string;
  INVOICEDETAILS: IInvoiceItemDetail[];
  keySearch?: string;
}

export interface IInvoiceItemDetail {
  REGIONID: string;
  OFFICEID: number;
  DEPTID: number;
  INVNO: string;
  INVDTID: number;
  PROD_ID: string;
  PROD_NAME: string;
  PROD_UOM: string;
  PROD_QTY: number;
  PROD_PRICE: number;
  PROD_AMOUNT: number;
  NOTES?: string;
  STATUS: InvoiceItemStatus;
  CREATEDBY: string;
  CREATEDDATE: Date;
  UPDATEDBY?: string;
  UPDATEDDATE?: Date;
}

//#endregion INVOICE

//#region

export interface IScaleFilterModel extends IGlobalModel {
  fromDate?: string;
  toDate?: string;
  status?: ScaleStatus;
  doCode?: string;
  scaleCode?: string;
}

export interface IScaleDetailDTO {
  ViewAdvScaleNoteDt_DTO: boolean;
  ALLOW_WEIGH_GREATER: boolean;
  PRODUCTCODE: string;
  PRODUCTID: string;
  MEASURE: string;
  SONO: string;
  SALEMAN: string;
  DISCOUNT: number;
  DISCOUNTNOTE: string;
  DONO: string;
  DOTYPENAME: string;
  SCALEID: string;
  SCALENO?: string;
  WEIGHMAN: string;
  SCALEDATE: Date;
  TRUCKNO: string;
  ARRIVALTIME?: string;
  DEPARTTIME?: string;
  FLOCKCODE?: string;
  FLOCKNAME?: string;
  LOCATIONID?: string;
  LOCATIONNAME?: string;
  LOCATIONADDRESS?: string;
  NAME_VN?: string;

  CUSTID: string;
  CUSTNAME: string;
  CUSTADD: string;

  RECEIVERNAME?: string;

  PLACEDELIVERY?: string;

  DOSTATUS: DeliveryOrderStatus;
  SOSTATUS: OrderStatus;
  SODATE: Date;
  DODATE: Date;

  REGIONID: string;
  OFFICEID: number;
  UNITID: string;
  DEPTID: number;
  TOTALQTY: number;

  NETGROSS: number;
  AVGWIGHT: number;
  SAVED_AVGWIGHT: number;

  PRICE1: number;
  PRICE2: number;
  SALEOFF_ID?: string;

  PRICEGROUP: string;
  REDUCEPRICE1?: number;
  REDUCEPRICE2?: number;
  AMOUNT: number;
  PLUSAMOUNT1?: number;
  PLUSAMOUNT2?: number;

  SUBAMOUNT1?: number;
  SUBAMOUNT2?: number;
  FORMULARID: number;

  UPDATEBY: string;
  UPDATETIME: Date;
  STATUS: ScaleStatus;
  KMSTART?: number;
  KMARRIVED?: number;

  QTYPACK?: number;
  QTYPERPACK?: number;
  TOTALGROSS: number;
  PACKWEIGHT: number;
  REMAKS?: string;
  USERNAME?: string;

  PRINTTIME?: string;
  IMPCODE?: string;
  SCALELOCK?: string;
  TRANSALE: number;
  LASTUPDATE?: Date;
  COMNO?: string;
  DONO_INFOGROUP?: string;
  DONO_INFOGROUP2?: string;
  DONO_TOTALQTY: number;
  ACT_TOTALWEIGH: number;
}

//#endregion

//#region === DISCOUNT ==

export enum DiscountType {
  WriteOff = 0,
}

export interface IDiscountFilterModel extends IGlobalModel {
  fromDate?: string;
  toDate?: string;
  custId?: string;
  status?: DiscountStatus;
  disCode?: string;
}

export interface IDiscountModelCommon extends Omit<IGlobalModel, 'loadDetail'> {
  discountId: number;
}

export interface IDiscountItemDTO {
  UNITNAME?: string;
  DISCOUNTTYPENAME?: string;
  STATUSNAME?: string;
  REGIONID: string;
  OFFICEID: number;
  UNITID: string;
  DEPTID: number;
  DISCOUNTID: number;
  TDATE: Date;
  CUSTID: string;
  CUSTNAME: string;
  CUSTADDRESS: string;
  AMOUNT: number;
  NOTES?: string;
  STATUS: DiscountStatus;
  APPROVEDBY: string;
  UPDATEDATE: string;
  UPDATEDBY: string;
  APPROVEDDATE: string;
  CREATEDBY: string;
  CREATEDATE: string;
  DISCOUNTTYPE?: DiscountType;
  keySearch: string;
}

export interface IDiscountModel {
  REGIONID?: string;
  OFFICEID?: number;
  DEPTID?: number;
  DISCOUNTID?: number;
  TDATE?: string;
  UNITID?: string;
  CUSTID?: string;
  CUSTNAME?: string;
  CUSTADDRESS?: string;
  AMOUNT?: number;
  NOTES?: string;
  STATUS?: DiscountStatus;
  APPROVEDBY?: string;
  APPROVEDDATE?: string;
  UPDATEDBY?: string;
  UPDATEDATE?: string;
  CREATEDBY?: string;
  CREATEDATE?: string;
  DISCOUNTTYPE?: DiscountType;
}

//#endregion

//#region  CNDN
export interface ICndnFilterModel extends IGlobalModel {
  fromDate?: string;
  toDate?: string;
  custId?: string;
  status?: CnDnStatus;
  cndnCode?: string;
}

export interface ICndnDtoItem {
  CNDNDETAILS: ICndnDetailDtoItem[];
  UPDATEDBY?: string;
  UPDATEDDATE?: string;
  REGIONID?: string;
  OFFICEID?: number;
  UNITID?: string;
  UNITNAME?: string;
  UNITIDTO?: string;
  UNITNAMETO?: string;
  DEPTID?: number;
  STATUS: CnDnStatus;
  CNDNNO: string;
  CNDNDATE: string;
  CNDN4ACCTYPE?: number;
  CNDNTYPE?: number;
  CUSTNO?: string;
  CUSTNAME?: string;
  CUSTADDRESS?: string;
  CUSTTAXCODE?: string;
  CURRENCY?: string;
  NOTES?: string;
  TOTALQTY?: number;
  TOTALAMT?: number;
  TOTALPAYINWORDS?: string;
  STATUS_DESC?: string;
  APPROVEDBY?: string;
  APPROVEDDATE?: Date;
  PRINTED?: number;
  PRINTEDDATE?: Date;
  CREATEDBY?: string;
  CREATEDDATE: string;
  DELETEDBY?: string;
  DELETEDDATE?: Date;
  EINV_INVNO?: string;
  EINV_SERIALNO?: string;
  EINV_PATTERN?: string;
  EINV_PUBLISHEDDATE?: Date;
  EINV_PUBLISHEDBY?: string;
  EINV_CONVERTEDDATE?: Date;
  EINV_CONVERTEDBY?: string;
  EINV_BRNO?: string;

  PIT_FLAG: boolean;
  PIT: number;
  P_USAGEDIS: number;
  S_USAGEDIS: number;

  TYPENAME: string;
  ACCTNAME: string;
}

export interface ICndnDetailDtoItem {
  UPDATEDBY?: string;
  UPDATEDDATE?: Date;
  REGIONID?: string;
  OFFICEID?: number;
  UNITID?: string;
  DEPTID?: number;
  CNDNNO?: string;
  CNDNDTID?: number;
  INVNO?: string;
  PROD_ID?: string;
  PROD_NAME?: string;
  PROD_UOM?: string;
  PROD_QTY?: number;
  PROD_PRICE?: number;
  PROD_AMOUNT?: number;
  NOTES?: string;
  STATUS: 0 | 1;
  CREATEDBY?: string;
  CREATEDDATE?: Date;
  DELETEDBY?: string;
  DELETEDDATE?: Date;
}

export interface ICndnModelCommon extends Omit<IGlobalModel, 'loadDetail'> {
  CndnNo: string;
}

export interface ICndnHeaderModel {
  UPDATEDBY?: string;
  UPDATEDDATE?: string;
  REGIONID?: string;
  OFFICEID?: number;
  DEPTID?: number;
  UNITID?: string;
  UNITIDTO?: string;
  CNDNNO?: string;
  CNDNDATE?: string;
  CNDNTYPE: number;
  CUSTNO?: string;
  CUSTNAME?: string;
  CUSTADDRESS?: string;
  CUSTTAXCODE?: string;
  TOTALPAY?: number;
  TOTALAMOUNT?: number;
  CURRENCY?: string;
  NOTES?: string;
  STATUS: CnDnStatus;
  STATUS_DESC?: string;
  PRINTED?: number;
  CREATEDBY?: string;
  CREATEDDATE?: string;
  CNDN4ACCTYPE?: number;

  TOTALQTY: number;
  TOTALAMT: number;

  PIT_FLAG: boolean;
  PIT: number;
  P_USAGEDIS: number;
  S_USAGEDIS: number;
}

export interface ICndnDetailModel {
  UPDATEDBY?: string;
  UPDATEDDATE?: string;
  REGIONID?: string;
  OFFICEID?: number;
  UNITID?: string;
  DEPTID?: number;
  CNDNNO?: string;
  CNDNDTID?: number;
  INVNO?: string;
  PROD_ID: string;
  PROD_NAME?: string;
  PROD_UOM?: string;
  PROD_QTY: number;
  PROD_PRICE: number;
  PROD_AMOUNT?: number;
  NOTES?: string;
  STATUS: 0 | 1;
  CREATEDBY?: string;
  CREATEDDATE?: string;
}

//#endregion CNDN

//#region ===== CREDIT =====

export enum CreditStatus {
  Deleted = 0,
  New = 1,
  Approved = 2,

  SendAndWait = 5,
  Rejected = 6,
  Cancel = 7,
}

export interface ICreditModelCommon extends Omit<IGlobalModel, 'loadDetail'> {
  creditId: number;
  reason?: string;
}

export interface ICreditFilterModel extends IGlobalModel {
  fromDate?: string;
  toDate?: string;
  custId?: number;
  creditCode?: number;
  status?: CreditStatus;
}

export interface ICreditModel {
  UPDATEDBY?: string;
  UPDATEDDATE?: string;
  STATUS: CreditStatus;
  REGIONID?: string;
  OFFICEID?: number;
  UNITID?: string;
  DEPTID?: number;
  CUSTID?: string;
  CUSTNAME?: string;
  DOCNO?: string;
  REQUESTAMOUNT?: number;
  PAYMENTAMOUNT?: number;
  REMAINAMOUNT?: number;
  APPROVEDAMOUNT?: number;
  REJECTREASON?: string;
  REMARKS?: string;
  DUEDATE?: string;
  PRINTNUMBER?: number;
  REFDOC?: string;
  SOAMOUNT_GROSS?: number;
  SOAMOUNT_NET?: number;
  CREDITATSTEP?: string;
  CREDIT_ISPAID?: number;
  APPROVEDBY?: string;
  APPROVEDDATE?: string;
  CREATEDBY?: string;
  CREATEDDATE?: string;
  DELETEDBY?: string;
  DELETEDDATE?: string;
  CREDIT_ID?: number;

  SONO?: string;
  CURRENTBALANCE?: number;
  REFUNDDATE?: string;
}

export interface IAdvSoDtDTO {
  SODTID?: number;
  REGIONID?: string;
  OFFICEID?: number;
  UNITID?: string;
  DEPTID?: number;
  SONO?: string;
  PRODUCTID?: string;
  PRODUCTNAME?: string;
  MEASURE?: string;
  QTY?: number;
  BW_AVG?: number;
  BW_TOTAL?: number;
  AMOUNT?: number;
  REMARKS?: string;
  SALEOFF_ID?: string;
  PRICEGROUPUNIT?: string;
  PRICEGROUP?: string;
  PRICEGROUP_DESCRIPTION?: string;
  REDUCEPRICE1?: number;
  REDUCEPRICE2?: number;
  PRICE1?: number;
  PRICE2?: number;
  CREATEDATE?: number;
  UPDATEDBY?: string;
  UPDATEDATE?: string;
  STATUS?: CreditStatus;
  ROWSTATUS?: number;
}

export interface ICreditDTO {
  UPDATEDBY?: string;
  UPDATEDDATE?: string;
  STATUS?: number;
  REGIONID?: string;
  OFFICEID?: number;
  UNITID?: string;
  UNITNAME?: string;
  DEPTID?: number;
  DOCNO?: string;
  CUSTID?: string;
  CUSTNAME?: string;
  CUSTADDRESS?: string;
  REQUESTAMOUNT?: number;
  PAYMENTAMOUNT?: number;
  REMAINAMOUNT?: number;
  APPROVEDAMOUNT?: number;
  REJECTREASON?: string;
  REMARKS?: string;
  DUEDATE?: string;
  PRINTNUMBER?: number;
  REFDOC?: string;
  SOAMOUNT_GROSS?: number;
  SOAMOUNT_NET?: number;
  CREDITATSTEP?: string;
  CREDIT_ISPAID?: number;
  APPROVEDBY?: string;
  APPROVEDDATE?: string;
  CREATEDBY?: string;
  CREATEDDATE?: string;
  DELETEDBY?: string;
  DELETEDDATE?: string;
  CREDIT_ID?: number;
  SODETAILS: IAdvSoDtDTO[];
  UPDATEDATE?: string;
  SONO?: string;
  SODATE?: string;
  DELIVERYDATE?: string;
  LOCATIONID?: string;
  LOCATIONNAME?: string;
  PLACEDELIVERYEID?: string;
  CUSTBAL_BF?: number;
  CUSTBAL_AT?: number;
  TRUCK_NO?: string;
  RECEIVEHOUR?: string;
  DISCOUNT?: number;
  DISCOUNTNOTE?: string;
  TOTALQTY?: number;
  TOTALAMT?: number;
  TOTALAMTAFTERVAT?: number;
  PRINTNUM?: number;
  CREATEDATE?: string;
  SALEMAN?: string;
  SALESPV?: string;
  POSTEDDATE?: string;
  POSTEDBY?: string;
  GEN_CUSTINFOID?: number;
  CONO?: string;
  VAT?: number;
  PLACEDELIVERY?: string;
  RECEIVERNAME?: string;
  RECEIVERPHONE?: string;
  CURRENTBALANCE: number;
}

//#endregion ===== END CREDIT =====

//#region ======= WEIGHING GOODS ======
export interface IWeighingGoodsModel {
  REGIONID: string;
  SCALEDATE?: string;
  DONO?: string;
  SONO?: string;
  SCALENO?: string;
  TRUCKNO?: string;
  ARRIVALTIME?: string;
  DEPARTTIME?: string;
  KMSTART?: number;
  KMARRIVED?: number;
  WEIGHMAN?: string;
  REMAKS?: string;
  USERNAME?: string;
  CREATEDBY?: string;
  UNITID?: string;
  CUSTID?: string;
  CUSTNAME?: string;
  CUSTADD?: string;
  WEIGHTTYPE?: number;
  SEALNUMBER?: string;
  SEALCONDITION?: string;
  SCALEID?: number;
  UPDATEDBY?: string;
  EVENIFEXCESSCO?: boolean; //vuot trong luong.

  //Option không cần gửi khi post
  TEMP_WS_NO?: string;
  COMNO?: string;
  CREATEDDATE?: string;
  UPDATEDDATE?: string;
  STATUS?: WeighingGoodsStatus;
  LOCATION_NAME?: string;
  LOCATIONNAME?: string;

  IS_LOCKED?: number; // local database
  TOTAL_BW_DO?: number; // lưu trữ lại tổng trọng lượng trinh bình của đơn hàng đặt (mục đích để so sánh vượt trọng lương.
  TOTAL_QTY_DO?: number; // lưu trữ lại tổng số lượng con của đơn hàng đặt (mục đích để so sánh vượt trọng lương.
  SCALE_ONLINE_ID?: number; // dùng để lưu lại database local.
}

export interface IWeighingGoodsItemModel {
  REGIONID?: string;
  SCALEID?: number;
  PRODUCTCODE?: string;
  PRODUCTNAME?: string;
  FLOCKID?: string;
  FLOCKNAME?: string;
  MEASURE?: string;
  QTY?: number;
  PWEIGHT?: number;
  GWEIGHT?: number;
  NWEIGHT?: number;
  AVGBW?: number;
  EARTAG1?: string;
  EARTAG2?: string;
  REMARKS?: string;
  WHID?: number;
  CREATEDBY?: string;
  WEIGHTCONNECTID?: number;
  SNITEMID?: number;
  UPDATEDBY?: string;
  EXTPRODNAME?: string;
  SCALENAME?: string;
  PRODUCTDOWN?: number; // 0 | 1;
  PRODUCTDOWNDESC?: string;

  ID?: number; // ID item local.
}

export interface IWeighingGoodsItemDTO {
  DOHEADER?: IDoItem;
  REGIONID?: string;
  SCALEID?: number;
  SCALENO?: string;
  TEMP_WS_NO?: string;
  WEIGHTTYPE?: number;
  SCALEDATE?: string;
  DONO?: string;
  SONO?: string;
  CUSTID?: string;
  CUSTNAME?: string;
  CUSTADD?: string;
  TRUCKNO?: string;
  ARRIVALTIME?: string;
  DEPARTTIME?: string;
  KMSTART?: number;
  KMARRIVED?: number;
  WEIGHMAN?: string;
  REMAKS?: string;
  USERNAME?: string;
  COMNO?: string;
  CREATEDDATE?: string;
  CREATEDBY?: string;
  UPDATEDDATE?: string;
  UPDATEDBY?: string;
  UNITID?: string;
  STATUS?: number;
  SEALNUMBER?: string;
  SEALCONDITION?: string;
  IS_LOCKED?: number; // local database
  EVENIFEXCESSCO?: boolean;

  SCALE_ONLINE_ID?: number;

  LOCATIONNAME?: string;
  SUM_QTY?: number;
  SUM_WEIGHT?: number;

  TOTALQTY?: number;
  TOTALBW?: number;
}

export interface IWeighingGoodsDetailDTO {
  ID?: number; //ID local database
  SCALEID?: number;
  SNITEMID?: number;
  PRODUCTCODE?: string;
  PRODUCTNAME?: string;
  FLOCKID?: string;
  FLOCKNAME?: string;
  MEASURE?: string;
  QTY?: number;
  PWEIGHT?: number;
  GWEIGHT?: number;
  NWEIGHT?: number;
  AVGBW?: number;
  EARTAG1?: string;
  EARTAG2?: string;
  REMARKS?: string;
  WHID?: number;
  WHNAME?: string;
  STATUS?: number;
  CREATEDDATE?: string;
  CREATEDBY?: string;
  UPDATEDDATE?: string;
  UPDATEDBY?: string;
  WEIGHTCONNECTID?: string;
  PRODUCTDOWN: boolean;
  PRODUCTDOWNDESC: string;
}

export interface IGoodsFilterModel extends Omit<IGlobalModel, 'loadDetail'> {
  doNo: string;
  isPostConfirm?: boolean;
}

// === product ====

export interface IProductStockModel
  extends Omit<IGlobalModel, 'officeId' | 'deptId' | 'loadDetail'> {
  custId?: string;
  locationId: string;
  productId: string;
}

export interface IProductStockDTO extends ISearchCommon {
  PRODUCTID: string;
  NAME_VN: string;
  NAME_EN: string;
  MEASURECODE: string;
  DESCRIPTION: string;
  PRODTYPE: number;
  ACTIVE: number;
  VAT: number;
  USERCREATE: string;
  CREATEDATE: string;
}

export interface IDoLocalItem {
  DONO: string;
  DODATE?: string;
  SONO?: string;
  UNITID: string;
  CUSTNAME: string;
  CUSTID: string;
  CUSTADDRESS: string;
  TRUCK_NO: string;
  BW_TOTAL?: number;
  TOTALQTY?: number;
  IS_HAS_SCALE_TEMP: boolean;
  LOCATIONNAME?: string;
}

//endregion ======== WEIGHING GOODS =====

//#region BLUETOOTH DEVICES

export interface IBleDevice {
  deviceName: string;
  deviceId: string;
  localName?: string;
  serviceUUID?: string;
  writeCharacteristicUUID?: string;
  monitoringCharacteristicUUID?: string;
  isConnected?: boolean;
}

//#endregion
