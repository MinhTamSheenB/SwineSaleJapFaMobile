import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Alert, Pressable, TouchableOpacity, View, PermissionsAndroid, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DeliveryOrderStatus, IDoHeaderCommon} from '~/apis/types.service';
import {MenuPermission} from '~/commons';
import {INavigateScreen} from '~/commons/types';
import {Accordion, Icon, SafeView, TextCustom, PrintButton, XML, HTML } from '~/components/commons';
import {
  Column,
  ConfirmModal,
  Container,
  Header,
  Row,
  RowLabelIconValue,
} from '~/components/sections';
import {Colors, Sizes} from '~/configs';
import {DoProduct} from '~/containers/transactions/Do';
import {convertStringDateToDdMmYyyy,convertStringDateToMdDdYyyy,normaliseValue } from '~/helpers/DatetimeHelpers';
import ScreenType from '~/navigations/screen.constant';
import DoActions from '~/redux/do/do.actions';
import {RootState} from '~/redux/reducers';
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import FileViewer from 'react-native-file-viewer'
import RNFS from 'react-native-fs';


type ActionType = 'POST_OR_REVERT_INVOICE' | 'DELETE_DO';

const DoSummaryScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {items, headerInfo, headerModel} = useSelector(
    (state: RootState) => state.dos,
  );
  const {userParams, drawerId} = useSelector(
    (state: RootState) => state.global,
  );
  const [isConfirmModal, setIsConfirmModal] = React.useState<boolean>(false);
  const [actionSelected, setActionSelected] = React.useState<
    ActionType | undefined
  >(undefined);

  React.useEffect(() => {
    const doNo = headerModel.DONO;
    if (doNo) {
      const loadDoRel = drawerId === MenuPermission.DO_RELEASE_MENU_ID;
      dispatch(DoActions.getProductsDoNo(doNo, loadDoRel));
      dispatch(DoActions.getHeaderInfoByNo(doNo));
    }
  }, [headerModel.DONO, dispatch, drawerId]);

  const handleOnAccept = () => {
    setIsConfirmModal(false);
    if (actionSelected === 'POST_OR_REVERT_INVOICE') {
      dispatch(
        DoActions.postToSale(headerInfo?.DONO!, headerInfo?.STATUS!, true),
      );
    } else {
      const nav: INavigateScreen = {
        screen: ScreenType.DO.LIST,
        isNavigate: true,
      };
      const model: IDoHeaderCommon = {...userParams, doNo: headerInfo?.DONO!};
      dispatch(DoActions.remove(model, true, nav));
    }
  };


  //////////////////////////////////////////////////////////////////////////////////////////////
  //***************************************************************************************/
  //**************************************EXPORT DO******************************************** */
  ///////////////////////////////////////////////////////////////////////////////////////////////
 

  const askPermission = () => {
    async function requestExternalWritePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          // DON'T KNOW HOW THIS SHIT CODE IN TYPESCRIPT
          //   {
          //     title: `Pdf creator needs External Storage Write Permission`,
          //     message:
          //       'Pdf creator needs access to Storage data in your SD Card',
          // }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          createPDF();
        } else {
          alert('WRITE_EXTERNAL_STORAGE permission denied');
        }
      } catch (err) {
        // alert('Write permission err', err);
        console.warn(err);
      }
    }
    if (Platform.OS === 'android') {
      requestExternalWritePermission();
    } else {
      createPDF();
    }
  }

  const data = {
    customerName: headerInfo?.CUSTNAME ?? '---',
    customerID: headerInfo?.CUSTID ?? '---',
    customerAddress: headerInfo?.PLACEDELIVERY ?? '---',
    customerPhone: headerInfo?.RECEIVERPHONE ?? '---',
    senderName: headerInfo?.LOCATIONNAME ?? '---',
    senderAddress: headerInfo?.LOCATIONADDRESS ?? '---',
    deliveryDate: convertStringDateToDdMmYyyy(headerInfo?.DODATE, 'date'),
    deliverDate2: convertStringDateToMdDdYyyy(`${headerInfo?.DODATE}`),
    deliveryplace: headerInfo?.PLACEDELIVERY ?? '---',
    doNo: headerInfo?.DONO ?? '---',
    soNo: headerInfo?.SONO ?? '---',
    vehicleNo: headerInfo?.TRUCK_NO ?? '---',
    totalQuantity: headerInfo?.TOTALQTY ?? '---',
    totalWeight: headerInfo?.BW_TOTAL ?? '---',
    regionID:headerInfo?.REGIONID ?? '---',
    officeID:headerInfo?.OFFICEID ?? `---`,
    deptID:headerInfo?.DEPTID ?? '---',
    senderID:headerInfo?.LOCATIONID ?? '---',
    unitID:headerInfo?.UNITID ?? '---',
  
  }

  const HTMLcontent = () => {
    var table = '';
    var no: number = 0
    for (let i in items) {
      const item = items[i];
      no = no + 1;
      table = table + `
      <tr style="height:15pt">
        <td
        style="width:30pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:1pt">
            <p class="s4" style="padding-top: 2pt;text-indent: 0pt;text-align: center;">${no}</p>
        </td>
        <td
        style="width:182pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:1pt">
            <p class="s4" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;text-align: left;">
                ${item.PRODUCTNAME}
            </p>
        </td>
        <td
        style="width:45pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:1pt">
            <p class="s4" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">${item.QTY}</p>
        </td>
        <td
        style="width:41pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:1pt">
            <p class="s4" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">${item.MEASURE}</p>
        </td>
        <td
        style="width:69pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:1pt">
            <p class="s4" style="padding-top: 2pt;padding-right: 1pt;text-indent: 0pt;text-align: right;">${normaliseValue(`${item.BW_AVG}`,2)}</p>
        </td>
        <td
        style="width:77pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:1pt">
            <p class="s4" style="padding-top: 2pt;text-indent: 0pt;text-align: right;">${normaliseValue(`${item.BW_TOTAL}`,2)}</p>
        </td>
        <td
        style="width:128pt;border-left-style:solid;border-left-width:2pt;border-right-style:solid;border-right-width:1pt">
        <p class="s4" style="padding-top: 2pt;padding-left: 1pt;text-indent: 0pt;text-align: left;">${item.REMARKS ?? ''}</p>
        </td>
      </tr>
      `
    }

    //data from HTML 
    let content = HTML(data.customerName, data.customerID, data.customerAddress.split(', ')[2], data.customerPhone, data.senderName,
                     data.senderAddress, data.deliveryDate, data.deliveryplace, data.doNo, data.soNo, data.vehicleNo,
                     data.totalQuantity, data.totalWeight, table)
                 
    return content;

  }

  const XMLcontent = () =>{
    var row = '';
    for(let i in items){
      const item = items[i];
      row = row + `
    <ROWS>
      <GOODSID>${item.PRODUCTID}</GOODSID>
      <GOODSNAME>${item.PRODUCTNAME}</GOODSNAME>
      <QTYORD>${item.QTY}</QTYORD>
      <TOTALWEIGHTORD>${item.BW_TOTAL}</TOTALWEIGHTORD>
      <MEASURE>${item.MEASURE}</MEASURE>
      <CHECKMEASURE>??????????</CHECKMEASURE>
      <EXTPRODNAME></EXTPRODNAME>
    </ROWS>
    `
    }
    let content = XML(data.customerName,data.customerID,data.customerAddress,data.customerPhone,
               data.senderName,data.senderAddress,data.deliverDate2,data.deliveryplace,data.doNo,
               data.soNo,data.vehicleNo,data.totalQuantity,data.totalWeight,data.regionID,data.officeID,
               data.deptID,data.senderID,data.unitID,row)
    
    return content;
  }

  const extension = (Platform.OS === 'android') ? 'file://' : ''

  const createPDF = async () => {
    //CREATE IMP FILE FROM TEXT
    //'xmlpath' is for creating imp file and 'xmlpathtxt' is for txt file
    //purpose is to read file that can't be read
    var XMLpath = `${extension}${RNFS.ExternalStorageDirectoryPath}/${data.doNo}.imp`
    var XMLpathTXT = `${extension}${RNFS.DocumentDirectoryPath}/${data.doNo}.txt`
    RNFS.writeFile(XMLpath, XMLcontent(), 'utf8').then(()=>{
      console.log(`ghi file thành công : ${XMLpath}`);
    }).catch((err)=>{console.log(err);})
    RNFS.writeFile(XMLpathTXT, XMLcontent(), 'utf8')
    ///////////////////////////////////////////////////////////////////
    //CREATE PDF FILE FROM HTML
    let Options = {
      html: HTMLcontent(),
      fileName: `${headerInfo?.DONO}`,
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(Options)
    ///////////////////////////////////////////////////////////////////

    Alert.alert('Xuất File PDF & XML Thành Công', 'PDF : ' + file.filePath + '\nXML : ' + XMLpath, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open XML', onPress: () => openFileXML(XMLpathTXT) },
      { text: 'Open PDF', onPress: () => openFile(file.filePath) }
    ], { cancelable: true });
  }

  const openFile = (filepath: string): void => {
    const path = filepath;
    FileViewer.open(path, { showAppsSuggestions: true })
      .then(() => {
        //success
        console.log(`Successfully export PDF file`);

      })
      .catch(error => {
        console.log(error);
      });
  }

  const openFileXML = (filepath: string): void => {
    const path = filepath;
    FileViewer.open(path,{ showAppsSuggestions: true })
      .then(() => {
        console.log(`successfully export XML file`);

      })
      .catch(err => {
        console.log(err);
      });
  }




  //**************************************************************************************** */
  //**************************************************************************************** */


  return (
    <SafeView>
      <Header
        title="Thông Tin Yêu Cầu Giao Hàng"
        isMenu={false}
        disableThreeDot
      />
      <Container isIncludeScrollView>
        <Accordion title="Phiếu Giao Hàng" isOpen>
          <RowLabelIconValue
            iconType="Entypo"
            iconName="location"
            label="Trại xuất:"
            value={headerInfo?.LOCATIONNAME ?? '---'}
            styleValue={{fontWeight: 'bold'}}
          />

          <RowLabelIconValue
            iconType="Entypo"
            iconName="users"
            label="Khách hàng:"
            value={headerInfo?.CUSTNAME ?? '---'}
            styleValue={{fontWeight: 'bold'}}
          />
          <RowLabelIconValue
            iconType="Entypo"
            iconName="location"
            label="Địa chỉ kh:"
            value={headerInfo?.PLACEDELIVERY ?? '---'}
          />

          <RowLabelIconValue
            iconType="Entypo"
            iconName="user"
            label="Người nhận:"
            value={headerInfo?.RECEIVERNAME ?? '---'}
          />

          <RowLabelIconValue
            iconType="FontAwesome"
            iconName="phone"
            label="Điện thoại:"
            value={headerInfo?.RECEIVERPHONE ?? '---'}
          />

          <RowLabelIconValue
            iconType="AntDesign"
            iconName="calendar"
            label="Giờ nhận:"
            value={headerInfo?.RECEIVEHOUR ?? '---'}
          />
          <RowLabelIconValue
            iconType="FontAwesome"
            iconName="truck"
            label="Số xe:"
            value={headerInfo?.TRUCK_NO ?? '---'}
          />
          <RowLabelIconValue
            iconType="AntDesign"
            iconName="warning"
            label="Ghi chú:"
            value={headerInfo?.REMARKS ?? '---'}
          />
        </Accordion>

        <Accordion title="Thông Tin Chứng Từ" isOpen>
          <RowLabelIconValue
            iconName="clipboard"
            iconType="Entypo"
            label="Số chứng từ:"
            value={headerInfo?.DONO ?? ''}
            styleValue={{fontWeight: 'bold'}}
          />
          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày chứng từ:"
            value={convertStringDateToDdMmYyyy(headerInfo?.DODATE, 'date')}
          />
          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày hạch toán:"
            value={convertStringDateToDdMmYyyy(headerInfo?.CREATEDATE, 'date')}
          />

          <RowLabelIconValue
            iconName="calendar"
            iconType="AntDesign"
            label="Ngày chốt đơn:"
            value={convertStringDateToDdMmYyyy(headerInfo?.CREATEDATE, 'date')}
          />

          <RowLabelIconValue
            iconType="AntDesign"
            iconName="warning"
            label="Ghi chú:"
            value={headerInfo?.REMARKS ?? '---'}
          />
        </Accordion>

        <Accordion title="Danh Sách Hàng Hóa" isOpen>
          {items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <DoProduct item={item} key={`${item.DODTID}-${index}`} />
          ))}
        </Accordion>
      </Container>
      
      {/* Print button */}
      <View>
        <PrintButton onPress={askPermission} />
      </View>

      <View style={{backgroundColor: Colors.WHITE, height: 70}}>
        <Row>
          <Column>
            <Pressable
              onPress={() => {
                setIsConfirmModal(true);
                setActionSelected('POST_OR_REVERT_INVOICE');
              }}
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Icon
                name={
                  headerInfo?.STATUS === DeliveryOrderStatus.New
                    ? 'lock1'
                    : 'unlock'
                }
                type="AntDesign"
                style={{
                  color:
                    headerInfo?.STATUS === DeliveryOrderStatus.New
                      ? Colors.SUCCESS
                      : Colors.DANGER,
                }}
              />
              <TextCustom
                style={{
                  fontSize: Sizes.Note,
                  marginTop: 5,
                  color:
                    headerInfo?.STATUS === DeliveryOrderStatus.New
                      ? Colors.SUCCESS
                      : Colors.DANGER,
                }}
                bold>
                {headerInfo?.STATUS === DeliveryOrderStatus.New
                  ? 'Chốt đơn'
                  : 'Hủy chốt đơn'}
              </TextCustom>
            </Pressable>
          </Column>
          <Column>
            <Pressable
              onPress={() => {
                setIsConfirmModal(true);
                setActionSelected('DELETE_DO');
              }}
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Icon
                name="closecircle"
                type="AntDesign"
                style={{color: Colors.DANGER}}
              />
              <TextCustom
                style={{
                  fontSize: Sizes.Note,
                  marginTop: 5,
                  color: Colors.DANGER,
                }}
                bold>
                Xóa Đơn
              </TextCustom>
            </Pressable>
          </Column>
          <Column>
            <Pressable
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
              onPress={() => navigation.navigate(ScreenType.DO.LIST)}>
              <Icon
                name="back"
                type="AntDesign"
                style={{color: Colors.GRAY, transform: [{rotateY: '180deg'}]}}
              />
              <TextCustom style={{fontSize: Sizes.Note, marginTop: 5}}>
                Danh sách
              </TextCustom>
            </Pressable>
          </Column>
        </Row>
      </View>
      <ConfirmModal
        isVisible={isConfirmModal}
        onClose={() => {
          setIsConfirmModal(false);
          setActionSelected(undefined);
        }}
        onAccept={handleOnAccept}
      />
    </SafeView>
  );
};

export default DoSummaryScreen;
