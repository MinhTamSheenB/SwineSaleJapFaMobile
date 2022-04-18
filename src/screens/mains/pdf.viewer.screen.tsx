/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import PDFView from 'react-native-view-pdf';
import {useSelector} from 'react-redux';
import {SafeView} from '~/components/commons';
import {Header} from '~/components/sections';
import {RootState} from '~/redux/reducers';

const resourceType = 'base64';

const PdfViewerScreen = () => {
  const {pdfViewer} = useSelector((state: RootState) => state.global);
  return (
    <SafeView>
      <View style={styles.container}>
        <Header
          title={pdfViewer.title ?? 'Thông tin tài liệu.'}
          isMenu={false}
          noShadow
          disableThreeDot
        />
        <View style={{flex: 1}}>
          <PDFView
            fadeInDuration={250.0}
            style={{flex: 1}}
            resource={pdfViewer.data}
            resourceType={resourceType}
            onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
            onError={(error) => console.log('Cannot render PDF', error)}
          />
        </View>
      </View>
    </SafeView>
  );
};

export default PdfViewerScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
