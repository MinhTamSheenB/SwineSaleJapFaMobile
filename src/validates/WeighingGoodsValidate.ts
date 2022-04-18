import * as Yup from 'yup';

export const WGoodHeaderFormValidate = Yup.object().shape({
  DONO: Yup.string().required('Nhập phiếu xuất kho'),
  TRUCKNO: Yup.string().required('Nhập số xe'),
  SCALEDATE: Yup.string().required('Chọn ngày cân'),
  // CUSTID: Yup.string().required('Chọn khách hàng'),
  DEPARTTIME: Yup.string().required('Nhập giờ đến'),
  ARRIVALTIME: Yup.string().required('Nhập giờ đi'),
  WEIGHMAN: Yup.string().required('Nhập nhân viên cân'),
  // KMSTART: Yup.number()
  //   .moreThan(0, 'Km đến không đúng')
  //   .required('Nhập KM đến'),
  // KMARRIVED: Yup.number()
  //   .moreThan(0, 'Km đi không đúng')
  //   .required('Nhập KM đi'),
});

export const WGoodsItemValidate = Yup.object().shape({
  QTY: Yup.number().required().moreThan(0, 'Số lượng không đúng.'),
  // AVGBW: Yup.number()
  //   .required('KL bình quân không đúng.')
  //   .moreThan(0, 'KL bình quân không đúng.'),
  PRODUCTCODE: Yup.string().required('Chưa chọn sản phẩm.'),
});
