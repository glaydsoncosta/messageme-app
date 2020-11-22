import axios from 'axios';
import * as Utils from '../helpers/Utils';

const Consts = require('../helpers/Consts');

const apiRequest = function(options) {
    
  const onSuccess = function(response) {
    //console.warn('Request Successful!', response);
    return response.data;
  };

  const onError = async function(error) {
    //console.warn('Request Failed:', error.config);
    if (error.response) {
        Utils.showError('It seems your are offline. Please verify your internet connection.');
    } else {
      //console.warn('Error Message:', error.message);
      //console.warn('Status:',  error.response.status);
      //console.warn('Data:',    error.response.data);
      //console.warn('Headers:', error.response.headers);      
    }
    return Promise.reject(error.response || error.message);
  };

  const client = axios.create({
    baseURL: Consts.api.baseUrl,
    timeout: 20000
  });

  return client(options)
            .then(onSuccess)
            .catch(onError);
};

export default apiRequest;