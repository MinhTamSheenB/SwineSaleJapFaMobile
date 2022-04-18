import {useRoute} from '@react-navigation/native';
import React from 'react';
import WebView from 'react-native-webview';
import {MaterialIndicator} from 'react-native-indicators';
import {View} from 'react-native';
import {SafeView, TextCustom} from '~/components/commons';
import {Header} from '~/components/sections';
import {Colors} from '~/configs';

const WebWiewScreen = () => {
  const route = useRoute();
  const {uri, title} = route.params;

  return (
    <SafeView>
      <Header title={title} isMenu={false} noShadow />
      <WebView
        source={{uri}}
        startInLoadingState
        renderLoading={() => (
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialIndicator color={Colors.ORIGIN} />
            <TextCustom style={{color: Colors.WHITE}}>
              Vui lòng đợi trong giây lát.
            </TextCustom>
          </View>
        )}
      />
    </SafeView>
  );
};

export default WebWiewScreen;
