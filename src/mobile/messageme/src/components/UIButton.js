import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const Consts = require('../helpers/Consts');

class UIButton extends React.Component {

    constructor(props) {
        super(props);
    }

    getCurrentView = (isLoading, props) => {
        if (!isLoading) {
            const { textColor, text, marginTop, height, fontFamily, fontSize, enabled } = props;
            return <Text style={{fontSize: fontSize, fontFamily: fontFamily, textAlign: 'center', color: enabled ? textColor : '#C4C4C4'}}>{text}</Text> 
        } else {
            return  <View>
                        <ActivityIndicator size="small" color={Consts.whiteColor}/>
                    </View>
        }
    }

    render() {
        const { backgroundColor, borderColor, borderWidth, textColor, text, marginTop, height, fontFamily, fontSize, onPress, isLoading, enabled } = this.props;
        return(
            <TouchableOpacity onPress={onPress} style={{ backgroundColor: enabled ? backgroundColor : "#EFEFEF", 
                                                         height: height,
                                                         justifyContent: 'center',
                                                         alignSelf: 'stretch',
                                                         marginTop: marginTop,
                                                         borderRadius: 10,
                                                         borderColor: enabled ? borderColor : "#EFEFEF",
                                                         borderWidth: borderWidth}}
                                                disabled={isLoading || !enabled}>
                {this.getCurrentView(isLoading, this.props)}
            </TouchableOpacity>            
        );
    }
}

export default UIButton;