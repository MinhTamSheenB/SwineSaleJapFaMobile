import * as Yup from 'yup';

export const SoCustomerFormValidate = Yup.object().shape({
  CUSTID: Yup.string().required('Chọn khách hàng'),
  LOCATIONID: Yup.string().required('Chọn trại/ kho xuất'),
  PLACEDELIVERY: Yup.string().required('Nhập địa chỉ giao hàng'),
});

export const SoDetailValidate = Yup.object().shape({
  PRODUCTID: Yup.string().required('Chọn sản phẩm'),
  PRICEGROUP: Yup.string().required('Chọn bảng giá'),
  BW_AVG: Yup.number()
    .required('Nhập trọng lượng trung bình')
    .min(1, 'Nhập trọng lượng trung bình'),
  QTY: Yup.number().required('Nhập số lượng').min(1, 'Nhập số lượng'),
});
