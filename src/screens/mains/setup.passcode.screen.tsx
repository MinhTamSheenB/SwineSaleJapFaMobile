/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  PassCode,
  PassCodeKeyBoard,
  SafeView,
  TextCustom,
} from '~/components/commons';
import {Header} from '~/components/sections';
import {Colors} from '~/configs';
import ScreenType from '~/navigations/screen.constant';

const PASS_CODE_LENGTH = 6;

const SetupPassCodeScreen = () => {
  const navigate = useNavigation();
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
      navigate.navigate(ScreenType.Main.ConfirmSetUpPassCode, {passCode});
    }
  }, [navigate, passCode]);

  return (
    <SafeView style={styles.container}>
      <Header noShadow title="Cài Đặt Mã PIN" isMenu={false} disableThreeDot />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
        }}>
        <TextCustom style={{marginBottom: 20}}>Nhập mã pin của bạn</TextCustom>
        <PassCode length={PASS_CODE_LENGTH} value={passCode} />
      </View>
      <PassCodeKeyBoard onPress={(number) => handleOnPress(number)} />
    </SafeView>
  );
};

export default SetupPassCodeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});
