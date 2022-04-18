/* eslint-disable prettier/prettier */
import {IGroupType} from '~/commons/types';
import {
  IState,
  Types,
  MonitoringActionType,
  dailySale,
} from './monitoring.types';

const initialState: IState = {
  dataDailySale: [],
  groupFieldData: [],
  dataGroupBy: [],
  groupBys: [],
  viewer: {
    titles: [],
    fields: [],
  },
  monitoringType: 'DAILY_SALE'
};

export default function MonitoringReducer(
  state = initialState,
  action: MonitoringActionType,
): IState {
  switch (action.type) {
    case Types.FETCH_DAILY_SALE_SUCCESS: {
      const {data} = action.payload;
      return {...state, dataDailySale: data};
    }
    case Types.GROUP_BY_SUCCESS: {
      const {groupData} = action.payload;
      return {...state, groupFieldData: groupData};
    }
    case Types.SET_DATA_GROUP_BY_FIELD: {
      const {dataGroupBy} = action.payload;
      return {...state, dataGroupBy};
    }
    case Types.HANDLE_VIEW_RESULTS: {
      const {type, accountType} = action.payload;
      const {viewer} = state;
      if (type === 'DAILY_SALE') {
        viewer.fields = [
          'SALEDATE',
          'EINVNO',
          'INVNO',
          'SONO',
          'DONO',
          'SCALENO',
          'SCALEID',
          'CUSTID',
          'CUSTNAME',
          'CUSTADDRESS',
          'FARMID',
          'FARMNAME',
          'FLOCKID',
          'FLOCKNAME',
          'NOOFHEAD',
          'QTYKG',
          'PRICE1',
          'PRICE2',
          'AMOUNT',
          'DISCOUNT',
          'AVGBW',
          'WEIGHTMAN',
          'SALESMAN',
          'TRUCKNO',
          'KINDOFPRODUCT',
          'DEPTNAME',
          'UNITNAME',
          'POSTEDDATE',
          'PRODTYPENAME',
          'REMARKS',
        ];
        viewer.titles = [
          'Ngày bán:',
          'Số HĐĐT',
          'Số HĐ',
          'Số SO',
          'Số DO',
          'Số PC',
          'Mã cân',
          'Mã KH',
          'Tên khách hàng',
          'Địa chỉ KH',
          'Mã trại',
          'Tên trại',
          'Mã đàn xuất',
          'Mã đàn nhận',
          'Số con',
          'Trọng lượng (kg)',
          'Đơn giá 1',
          'Đơn giá 2',
          'Thành tiền trước CK',
          'Chiết khấu',
          'TL Trung bình',
          'NV cân',
          'NV bán hàng',
          'Số xe',
          'Sản phẩm',
          'Bộ phận',
          'Tên đơn vị',
          'Giờ chốt đơn',
          'Loại sản phẩm',
          'Ghi chú'
        ];
        return {...state, groupBys: dailySale.groupBys, viewer, monitoringType: type};
      }

      if (type === 'CUSTOMER_MONTHLY_BALANCE') {
        const groupBys: IGroupType[] = [
          {key: '', name: 'Mặc định'},
          {key: 'UNITGRP', name: 'Đơn vị'},
          {key: 'CUSTGRP', name: 'Khách hàng'},
        ];

        const titles = ['Tháng', 'Năm', 'Đơn vị', 'Mã khách hàng', 'Tên khách hàng'];
        const fields = ['CMONTH', 'CYEAR', 'UNITNAME', 'CUSTID', 'CUSTNAME',];

        switch(accountType) {
          case 'MAIN': {
            viewer.titles = [...titles, 'Đầu kỳ', 'Thu tiền ngân hàng', 'Thu tiền tiền mặt', 'Nhận tiền nhánh khác', 'Chuyển tiền nhánh khác', 'Mua hàng',  'Điều chỉnh tăng', 'Điều chỉnh giảm', 'Rút cọc', 'Write-off', 'Cuối kỳ'];
            viewer.fields = [...fields, 'BEGINBALANCE', 'OPENBALANCE', 'OPENCASH', 'INMONEY', 'OUTMONEY', 'PAYMENTS', 'IN_ADJ', 'OUT_ADJ', 'WITHDRAW', 'WRITEOFF', 'ENDBALANCE'];
            break;
          }
          case 'SUB': {
            viewer.titles = [...titles, 'Đầu kỳ', 'Chiết khấu', 'Nhận từ nhánh khác', 'Chuyển đi nhánh khác', 'Mua hàng','CK-PIT', 'PIT', 'Điều chỉnh tăng', 'Điều chỉnh giảm', 'Write-off', 'Cuối kỳ'];
            viewer.fields = [...fields, 'D_BEGINDISBAL', 'D_OPENBALANCE', 'D_INDISCOUNT', 'D_OUTDISCOUNT', 'D_USAGEDIS', 'S_USAGEDIS', 'P_USAGEDIS', 'D_IN_ADJ', 'D_OUT_ADJ', 'D_WRITEOFF', 'D_CLOSINGDISBAL'];
            break;
          }
          case 'MAIN_AND_SUB': {
            viewer.titles = [...titles, 'Đầu kỳ(chính + phụ)', 'Đầu kỳ', 'Thu tiền ngân hàng', 'Thu tiền TM', 'Thanh toán', 'Nhận nhánh khác', 'Chuyển nhánh khác', 'Điểu chỉnh tăng', 'Điều chỉnh giảm', 'Rút tiền cọc', 'Write-off', 'Cuối kỳ', 'Tháng(TK phụ)', 'Năm', 'Tên đơn vị CK', 'Mã khách hàng', 'Tên khách hàng', 'Thu tiền ngân hàng', 'Thánh toán', 'Nhận nhánh khác', 'Chuyển nhánh khác', 'Điều chỉnh tăng', 'Điều chỉnh giảm', 'Write-off', 'Cuối kỳ', 'Cuối kỳ (chính + phụ)'];
            viewer.fields = [...fields, 'BEGINBALANCEMIX' ,'BEGINBALANCE', 'OPENBALANCE', 'OPENCASH', 'PAYMENTS', 'INMONEY', 'OUTMONEY', 'IN_ADJ', 'OUT_ADJ', 'WITHDRAW', 'WRITEOFF', 'ENDBALANCE', 'CMONTH', 'CYEAR', 'UNITNAME', 'CUSTID', 'CUSTNAME', 'D_OPENBALANCE', 'D_USAGEDIS', 'D_INDISCOUNT', 'D_OUTDISCOUNT', 'D_IN_ADJ', 'D_OUT_ADJ', 'D_WRITEOFF', 'D_CLOSINGDISBAL', 'ENDBALANCEMIX']
            break;
          }
          default: break;
        }

        return {...state, groupBys, viewer, monitoringType: type};
      }

      if (type === 'CUSTOMER_DAILY_BALANCE') {
        const groupBys: IGroupType[] = [
          {key: '', name: 'Mặc định'},
          {key: 'UNITGRP', name: 'Đơn vị'},
          {key: 'CUSTGRP', name: 'Khách hàng', type: 'CUSTOMER'},
        ];

        viewer.titles = ['Ngày', 'Đơn vị', 'Mã khách hàng', 'Tên khách hàng', 'Đầu kỳ', 'Thu tiền NH', 'Thu tiền TM', 'Thanh toán trước CK', 'Chiết khấu', 'Nhận nhánh khác', 'Chuyển nhánh khác',  'Rút tiền cọc', 'Write-off',  'Khác', 'Cuối kỳ'];
        viewer.fields = ['TDATE', 'UNITNAME', 'CUSTID', 'CUSTNAME', 'BEGINBALANCE', 'OPENBALANCE', 'OPENCASH', 'PAYMENTS', 'DISCOUNT_HAS_USED', 'INMONEY', 'OUTMONEY',  'WITHDRAW', 'WRITEOFF', 'D_CLOSINGDISBAL', 'ENDBALANCE'];

        return {...state, groupBys, viewer, monitoringType: type};
      }

      if (type === 'DISCOUNT_MONITORING') {       
        viewer.titles = ['Đơn Vị', 'ID', 'Ngày', 'Mã khách hàng', 'Khách hàng', 'Số tiền CK', 'Loại CK', 'Trạng thái'];
        viewer.fields = ['UNITNAME', 'DISCOUNTID', 'TDATE', 'CUSTID', 'CUSTNAME', 'AMOUNT', 'DISCOUNTTYPENAME', 'STATUSNAME'];

        const groupBys: IGroupType[] = [
          {key: '', name: 'Mặc định'},
          {key: 'UNITNAME', name: 'Đơn vị'},
          {key: 'DISCOUNTTYPENAME', name: 'Loại chiết khấu'},
          {key: 'CUSTNAME', name: 'Khách hàng'},
          {key: 'STATUSNAME', name: 'Trạng thái'}
        ];

        return {...state, viewer, groupBys, monitoringType: type};
      }

      if (type === 'CNDN_MONITORING') {
        viewer.titles = ['Ngày chứng từ', 'Số chứng từ', 'Khách hàng', 'Địa chỉ', 'Mã số thuế', 'Số lượng', 'Tiền', 'PIT(%)', 'Thuế TNCN', 'Diễn giải', 'Người duyệt', 'Ngày duyệt'];
        viewer.fields = ['CNDNDATE', 'CNDNNO', 'CUSTNAME', 'CUSTADDRESS', 'CUSTTAXCODE', 'TOTALQTY', 'TOTALAMT', 'PIT', 'P_USAGEDIS', 'NOTES', 'APPROVEDBY', 'APPROVEDDATE'];

        const groupBys: IGroupType[] = [
          {key: '', name: 'Mặc định'},
          {key: 'STATUS', name: 'Trạng thái', type: 'STATUS'},
          {key: 'CUSTNAME', name: 'Khách hàng', type: 'CUSTOMER'},
        ];
        return {...state, viewer, groupBys, monitoringType: type};
      }

      if (type === 'CREDIT_MONITORING') {
        viewer.titles = ['Ngày chứng từ', 'Số chứng từ', 'Khách hàng', 'Địa chỉ', 'Số tiền nợ', 'Diễn giải', 'Người duyệt', 'Ngày duyệt'];
        viewer.fields = ['DUEDATE', 'CREDIT_ID', 'CUSTNAME', 'CUSTADDRESS', 'REQUESTAMOUNT', 'REMARKS', 'APPROVEDBY', 'APPROVEDDATE'];
        const groupBys: IGroupType[] = [
          {key: '', name: 'Mặc định'},
          {key: 'STATUS', name: 'Trạng thái', type: 'STATUS'},
          {key: 'CUSTNAME', name: 'Khách hàng', type: 'CUSTOMER'},
        ];
        
        return {...state, viewer, groupBys, monitoringType: type};
      }
       
      return {...state};
    }
    default:
      return {...state};
  }
}
