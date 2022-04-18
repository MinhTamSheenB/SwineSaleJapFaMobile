/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {IGroupType} from '~/commons/types';
import {TagButton} from '~/components/commons';
import {Colors} from '~/configs';

export interface IProps {
  data: IGroupType[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const GroupBy = ({data, selectedValue, onSelect}: IProps) => {
  return (
    <View
      style={{
        backgroundColor: Colors.WHITE,
        paddingVertical: 10,
      }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{justifyContent: 'space-between'}}>
        {data.map((group) => (
          <TagButton
            text={group.name}
            key={`${group.key}`}
            isActive={group.key === selectedValue}
            onPress={() => onSelect(group.key)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default GroupBy;
const styles = StyleSheet.create({
  container: {flexDirection: 'row'},
});
