import { Dimensions, PixelRatio, Alert } from 'react-native';

const Consts = require('../helpers/Consts');

function renderIf(condition, content) {
    return (condition) ? content : null;
}

function renderIfElse(condition, contentTrue, contentFalse) {
    return (condition) ? contentTrue : contentFalse;
}

function getDeviceWidth() {
    return Dimensions.get('window').width;
}

function getDeviceHeight() {
    return Dimensions.get('window').height;
}

function showSimpleAlertDialog(title, content, onPressAction) {
    Alert.alert(
        title,
        content,
        [
            {text: 'OK', onPress: () => onPressAction() },
        ],
        {cancelable: false},
    );
}

function getObject(object, undefinedReturn) {
    if (typeof object !== 'undefined') {
        return object;
    } else {
        return undefinedReturn;
    }
}

function getTextReadableDate() {
    var date = new Date();  
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    var date = date.getDate();
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'October', 'Nov', 'Dec'][date.getMonth()];
    var year = date.getFullYear();
    return day + ', ' + month + [date.getDay()] + ' ' + year;
}

function getCurrentDate() {
    var date = new Date();
    return date.getDate();
}

function getCurrentMonth() {
    var date = new Date();
    var month = date.getMonth();
    return month;
}

function getCurrentYear() {
    var date = new Date();
    var year = date.getFullYear();
    return year;
}

function getCurrentFullDate() {
    var dia = getCurrentDate();
    var mes = getCurrentMonth() + 1;
    var ano = getCurrentYear();
    return dia.toString().padStart(2, '0') + '/' + mes.toString().padStart(2, '0') + '/' + ano.toString().padStart(2, '0');
}

function getDefaultHTTPHeaders(urlEncoded) {
    if (urlEncoded === true) {
        return { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8', 'Accept': 'application/json' } };
    } else {
        return { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json' } };
    }
}

function httpRequestSuccess(statusCode) {
    var arrSuccessCodes = [ Consts.HTTP_STATUS_OK ];
    return arrSuccessCodes.indexOf(parseInt(statusCode, 2)) !== -1;
}

function httpRequestError(statusCode) {
    var arrErrorCodes = [   Consts.HTTP_STATUS_BAD_REQUEST, 
                            Consts.HTTP_STATUS_UNAUTHORIZED,
                            Consts.HTTP_STATUS_FORBIDDEN,
                            Consts.HTTP_STATUS_NOT_FOUND,
                            Consts.HTTP_STATUS_BAD_GATEWAY,
                            Consts.HTTP_STATUS_SERVICE_UNAVAILABLE,
                            Consts.HTTP_STATUS_GATEWAY_TIMEOUT ];
    return arrErrorCodes.indexOf(parseInt(statusCode, 2)) !== -1;
}

function showError(errorMessage) {
    showSimpleAlertDialog('Error', errorMessage, () => {});
}

function showWarning(warningMessage) {
    showSimpleAlertDialog('Warning', warningMessage, () => {});
}

function showInformation(infoMessage) {
    showSimpleAlertDialog('Information', infoMessage, () => {});
}

function showSimpleChoiceDialog(title, content, textCancel, textOK, actionCancel, actionOK) {
    Alert.alert(
        title,
        content,
        [
          {
            text: textCancel,
            onPress: () => actionCancel(),
            style: 'cancel',
          },
          {
            text: textOK,
            onPress: () => actionOK(),
          },
        ],
      );    
}

function padLeft(size, number, character) {
    var internalNumber = number;
    return internalNumber.toString().padStart(size, character);
}

function getAPIFormattedDate(incYears) {
    var date = new Date();
    if (incYears > 0) {
        date.setFullYear(date.getFullYear() + incYears);
    }
    var formattedDate = date.getFullYear() + '-' + padLeft(2, date.getMonth() + 1, '0') + '-' + padLeft(2, date.getDate(), '0'); // + 'T' + date.getHours() + ':' + padLeft(2, date.getMinutes(), '0') + ':' +  padLeft(2, date.getSeconds(), '0') + '.' + date.getMilliseconds() + 'Z';
    return formattedDate;
}

function formataDataAPI(data) {
    var day = parseInt(data.substr(0, 2), 2);
    var month = parseInt(data.substr(3, 2), 2) - 1;
    var year = parseInt(data.substr(6, 4), 2);
    var data = new Date(year, month, day);
    var dataFormatada = data.getFullYear() + '-' + padLeft(2, data.getMonth() + 1, '0') + '-' + padLeft(2, data.getDate(), '0'); // + 'T' + date.getHours() + ':' + padLeft(2, date.getMinutes(), '0') + ':' +  padLeft(2, date.getSeconds(), '0') + '.' + date.getMilliseconds() + 'Z';
    return dataFormatada;
}

function isValidDate(str) {
    var parts = str.split('/');
    if (parts.length < 3) {
        return false;
    }
    else {
        var day = parseInt(parts[0], 2);
        var month = parseInt(parts[1], 2);
        var year = parseInt(parts[2], 2);
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return false;
        }
        if (day < 1 || year < 1) {
            return false;
        }
        if (month > 12 || month < 1) {
            return false;
        }
        if ((month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) && day > 31) {
            return false;
        }   
        if ((month === 4 || month === 6 || month === 9 || month === 11 ) && day > 30) {
            return false;
        }    
        if (month === 2) {
            if (((year % 4) === 0 && (year % 100) !== 0) || ((year % 400) === 0 && (year % 100) === 0)) {
                if (day > 29){
                    return false;
                }      
            } else {
                if (day > 28) {
                    return false;
                } 
            }      
        }
        return true;
    }
}

function objectIsEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)){
            return false;
        }
    }
    return true;
}

function updateObjProp(obj, value, propPath) {
    const [head, ...rest] = propPath.split('.');
    !rest.length
        ? obj[head] = value
        : this.updateObjProp(obj[head], value, rest.join());
}

function getElementLayoutDimensions(elementLayout) {
    var obj = {};
    const { x, y, width, height} = elementLayout;
    obj.x = x;
    obj.y = y;
    obj.width = width;
    obj.height = height;
    return obj;   
}

function widthPercentToDP(widthPercent, customWidth) {
    var screenWidth;
    if (customWidth !== undefined) {
        screenWidth = customWidth;
    } else {
        screenWidth = Dimensions.get('window').width;
    }
    var elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
}

function heightPercentToDP(heightPercent, customHeight) {
    var screenHeight;
    if (customHeight !== undefined) {
        screenHeight = customHeight;
    } else {
        screenHeight = Dimensions.get('window').height;
    }    
    var elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
}

function unformatAPIDateTime(dateTime, includesTime) {
    if (dateTime !== undefined) {
        var tmpDateTime = dateTime;
        //2020-06-17T22:06:12
        var strDate = tmpDateTime.substr(0, 10).trim();
        var strTime = tmpDateTime.substr(11, 8).trim();
        var year = strDate.substr(0, 4);
        var month = strDate.substr(5, 2);
        var day = strDate.substr(8, 2);
        var validDate = new Date(year + '/' + month + '/' + day);
        var textNonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'October', 'Nov', 'Dec'][validDate.getMonth()];
        var today = new Date();
        if (validDate.getDay() === today.getDay()) {
            var hour = strTime.substr(0, 2);
            var minute = strTime.substr(3, 2);
            return hour + ':' + minute;
        } else {
            if (includesTime) {
                var hour = strTime.substr(0, 2);
                var minute = strTime.substr(3, 2);                
                return textNonth + ' ' + day + ' ' + hour + ':' + minute;
            } else {
                return textNonth + ' ' + day;
            }
        }
    }
}

function strToInt(value) {
    if (value === undefined) {
        return 0;
    } else {
        if (value.length > 0) {
            return parseInt(value, 2);
        } else {
            return 0;
        }
    }
}

export {    renderIf,
            renderIfElse,
            getDeviceWidth, 
            getDeviceHeight, 
            showSimpleAlertDialog,
            getObject,
            getDefaultHTTPHeaders,
            httpRequestSuccess,
            httpRequestError,
            showError,
            showWarning,
            showSimpleChoiceDialog,
            getCurrentDate,
            getCurrentMonth,
            getCurrentYear,
            getAPIFormattedDate,
            isValidDate,
            formataDataAPI,
            objectIsEmpty,
            getCurrentFullDate,
            padLeft,
            updateObjProp,
            showInformation,
            getElementLayoutDimensions,
            widthPercentToDP,
            heightPercentToDP,
            unformatAPIDateTime,
            strToInt,
            getTextReadableDate };
