import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Pressable, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DeliveryOrderStatus, IDoHeaderCommon} from '~/apis/types.service';
import {MenuPermission} from '~/commons';
import {INavigateScreen} from '~/commons/types';
import {Accordion, Icon, SafeView, TextCustom} from '~/components/commons';
import {
  Column,
  ConfirmModal,
  Container,
  Header,
  Row,
  RowLabelIconValue,
} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {DoProduct} from '~/containers/transactions/Do';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import ScreenType from '~/navigations/screen.constant';
import DoActions from '~/redux/do/do.actions';
import {RootState} from '~/redux/reducers';

type ActionType = 'POST_OR_REVERT_INVOICE' | 'DELETE_DO';

const DoSummaryScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {items, headerInfo, headerModel} = useSelector(
    (state: RootState) => state.dos,
  );
  const {userParams, drawerId} = useSelector(
    (state: RootState) => state.global,
  );
  const [isConfirmModal, setIsConfirmModal] = React.useState<boolean>(false);
  const [actionSelected, setActionSelected] = React.useState<
    ActionType | undefined
  >(undefined);

  React.useEffect(() => {
    const doNo = headerModel.DONO;
    if (doNo) {
      const loadDoRel = drawerId === MenuPermission.DO_RELEASE_MENU_ID;
      dispatch(DoActions.getProductsDoNo(doNo, loadDoRel));
      dispatch(DoActions.getHeaderInfoByNo(doNo));
    }
  }, [headerModel.DONO, dispatch, drawerId]);

  const handleOnAccept = () => {
    setIsConfirmModal(false);
    if (actionSelected === 'POST_OR_REVERT_INVOICE') {
      dispatch(
        DoActions.postToSale(headerInfo?.DONO!, headerInfo?.STATUS!, true),
      );
    } else {
      const nav: INavigateScreen = {
        screen: ScreenType.DO.LIST,
        isNavigate: true,
      };
      const model: IDoHeaderCommon = {...userParams, doNo: headerInfo?.DONO!};
      dispatch(DoActions.remove(model, true, nav));
    }
  };

  return (
    <SafeView>
      <Header
        title="Thông Tin Yêu Cầu Giao Hàng"
        isMenu={false}
        disableThreeDot
      />
      <Container isIncludeScrollView>
        <Accordion title="Phiếu Giao Hàng" isOpen>
          <RowLabelIconValue
            iconType="Entypo"
            iconName="location"
            label="Trại xuất:"
            value={headerInfo?.LOCATIONNAME ?? '---'}
            styleValue={{fontWeight: 'bold'}}
          />

          <RowLabelIconValue
            iconType="Entypo"
            iconName="users"
            label="Khách hàng:"
            value={headerInfo?.CUSTNAME ?? '---'}
            styleValue={{fontWeight: 'bold'}}
          />
          <RowLabelIconValue
            iconType="Entypo"
            iconName="location"
            label="Địa chỉ kh:"
            value={headerInfo?.PLACEDELIVERY ?? '---'}
          />

          <RowLabelIconValue
            iconType="Entypo"
            iconName="user"
            label="Người nhận:"
            value={headerInfo?.RECEIVERNAME ?? '---'}
          />

          <RowLabelIconValue
            iconType="FontAwesome"
            iconName="phone"
            label="Điện thoại:"
            value={headerInfo?.RECEIVERPHONE ?? '---'}
          />

          <RowLabelIconValue
            iconType="AntDesign"
            iconName="calendar"
            label="Giờ nhận:"
            value={headerInfo?.RECEIVEHOUR ?? '---'}
          />
          <RowLabelIconValue
            iconType="FontAwesome"
            iconName="truck"
            label="Số xe:"
            value={headerInfo?.TRUCK_NO ?? '---'}
          />
          <RowLabelIconValue
            iconType="AntDesign"
            iconName="warning"
            label="Ghi chú:"
            value={headerInfo?.REMARKS ?? '---'}
          />
        </Accordion>

        <Accordion title="Thông Tin Chứng Từ" isOpen>
          <RowLabelIconValue
            iconName="clipboard"
            iconType="Entypo"
            label="Số chứng từ:"
            value={headerInfo?.DONO ?? ''}
            styleValue={{fontWeight: 'bold'}}
          />
          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày chứng từ:"
            value={convertStringDateToDdMmYyyy(headerInfo?.DODATE, 'date')}
          />
          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày hạch toán:"
            value={convertStringDateToDdMmYyyy(headerInfo?.CREATEDATE, 'date')}
          />

          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày chốt đơn:"
            value={convertStringDateToDdMmYyyy(headerInfo?.CREATEDATE, 'date')}
          />

          <RowLabelIconValue
            iconType="AntDesign"
            iconName="warning"
            label="Ghi chú:"
            value={headerInfo?.REMARKS ?? '---'}
          />
        </Accordion>

        <Accordion title="Danh Sách Hàng Hóa" isOpen>
          {items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <DoProduct item={item} key={`${item.DODTID}-${index}`} />
          ))}
        </Accordion>
      </Container>

      <View style={{backgroundColor: Colors.WHITE, height: 70}}>
        <Row>
          <Column>
            <Pressable
              onPress={() => {
                setIsConfirmModal(true);
                setActionSelected('POST_OR_REVERT_INVOICE');
              }}
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Icon
                name={
                  headerInfo?.STATUS === DeliveryOrderStatus.New
                    ? 'lock1'
                    : 'unlock'
                }
                type="AntDesign"
                style={{
                  color:
                    headerInfo?.STATUS === DeliveryOrderStatus.New
                      ? Colors.SUCCESS
                      : Colors.DANGER,
                }}
              />
              <TextCustom
                style={{
                  fontSize: Sizes.Note,
                  marginTop: 5,
                  color:
                    headerInfo?.STATUS === DeliveryOrderStatus.New
                      ? Colors.SUCCESS
                      : Colors.DANGER,
                }}
                bold>
                {headerInfo?.STATUS === DeliveryOrderStatus.New
                  ? 'Chốt đơn'
                  : 'Hủy chốt đơn'}
              </TextCustom>
            </Pressable>
          </Column>
          <Column>
            <Pressable
              onPress={() => {
                setIsConfirmModal(true);
                setActionSelected('DELETE_DO');
              }}
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Icon
                name="closecircle"
                type="AntDesign"
                style={{color: Colors.DANGER}}
              />
              <TextCustom
                style={{
                  fontSize: Sizes.Note,
                  marginTop: 5,
                  color: Colors.DANGER,
                }}
                bold>
                Xóa Đơn
              </TextCustom>
            </Pressable>
          </Column>
          <Column>
            <Pressable
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
              onPress={() => navigation.navigate(ScreenType.DO.LIST)}>
              <Icon
                name="back"
                type="AntDesign"
                style={{color: Colors.GRAY, transform: [{rotateY: '180deg'}]}}
              />
              <TextCustom style={{fontSize: Sizes.Note, marginTop: 5}}>
                Danh sách
              </TextCustom>
            </Pressable>
          </Column>
        </Row>
      </View>
      <ConfirmModal
        isVisible={isConfirmModal}
        onClose={() => {
          setIsConfirmModal(false);
          setActionSelected(undefined);
        }}
        onAccept={handleOnAccept}
      />
    </SafeView>
  );
};

export default DoSummaryScreen;
