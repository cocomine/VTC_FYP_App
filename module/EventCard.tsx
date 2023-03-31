import { Image, Linking, StyleSheet, View } from 'react-native';
import { URL } from '../App';
import { Button, Text } from 'react-native-paper';
import { Color } from './Color';
import { ResultData } from './resultData';
import React from 'react';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

interface EventCardProps {
    data: ResultData;
    cardWidth: number;
}

/**
 * Event卡片
 */
const EventCard: React.FC<EventCardProps> = ({ data, cardWidth }) => {

    const handlePress = async () => {
        try {
            const url = URL;
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: '#453AA4',
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'coverVertical',
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: '#6200EE',
                    secondaryToolbarColor: 'black',
                    navigationBarColor: 'black',
                    navigationBarDividerColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right',
                    },
                });
                setTimeout(() => {
                    console.log(JSON.stringify(result));
                }, 800);
            } else {
                await Linking.openURL(url);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <View
            style={{
                width: cardWidth,
                marginRight: 10,
            }}>
            <Image style={styles.thumbnail} source={{ uri: URL + '/panel/api/media/' + data.thumbnail }} />
            <Text style={styles.text_title} variant={'titleMedium'}>{data.name}</Text>
            <Text style={styles.text_summary} variant={'bodyMedium'}>{data.summary}</Text>
            <View style={styles.moreBtn_container}>
                <Button mode={'contained'} textColor={Color.light} style={{ width: 'auto' }}
                        onPress={handlePress}>立即預約</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    text_summary: {
        color: Color.secondary,
        paddingTop: 10,
    },
    text_title: {
        paddingTop: 10,
    },
    moreBtn_container: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginTop: 10,
    },
});

export default EventCard;
