import AsyncStorage from '@react-native-async-storage/async-storage';

export const HIGHESTSCORE = 'HIGHESTSCORE';



export const storeData = async (storage_Key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(storage_Key, jsonValue)
    } catch (e) {
      // saving error
    }
  }


  export const getData = async (storage_Key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(storage_Key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }