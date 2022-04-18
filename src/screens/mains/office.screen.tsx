/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  BackHandler,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import {TextCustom} from '~/components/commons';
import {Row} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import fonts from '~/configs/fonts';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';
import {IMasterResponseCommon} from '~/apis/types.service';
import MasterActions from '~/redux/master/master.actions';
import {convertStringToNumber, scaleFactor} from '~/helpers/UtilitiesHelper';
import GlobalActions from '~/redux/global/global.actions';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.45;

export interface IOfficeCardProp {
  url: any;
  title: string;
  startAt: 'Left' | 'Right';
  onPress: () => void;
}

const OfficeCard = ({url, title, startAt, onPress}: IOfficeCardProp) => {
  const translateAnimated = useRef(new Animated.Value(0)).current;
  const animatedPosition = startAt === 'Left' ? -1 : 1;
  const widthValue = SCREEN_WIDTH * 0.5 * animatedPosition;

  const startAnimated = React.useCallback(() => {
    const toValue = 100;
    Animated.timing(translateAnimated, {
      duration: 200,
      toValue,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start();
  }, [translateAnimated]);

  useEffect(() => {
    startAnimated();
  }, [startAnimated]);

  const xValue = translateAnimated.interpolate({
    inputRange: [0, 100],
    outputRange: [widthValue, 0],
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={[styles.officeContainer, {transform: [{translateX: xValue}]}]}>
        <ImageBackground
          source={url}
          style={{flex: 1, justifyContent: 'center', borderRadius: 20}}
          imageStyle={styles.bgImageBackground}
          resizeMode="cover">
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <TextCustom bold style={{color: Colors.WHITE, textAlign: 'center'}}>
              {title}
            </TextCustom>
          </View>
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
};

const OfficeScreen = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const {userParams} = useSelector((state: RootState) => state.global);

  const imageBackground = require('../../assets/imgs/office-bg.jpg');
  const dongNaiImage = require('../../assets/imgs/dong-nai.jpg');
  const binhThuanImage = require('../../assets/imgs/binh-thuan.jpg');
  const huongCanhImage = require('../../assets/imgs/binh-duong.jpg');
  const sellingCenterImage = require('../../assets/imgs/selling-center.jpg');

  const {userOfficeS} = useSelector((state: RootState) => state.master);
  const handelSelectOffice = (officeId: string): void => {
    const numberOfficeId = convertStringToNumber(officeId);
    const office = userOfficeS.find((p) => p.ID === officeId);
    dispatch(
      GlobalActions.updateUserParams({
        ...userParams,
        officeId: numberOfficeId,
        regionId: office?.RegionID,
      }),
    );
    dispatch(MasterActions.getDepartments(userParams.userId, numberOfficeId));
    navigate.navigate(ScreenType.Main.Home);
  };
  const getImageById = (id: string) => {
    if (id === '2') return dongNaiImage;
    if (id === '4') return binhThuanImage;
    if (id === '1') return huongCanhImage;
    return sellingCenterImage;
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground
        source={imageBackground}
        style={{flex: 1, justifyContent: 'center'}}
        resizeMode="cover">
        <View style={styles.container}>
          <Row style={{marginTop: 50}}>
            <View style={{flex: 1, paddingHorizontal: 20}}>
              <TextCustom style={styles.hello}>Xin Chào</TextCustom>
              <TextCustom style={styles.title} bold>
                {userParams.fullName}
              </TextCustom>
            </View>
          </Row>

          <FlatList
            numColumns={2}
            columnWrapperStyle={{
              flex: 1,
              justifyContent: 'space-around',
            }}
            data={userOfficeS}
            keyExtractor={(item) => item.ID}
            renderItem={({item, index}: {item: IMasterResponseCommon}) => (
              <OfficeCard
                url={getImageById(item.ID)}
                title={item.Name}
                startAt={index % 2 === 0 ? 'Left' : 'Right'}
                onPress={() => handelSelectOffice(item.ID)}
              />
            )}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <TextCustom isSmall style={styles.note}>
              Vui lòng chọn văn phòng làm việc
            </TextCustom>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default OfficeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  officeContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: Colors.BLACK,
    borderRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#f3f3f3',
    marginBottom: scaleFactor(20),
  },
  bgImageBackground: {
    opacity: 0.7,
    borderRadius: 20,
  },
  hello: {
    color: Colors.WHITE,
    fontSize: Sizes.Content,
    fontStyle: 'italic',
  },
  title: {
    color: 'rgba(255,255,255, 0.9)',
    fontSize: 50,
    marginBottom: 20,
    fontFamily: fonts.RobotoRegular,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: {width: -2, height: -2},
    textShadowRadius: 10,
  },
  note: {
    color: Colors.WHITE,
    marginTop: 20,
  },
});
