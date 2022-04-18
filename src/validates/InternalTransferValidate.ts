import * as Yup from 'yup';

export const DoInformationFormValidate = Yup.object().shape({
  LOCATIONID: Yup.string().required('Chọn trại/ kho xuất'),
  CUSTID: Yup.string().required('Chọn khách hàng'),
  DODATE: Yup.string().required('Chọn ngày giao hàng'),
  PLACEDELIVERY: Yup.string().required('Chọn địa chỉ giao hàng'),
  TRUCK_NO: Yup.string().required('Nhập số xe'),
  RECEIVEHOUR: Yup.string().required('Chọn thời gian nhận hàng'),
  RECEIVERNAME: Yup.string().required('Nhập người nhận hàng'),
  RECEIVERPHONE: Yup.string().required('Nhập SĐT người nhận'),
  SALEMAN: Yup.string().required('Nhập nhân viên bán hàng'),
  SALESPV: Yup.string().required('Nhập nhân viên giám sát'),
});

export const Test = Yup.object().shape({});
