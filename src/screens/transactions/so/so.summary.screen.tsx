import React from 'react';
import {View, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  Header,
  Container,
  Row,
  Column,
  ConfirmModal,
  RowLabelIconValue,
} from '~/components/sections';
import {AppStrings, Colors, Sizes} from '~/configs';
import {Accordion, TextCustom, Icon, SafeView} from '~/components/commons';
import SoProductSummary from '~/containers/transactions/So/SoProductSummary';
import {RootState} from '~/redux/reducers';
import SoAction from '~/redux/so/so.actions';
import {Types} from '~/redux/so/so.types';
import {convertStringDateToDdMmYyyy} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import {ISoHeaderCommon, OrderStatus} from '~/apis/types.service';
import ScreenType from '~/navigations/screen.constant';
import GlobalActions from '~/redux/global/global.actions';
import MasterActions from '~/redux/master/master.actions';

type ActionType = 'POST_TO_DO' | 'DELETE_SO';

const SoSummaryScreen = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigation();

  // Reducer
  const {userParams, action} = useSelector((state: RootState) => state.global);
  const {soModel, soDetail} = useSelector((state: RootState) => state.so);
  const {customerBalances} = useSelector((state: RootState) => state.master);
  const [isConfirmModal, setIsConfirmModal] = React.useState<boolean>(false);
  const [actionSelected, setActionSelected] = React.useState<
    ActionType | undefined
  >(undefined);
  const [_, setLockText] = React.useState<string>('Chốt đơn');

  React.useEffect(() => {
    dispatch(SoAction.getSoInformationAndDetails(soModel.SONO));
  }, [dispatch, soModel.SONO]);

  React.useEffect(() => {
    if (!action.status) return;
    switch (action.name) {
      case Types.SO_DELETING_HEADER: {
        dispatch(GlobalActions.clearAction());
        navigate.navigate(ScreenType.SO.List);
        break;
      }
      default: {
        break;
      }
    }
  }, [action, dispatch, navigate]);

  React.useEffect(() => {
    switch (soModel.STATUS) {
      case OrderStatus.New: {
        setLockText('Chốt đơn');
        break;
      }
      case OrderStatus.Posted: {
        setLockText('Hủy chốt đơn');
        break;
      }
      default:
        break;
    }
  }, [soModel.STATUS]);

  React.useEffect(() => {
    dispatch(MasterActions.getCustomerBalance(soModel.CUSTID, soModel.UNITID));
  }, [dispatch, soModel.CUSTID, soModel.UNITID]);

  /**
   * Tính số tiền còn lại của khách hàng
   */
  const customerBalance: string = React.useMemo(() => {
    if (customerBalances.length < 1) return numberFormat(0);
    const balance = customerBalances[0];
    const value = balance?.ENDBALANCE ?? 0;
    return numberFormat(value);
  }, [customerBalances]);

  const totalKgBw: string = React.useMemo(() => {
    const value = soDetail?.SODETAILS?.reduce((cur, item) => {
      return cur + (item.BW_TOTAL ?? 0);
    }, 0);
    return numberFormat(value, 'Kg');
  }, [soDetail?.SODETAILS]);

  function handleAcceptModel(): void {
    setIsConfirmModal(false);
    const header: ISoHeaderCommon = {
      ...userParams,
      soNo: soModel.SONO,
    };
    switch (actionSelected) {
      case 'POST_TO_DO':
        if (soModel.STATUS === OrderStatus.New) {
          dispatch(SoAction.postToDo(header));
        } else if (soModel.STATUS === OrderStatus.Posted) {
          dispatch(SoAction.revertToSo(header));
        }
        break;
      case 'DELETE_SO': {
        dispatch(SoAction.deleteHeader(header));
        break;
      }
      default:
        break;
    }
  }

  return (
    <SafeView>
      <Header
        title={AppStrings.SO.SummaryTitle}
        isMenu={false}
        disableThreeDot
      />
      <Container isIncludeScrollView>
        <Accordion title="Thông Tin Khách Hàng" isOpen>
          <RowLabelIconValue
            iconName="users"
            iconType="Entypo"
            label="Khách hàng:"
            value={`${soDetail?.CUSTNAME}`}
          />
          <RowLabelIconValue
            iconName="location-pin"
            iconType="Entypo"
            label="Trại xuất:"
            value={soDetail?.LOCATIONNAME ?? ''}
          />
          <RowLabelIconValue
            iconName="user"
            iconType="Entypo"
            label="Người nhận:"
            value={soDetail?.RECEIVERNAME ?? ''}
          />
          <RowLabelIconValue
            iconName="phone"
            iconType="FontAwesome"
            label="Điện thoại:"
            value={soDetail?.RECEIVERPHONE ?? ''}
          />

          <RowLabelIconValue
            iconName="calendar"
            iconType="Entypo"
            label="Ngày giờ giao:"
            value={`${convertStringDateToDdMmYyyy(
              soDetail?.DELIVERYDATE,
              'date',
            )} - ${soDetail?.RECEIVEHOUR ?? '0:0'}`}
          />
          <RowLabelIconValue
            iconName="truck"
            iconType="FontAwesome"
            label="Số xe:"
            value={soDetail?.TRUCK_NO ?? ''}
          />

          <RowLabelIconValue
            iconName="dollar"
            iconType="FontAwesome"
            label="Số dư tài khoản:"
            value={customerBalance}
            styleValue={{fontWeight: 'bold', color: Colors.DANGER}}
          />
        </Accordion>

        <Accordion title="Thông Tin Chứng Từ" isOpen>
          <RowLabelIconValue
            iconName="clipboard"
            iconType="Entypo"
            label="Số chứng từ:"
            value={soDetail?.SONO ?? ''}
            styleValue={{fontWeight: 'bold'}}
          />
          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày chứng từ:"
            value={convertStringDateToDdMmYyyy(soDetail?.SODATE, 'date')}
          />
          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày hạch toán:"
            value={convertStringDateToDdMmYyyy(soDetail?.CREATEDATE, 'date')}
          />

          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày chốt đơn:"
            value={convertStringDateToDdMmYyyy(
              soDetail?.POSTEDDATE?.toString(),
              'date',
            )}
          />

          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Tổng số con:"
            value={numberFormat(soDetail?.TOTALQTY, 'Con')}
          />
          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Tổng số ký:"
            value={totalKgBw}
          />

          <RowLabelIconValue
            iconName="dollar-sign"
            iconType="Feather"
            label="Thành tiền:"
            styleValue={{fontWeight: 'bold'}}
            value={numberFormat(soDetail?.TOTALAMTAFTERVAT)}
          />
        </Accordion>

        <Accordion title="Danh Sách Hàng Hóa" isOpen>
          {soDetail?.SODETAILS?.map((item, index) => {
            return (
              <SoProductSummary
                key={item.PRODUCTID ?? index.toString()}
                item={item}
              />
            );
          })}
        </Accordion>
      </Container>
      <View style={{backgroundColor: Colors.WHITE, height: 70}}>
        <Row>
          <Column>
            <Pressable
              onPress={() => {
                setIsConfirmModal(true);
                setActionSelected('POST_TO_DO');
              }}
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Icon
                name={soModel.STATUS === OrderStatus.New ? 'lock1' : 'unlock'}
                type="AntDesign"
                style={{
                  color:
                    soModel.STATUS === OrderStatus.New
                      ? Colors.SUCCESS
                      : Colors.DANGER,
                }}
              />
              <TextCustom
                style={{
                  fontSize: Sizes.Note,
                  marginTop: 5,
                  color:
                    soModel.STATUS === OrderStatus.New
                      ? Colors.SUCCESS
                      : Colors.DANGER,
                }}
                bold>
                {soModel.STATUS === OrderStatus.New
                  ? 'Chốt đơn'
                  : 'Hủy chốt đơn'}
              </TextCustom>
            </Pressable>
          </Column>
          <Column>
            <Pressable
              onPress={() => {
                setIsConfirmModal(true);
                setActionSelected('DELETE_SO');
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
              onPress={() => navigate.navigate(ScreenType.SO.List)}
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
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
        onAccept={() => handleAcceptModel()}
      />
    </SafeView>
  );
};

export default SoSummaryScreen;
