import React from 'react';
import {ScrollView, View} from 'react-native';
import {TagButton} from '~/components/commons';
import {AppStrings} from '~/configs';
import {OrderStatus} from '~/apis/types.service';

export interface ISoFilter {
  currentValue: OrderStatus;
  onChange: (value: OrderStatus) => void;
}

const SoFilter = ({currentValue, onChange}: ISoFilter) => {
  return (
    <View style={{paddingVertical: 10}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          text={AppStrings.SO.NewOrder}
          isActive={currentValue === OrderStatus.New}
          onPress={() => onChange(OrderStatus.New)}
        />
        <TagButton
          text={AppStrings.SO.closeOrder}
          isActive={currentValue === OrderStatus.Posted}
          onPress={() => onChange(OrderStatus.Posted)}
        />
        <TagButton
          text={AppStrings.SO.successOrder}
          isActive={currentValue === OrderStatus.Paymented}
          onPress={() => onChange(OrderStatus.Paymented)}
        />
      </ScrollView>
    </View>
  );
};

export default SoFilter;
