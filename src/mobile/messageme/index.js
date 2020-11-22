import 'react-native-gesture-handler';
import { AppRegistry, YellowBox } from 'react-native';
import { name as appName } from './app.json';
import App from './src/screens/App';

console.disableYellowBox = true;

YellowBox.ignoreWarnings([
    'Require cycle:',
]);

AppRegistry.registerComponent(appName, () => App);