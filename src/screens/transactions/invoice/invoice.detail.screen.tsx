/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import { InvoiceStatus } from '~/apis/types.service';
import {INavigateScreen} from '~/commons/types';
import {Accordion, Button, Icon, InputWithoutFormik, ModalCommon, SafeView, TextCustom} from '~/components/commons';
import {
  Column,
  Container,
  Header,
  Row,
  RowLabelIcon,
} from '~/components/sections';
import {AppStrings, Colors, Sizes} from '~/configs';
import {InvoiceProductItem} from '~/containers/transactions/Invoice';
import { PermissionHelper } from '~/helpers';
import {formatDate} from '~/helpers/DatetimeHelpers';
import {numberFormat} from '~/helpers/UtilitiesHelper';
import ScreenType from '~/navigations/screen.constant';
import GlobalActions from '~/redux/global/global.actions';
import InvoiceActions from '~/redux/invoice/invoice.actions';
import {RootState} from '~/redux/reducers';

type InvoiceOnPressType = 'DELETE' | 'CANCEL' | 'CONVERT' | 'VIEW' | 'PUBLISH';

const InvoiceDetailScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const {headerDetail, items, currentInvNo} = useSelector(
    (state: RootState) => state.invoice,
  );

  const [isCancelModal, setCancelModel] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  React.useEffect(() => {
    if (currentInvNo) {
      dispatch(InvoiceActions.getDetailByNo(currentInvNo));
    }
  }, [dispatch, currentInvNo]);

  const handleUserOnPress = async (type: InvoiceOnPressType): Promise<void> => {
    if (!headerDetail?.INVNO) return;

    switch (type) {
      case 'DELETE': {
        if (headerDetail.STATUS === InvoiceStatus.Published) {
          dispatch(GlobalActions.openErrorInfoModal(AppStrings.Invoice.CannotDelete,'WARNING'));
          break;
        }
        const nav: INavigateScreen = {
          isNavigate: true,
          screen: ScreenType.Invoice.LIST,
        };
        dispatch(InvoiceActions.deleteInvoiceByCode(headerDetail?.INVNO, true, nav));
        break;
      }
      case 'VIEW': {
        if (headerDetail.STATUS !== InvoiceStatus.Published) {
         dispatch(GlobalActions.openErrorInfoModal(AppStrings.Invoice.InValidView, 'WARNING'));
         break;
        }
        const isHasPermission = await PermissionHelper.requestWriteExternalStorage()
        if (isHasPermission) {
          dispatch(InvoiceActions.downloadInvoicePdf(headerDetail?.INVNO));
        }
        break;
      }
      case 'PUBLISH': {
        if (headerDetail.STATUS === InvoiceStatus.Canceled) {
          dispatch(GlobalActions.openErrorInfoModal(AppStrings.Invoice.CanceledInvoice, 'WARNING'));
          break;
        }
        dispatch(InvoiceActions.publishInvoice(headerDetail?.INVNO, true));
        break;
      }
      case 'CANCEL': {
        setCancelModel(true);
        break;
      }
      case 'CONVERT': {
        const uri = `http://apps.japfa.com.vn:62052/api/EInvoice/ConvertForVerifyFkeyAndGetHTML?fkey=${headerDetail.INVNO}&userid=test&saleGroupNo=00002`;
        navigate.navigate(ScreenType.Main.WebView, {uri, title: 'Chuy???n ?????i H??a ????n ??i???n T???'});
        break;
      }
      default: {
        dispatch(GlobalActions.openErrorInfoModal(AppStrings.Common.ComingSoon, 'WARNING'))
        break;
      }
    }
  };

  const handleCancelInvoice = () => {
    setCancelModel(false);
    const nav: INavigateScreen = {isNavigate: true, screen: ScreenType.Invoice.LIST};
    dispatch(InvoiceActions.cancelByInvNo(headerDetail?.INVNO, reason, true, nav))
  }

  return (
    <SafeView>
      <Header title="Th??ng Tin H??a ????n" isMenu={false} />

      <Container isIncludeScrollView>
        <Accordion title="Th??ng Tin Kh??ch H??ng" isOpen>
          <Row isSmall>
            <Column>
              <RowLabelIcon
                iconName="users"
                iconType="Entypo"
                value={headerDetail?.CUSTNAME}
                bold
              />
            </Column>
          </Row>

          <Row isSmall>
            <Column>
              <RowLabelIcon
                iconName="idcard"
                iconType="AntDesign"
                value={headerDetail?.CUSTTAXCODE ?? '0000-0000-0000-0000'}
                bold
              />
            </Column>
          </Row>

          <Row isSmall>
            <Column>
              <RowLabelIcon
                iconName="address"
                iconType="Entypo"
                value={headerDetail?.CUSTADDRESS}
              />
            </Column>
          </Row>
        </Accordion>

        <Accordion title="Th??ng Tin H??a ????n" isOpen>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>S??? h??a ????n: </TextCustom>
              <TextCustom bold>{headerDetail?.INVNO}</TextCustom>
            </Column>
          </Row>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>Ng??y h??a ????n: </TextCustom>
              <TextCustom>
                {formatDate(headerDetail?.INVDATE, 'date')}
              </TextCustom>
            </Column>
          </Row>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>M?? ????n H??ng: </TextCustom>
              <TextCustom bold>{headerDetail?.DONO}</TextCustom>
            </Column>
          </Row>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>S??? xe: </TextCustom>
              <TextCustom>{headerDetail?.TRUCKNO}</TextCustom>
            </Column>
          </Row>

          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>Chi???t kh???u: </TextCustom>
              <TextCustom>
                {numberFormat(headerDetail?.DISCOUNTAMT, 'VN??')}
              </TextCustom>
            </Column>
          </Row>

          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>Ti???n thu???: </TextCustom>
              <TextCustom>
                {numberFormat(headerDetail?.VATAMT, 'VN??')}
              </TextCustom>
            </Column>
          </Row>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>Ng??y giao:</TextCustom>
              <TextCustom bold>
                {formatDate(headerDetail?.DODATE, 'date')}
              </TextCustom>
            </Column>
          </Row>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>Ng?????i L???p</TextCustom>
              <TextCustom>{headerDetail?.CREATEDBY}</TextCustom>
            </Column>
          </Row>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>
                T???ng ti???n thanh to??n:
              </TextCustom>
              <TextCustom bold style={{color: Colors.ORIGIN}}>
                {numberFormat(headerDetail?.TOTALPAYMENT, 'VN??')}
              </TextCustom>
            </Column>
          </Row>
          <Row isSmall style={styles.rowLine}>
            <Column style={{justifyContent: 'space-between'}}>
              <TextCustom style={styles.title}>Ghi ch??:</TextCustom>
              <TextCustom>{headerDetail?.INVNOTES ?? '---'}</TextCustom>
            </Column>
          </Row>
        </Accordion>

        <Accordion title="Danh S??ch H??ng H??a" isOpen>
          {items.map((item, index) => (
            <InvoiceProductItem item={item} key={`${item.PROD_ID}-${index}`} />
          ))}
        </Accordion>
      </Container>

      <View style={{backgroundColor: Colors.WHITE, height: 70}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Row>
            <Column style={{width: 80}}>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
                onPress={() => handleUserOnPress('DELETE')}>
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
                  X??a H??
                </TextCustom>
              </Pressable>
            </Column>
            <Column style={{width: 80}}>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
                onPress={() => handleUserOnPress('CANCEL')}>
                <Icon
                  name="ban"
                  type="FontAwesome"
                  style={{
                    color: Colors.SUCCESS,
                  }}
                />
                <TextCustom
                  style={{
                    fontSize: Sizes.Note,
                    marginTop: 5,
                    color: Colors.SUCCESS,
                  }}
                  bold>
                  H???y H??
                </TextCustom>
              </Pressable>
            </Column>
            <Column style={{width: 120}}>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
                onPress={() => handleUserOnPress('CONVERT')}>
                <Icon
                  name="recycle"
                  type="FontAwesome"
                  style={{color: Colors.GRAY, transform: [{rotateY: '180deg'}]}}
                />
                <TextCustom style={{fontSize: 12, marginTop: 5}} bold>
                  Chuy???n ?????i H????T
                </TextCustom>
              </Pressable>
            </Column>

            <Column style={{width: 80}}>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
                onPress={() => handleUserOnPress('VIEW')}>
                <Icon
                  name="eye"
                  type="FontAwesome"
                  style={{color: Colors.GRAY}}
                />
                <TextCustom style={{fontSize: Sizes.Note, marginTop: 5}} bold>
                  Xem H??
                </TextCustom>
              </Pressable>
            </Column>

            <Column style={{width: 80}}>
              <Pressable
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
                onPress={() => handleUserOnPress('PUBLISH')}>
                <Icon
                  name="share-square"
                  type="FontAwesome"
                  style={{color: Colors.GRAY}}
                />
                <TextCustom style={{fontSize: Sizes.Note, marginTop: 5}} bold>
                  Ph??t h??nh
                </TextCustom>
              </Pressable>
            </Column>
          </Row>
        </ScrollView>
      </View>
                
      <ModalCommon isVisible={isCancelModal} title="Nh???p L?? Do H???y H??a ????n" onClose={() => setCancelModel(false)}>
        <View style={{height: 200}}>
          <InputWithoutFormik style={{justifyContent: 'flex-start'}} multiline onValueChange={(str) => setReason(str)} value={reason} />
          <Button title="H???y H??a ????n" color={Colors.WHITE} radius={20} onPress={() => handleCancelInvoice()} />
        </View>       
      </ModalCommon>
   
    </SafeView>
  );
};

export default InvoiceDetailScreen;

const styles = StyleSheet.create({
  title: {
    color: Colors.GRAY_LIGHT,
    fontSize: 15,
    textTransform: 'capitalize',
  },
  rowLine: {
    borderBottomColor: Colors.GRAY_LIGHT,
    borderBottomWidth: 0.2,
    paddingBottom: 10,
  },
});
