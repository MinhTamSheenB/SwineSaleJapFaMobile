export type GroupType =
  | 'STATUS'
  | 'CUSTOMER'
  | 'UNIT'
  | 'DEPARTMENT'
  | 'FARM'
  | 'KIND_OF_PRODUCT';

export type MonitoringType =
  | 'DAILY_SALE'
  | 'CUSTOMER_MONTHLY_BALANCE'
  | 'CUSTOMER_DAILY_BALANCE'
  | 'DISCOUNT_MONITORING'
  | 'CNDN_MONITORING'
  | 'CREDIT_MONITORING';

export interface IDailySaleGroup {
  name: string;
  id: string | number;
  qty: number;
  weight: number;
  total: number;
  data: IDailySaleMonitoring[];
  type?: GroupType;
}

export interface IDailySaleMonitoring {
  UNITGRP: string;
  DEPTGRP: string;
  CUSTGRP: string;
  FARMGRP: string;
  FLOCKGRP: string;
  FLOCKGRP_REV: string;
  DEPTID: number;
  DEPTNAME: string;
  UPDATEBY?: string;
  UPDATEDATE: string;
  STATUS?: number;
  SALEID: number;
  SALEDATE: string;
  INVDATE: string;
  INVNO: string;
  EINVNO: string;
  SONO: string;
  DONO: string;
  SCALEID: string;
  SCALENO: string;
  CUSTID: string;
  CUSTNAME: string;
  CUSTADDRESS: string;
  FARMID: string;
  FARMNAME: string;
  FLOCKID: string;
  FLOCKNAME: string;
  TRUCKNO: string;
  PRODUCTID: string;
  KINDOFPRODUCT: string;
  PRODTYPENAME?: string;
  MEASURE?: string;
  MEASURENAME: string;
  NOOFHEAD: number;
  QTYKG: number;
  PRICE?: number;
  AMOUNTAFTERDIS: number;
  AMOUNT: number;
  AVGBW: number;
  SALESMAN: string;
  WEIGHTMAN: string;
  DISCOUNT: number;
  DISCOUNTNOTE?: string;
  TAKENOTES?: string;
  ISTRANINVOICE?: number;
  LASTUPDATE?: string;
  COMNO?: string;
  DEPTNO?: string;
  REGIONID: string;
  OFFICEID: number;
  UNITID: string;
  UNITNAME: string;
  AUTOID: number;
  DOTYPE: number;
  PRICEGROUP?: string;
  PRICE1: number;
  PRICE2: number;
  SALEOFF_ID?: string;
  REDUCEPRICE1: number;
  REDUCEPRICE2: number;
  PLUSAMOUNT1: number;
  PLUSAMOUNT2: number;
  SUBAMOUNT1: number;
  SUBAMOUNT2: number;
  PROVINCENAME: string;

  // Monthly
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

  // DAILY
  TDATE?: string;
  TDATE_1?: string;
  POSTEDDATE?: string;
  

  // Discount
  DISCOUNTTYPENAME?: string;
  STATUSNAME?: string;
  DISCOUNTID?: number;
  NOTES?: string;
  APPROVEDBY?: string;
  UPDATEDBY?: string;
  APPROVEDDATE?: string;
  CREATEDBY?: string;
  DISCOUNTTYPE?: number;
  REFNO?: string;

  // CNDN
  UPDATEDDATE?: string;
  UNITIDTO?: string;
  UNITNAMETO?: string;
  CNDNNO?: string;
  CNDNDATE?: string;
  CNDN4ACCTYPE?: number;
  CNDNTYPE?: number;
  CUSTNO?: string;
  CUSTTAXCODE?: string;
  CURRENCY?: string;
  TOTALQTY?: number;
  TOTALAMT?: number;
  TOTALPAYINWORDS?: string;
  STATUS_DESC?: string;
  PRINTED?: number;
  PRINTEDDATE?: string;
  CREATEDDATE?: string;
  DELETEDBY?: string;
  DELETEDDATE?: string;
  EINV_INVNO?: string;
  EINV_SERIALNO?: string;
  EINV_PATTERN?: string;
  EINV_PUBLISHEDDATE?: string;
  EINV_PUBLISHEDBY?: string;
  EINV_CONVERTEDDATE?: string;
  EINV_CONVERTEDBY?: string;
  EINV_BRNO?: string;
  PIT_FLAG: boolean;
  PIT?: number;
  P_USAGEDIS?: number;
  S_USAGEDIS: number;

  // Credit
  DUEDATE?: string;
  CREDIT_ID?: string;
  REQUESTAMOUNT?: number;
  REMARKS?: string;
}