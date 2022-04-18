import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DeliveryOrderStatus} from '~/apis/types.service';
import {SafeView} from '~/components/commons';
import {
  Container,
  Header,
  PickDateModal,
  SearchBox,
} from '~/components/sections';
import {IPickDateProps} from '~/components/sections/PickDateModal';
import {DoFilter, DoListOrder} from '~/containers/transactions/Do';

export interface IProps {}

const DoReleaseListScreen = () => {
  const pickDateRef = React.useRef<IPickDateProps>(null);
  return (
    <SafeView>
      <Header
        title="13. Xác nhận giao hàng (DOR)"
        isMenu
        onMenuPress={() => {
          if (pickDateRef.current && pickDateRef.current.onOpen) {
            pickDateRef.current?.onOpen();
          }
        }}
      />
      <Container>
        <SearchBox
          placeholder="Nhập mã phiếu xuất hàng"
          accessor=""
          dataSource={[]}
        />
        <DoFilter
          currentValue={DeliveryOrderStatus.New}
          onChange={(status) => {}}
        />
        <DoListOrder
          data={[]}
          onSelect={(item) => {
        
          }}
        />
      </Container>
      <PickDateModal ref={pickDateRef} />
    </SafeView>
  );
};

export default DoReleaseListScreen;
const styles = StyleSheet.create({
  container: {},
});
