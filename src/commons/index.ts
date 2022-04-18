import {IRadioData} from './types';

export const CndnAccountTypeDataSource: IRadioData[] = [
  {label: 'Tài khoản chính', value: 0},
  {label: 'Tài khoản chiết khấu', value: 1},
];

export const CndnTypeDataSource: IRadioData[] = [
  {label: 'Điều chỉnh tăng', value: 0},
  {label: 'Điều chỉnh giảm', value: 1},
  {label: 'Chuyển nhánh khác', value: 2},
  {label: 'Write off', value: 3},
];

/**
 * Lấy tên loại tài khoản theo giá trị.
 * @param value
 */
export const getCndnAccountTypeName = (value: number): string => {
  const obj = CndnAccountTypeDataSource.find((p) => p.value === value);
  return obj?.label ?? '';
};

/**
 * Lấy tên hình thức điều chỉnh.
 * @param value
 */
export const getCndnTypeName = (value: number): string => {
  const item = CndnTypeDataSource.find((p) => p.value === value);
  return item?.label ?? '';
};

export const MenuPermission = {
  DO_RELEASE_MENU_ID: 251,

  CREDIT: {
    APPROVAL: 118,
    CREATE: 178,
  },
};

export const checkPermission = (menuIds: number[], menuId: number): boolean => {
  return menuIds.indexOf(menuId) > -1;
};
