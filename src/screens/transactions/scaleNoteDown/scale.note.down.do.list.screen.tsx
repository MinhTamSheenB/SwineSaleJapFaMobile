/* eslint-disable @typescript-eslint/no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IScaleDOItem, IScaleNoteDownModel} from '~/apis/types.scale.note.down';
import {IScaleDetailDTO} from '~/apis/types.service';
import {FlatListCommon, SafeView} from '~/components/commons';
import {
  Container,
  Header,
  PickDateModal,
  SearchBox,
} from '~/components/sections';
import {IPickDateProps} from '~/components/sections/PickDateModal';
import {FROM_DATE, TO_DATE} from '~/configs/initializeVariable';
import {ScaleNoteDownDoItem} from '~/containers/transactions/SaleNoteDown';
import {IScaleRowITem} from '~/containers/transactions/SaleNoteDown/ScaleNoteDownDoItem';
import ScreenType from '~/navigations/screen.constant';
import {RootState} from '~/redux/reducers';
import ScaleNoteDownActions from '~/redux/scaleNoteDown/scale.note.down.actions';

const ScaleNoteDownDoListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const ref = useRef<IPickDateProps>(null);

  const {scaleNoteData} = useSelector(
    (state: RootState) => state.scaleNoteDown,
  );
  const [dataSearch, setDataSearch] = useState<IScaleDOItem[]>([]);

  const handleGetSaleNote = useCallback(
    (fromDate = FROM_DATE, toDate = TO_DATE) => {
      dispatch(ScaleNoteDownActions.getScaleNoteList(fromDate, toDate));
    },
    [dispatch],
  );

  useEffect(() => {
    handleGetSaleNote();
  }, [handleGetSaleNote]);

  useEffect(() => {
    setDataSearch(scaleNoteData.reverse());
  }, [scaleNoteData]);

  const handleSelectItem = (item: IScaleDetailDTO) => {
    const model: IScaleNoteDownModel = {
      ...item,
      ROOTSCALEID: item.SCALEID,
      SCALEID: '',
    };
    dispatch(ScaleNoteDownActions.setLocalModel(model));
    setTimeout(() => {
      navigation.navigate(ScreenType.ScaleNoteDown.EDIT);
    }, 200);
  };

  return (
    <SafeView>
      <Header
        isMenu={false}
        title="(1) Chọn phiếu cân điều chỉnh"
        onMenuPress={() => {
          if (ref.current) {
            return ref.current.onOpen && ref.current.onOpen();
          }
        }}
      />
      <Container style={styles.container}>
        <SearchBox
          dataSource={scaleNoteData}
          placeholder="Nhập số do cần tìm."
          accessor="keySearch"
          onSearch={(data) => setDataSearch(data ?? [])}
        />
        <FlatListCommon
          contentContainerStyle={{marginTop: 10}}
          isShowVertical={false}
          data={dataSearch}
          renderItem={({item}: {item: IScaleDOItem}) => {
            const items: IScaleRowITem[] = item.DETAILS.map((de, index) => ({
              key: index,
              no: de.SCALENO ?? '',
              name: de.NAME_VN ?? '',
              qty: de.TOTALQTY,
              avg: de.AVGWIGHT,
              weight: de.NETGROSS,
            }));
            return (
              <ScaleNoteDownDoItem
                doNo={item.DONO}
                custName={item.CUSTNAME}
                scaleData={items}
                visibleDO
                onSelect={(select) =>
                  handleSelectItem(item.DETAILS[select.key])
                }
              />
            );
          }}
        />
      </Container>
      <PickDateModal
        ref={ref}
        onAccept={(from, to) => {
          handleGetSaleNote(from, to);
        }}
      />
    </SafeView>
  );
};

export default ScaleNoteDownDoListScreen;
const styles = StyleSheet.create({
  container: {},
});
