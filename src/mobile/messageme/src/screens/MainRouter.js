import React from 'react';
import {  StyleSheet, View, StatusBar, ActivityIndicator} from 'react-native';

const Consts = require('../helpers/Consts');

export default class MainRouter extends React.Component {

  // Default navigation options
  static navigationOptions = ({ navigation }) => ({
    title: null,
    headerShown: false,
    gestureEnabled: true
  });  

  constructor(props) {
    super(props);
    this.doRouting();
  }

  doRouting = async () => {
    setTimeout(() => {
      this.selectRoute();
    }, 1000);
  }

  selectRoute = () => {
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
        <ActivityIndicator size="large" color={Consts.whiteColor} style={styles.activityIndicatorStyle}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Consts.colorPrimary,
  },
  defaultText: {
    fontFamily: Consts.fontStyleDemi,
    fontSize: 20,
    color: Consts.whiteColor
  },
  activityIndicatorStyle: {
    marginBottom: 10
  }
});