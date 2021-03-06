/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {CreditStatus} from '~/apis/types.service';
import {checkPermission, MenuPermission} from '~/commons';
import {IconType} from '~/commons/types';
import {
  Accordion,
  Button,
  Icon,
  InputWithoutFormik,
  ModalBottom,
  SafeView,
  TagButton,
  TextCustom,
} from '~/components/commons';
import {
  Column,
  ConfirmModal,
  Container,
  Header,
  Row,
  RowLabelValue,
} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {formatDate} from '~/helpers/DatetimeHelpers';
import {numberFormat, scaleFactor} from '~/helpers/UtilitiesHelper';
import CreditActions from '~/redux/credit/credit.actions';
import {CreditType} from '~/redux/credit/credit.types';
import {RootState} from '~/redux/reducers';

export interface IUserActionProps {
  iconType: IconType;
  iconName: string;
  label: string;
  color?: string;
  onClick?: () => void;
}
const UserAction = ({
  iconType,
  iconName,
  label,
  color,
  onClick,
}: IUserActionProps) => {
  const strColor = color ?? Colors.GRAY_LIGHT;
  const borderColor = {borderColor: strColor};

  return (
    <TouchableOpacity onPress={onClick}>
      <View style={[styles.actionContainer, borderColor]}>
        <Icon
          name={iconName}
          type={iconType}
          style={[styles.iconStyle, {color: strColor}]}
        />
        <TextCustom style={{...styles.labelStyle, color}}>{label}</TextCustom>
      </View>
    </TouchableOpacity>
  );
};

const CreditDetailScreen = () => {
  const dispatch = useDispatch();

  const [actionSelected, setActionSelected] = React.useState<CreditType>();
  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const {detail, selectedId} = useSelector((state: RootState) => state.credit);
  const [isRejectModal, setIsRejectModal] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>();
  const {userMenuIds} = useSelector((state: RootState) => state.master);

  React.useEffect(() => {
    dispatch(CreditActions.getDetail(selectedId));
  }, [dispatch, selectedId]);

  const onUserSelectedAction = (type: CreditType) => {
    setActionSelected(type);
    if (type === 'REJECT') {
      setIsRejectModal(true);
    } else {
      setIsConfirm(true);
    }
  };

  const onAccept = () => {
    if (selectedId && actionSelected) {
      dispatch(
        CreditActions.doAnotherAction(selectedId, actionSelected, '', true),
      );
    }
  };

  const onReject = () => {
    setIsRejectModal(false);
    if (actionSelected) {
      dispatch(
        CreditActions.doAnotherAction(
          selectedId,
          actionSelected,
          rejectReason ?? '',
          true,
        ),
      );
    }
  };

  return (
    <SafeView>
      <Header
        title="Th??ng Tin Xin N???"
        isMenu={false}
        noShadow
        disableThreeDot
      />
      <Container isIncludeScrollView>
        <Accordion title="????n h??ng" isOpen>
          <RowLabelValue label="M?? ????n h??ng:" value={detail?.SONO ?? '---'} />
          <RowLabelValue
            label="Ng??y ????n h??ng:"
            value={formatDate(detail?.SODATE, 'date')}
          />
          <RowLabelValue
            label="Kh??ch h??ng:"
            value={detail?.CUSTNAME ?? ''}
            isBold
          />
          <RowLabelValue
            label="S??? d?? hi???n t???i:"
            value={numberFormat(detail?.CURRENTBALANCE)}
            valColor={Colors.DANGER}
          />
        </Accordion>
        <Accordion title="Th??ng tin xin n???" isOpen>
          <RowLabelValue
            label="T???ng ti???n ??h:"
            value={numberFormat(detail?.SOAMOUNT_GROSS)}
          />
          <RowLabelValue
            label="Ti???n sau chi???t kh???u:"
            value={numberFormat(detail?.SOAMOUNT_NET)}
          />
          <RowLabelValue
            label="S??? ti???n xin n???:"
            value={numberFormat(detail?.REQUESTAMOUNT)}
          />
          <RowLabelValue
            label="Ti???n n??? ???? tr???:"
            value={numberFormat(detail?.PAYMENTAMOUNT)}
          />
          <RowLabelValue
            label="Ti???n n??? c??n l???i:"
            value={numberFormat(detail?.REMAINAMOUNT)}
          />
          <RowLabelValue
            label="L?? do kh??ng duy???t:"
            value={detail?.REJECTREASON ?? ''}
          />
          <RowLabelValue label="Ghi ch??:" value={detail?.REMARKS ?? '---'} />
          <RowLabelValue label="Memmo" value={detail?.REFDOC ?? '---'} />
        </Accordion>
      </Container>
      <View
        style={{
          backgroundColor: Colors.WHITE,
          width: '100%',
          height: 50,
          alignItems: 'center',
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}>
          {checkPermission(userMenuIds, MenuPermission.CREDIT.CREATE) &&
            detail?.STATUS === CreditStatus.New && (
              <>
                <UserAction
                  iconName="closecircle"
                  iconType="AntDesign"
                  label="X??a xin n???"
                  color={Colors.DANGER}
                  onClick={() => onUserSelectedAction('DELETE')}
                />
                {/* <UserAction
                    iconName="send"
                    iconType="FontAwesome"
                    label="G???i"
                    color={Colors.SUCCESS}
                    onClick={() => onUserSelectedAction('SEND')}
                  /> */}
              </>
            )}
          {[
            CreditStatus.Rejected,
            CreditStatus.Deleted,
            CreditStatus.Approved,
          ].indexOf(detail?.STATUS ?? -1) < 0 && (
            <UserAction
              iconName="ban"
              iconType="FontAwesome"
              label="H???y phi???u"
              onClick={() => onUserSelectedAction('CANCEL')}
            />
          )}
          {checkPermission(userMenuIds, MenuPermission.CREDIT.APPROVAL) &&
            [CreditStatus.New].indexOf(detail?.STATUS ?? -1) > -1 && (
              <>
                <UserAction
                  iconName="check-square-o"
                  iconType="FontAwesome"
                  label="Duy???t"
                  color={Colors.SUCCESS}
                  onClick={() => onUserSelectedAction('APPROVED')}
                />
                <UserAction
                  iconName="ban"
                  iconType="FontAwesome"
                  label="T??? ch???i duy???t"
                  color={Colors.DANGER}
                  onClick={() => onUserSelectedAction('REJECT')}
                />
              </>
            )}
        </ScrollView>
      </View>

      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => setIsConfirm(false)}
        onAccept={() => {
          setIsConfirm(false);
          onAccept();
        }}
      />

      <ModalBottom
        title="T??? ch???i xin n???"
        isVisible={isRejectModal}
        style={{minHeight: scaleFactor(270)}}
        onClose={() => setIsRejectModal(false)}>
        <View style={{flex: 1}}>
          <Row>
            <InputWithoutFormik
              label="L?? do t??? ch???i"
              multiline
              value={rejectReason}
              onValueChange={(str) => setRejectReason(str.toString())}
              contentStyle={{borderColor: Colors.BORDER_TWO, padding: 5}}
            />
          </Row>
          <Row>
            <Button
              color={Colors.WHITE}
              title="L??u th??ng tin"
              onPress={() => onReject()}
            />
          </Row>
        </View>
      </ModalBottom>
    </SafeView>
  );
};
export default CreditDetailScreen;

const styles = StyleSheet.create({
  actionContainer: {
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.BORDER_DARK,
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  iconStyle: {
    marginRight: 5,
  },
  labelStyle: {
    fontSize: Sizes.Note,
    marginTop: 5,
  },
});
