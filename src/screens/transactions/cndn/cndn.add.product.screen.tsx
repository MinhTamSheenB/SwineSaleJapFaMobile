import React from 'react';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import CndnAddProduct from '~/containers/transactions/Cndn/CndnAddProduct';

const CndnAddProductScreen = () => {
  return (
    <SafeView>
      <Header title="Thêm Sản Phẩm" isMenu={false} disableThreeDot />
      <CndnAddProduct />
    </SafeView>
  );
};

export default CndnAddProductScreen;
