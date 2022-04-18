import React from 'react';
import {View, ScrollView} from 'react-native';
import {DiscountStatus} from '~/apis/types.service';
import {TagButton} from '~/components/commons';
import {AppStrings} from '~/configs';

export interface IProps {
  currentValue: DiscountStatus;
  onChange: (status: DiscountStatus) => void;
}

const DiscountFilter = ({currentValue, onChange}: IProps) => {
  return (
    <View style={{paddingVertical: 10}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          text={AppStrings.Discount.NewStatus}
          isActive={currentValue === DiscountStatus.New}
          onPress={() => onChange(DiscountStatus.New)}
        />
        <TagButton
          text={AppStrings.Discount.ApprovedStatus}
          isActive={currentValue === DiscountStatus.Approved}
          onPress={() => onChange(DiscountStatus.Approved)}
        />
      </ScrollView>
    </View>
  );
};

export default DiscountFilter;
