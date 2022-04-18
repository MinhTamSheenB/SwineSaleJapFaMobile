/* eslint-disable @typescript-eslint/no-use-before-define */
import React, {useState, useMemo, useRef, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Animated from 'react-native-reanimated';
import {IScaleDetailDTO} from '~/apis/types.service';
import {Header, SearchBox} from '~/components/sections';
import {
  ScaleDoDetail,
  ScaleDoList,
  ScaleProducts,
  IScaleDoDetailProps,
} from '~/containers/transactions/Scale';
import {ModalFilter} from '~/containers/transactions/So';
import {isValidString} from '~/helpers/UtilitiesHelper';
import {RootState} from '~/redux/reducers';
import ScaleActions from '~/redux/scale/scale.actions';
import {Colors, Sizes} from '~/configs';
import {NotFound, SafeView} from '~/components/commons';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';

const {HEADER_HEIGHT, SEARCH_BOX_MARGIN} = Sizes;

interface IProduct {
  productId: string;
  productName: string;
  totalQtyWeighted: number;
  totalBwWeighted: number;
  farmName: string;
  doNo: string;
  customerName: string;
  totalQty: number;
  scales: IScaleDetailDTO[];
}

const ScaleListScreen = () => {
  const dispatch = useDispatch();

  const {doNos, data} = useSelector((state: RootState) => state.scale);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<string>(() => FROM_DATE);
  const [toDate, setToDate] = useState<string>(() => TO_DATE);
  const [doSelected, setDoSelected] = useState<string>('');
  const [productData, setProductData] = useState<IProduct[]>([]);

  const handleSearchScale = useCallback(() => {
    setIsVisible(false);
    dispatch(ScaleActions.search(fromDate, toDate));
  }, [dispatch, fromDate, toDate]);

  React.useEffect(() => {
    const doNo = doNos.length < 1 ? '' : doNos[0];
    setDoSelected(doNo);
  }, [doNos]);

  React.useEffect(() => {
    handleSearchScale();
  }, [handleSearchScale]);

  const getScalesByDoNo = useCallback(() => {
    if (isValidString(doSelected)) {
      const dataByDo: IScaleDetailDTO[] = data.filter(
        (item) => item.DONO === doSelected,
      );

      if (dataByDo.length > 0) {
        const products: IProduct[] = [];
        const productIds: string[] = [
          ...new Set(dataByDo.map((item) => item.PRODUCTID)),
        ];
        productIds.forEach((value) => {
          const dataTemp: IScaleDetailDTO[] = dataByDo.filter(
            (item) => item.PRODUCTID === value,
          );
          const firstItem: IScaleDetailDTO = dataTemp[0];
          const product: IProduct = {
            doNo: firstItem.DONO,
            farmName: firstItem.LOCATIONNAME ?? '',
            customerName: firstItem.CUSTNAME,
            totalQty: firstItem.DONO_TOTALQTY,
            productId: value,
            productName: firstItem.NAME_VN ?? '',
            scales: dataTemp,
            totalBwWeighted: dataTemp.reduce(
              (preValue, item) => preValue + item.NETGROSS,
              0,
            ),
            totalQtyWeighted: dataTemp.reduce(
              (preVal, item) => preVal + item.TOTALQTY,
              0,
            ),
          };
          products.push(product);
        });
        setProductData(products);
      } else {
        setProductData([]);
      }
    }
  }, [data, doSelected]);

  React.useEffect(() => {
    getScalesByDoNo();
  }, [getScalesByDoNo]);

  const scaleDetail: IScaleDoDetailProps = useMemo(() => {
    const firstItem: IProduct = productData[0];
    const item: IScaleDoDetailProps = {
      customerName: firstItem?.customerName,
      doNo: firstItem?.doNo,
      farmName: firstItem?.farmName,
      totalBwWeighted: productData.reduce(
        (pre, i) => pre + i.totalBwWeighted,
        0,
      ),
      totalQty: firstItem?.totalQty,
      totalQtyWeighted: productData.reduce(
        (pre, i) => pre + i.totalQtyWeighted,
        0,
      ),
    };
    return item;
  }, [productData]);

  const headerValue = HEADER_HEIGHT + SEARCH_BOX_MARGIN - 10;

  const y = useRef<Animated.Node<number>>(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(y, 0, headerValue);
  const onScroll = Animated.event([{nativeEvent: {contentOffset: {y}}}]);
  const transition = diffClamp;
  const translateY = Animated.interpolateNode(transition, {
    inputRange: [0, headerValue],
    outputRange: [0, -headerValue],
  });

  return (
    <SafeView>
      <Header
        title="Phiếu Cân"
        isMenu
        onMenuPress={() => setIsVisible(true)}
        noShadow
      />
      {doNos.length < 1 && <NotFound />}
      {doNos.length > 0 && (
        <Animated.ScrollView
          {...{onScroll}}
          bounces
          contentContainerStyle={styles.list}
          scrollEventThrottle={16}>
          <ScaleDoDetail {...scaleDetail} />
          {productData.map((item) => (
            <ScaleProducts
              productName={item.productName}
              productId={item.productId}
              data={item.scales}
              key={`${item.productId}`}
            />
          ))}
        </Animated.ScrollView>
      )}

      <Animated.View
        style={[styles.viewContainer, {transform: [{translateY}]}]}>
        <View style={{paddingHorizontal: 20}}>
          <SearchBox placeholder="Nhập mã phiếu, do..." accessor="" />
        </View>
        {doNos.length > 0 && (
          <ScaleDoList
            data={doNos}
            doSelected={doSelected}
            onPress={(doNo) => setDoSelected(doNo)}
          />
        )}
      </Animated.View>

      <ModalFilter
        isVisible={isVisible}
        title="Ngày Cân"
        fromDate={fromDate}
        toDate={toDate}
        onClose={() => setIsVisible(false)}
        onDateChange={(strDate, type) => {
          if (type === 'fromDate') {
            setFromDate(strDate);
          } else setToDate(strDate);
        }}
        onFilter={() => handleSearchScale()}
      />
    </SafeView>
  );
};

export default ScaleListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {marginHorizontal: 20, paddingTop: HEADER_HEIGHT * 2.5},
  actionBar: {
    height: 50,
    marginVertical: 10,
    elevation: 1,
    backgroundColor: Colors.WHITE,
  },
  viewContainer: {
    position: 'absolute',
    zIndex: 2,
    top: HEADER_HEIGHT,
    backgroundColor: Colors.BG,
    width: '100%',
  },
});
