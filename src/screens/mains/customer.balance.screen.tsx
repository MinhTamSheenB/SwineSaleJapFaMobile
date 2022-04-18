/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {FlatListCommon, SafeView, TextCustom} from '~/components/commons';
import {Container, Header} from '~/components/sections';

import imgs from '~/assets/imgs';
import {Colors} from '~/configs';
import {scaleFactor} from '~/helpers/UtilitiesHelper';

export interface IProps {}

const CustomerBalanceScreen = () => {
  return (
    <SafeView>
      <Header title="Số dư khách hàng" isMenu={false} disableThreeDot />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginBottom: 10,
          paddingVertical: 10,
          backgroundColor: Colors.WHITE,
        }}>
        <View>
          <Image source={imgs.customer} style={{width: 80, height: 80}} />
        </View>
        <View
          style={{flex: 1, paddingHorizontal: 10, justifyContent: 'center'}}>
          <TextCustom style={{fontWeight: 'bold'}}>NGUYỄN THỊ LƯỢNG</TextCustom>
          <TextCustom
            style={{fontSize: scaleFactor(12), color: Colors.GRAY_LIGHT}}>
            N0000565
          </TextCustom>
          <TextCustom
            style={{fontSize: scaleFactor(12), color: Colors.GRAY_LIGHT}}>
            190 Nguyễn Hữu Cảnh, Biên Hoà, Đồng Nai
          </TextCustom>
        </View>
      </View>
      <Container>
        <FlatListCommon
          isShowVertical={false}
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={() => (
            <View style={styles.cardContainer}>
              <View
                style={{
                  width: scaleFactor(80),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f5a76c',
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }}>
                <Text style={styles.title}>10</Text>
                <View style={styles.line} />
                <Text style={styles.title}>2021</Text>
              </View>
              <View style={styles.container}>
                <TextCustom bold>[00005] SALE NORTH TEST</TextCustom>
                <View style={styles.row}>
                  <View>
                    <TextCustom isSmall>Số dư cuối kỳ (tk chính)</TextCustom>
                    <TextCustom>10,000,000 vnđ</TextCustom>
                  </View>
                </View>

                <View style={styles.row}>
                  <View>
                    <TextCustom isSmall>Số dư cuối kỳ (tk chính)</TextCustom>
                    <TextCustom>10,000,000 vnđ</TextCustom>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </Container>
    </SafeView>
  );
};

export default CustomerBalanceScreen;
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: Colors.SHADOW,
    shadowOffset: {width: 5, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  title: {
    textAlign: 'center',
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 21,
    textShadowColor: '#333',
    textShadowOffset: {width: 0.2, height: 1},
    textShadowRadius: 1,
  },
  line: {
    width: '50%',
    height: 1,
    backgroundColor: Colors.WHITE,
    marginVertical: 5,
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  row: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
