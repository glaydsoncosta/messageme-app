import React from 'react';
import MainRouter from './MainRouter';
import Home from './Home';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

const Consts = require('../helpers/Consts.js');

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const DefaultStack = createStackNavigator({
            Home: { screen: Home, navigationOptions: { headerShown: false, gestureEnabled: false } },    
        });
        const AppRoutes = createAppContainer(createStackNavigator(
            {
                DefaultStack: { screen: DefaultStack, navigationOptions: { headerShown: false, gestureEnabled: false } },
                MainRouter: MainRouter
            },
            {
                initialRouteName: 'MainRouter'
            }
        ));
        return (
                <React.Fragment>
                    <SafeAreaView style={styles.safeAreaViewTop} />
                    <SafeAreaView style={styles.safeAreaViewBottom}>
                        <AppRoutes/>
                    </SafeAreaView>
                </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    safeAreaViewTop: {
        flex: 0,
        backgroundColor: Consts.colorPrimary
    },
    safeAreaViewBottom: {
        flex: 1,
        backgroundColor: '#FFF'
    }
});

export default App;