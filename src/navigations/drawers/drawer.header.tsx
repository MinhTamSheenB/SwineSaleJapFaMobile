import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import styles from '../navigation.style';
import {TextCustom, Icon, Dropdown} from '~/components/commons';
import {Container, Row} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {RootState} from '~/redux/reducers';
import {DropdownItemType, IUserParams} from '~/commons/types';
import GlobalActions from '~/redux/global/global.actions';
import {removeUnicode} from '~/helpers/UtilitiesHelper';

const DrawerHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const {userParams} = useSelector((state: RootState) => state.global);
  const {userDepartmentS} = useSelector((state: RootState) => state.master);
  const [deptsData, setDeptData] = useState<DropdownItemType[]>([]);

  const handleDeptIdChange = (deptIdValue: number) => {
    const params: IUserParams = {...userParams, deptId: deptIdValue};
    dispatch(GlobalActions.updateUserParams(params));
  };

  useEffect(() => {
    const deptS = userDepartmentS.map((dev) => {
      const item: DropdownItemType = {
        label: dev.Name,
        value: dev.IDNumber,
        keySearch: removeUnicode(dev.Name),
      };
      return item;
    });
    setDeptData(deptS);
  }, [userDepartmentS]);

  return (
    <View style={styles.drawerHeader}>
      <Container>
        <Row>
          <View style={{paddingTop: 10}}>
            <Icon
              type="FontAwesome"
              name="user-circle-o"
              color={Colors.GRAY}
              size={60}
            />
          </View>
          <View style={{marginLeft: 20, justifyContent: 'center'}}>
            <TextCustom
              style={{
                color: Colors.GRAY,
                fontSize: Sizes.Title,
                marginBottom: 5,
              }}
              bold>
              {userParams.fullName}
            </TextCustom>
            <TextCustom style={{color: Colors.GRAY, fontSize: Sizes.Note}}>
              {userParams.email}
            </TextCustom>
          </View>
        </Row>
        <View style={{height: 10}} />
        <Formik
          enableReinitialize
          initialValues={userParams}
          onSubmit={(value) => {
            handleDeptIdChange(value.deptId ?? 0);
          }}>
          {({values, handleSubmit}) => (
            <Dropdown
              label="Phòng làm việc"
              data={deptsData}
              name="deptId"
              selectedValue={values.deptId}
              onSelect={() => handleSubmit()}
              wrapStyle={{borderBottomWidth: 0}}
              modalTitle="Chọn phòng ban làm việc"
              labelStyle={{display: 'none'}}
              containerStyle={{
                borderWidth: 0.5,
                borderColor: Colors.BORDER_DARK,
                flex: undefined,
                paddingVertical: 5,
                paddingHorizontal: 15,
                borderRadius: 5,
                backgroundColor: Colors.BG,
              }}
            />
          )}
        </Formik>
      </Container>
    </View>
  );
};

export default DrawerHeader;
