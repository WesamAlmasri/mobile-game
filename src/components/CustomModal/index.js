import React from 'react';
import { View, 
        StyleSheet, 
        Text, 
        Modal, 
        TouchableHighlight,
        Dimensions,
      } from 'react-native';


height = Dimensions.get('window').height;
width = Dimensions.get('window').width;

export default CustomModal = (props) => {
  const { modalVisible, onPressButton, modalText1, modalText2, buttonText } = props;

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText1}>{modalText1}</Text>
            <Text style={styles.modalText2}>{modalText2}</Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={onPressButton}
            >
              <Text style={styles.textStyle}>{buttonText}</Text>
            </TouchableHighlight>
          </View>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    width: width * 0.7,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    width: width * 0.5,
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
  },
  modalText1: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 25,
  },
  modalText2: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 17,
  },
});
