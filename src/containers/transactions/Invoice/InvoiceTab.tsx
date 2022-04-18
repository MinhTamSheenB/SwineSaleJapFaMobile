import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  IInvoiceFilterModel,
  IInvoiceHeaderDetail,
  InvoiceStatus,
} from '~/apis/types.service';
import {FlatListCommon} from '~/components/commons';
import {Container, SearchBox} from '~/components/sections';
import ScreenType from '~/navigations/screen.constant';
import InvoiceActions from '~/redux/invoice/invoice.actions';
import {RootState} from '~/redux/reducers';
import InvoiceFilter from './InvoiceFilter';
import InvoiceItem from './InvoiceItem';

export interface IProps {
  model: IInvoiceFilterModel;
}

const InvoiceTab = ({model}: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigation();
  const {data} = useSelector((state: RootState) => state.invoice);
  const [dataLocal, setDataLocal] = React.useState<IInvoiceHeaderDetail[]>([]);
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>(
    InvoiceStatus.New,
  );

  React.useEffect(() => {
    const invoiceFilter: IInvoiceFilterModel = {
      ...model,
      status: invoiceStatus,
    };
    dispatch(InvoiceActions.search(invoiceFilter));
  }, [dispatch, invoiceStatus, model]);

  React.useEffect(() => {
    setDataLocal(data);
  }, [data]);
  const handleNavigate = (item: IInvoiceHeaderDetail): void => {
    dispatch(InvoiceActions.setInvoiceCode(item.INVNO));
    navigate.navigate(ScreenType.Invoice.DETAIL);
  };

  return (
    <>
      <Container>
        <SearchBox
          placeholder="Đơn hàng, phiếu xuất kho, khách hàng ..."
          accessor="keySearch"
          dataSource={data}
          onSearch={(dataSearch) => setDataLocal(dataSearch ?? [])}
        />
        <InvoiceFilter
          onChange={(status) => setInvoiceStatus(status)}
          currentValue={invoiceStatus}
        />
        <View style={{height: 10}} />

        <FlatListCommon
          data={dataLocal}
          renderItem={({item}) => (
            <InvoiceItem item={item} onPress={() => handleNavigate(item)} />
          )}
          isShowVertical={false}
        />
      </Container>
    </>
  );
};

export default InvoiceTab;
