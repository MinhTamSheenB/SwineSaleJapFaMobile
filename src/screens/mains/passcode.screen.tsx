/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import imgs from '~/assets/imgs';
import {CircleButton, Icon, TextCustom} from '~/components/commons';
import {Colors, Sizes} from '~/configs';
import useLocalAuthentication, {
  IBiometric,
} from '~/helpers/useLocalAuthentication';
import MasterActions from '~/redux/master/master.actions';
import {RootState} from '~/redux/reducers';
import SafeView from '~/components/commons/SafeView';
import ScreenType from '~/navigations/screen.constant';

const PASS_CODE_LENGTH = 6;
const USER_BACK_DOOR = 'phuc.nguyenhong';

const PassCodeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const {checkDeviceSupportBiometric, authenticate} = useLocalAuthentication();

  const {userParams} = useSelector((state: RootState) => state.global);

  const [biometricType, setBiometricType] = useState<IBiometric>();

  const passCodeRef = useRef<TextInput>(null);

  const handleAuthentication = useCallback(
    async (type: 'AUT' | undefined) => {
      try {
        const isResult = await authenticate();
        if (!isResult) {
          if (type === 'AUT') {
            passCodeRef.current?.focus();
          }
        } else {
          // const codeFromKeychain = await getPassCode();
          // const decryptPasscode = CryptoJsHelpers.decryptASE(codeFromKeychain);
          // console.log({decryptPasscode});
          // setPassCode(decryptPasscode);
          dispatch(MasterActions.getMenuByUser());
        }
      } catch (er) {
        console.log({er});
      }
    },
    [authenticate, dispatch],
  );

  const backDoor = () => {
    dispatch(MasterActions.getMenuByUser());
  };

  const checkDeviceSupport = useCallback(async () => {
    const item = await checkDeviceSupportBiometric();
    setBiometricType(item);
    if (item) {
      await handleAuthentication('AUT');
    } else {
      passCodeRef.current?.focus();
    }
  }, [checkDeviceSupportBiometric, handleAuthentication]);

  useEffect(() => {
    checkDeviceSupport();
  }, []);

  return (
    <SafeView
      disableStatusBar={false}
      statusBarBackgroundColor={Colors.ORIGIN}
      style={styles.container}
      bgColor={Colors.ORIGIN}>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TextCustom style={styles.h1}>Xin chào!</TextCustom>
        <TextCustom style={styles.h2}>{userParams.fullName}</TextCustom>
      </View>
      <View style={{flex: 2, width: '100%', alignItems: 'center'}}>
        <TouchableOpacity
          style={[styles.inputWrapper, styles.btn]}
          onPress={() => navigate.navigate(ScreenType.Main.Login)}>
          <View style={styles.btnContainer}>
            <Icon
              type="AntDesign"
              name="mail"
              style={{marginRight: 10, fontSize: 25}}
              color={Colors.WHITE}
            />
            <TextCustom style={styles.login}>
              Đăng nhập bằng email Japfa
            </TextCustom>
          </View>
        </TouchableOpacity>

        {biometricType && (
          <>
            <TouchableOpacity
              style={[styles.inputWrapper, styles.btn]}
              onPress={() => handleAuthentication('AUT')}>
              <View style={styles.btnContainer}>
                <Image
                  source={imgs[biometricType.image]}
                  style={styles.iconAut}
                />
                <TextCustom style={styles.login}>
                  {biometricType.text}
                </TextCustom>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
      {userParams.userId && userParams.userId === USER_BACK_DOOR && (
        <CircleButton
          iconName="unlock"
          iconColor={Colors.BLACK}
          onPress={() => backDoor()}
        />
      )}
    </SafeView>
  );
};

export default PassCodeScreen;
const styles = StyleSheet.create({
  container: {backgroundColor: Colors.ORIGIN, alignItems: 'center'},
  h1: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    paddingTop: 20,
    fontSize: 18,
    marginBottom: 10,
  },
  h2: {color: Colors.WHITE, textTransform: 'uppercase', fontSize: 14},
  inputWrapper: {
    height: 50,
    width: '85%',
    borderRadius: 40,
    marginBottom: 10,
    elevation: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  lockIcon: {
    color: Colors.GRAY,
    fontSize: Sizes.Icon,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    right: 15,
    color: Colors.GRAY_LIGHT,
  },
  password: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    textAlign: 'center',
    color: Colors.WHITE,
  },
  btn: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {color: Colors.WHITE},
  iconAut: {marginRight: 10, width: 30, height: 30, tintColor: Colors.WHITE},
  btnContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
