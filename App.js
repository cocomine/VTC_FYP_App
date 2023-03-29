/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    NavigationContainer,
} from '@react-navigation/native';
import {
    Appbar,
    MD3DarkTheme as PaperDarkTheme,
    MD3LightTheme as PaperDefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import merge from 'deepmerge';
import {Color} from './module/Color';
import Main from "./page/Main";
import {StartUp} from "./page/StartUp";

const Stack = createNativeStackNavigator();

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
let CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);
CombinedDarkTheme = {
    ...CombinedDarkTheme,
    colors: {...CombinedDarkTheme.colors, background: Color.darkColor},
};

function App() {
    const isDarkMode = useColorScheme() === 'dark';
    let theme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
    theme = {
        ...theme,
        colors: {
            ...theme.colors,
            primary: Color.primaryColor,
        },
    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <Stack.Navigator
                        initialRouteName={'StartUp'}
                        screenOptions={{
                            header: props => <CustomNavigationBar {...props} />,
                        }}>
                        <Stack.Group>
                            <Stack.Screen //主要介面
                                name="Main"
                                component={Main}
                                options={{headerShown: false}}
                            />
                        </Stack.Group>
                        <Stack.Screen //啟動介面
                            name="StartUp"
                            component={StartUp}
                            options={{headerShown: false}}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}

function CustomNavigationBar({navigation, back, options}) {
    return (
        <Appbar.Header style={{backgroundColor: Color.primaryColor}}>
            {options.headerBackVisible === false ? null : (
                <Appbar.BackAction onPress={navigation.goBack} />
            )}
            <Appbar.Content title={options.title} />
        </Appbar.Header>
    );
}

export default App;
