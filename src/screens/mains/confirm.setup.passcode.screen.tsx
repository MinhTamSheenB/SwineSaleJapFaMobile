/* eslint-disable @typescript-eslint/no-use-before-define */
import {useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';

import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  PassCode,
  PassCodeKeyBoard,
  SafeView,
  TextCustom,
} from '~/components/commons';
import {Header} from '~/components/sections';
import {Colors} from '~/configs';
import GlobalActions from '~/redux/global/global.actions';
import MasterActions from '~/redux/master/master.actions';

const PASS_CODE_LENGTH = 6;

const ConfirmSetupPassCodeScreen = () => {
  const route = useRoute();
  const {params} = route;
  const dispatch = useDispatch();

  const [passCode, setPassCode] = useState<string>();

  const handleOnPress = (num?: number) => {
    if (num === undefined && passCode === undefined) return;
    let str = '';
    if (num !== undefined) {
      str = passCode ? `${passCode}${num}` : `${num}`;
    } else if (passCode) {
      str = passCode.substring(0, passCode.length - 1);
    }
    if (str.length > PASS_CODE_LENGTH) return;
    setPassCode(str);
  };

  useEffect(() => {
    if (passCode && passCode.length === PASS_CODE_LENGTH) {
      const passCodeParam = params?.passCode ?? undefined;
      if (passCodeParam === passCode) {
        dispatch(MasterActions.setupPassCode(passCode));
      } else {
        dispatch(
          GlobalActions.openErrorInfoModal(
            'Mã PIN không đúng. \n Vui lòng thử lại.',
            'ERROR',
          ),
        );
        setPassCode(undefined);
      }
    }
  }, [dispatch, params, passCode]);

  return (
    <SafeView style={styles.container}>
      <Header noShadow title="Xác Nhận Mã PIN" isMenu={false} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
        }}>
        <TextCustom style={{marginBottom: 20}}>
          Nhập lại mã pin của bạn
        </TextCustom>
        <PassCode length={PASS_CODE_LENGTH} value={passCode} />
      </View>
      <PassCodeKeyBoard onPress={(number) => handleOnPress(number)} />
    </SafeView>
  );
};

export default ConfirmSetupPassCodeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
