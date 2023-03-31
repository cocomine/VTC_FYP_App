import { Image, Linking, StyleSheet, View } from 'react-native';
import { URL } from '../App';
import { Button, Text, useTheme } from 'react-native-paper';
import { Color } from './Color';
import { ResultData } from './resultData';
import React from 'react';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
// @ts-ignore
import Icon from 'react-native-vector-icons/AntDesign';

interface EventCardProps {
    data: ResultData;
    cardWidth: number;
}

/**
 * Event卡片
 */
const EventCard: React.FC<EventCardProps> = ({ data, cardWidth }) => {
    const theme = useTheme();

    /*  */
    const handlePress = async () => {
        try {
            const url = URL + '/details/' + data.ID;
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: Color.primaryColor,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'coverVertical',
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    hasBackButton: true,
                    showInRecents: true,
                    toolbarColor: Color.primaryColor,
                    secondaryToolbarColor: 'white',
                    navigationBarColor: 'white',
                    navigationBarDividerColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    browserPackage: 'com.android.chrome',
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right',
                    },
                });
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
            <View style={styles.text_title}>
                <Text variant={'titleMedium'}>{data.name}</Text>
                <Text variant={'labelSmall'} style={{color: theme.colors.secondary}}><Icon name={'star'} color={Color.warning}/>{data.rate}({data.total})</Text>
            </View>
            <Text style={[styles.text_summary, {color: theme.colors.secondary}]} variant={'bodyMedium'}>{data.summary}</Text>
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
        paddingTop: 10,
    },
    text_title: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    moreBtn_container: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginTop: 10,
    },
});

export default EventCard;
