/* eslint-disable @typescript-eslint/no-use-before-define */
import { useDimensions } from '@react-native-community/hooks';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {ILog} from '~/apis/types.service';
import {Button, InputWithoutFormik, SafeView} from '~/components/commons';
import {Column, Container, Header, Row} from '~/components/sections';
import {Colors} from '~/configs';
import {addLog, deleteLogApp, getLogs} from '~/helpers/AppLog';

const Test = () => {
  const {window} = useDimensions();
  const [logs, setLogs] = useState<ILog[]>([]);
  const handleGetLog = async () => {
    const los = await getLogs();
    setLogs(los);
  };

  const handleAddLog = async () => {
    // const obj = {name: 'vien', lastname: 'levan'};
    // await addLog('vien.levan', 'CREATE', 'SCALE_TEMP_HEADER', obj);
    // await deleteLogApp();
  };

  return (
    <>
      <SafeView>
        <Header title="Logs" isMenu disableThreeDot />

        <Container>
          <Row>
            <InputWithoutFormik
              multiline
              contentStyle={{height: window.height - 300}}
              value={JSON.stringify(logs)}
            />
          </Row>
          <Row>
            {/* <Column>
              <Button
                title="Lưu giá trị"
                color={Colors.WHITE}
                onPress={() => handleAddLog()}
              />
            </Column> */}
            <Column>
              <Button
                title="Lấy giá trị"
                color={Colors.WHITE}
                bgColor={Colors.SUCCESS}
                onPress={() => handleGetLog()}
              />
            </Column>
          </Row>
        </Container>
      </SafeView>
    </>
  );
};

export default Test;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginHorizontal: 10,
    position: 'absolute',
    width: '95%',
    top: 70,
  },
  searchBox: {
    width: 30,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  textMultiline: {
    backgroundColor: 'rgba(0,0,0, 0.1)',
    height: 150,
    marginHorizontal: 20,
    color: Colors.BLACK,
    fontSize: 15,
    marginTop: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.BORDER_DARK,
  },
  filterForm: {
    backgroundColor: Colors.WHITE,
    marginTop: 10,
  },
  toast: {
    backgroundColor: 'rgba(0,0,0, .5)',
    position: 'absolute',
    bottom: 50,
    padding: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  text: {color: Colors.WHITE, letterSpacing: 2},
});
