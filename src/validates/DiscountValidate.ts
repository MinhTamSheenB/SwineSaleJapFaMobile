/* eslint-disable import/prefer-default-export hihi -- da sua kk ---- no collarborator*/
import * as Yup from 'yup';

export const DiscountFormValidate = Yup.object().shape({
  TDATE: Yup.string().required('Chọn ngày chiết khấu'),
  CUSTID: Yup.string().required('Chọn khách hàng'),
  NOTES: Yup.string().required('Nhập chú thích'),
  AMOUNT: Yup.number()
    .required('Nhập số tiền')
    .moreThan(0, 'Số tiền không hợp lệ'),
  DISCOUNTTYPE: Yup.number().required('Chọn loại chiết khấu'),
  UNITID: Yup.string().required('Chọn đơn vị'),
});
