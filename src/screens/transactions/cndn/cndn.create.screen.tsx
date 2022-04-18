import React from 'react';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {AppStrings} from '~/configs';
import {CndnCustomerForm, CndnWizard} from '~/containers/transactions/Cndn';

const CndnCreateScreen = () => {
  return (
    <SafeView>
      <Header title={AppStrings.Cndn.titleCreate} isMenu={false} noShadow />
      <CndnWizard currentStep={1} />
      <CndnCustomerForm />
    </SafeView>
  );
};

export default CndnCreateScreen;
