import React from 'react';
import {SafeView} from '~/components/commons';
import {Header, Container, Row} from '~/components/sections';
import {AppStrings} from '~/configs';
import {SoDiscountForm, SoWizard} from '~/containers/transactions/So';

const SoCreateDiscountScreen = (): JSX.Element => {
  return (
    <SafeView>
      <Header
        disableThreeDot
        title={AppStrings.SO.title}
        isMenu={false}
        noShadow
      />
      <SoWizard currentStep={3} />
      <Container isIncludeScrollView>
        <Row>
          <SoDiscountForm />
        </Row>
      </Container>
    </SafeView>
  );
};

export default SoCreateDiscountScreen;
