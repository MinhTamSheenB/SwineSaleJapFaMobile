import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  DeliveryOrderStatus,
  IDoFilterModel,
  IDoItem,
  IInvoiceFilterModel,
} from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {FlatListCommon} from '~/components/commons';
import {ConfirmModal, Container, SearchBox} from '~/components/sections';
import ScreenType from '~/navigations/screen.constant';
import DoActions from '~/redux/do/do.actions';
import InvoiceActions from '~/redux/invoice/invoice.actions';
import {RootState} from '~/redux/reducers';
import DoInvoiceItem from './DoInvoiceItem';

export interface IProps {
  model: IInvoiceFilterModel;
}

const DoInvoiceTab = ({model}: IProps) => {
  const dispatch = useDispatch();
  const {data} = useSelector((state: RootState) => state.dos);
  const [dataLocal, setDataLocal] = React.useState<IDoItem[]>([]);

  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const [doNo, setDoNo] = React.useState<string>('');
  const [soNo, setSoNo] = React.useState<string>('');

  React.useEffect(() => {
    setDataLocal(data);
  }, [data]);

  React.useEffect(() => {
    const objFilter: IDoFilterModel = {
      fromDate: model.fromDate,
      toDate: model.toDate,
      deptId: model.deptId,
      loadDetail: false,
      loadScaleHeader: false,
      status: DeliveryOrderStatus.Finish,
    };
    dispatch(DoActions.search(objFilter));
  }, [dispatch, model]);

  const onPostToInvoice = async () => {
    setIsConfirm(false);
    const nav: INavigateScreen = {
      isNavigate: true,
      screen: ScreenType.Invoice.DETAIL,
    };
    dispatch(InvoiceActions.postDoToInvoice(doNo, nav));
    setDoNo('');
  };

  return (
    <>
      <Container>
        <SearchBox
          placeholder="Đơn hàng, phiếu xuất kho, khách hàng ..."
          accessor="key"
          dataSource={data}
          onSearch={(dataSearch) => setDataLocal(dataSearch ?? [])}
        />

        <View style={{height: 10}} />

        <FlatListCommon
          data={dataLocal}
          renderItem={({item}) => (
            <DoInvoiceItem
              item={item}
              onPress={(obj) => {
                setDoNo(obj.DONO);
                setSoNo(obj.SONO);
                setIsConfirm(true);
              }}
            />
          )}
          isShowVertical={false}
        />
      </Container>
      <ConfirmModal
        title={`Bạn muốn lập hóa đơn cho đơn hàng: ${soNo} ?`}
        isVisible={isConfirm}
        onAccept={onPostToInvoice}
        onClose={() => setIsConfirm(false)}
      />
    </>
  );
};

export default DoInvoiceTab;
