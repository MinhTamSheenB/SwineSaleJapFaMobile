/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Icon, ModalCommon, TextCustom} from '~/components/commons';
import {Column, Row} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {
  convertStringToNumber,
  isInvalidString,
  isValidString,
  scaleFactor,
} from '~/helpers/UtilitiesHelper';

export type wGoodsActionType =
  | 'POST_UNPOST'
  | 'DELETE'
  // | 'PRINT'
  | 'WGOODS_LIST';

export interface IProps {
  onUserAction: (action: wGoodsActionType) => void;
  onPrint: (value: number) => void;
  isLock: boolean;
  printerName?: string;
}

const WeighingGoodsUserActions = ({
  onUserAction,
  onPrint,
  isLock,
  printerName,
}: IProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [printValue, setPrintValue] = useState<string>();

  const handleOnSelectNumberPrint = (val: number) => {
    setIsVisible(false);
    onPrint(val);
  };

  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        height: 60,
        elevation: 5,
      }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Row>
          <Column>
            <TouchableOpacity
              onPress={() => onUserAction('POST_UNPOST')}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
                minWidth: scaleFactor(80),
              }}>
              <Icon
                name={isLock ? 'unlock' : 'lock'}
                type="AntDesign"
                style={{
                  color: isLock ? Colors.DANGER : Colors.SUCCESS,
                }}
              />
              <TextCustom
                style={{
                  fontSize: Sizes.Content,
                  marginLeft: 10,
                  color: isLock ? Colors.DANGER : Colors.SUCCESS,
                }}
                bold>
                {isLock ? 'Huỷ chốt phiếu' : 'Chốt phiếu'}
              </TextCustom>
            </TouchableOpacity>
          </Column>
          <Column>
            <TouchableOpacity
              onPress={() => setIsVisible(true)}
              style={{
                alignItems: 'center',
                flex: 1,
                minWidth: scaleFactor(80),
              }}>
              <>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="printer"
                    type="AntDesign"
                    style={{
                      color: Colors.BLACK,
                    }}
                  />
                  <TextCustom
                    style={{
                      fontSize: Sizes.Content,
                      marginLeft: 10,
                      color: Colors.BLACK,
                    }}>
                    In
                  </TextCustom>
                </View>
                {isValidString(printerName) && (
                  <Text style={{fontSize: 8, fontStyle: 'italic'}}>
                    ({printerName})
                  </Text>
                )}
              </>
            </TouchableOpacity>
          </Column>
          <Column>
            <TouchableOpacity
              onPress={() => onUserAction('DELETE')}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
              }}>
              <Icon
                name="closecircle"
                type="AntDesign"
                style={{color: Colors.DANGER}}
              />
              <TextCustom
                style={{
                  fontSize: Sizes.Content,
                  marginLeft: 10,
                  color: Colors.DANGER,
                }}
                bold>
                Xóa
              </TextCustom>
            </TouchableOpacity>
          </Column>
          <Column>
            <TouchableOpacity
              onPress={() => onUserAction('WGOODS_LIST')}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
                minWidth: scaleFactor(100),
              }}>
              <Icon
                name="back"
                type="AntDesign"
                style={{
                  color: Colors.GRAY,
                  transform: [{rotateY: '180deg'}],
                }}
              />
              <TextCustom style={{fontSize: Sizes.Content, marginLeft: 10}}>
                Danh sách
              </TextCustom>
            </TouchableOpacity>
          </Column>
        </Row>
      </ScrollView>

      <ModalCommon
        title="Chọn/nhập số liên muốn in"
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}>
        <View style={styles.printerContainer}>
          <Pressable onPress={() => handleOnSelectNumberPrint(1)}>
            <View style={styles.btn}>
              <TextCustom style={styles.number}>1</TextCustom>
            </View>
          </Pressable>
          <Pressable onPress={() => handleOnSelectNumberPrint(2)}>
            <View style={styles.btn}>
              <TextCustom style={styles.number}>2</TextCustom>
            </View>
          </Pressable>
          <Pressable onPress={() => handleOnSelectNumberPrint(3)}>
            <View style={styles.btn}>
              <TextCustom style={styles.number}>3</TextCustom>
            </View>
          </Pressable>
          <Pressable onPress={() => handleOnSelectNumberPrint(4)}>
            <View style={styles.btn}>
              <TextCustom style={styles.number}>4</TextCustom>
            </View>
          </Pressable>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                {fontSize: isInvalidString(printValue) ? 12 : 25},
              ]}
              value={printValue}
              onChangeText={(str) => setPrintValue(str)}
              keyboardType="numeric"
              placeholder="Nhập số liên muốn in"
              maxLength={2}
            />
          </View>
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              if (printValue) {
                const num = convertStringToNumber(printValue);
                handleOnSelectNumberPrint(num);
              }
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: Colors.ORIGIN,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Icon
                name="printer"
                type="AntDesign"
                color={Colors.WHITE}
                style={{marginRight: 10}}
              />
              <Text style={{color: Colors.WHITE, fontSize: 18}}>In</Text>
            </View>
          </Pressable>
        </View>
      </ModalCommon>
    </View>
  );
};

export default WeighingGoodsUserActions;

const styles = StyleSheet.create({
  printerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: scaleFactor(60),
    height: scaleFactor(60),
    backgroundColor: Colors.WHITE,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    borderWidth: scaleFactor(0.3),
    borderColor: Colors.ORIGIN,
  },
  number: {
    fontSize: scaleFactor(25),
    fontWeight: '600',
    color: Colors.ORIGIN,
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    height: scaleFactor(40),
    borderWidth: 1,
    borderColor: Colors.ORIGIN,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    fontSize: scaleFactor(25),
    color: Colors.ORIGIN,
  },
});
