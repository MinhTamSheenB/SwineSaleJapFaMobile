import React from 'react';
import {View, ScrollView} from 'react-native';
import {DeliveryOrderStatus} from '~/apis/types.service';
import {TagButton} from '~/components/commons';
import {AppStrings} from '~/configs';

export interface IProps {
  currentValue: DeliveryOrderStatus;
  onChange: (value: DeliveryOrderStatus) => void;
}

const DoFilter = (props: IProps) => {
  const {currentValue, onChange} = props;
  return (
    <View style={{paddingVertical: 10}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          text={AppStrings.DO.newOrder}
          isActive={currentValue === DeliveryOrderStatus.New}
          onPress={() => onChange(DeliveryOrderStatus.New)}
        />
        <TagButton
          text={AppStrings.DO.successOrder}
          isActive={currentValue === DeliveryOrderStatus.Finish}
          onPress={() => onChange(DeliveryOrderStatus.Finish)}
        />
        <TagButton
          text={AppStrings.DO.createdInvoice}
          isActive={currentValue === DeliveryOrderStatus.InvoiceIssued}
          onPress={() => onChange(DeliveryOrderStatus.InvoiceIssued)}
        />
      </ScrollView>
    </View>
  );
};

export default DoFilter;
