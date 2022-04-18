import React from 'react';
import {View, ScrollView} from 'react-native';
import {DeliveryOrderStatus, InvoiceStatus} from '~/apis/types.service';
import {TagButton} from '~/components/commons';
import {AppStrings} from '~/configs';

export interface IProps {
  currentValue: InvoiceStatus;
  onChange: (value: InvoiceStatus) => void;
}

const InvoiceFilter = (props: IProps) => {
  const {currentValue, onChange} = props;
  return (
    <View style={{paddingVertical: 10}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          text={AppStrings.Invoice.NewInvoice}
          isActive={currentValue === InvoiceStatus.New}
          onPress={() => onChange(InvoiceStatus.New)}
        />
        <TagButton
          text={AppStrings.Invoice.PublishInvoice}
          isActive={currentValue === InvoiceStatus.Published}
          onPress={() => onChange(InvoiceStatus.Published)}
        />
        <TagButton
          text={AppStrings.Invoice.CanceledInvoice}
          isActive={currentValue === InvoiceStatus.Canceled}
          onPress={() => onChange(InvoiceStatus.Canceled)}
        />
      </ScrollView>
    </View>
  );
};

export default InvoiceFilter;
