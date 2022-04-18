import {IconType} from '~/commons/types';
import ScreenType from '../screen.constant';

type DrawerItemData = {
  iconType: IconType;
  iconName: string;
  name: string;
  screen: string;
  id: number;
};

const dataDrawer: DrawerItemData[] = [
  {
    iconType: 'AntDesign',
    iconName: 'profile',
    name: '2. Đơn hàng (SO)',
    screen: ScreenType.SO.List,
    id: 148,
  },
  {
    iconType: 'AntDesign',
    iconName: 'swap',
    name: '3. Chuyển heo nội bộ',
    screen: ScreenType.InternalTransfer.LIST,
    id: 149,
  },
  {
    iconType: 'AntDesign',
    iconName: 'doubleright',
    name: '3. Giao hàng (DO)',
    screen: ScreenType.DO.LIST,
    id: 149,
  },
  {
    iconType: 'AntDesign',
    iconName: 'tagso',
    name: '4. Hoá đơn bán hàng (INV)',
    screen: ScreenType.Invoice.LIST,
    id: 150,
  },
  {
    iconType: 'AntDesign',
    iconName: 'calculator',
    name: '5. Phiếu cân (SN)',
    screen: ScreenType.Scale.LIST,
    id: 151,
  },
  {
    iconType: 'AntDesign',
    iconName: 'creditcard',
    name: '6. Chiết khấu (DIS)',
    screen: ScreenType.Discount.LIST,
    id: 152,
  },
  {
    iconType: 'AntDesign',
    iconName: 'form',
    name: '7. Điều chỉnh (ADJ)',
    screen: ScreenType.Cndn.LIST,
    id: 153,
  },
  {
    iconType: 'AntDesign',
    iconName: 'creditcard',
    name: '12. Điều chỉnh giao hàng (sd).',
    screen: ScreenType.ScaleNoteDown.List,
    id: 217,
  },
  {
    iconType: 'AntDesign',
    iconName: 'creditcard',
    name: '13. Xác nhận giao hàng (DOR).',
    screen: ScreenType.DO.LIST,
    id: 251,
  },
  {
    iconType: 'FontAwesome',
    iconName: 'balance-scale',
    name: '14. Cân bán hàng',
    screen: ScreenType.WeighingGoods.DO_LIST,
    id: 289,
  },
  {
    iconType: 'FontAwesome',
    iconName: 'balance-scale',
    name: '15. Cân bán hàng (offline)',
    screen: ScreenType.WeighingGoods.DO_LIST_OFFLINE,
    id: 290,
  },
];

const approvalData: DrawerItemData[] = [
  {
    iconType: 'AntDesign',
    iconName: 'creditcard',
    name: '1. Duyệt Xin nợ (DRC)',
    screen: ScreenType.Credit.LIST,
    id: 118,
  },
  {
    iconType: 'Feather',
    iconName: 'check-circle',
    name: '2. Duyệt chiết khấu',
    screen: ScreenType.Approval.DISCOUNT,
    id: 139,
  },
  {
    iconType: 'Feather',
    iconName: 'check-square',
    name: '3. Duyệt điều chỉnh',
    screen: ScreenType.Approval.CNDN,
    id: 188,
  },
];

const monitoringData: DrawerItemData[] = [
  {
    iconType: 'AntDesign',
    iconName: 'barchart',
    name: '5. Thống kê bán hàng',
    screen: ScreenType.Monitoring.DailySale,
    id: 142,
  },
  {
    iconType: 'AntDesign',
    iconName: 'barchart',
    name: '6. Thống kê nợ',
    screen: ScreenType.Monitoring.DailySale,
    id: 179,
  },
  {
    iconType: 'AntDesign',
    iconName: 'barchart',
    name: '7. Thống kê chiết khấu',
    screen: ScreenType.Monitoring.DailySale,
    id: 137,
  },
  {
    iconType: 'AntDesign',
    iconName: 'barchart',
    name: '8. Thống kê điều chỉnh',
    screen: ScreenType.Monitoring.DailySale,
    id: 136,
  },
  {
    iconType: 'AntDesign',
    iconName: 'piechart',
    name: '9. Tk số dư KH (tháng)',
    screen: ScreenType.Monitoring.DailySale,
    id: 203,
  },
  {
    iconType: 'AntDesign',
    iconName: 'areachart',
    name: '10. Tk số dư KH (ngày)',
    screen: ScreenType.Monitoring.DailySale,
    id: 214,
  },
];

export {approvalData, monitoringData};
export default dataDrawer;
