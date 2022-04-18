import React from 'react';
import {useDispatch} from 'react-redux';
import {SafeView} from '~/components/commons';
import {Header, Container} from '~/components/sections';
import AppString from '~/configs/strings';
import {SoWizard, SoCustomerForm} from '~/containers/transactions/So';
import MasterActions from '~/redux/master/master.actions';

const SoCreateCustomerScreen = (): JSX.Element => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MasterActions.getCustomers());
  }, [dispatch]);

  return (
    <SafeView>
      <Header
        disableThreeDot
        title={AppString.SO.CustomersOrderForm}
        isMenu={false}
      />
      <Container>
        <SoWizard currentStep={0} />
        <SoCustomerForm />
      </Container>
    </SafeView>
  );
};

export default SoCreateCustomerScreen;
