import { useNavigation } from '@react-navigation/core';
import {Formik} from 'formik';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ICndnHeaderModel} from '~/apis/types.service';
import {CndnAccountTypeDataSource, CndnTypeDataSource} from '~/commons';
import {Accordion, Button, RadioGroup} from '~/components/commons';
import {Container} from '~/components/sections';
import {Colors} from '~/configs';
import ScreenType from '~/navigations/screen.constant';
import CndnActions from '~/redux/cndn/cndn.actions';
import {RootState} from '~/redux/reducers';

const CndnAccountForm = () => {
  const dispatch = useDispatch();
  const navigations = useNavigation();
  const {model} = useSelector((state: RootState) => state.cndn);
  return (
    <View style={{flex: 1, width: '100%'}}>
      <Formik
        initialValues={model}
        onSubmit={(values) => {
          const temp: ICndnHeaderModel = {
            ...model,
            CNDN4ACCTYPE: values.CNDN4ACCTYPE,
            CNDNTYPE: values.CNDNTYPE,
          };
          dispatch(CndnActions.updateHeaderLocalModel(temp));
          navigations.navigate(ScreenType.Cndn.CREATE);
        }}>
        {({values, handleSubmit}) => (
          <Container isIncludeScrollView>
            <Accordion title="Loại Tài Khoản" isOpen>
              <View style={{paddingHorizontal: 20}}>
                <RadioGroup
                  data={CndnAccountTypeDataSource}
                  selectedValue={values.CNDN4ACCTYPE}
                  name="CNDN4ACCTYPE"
                />
              </View>
            </Accordion>
            <Accordion title="Hình Thức Điều Chỉnh" isOpen>
              <View style={{paddingHorizontal: 20}}>
                <RadioGroup
                  data={CndnTypeDataSource}
                  selectedValue={values.CNDNTYPE}
                  name="CNDNTYPE"
                />
              </View>
            </Accordion>

            <Button
              title="Tiếp tục"
              radius={20}
              color={Colors.WHITE}
              onPress={handleSubmit}
            />
          </Container>
        )}
      </Formik>
    </View>
  );
};

export default CndnAccountForm;
