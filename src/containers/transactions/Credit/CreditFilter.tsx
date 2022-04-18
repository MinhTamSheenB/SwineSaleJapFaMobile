import React from 'react';
import {View, ScrollView} from 'react-native';
import {CreditStatus} from '~/apis/types.service';
import {TagButton} from '~/components/commons';

export interface IProps {
  currentValue: CreditStatus;
  onChange: (value: CreditStatus) => void;
}

const CreditFilter = (props: IProps) => {
  const {currentValue, onChange} = props;
  return (
    <View style={{paddingVertical: 10}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          text="Mới"
          isActive={currentValue === CreditStatus.New}
          onPress={() => onChange(CreditStatus.New)}
        />
        {/* <TagButton
          text="Đợi duyệt"
          isActive={currentValue === CreditStatus.SendAndWait}
          onPress={() => onChange(CreditStatus.SendAndWait)}
        /> */}
        <TagButton
          text="Đã duyệt"
          isActive={currentValue === CreditStatus.Approved}
          onPress={() => onChange(CreditStatus.Approved)}
        />
        <TagButton
          text="Từ chối duyệt"
          isActive={currentValue === CreditStatus.Rejected}
          onPress={() => onChange(CreditStatus.Rejected)}
        />
        <TagButton
          text="Đã hủy"
          isActive={currentValue === CreditStatus.Cancel}
          onPress={() => onChange(CreditStatus.Cancel)}
        />
      </ScrollView>
    </View>
  );
};

export default CreditFilter;
