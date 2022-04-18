/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ViewToken,
  Image,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {
  GroupType,
  IDailySaleGroup,
  MonitoringType,
} from '~/apis/types.monitoring';
import {CndnStatusName} from '~/apis/types.service';
import {TextCustom} from '~/components/commons';
import {Colors, Sizes} from '~/configs';
import {
  doubleFormat,
  numberFormat,
  scaleFactor,
} from '~/helpers/UtilitiesHelper';
import icons from '~/assets/icons';

const {width} = Dimensions.get('window');

interface IGroupProps {
  item: IDailySaleGroup;
  type: MonitoringType;
}

const GroupComponent = ({item, type}: IGroupProps) => {
  const getStatusName = (
    key: string,
    monitoringType: MonitoringType,
  ): string => {
    switch (monitoringType) {
      case 'CNDN_MONITORING': {
        const id = Number(key);
        return CndnStatusName[id];
      }
      default:
        break;
    }
    return '';
  };

  const getIcon = (groupType?: GroupType): any => {
    switch (groupType) {
      case 'STATUS':
        return icons.status;
      case 'CUSTOMER':
        return icons.partner;
      default:
        return icons.status;
    }
  };

  const Balance = (begin: number, end: number) => {
    return (
      <>
        <View style={styles.row}>
          <Text style={styles.title}>Số dư đầu kỳ: </Text>
          <Text style={{fontWeight: 'bold'}}>{numberFormat(begin)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Số dư cưới kỳ: </Text>
          <Text style={{fontWeight: 'bold'}}>{numberFormat(end)}</Text>
        </View>
      </>
    );
  };

  const Different = (qty: number, weight: number, total: number) => {
    return (
      <>
        <View style={styles.row}>
          <Text style={styles.title}>Số lượng: </Text>
          <Text style={{fontWeight: 'bold'}}>{numberFormat(qty, 'CON')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Trọng lượng: </Text>
          <Text style={{fontWeight: 'bold'}}>{doubleFormat(weight, 'KG')}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.title}>Tổng tiền:</Text>
          <Text style={{fontWeight: 'bold', color: Colors.DANGER}}>
            {doubleFormat(total, 'VNĐ')}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.groupContainer} key={`${item.id}`}>
      <View style={styles.col1}>
        <Image source={getIcon(item.type)} style={styles.avatar} />
      </View>
      <View style={styles.col2}>
        <TextCustom bold style={{marginBottom: 5}}>
          {item.type !== 'STATUS' ? item.name : getStatusName(item.name, type)}
        </TextCustom>
        <>
          {type === 'CUSTOMER_MONTHLY_BALANCE' ||
          type === 'CUSTOMER_DAILY_BALANCE'
            ? Balance(item.qty, item.total)
            : Different(item.qty, item.weight, item.total)}
        </>
      </View>
    </View>
  );
};

export interface IProps {
  data: IDailySaleGroup[];
  onChange?: (index: number) => void;
  isMoneyReport?: boolean;
  type: MonitoringType;
}

const GroupInformation = ({data, onChange, type}: IProps) => {
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    if (data.length > 0 && flatListRef.current) {
      flatListRef.current?.scrollToIndex({index: 0, animated: true});
    }
  }, [data]);

  const onViewRef = React.useRef(({viewableItems}) => {
    const {current} = flatListRef;
    if (viewableItems && viewableItems.length > 0) {
      const first: ViewToken = viewableItems[0];
      if (onChange && first.index != null) onChange(first.index);
    }
  });

  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        viewabilityConfig={viewConfigRef.current}
        onViewableItemsChanged={onViewRef.current}
        renderItem={({item}) => <GroupComponent item={item} type={type} />}
      />
    </View>
  );
};

export default GroupInformation;
const styles = StyleSheet.create({
  container: {backgroundColor: Colors.BG},
  groupContainer: {
    paddingHorizontal: 20,
    flex: 1,
    width,
    paddingVertical: 10,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
  },
  col1: {flex: 1},
  col2: {
    flex: 3,
    paddingBottom: 5,
  },
  avatar: {
    width: scaleFactor(80),
    height: scaleFactor(80),
  },
  row: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5},
  title: {color: Colors.GRAY_LIGHT, fontSize: Sizes.Note},
});
