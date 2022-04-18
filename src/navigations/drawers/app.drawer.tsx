/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/no-array-index-key */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Pressable, Dimensions, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import styles from '../navigation.style';
import {Container, Row} from '~/components/sections';
import {Accordion, Icon, SafeView, TextCustom} from '~/components/commons';
import DrawerData, {approvalData, monitoringData} from './drawer.data';
import DrawerHeader from './drawer.header';
import {RootState} from '~/redux/reducers';
import ScreenType from '../screen.constant';
import {DepartmentId} from '~/commons/types';
import {navigate} from '~/navigations/navigation.services';
import {IMasterMenu} from '~/apis/types.service';
import {Colors} from '~/configs';
import GlobalActions from '~/redux/global/global.actions';
import {numberFormat} from '~/helpers/UtilitiesHelper';

const APPROVAL_MENU_ID = 25;

const AppDrawer = (): JSX.Element => {
  const {width, height} = Dimensions.get('window');
  const dispatch = useDispatch();
  const {
    userParams: {deptId},
  } = useSelector((state: RootState) => state.global);
  const {userMenus} = useSelector((state: RootState) => state.master);
  const [menuIds, setMenuIds] = useState<number[]>([]);

  const handleRenderMenu = useCallback(() => {
    const ids: number[] = [];
    const menus: IMasterMenu | undefined = userMenus.find(
      (p) => p.common.idNum === 30,
    );
    if (!menus) {
      setMenuIds(ids);
      return;
    }
    menus.menulv2.forEach((item) => {
      ids.push(item.common.idNum);
    });

    const menusApprovals: IMasterMenu | undefined = userMenus.find(
      (p) => p.common.idNum === 25,
    );
    if (menusApprovals) {
      menusApprovals.menulv2.forEach((item) => {
        ids.push(item.common.idNum);
      });
    }

    const menusMonitorings: IMasterMenu | undefined = userMenus.find(
      (p) => p.common.idNum === 27,
    );
    if (menusMonitorings) {
      menusMonitorings.menulv2.forEach((item) => {
        ids.push(item.common.idNum);
      });
    }

    setMenuIds(ids);
  }, [userMenus]);

  useEffect(() => {
    handleRenderMenu();
  }, [handleRenderMenu]);

  const gotoFeature = (
    screenType: string,
    drawerId?: number,
    drawerTitle?: string,
  ): void => {
    const isInternalTransfer = screenType === ScreenType.InternalTransfer.LIST;
    const nav =
      screenType === ScreenType.InternalTransfer.LIST
        ? ScreenType.DO.LIST
        : screenType;
    dispatch(
      GlobalActions.setCurrentDrawer(
        nav,
        drawerId ?? -1,
        drawerTitle ?? '',
        isInternalTransfer,
      ),
    );
    navigate(nav);
  };

  const handleLogOut = () => {
    dispatch(GlobalActions.logOut());
  };

  return (
    <SafeView
      disableStatusBar={false}
      statusBarBackgroundColor={Colors.ORIGIN}
      // bgColor={Colors.ORIGIN}
      style={styles.drawerContainer}>
      <DrawerHeader />
      <View style={styles.drawerBody}>
        <ScrollView style={{flex: 1}}>
          <Container isIncludeScrollView={false}>
            <Accordion
              title="Nghiệp vụ - Bán Hàng"
              showIcon={false}
              isOpen
              style={stylesLocal.accordionContainer}
              headerStyle={stylesLocal.headerStyle}>
              {DrawerData.map((item, index) => {
                if (
                  item.screen === ScreenType.InternalTransfer.LIST &&
                  deptId !== DepartmentId.INTERNAL_TRANSFER &&
                  deptId !== DepartmentId.IT_TEST
                ) {
                  return null;
                }

                if (
                  item.screen === ScreenType.DO.LIST &&
                  deptId === DepartmentId.INTERNAL_TRANSFER
                ) {
                  return null;
                }

                const indexMenu = menuIds.findIndex((p) => p === item.id);
                if (indexMenu < 0) return null;

                return (
                  <Pressable
                    onPress={() => gotoFeature(item.screen, item.id, item.name)}
                    style={styles.rowDrawer}
                    key={`${item.iconType}-${item.iconName}-${index}`}>
                    <Row>
                      <Icon
                        type={item.iconType}
                        name={item.iconName}
                        style={styles.drawerItemIcon}
                      />
                      <TextCustom style={styles.drawerItemText}>
                        {item.name}
                      </TextCustom>
                    </Row>
                  </Pressable>
                );
              })}
            </Accordion>

            {userMenus.findIndex((i) => i.common.idNum === APPROVAL_MENU_ID) >
              -1 && (
              <Accordion
                title="Phê duyệt - Bán Hàng"
                showIcon={false}
                isOpen
                headerStyle={stylesLocal.headerStyle}
                style={stylesLocal.accordionContainer}>
                {approvalData.map((item, index) => {
                  const indexMenu = menuIds.findIndex((p) => p === item.id);
                  if (indexMenu < 0) return null;
                  return (
                    <Pressable
                      onPress={() => gotoFeature(item.screen)}
                      style={styles.rowDrawer}
                      key={`${item.iconType}-${item.iconName}-${index}`}>
                      <Row>
                        <Icon
                          type={item.iconType}
                          name={item.iconName}
                          style={styles.drawerItemIcon}
                        />
                        <TextCustom style={styles.drawerItemText}>
                          {item.name}
                        </TextCustom>
                      </Row>
                    </Pressable>
                  );
                })}
              </Accordion>
            )}

            <Accordion
              headerStyle={stylesLocal.headerStyle}
              style={stylesLocal.accordionContainer}
              title="Thống kê - Bán hàng"
              showIcon={false}
              isOpen>
              {monitoringData.map((item, index) => {
                const indexMenu = menuIds.findIndex((p) => p === item.id);
                if (indexMenu < 0) return null;
                return (
                  <Pressable
                    onPress={() => gotoFeature(item.screen, item.id, item.name)}
                    style={styles.rowDrawer}
                    key={`${item.iconType}-${item.iconName}-${index}`}>
                    <Row>
                      <Icon
                        type={item.iconType}
                        name={item.iconName}
                        style={styles.drawerItemIcon}
                      />
                      <TextCustom style={styles.drawerItemText}>
                        {item.name}
                      </TextCustom>
                    </Row>
                  </Pressable>
                );
              })}
            </Accordion>

            <Accordion
              headerStyle={stylesLocal.headerStyle}
              style={stylesLocal.accordionContainer}
              title="Cài đặt"
              isOpen
              showIcon={false}>
              <Pressable
                onPress={() => gotoFeature(ScreenType.Setting.BLUETOOTH_SEARCH)}
                style={styles.rowDrawer}>
                <Row>
                  <Icon
                    type="MaterialIcons"
                    name="bluetooth"
                    style={styles.drawerItemIcon}
                  />
                  <TextCustom style={styles.drawerItemText}>
                    Bluetooth
                  </TextCustom>
                </Row>
              </Pressable>

              <Pressable
                onPress={() => gotoFeature(ScreenType.Setting.DEVICES)}
                style={styles.rowDrawer}>
                <Row>
                  <Icon
                    type="MaterialIcons"
                    name="devices-other"
                    style={styles.drawerItemIcon}
                  />
                  <TextCustom style={styles.drawerItemText}>
                    Thiết bị
                  </TextCustom>
                </Row>
              </Pressable>

              <Pressable
                onPress={() => gotoFeature(ScreenType.Main.Test)}
                style={styles.rowDrawer}>
                <Row>
                  <Icon
                    type="MaterialIcons"
                    name="devices-other"
                    style={styles.drawerItemIcon}
                  />
                  <TextCustom style={styles.drawerItemText}>Logs</TextCustom>
                </Row>
              </Pressable>
            </Accordion>

            <View style={styles.drawerFooter}>
              <Pressable
                style={{alignItems: 'flex-end'}}
                onPress={() => handleLogOut()}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="log-out"
                    type="Entypo"
                    color={Colors.GRAY_LIGHT}
                    style={{marginRight: 10}}
                    size={14}
                  />
                  <TextCustom style={{fontSize: 14}}>Đăng xuất</TextCustom>
                </View>
                <TextCustom style={styles.appVersion}>
                  $ Version 1.0.5
                </TextCustom>
              </Pressable>
            </View>
          </Container>
        </ScrollView>
      </View>
    </SafeView>
  );
};

export default AppDrawer;

const stylesLocal = StyleSheet.create({
  accordionContainer: {
    // backgroundColor: Colors.WHITE,
    marginHorizontal: -5,
    marginVertical: 0,
    marginBottom: 5,
    // borderWidth: 0.5,
    // borderColor: Colors.BORDER_TWO,
    backgroundColor: Colors.TRANSPARENT,
  },
  headerStyle: {
    // backgroundColor: Colors.BG_SECOND,
  },
});
