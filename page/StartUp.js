import React, {useEffect} from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';
import {Headline, useTheme} from 'react-native-paper';
import Lottie from 'lottie-react-native';

const StartUp = ({navigation}) => {
    const {colors} = useTheme();
    const isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        setTimeout(() => {
            navigation.reset({index: 0, routes: [{name: 'Main'}]});
        }, 1000);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.flex}>
            <StatusBar
                backgroundColor={colors.background}
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                animated={true}
            />
            <View style={styles.body}>
                <Lottie
                    source={require('../resource/logo lottie.json')}
                    autoPlay={true}
                    loop={false}
                    style={{width: 200, height: 200}}
                />
                <Headline style={styles.text}>X-Travel</Headline>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    body: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    text: {
        paddingTop: 40,
    },
    flex: {
        flex: 1,
    },
});

export {StartUp};
