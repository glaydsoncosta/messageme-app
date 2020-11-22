import AsyncStorage from '@react-native-community/async-storage';

export default {
    get: (key) => {
        return AsyncStorage.getItem(key).then((value) => {
            if (value != null) {
                return JSON.parse(' { "' + key + '": ' + value + '}');
            } else {
                return null;
            }
        });
    },

    set: (key, json) => {
        const value = JSON.stringify(json);
        return AsyncStorage.setItem(key, value);
    },

    merge: (key, json) => {
        const value = JSON.stringify(json);
        return AsyncStorage.mergeItem(key, value);
    },

    clear: (key) => {
        return AsyncStorage.removeItem(key);
    }
};