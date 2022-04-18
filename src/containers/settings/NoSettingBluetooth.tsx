import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon, TextCustom} from '~/components/commons';
import {Colors, Sizes} from '~/configs';
import {scaleFactor} from '~/helpers/UtilitiesHelper';

export interface IProps {
  onPress?: () => void;
}

const NoSettingBluetooth = ({onPress}: IProps) => {
  return (
    <View style={{alignItems: 'center', alignSelf: 'center', marginTop: 20}}>
      <View
        style={{
          width: 150,
          height: 150,
          backgroundColor: Colors.WHITE,
          borderRadius: 150,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: Colors.ORIGIN,
        }}>
        <Icon name="bluetooth-disabled" type="MaterialIcons" size={50} />
      </View>
      <TextCustom
        style={{
          color: Colors.GRAY_LIGHT,
          marginBottom: 20,
          fontSize: Sizes.Note,
          marginTop: 10,
          fontStyle: 'italic',
        }}>
        Bạn chưa thiết lập cân bluetooth.
      </TextCustom>
      <View>
        <TouchableOpacity onPress={onPress}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: Colors.WHITE,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: Colors.GRAY,
              borderRadius: 10,
            }}>
            <TextCustom style={{fontSize: scaleFactor(14)}}>
              Nhấn chọn để cài đặt cân bluetooth
            </TextCustom>
            <Icon
              name="right"
              color={Colors.GRAY}
              size={17}
              style={{marginLeft: 15}}
              type="AntDesign"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoSettingBluetooth;
const styles = StyleSheet.create({
  container: {},
});
