import React from 'react';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {CndnProductsForm, CndnWizard} from '~/containers/transactions/Cndn';

const CndnProductsTypeScreen = () => {
  return (
    <SafeView>
      <Header title="Danh Sách Sản Phẩm" isMenu={false} disableThreeDot />
      <CndnWizard currentStep={3} />
      <CndnProductsForm />
    </SafeView>
  );
};

export default CndnProductsTypeScreen;
