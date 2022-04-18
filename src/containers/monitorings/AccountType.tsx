/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {StyleSheet, ScrollView, View, Pressable} from 'react-native';
import {Icon, TagButton, TextCustom} from '~/components/commons';
import {Colors} from '~/configs';
import {scaleFactor} from '~/helpers/UtilitiesHelper';

export interface IProps {
  selectedValue: string;
  onSelect: (value: 'MAIN' | 'SUB' | 'MAIN_AND_SUB') => void;
}

const AccountType = ({selectedValue, onSelect}: IProps) => {
  return (
    <View style={styles.container}>
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          text="Tài khoản chính"
          isActive={selectedValue === 'MAIN'}
          onPress={() => onSelect('MAIN')}
        />
        <TagButton
          text="Tài khoản phụ"
          isActive={selectedValue === 'SUB'}
          onPress={() => onSelect('SUB')}
        />
        <TagButton
          text="Tài khoản chính + phụ"
          isActive={selectedValue === 'MAIN_AND_SUB'}
          onPress={() => onSelect('MAIN_AND_SUB')}
        />
      </ScrollView> */}
      <View style={[{backgroundColor: Colors.SUCCESS, flex: 1}]}>
        <Pressable onPress={() => onSelect('MAIN')} style={styles.viewBox}>
          <Icon
            name="account-balance-wallet"
            type="MaterialIcons"
            style={[styles.icon, selectedValue === 'MAIN' && styles.active]}
          />
          <TextCustom style={styles.text}>Tài khoản chính</TextCustom>
        </Pressable>
      </View>
      <View style={[{backgroundColor: Colors.ORIGIN, flex: 1}]}>
        <Pressable onPress={() => onSelect('SUB')} style={styles.viewBox}>
          <Icon
            name="account-balance-wallet"
            type="MaterialIcons"
            style={[styles.icon, selectedValue === 'SUB' && styles.active]}
          />
          <TextCustom style={styles.text}>Tài khoản phụ</TextCustom>
        </Pressable>
      </View>
      <View style={[{backgroundColor: Colors.DANGER, flex: 1}]}>
        <Pressable
          onPress={() => onSelect('MAIN_AND_SUB')}
          style={styles.viewBox}>
          <Icon
            name="account-balance-wallet"
            type="MaterialIcons"
            style={[
              styles.icon,
              selectedValue === 'MAIN_AND_SUB' && styles.active,
            ]}
          />
          <TextCustom style={styles.text}>Tài khoản chính + phụ</TextCustom>
        </Pressable>
      </View>
    </View>
  );
};

export default AccountType;
const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    flexDirection: 'row',
    borderBottomColor: Colors.BORDER_DARK,
    borderBottomWidth: 0.5,
  },
  viewBox: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  text: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontSize: scaleFactor(10),
    textTransform: 'uppercase',
  },
  icon: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colors.WHITE,
    marginBottom: 5,
    marginTop: 5,
  },
  active: {
    fontWeight: 'bold',
    fontSize: 35,
  },
});
