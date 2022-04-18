/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {IconType, INavigateScreen} from '~/commons/types';
import {
  Button,
  Icon,
  InputWithoutFormik,
  ModalCommon,
  SafeView,
  TextCustom,
} from '~/components/commons';
import {ConfirmModal, Header} from '~/components/sections';
import {Colors} from '~/configs';
import {CndnSummary} from '~/containers/transactions/Cndn';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import {RootState} from '~/redux/reducers';

export interface IButtonProps extends TouchableOpacityProps {
  label: string;
  iconName: string;
  iconType: IconType;
  color: string;
  isVisible: boolean;
}

const ActionButton = ({
  label,
  iconName,
  iconType,
  color,
  isVisible,
  ...prop
}: IButtonProps) => {
  if (!isVisible) return null;
  return (
    <TouchableOpacity {...prop}>
      <View style={styles.buttonContainer}>
        <Icon
          type={iconType}
          name={iconName}
          style={[styles.btnIcon, {color}]}
        />
        <TextCustom style={{color}} bold>
          {label}
        </TextCustom>
      </View>
    </TouchableOpacity>
  );
};

const CndnSummaryScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const cndnNo = route.params?.cndnNo;

  const {currentDrawerScreen} = useSelector((state: RootState) => state.global);
  const {info} = useSelector((state: RootState) => state.cndn);

  const isApproval = currentDrawerScreen === ScreenType.Approval.CNDN;

  type UserActionType = 'DELETE' | 'APPROVE' | 'REJECT' | 'INVOICE' | 'LIST';

  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const [actionSelected, setAction] = React.useState<
    UserActionType | undefined
  >();

  const [isRejectModal, setRejectModal] = React.useState<boolean>(false);
  const [reason, setReason] = React.useState<string>('');

  const handleAction = () => {
    setIsConfirm(false);
    setRejectModal(false);
    if (!info || !actionSelected) return;
    switch (actionSelected) {
      case 'DELETE': {
        const nav: INavigateScreen = {
          screen: ScreenType.Cndn.LIST,
          isNavigate: true,
        };
        dispatch(
          CndnActions.deleteHeader(info?.CNDNNO, info?.STATUS, true, nav),
        );
        break;
      }
      case 'APPROVE': {
        dispatch(CndnActions.approve(info?.CNDNNO, info, true));
        break;
      }
      case 'REJECT': {
        dispatch(CndnActions.reject(info?.CNDNNO, reason, info, true));
        break;
      }
      case 'INVOICE': {
        dispatch(CndnActions.invoice(info?.CNDNNO, info, true));
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <SafeView>
      <Header title="Thông Tin Điều Chỉnh" isMenu />
      <CndnSummary cndnNo={cndnNo} />
      <View style={styles.actionContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <ActionButton
            label="Xóa"
            iconName="closecircle"
            iconType="AntDesign"
            color={Colors.DANGER}
            onPress={() => {
              setIsConfirm(true);
              setAction('DELETE');
            }}
            isVisible={!isApproval}
          />
          <ActionButton
            label="Duyệt"
            iconName="checkcircle"
            iconType="AntDesign"
            color={Colors.SUCCESS}
            onPress={() => {
              setIsConfirm(true);
              setAction('APPROVE');
            }}
            isVisible={isApproval}
          />
          <ActionButton
            label="Từ Chối"
            iconType="FontAwesome"
            iconName="ban"
            color={Colors.ORIGIN}
            onPress={() => {
              setRejectModal(true);
              setAction('REJECT');
            }}
            isVisible={isApproval}
          />
          <ActionButton
            label="Lập Hóa Đơn"
            iconType="Entypo"
            iconName="clipboard"
            color={Colors.BORDER_DARK}
            onPress={() => {
              setIsConfirm(true);
              setAction('INVOICE');
            }}
            isVisible
          />
          <ActionButton
            label="Danh Sách"
            iconType="Entypo"
            iconName="align-right"
            color={Colors.BORDER_DARK}
            onPress={() => navigate.navigate(ScreenType.Cndn.LIST)}
            isVisible
          />
        </ScrollView>
      </View>
      <ConfirmModal
        isVisible={isConfirm}
        onClose={() => setIsConfirm(false)}
        onAccept={() => handleAction()}
      />

      <ModalCommon
        title="Từ Chối Phiếu Điều Chỉnh"
        isVisible={isRejectModal}
        onClose={() => setRejectModal(false)}>
        <View style={{height: 200}}>
          <InputWithoutFormik
            label="Lý do"
            multiline
            value={reason}
            onValueChange={(str) => setReason(str.toString())}
            style={{height: 100}}
          />
          <Button
            title="Từ Chối"
            radius={20}
            color={Colors.WHITE}
            onPress={() => handleAction()}
          />
        </View>
      </ModalCommon>
    </SafeView>
  );
};

export default CndnSummaryScreen;
const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: Colors.WHITE,
    height: 60,
    elevation: 10,
  },
  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '100%',
  },
  btnIcon: {marginRight: 10},
});
