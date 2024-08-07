import { Dimensions, Image, Linking, PixelRatio, StyleSheet, View } from 'react-native';
import { URL } from '../App';
import { Button, Divider, Text, useTheme } from 'react-native-paper';
import { Color } from './Color';
import { ResultData } from './resultData';
import React, { useCallback, useMemo, useRef } from 'react';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
// @ts-ignore
import Icon from 'react-native-vector-icons/AntDesign';
import WebView from 'react-native-webview';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface EventCardProps {
    data: ResultData;
    cardWidth: number;
}
type newNavState = {
    url?: string;
}

// 瀏覽器參數
const inAppBrowser_Opt = {
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
};

/**
 * Event卡片
 */
const EventCard: React.FC<EventCardProps> = ({ data, cardWidth }) => {
    const theme = useTheme();

    const webview = useRef<WebView | null>(null);

    /**
     * 點擊立即預約
     */
    const handlePress = async () => {
        try {
            const url = URL + '/details/' + data.ID;
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(url, inAppBrowser_Opt);
            } else {
                await Linking.openURL(url);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    /**
     * 說明文字 -> HTML -> WebView -> 加上style
     */
    const description = useMemo(() => {
        return `<style>
            body {
                color: ${theme.colors.secondary};
                user-select: none;
                font-size: ${45 * PixelRatio.getFontScale()}px;
            }
            a {
                color: ${Color.primaryColor};
            }
            img {
                width: 100%;
                border-radius: 20pt;
            }
        </style>`
            + data.description_html;
    }, [data.description_html, theme.colors.secondary]);

    /**
     * 瀏覽器狀態改變
     */
    const onNavigationStateChange = useCallback(async ({url}: newNavState) => {
        if (!url) return;

        console.log(url);
        // 攔截連結
        if (!url.includes(URL)) {
            webview.current?.stopLoading();
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(url, inAppBrowser_Opt);
            } else {
                await Linking.openURL(url);
            }
        }
    }, []);

    return (
        <View
            style={{
                width: cardWidth,
                marginRight: 10,
            }}>
            <Image
                style={styles.thumbnail}
                source={{ uri: URL + '/panel/api/media/' + data.thumbnail }}
            />
            <View style={styles.text_title}>
                <Text
                    variant={'titleMedium'}
                    style={{ overflow: 'hidden', flex: 1 }}
                    numberOfLines={1}
                >
                    {data.name}
                </Text>
                <Text
                    variant={'labelSmall'}
                    style={{ color: theme.colors.secondary, width: 'auto' }}
                >
                    <Icon
                        name={'star'}
                        color={Color.warning}
                    />
                    {data.rate}({data.total})
                </Text>
            </View>
            <Text
                style={[styles.text_summary, { color: theme.colors.secondary }]}
                variant={'bodyMedium'}
            >
                {data.summary}
            </Text>
            <View style={styles.moreBtn_container}>
                <Button
                    mode={'contained'}
                    textColor={Color.light}
                    style={{ width: 'auto' }}
                    onPress={handlePress}
                >
                    立即預約
                </Button>
            </View>
            <Divider style={{ marginTop: 10 }} />
            <View style={{ flex: 1, marginTop: 5 }}>
                <Text variant={'titleMedium'}>活動詳情</Text>
                <BottomSheetScrollView style={{ marginTop: 10 }}>
                    <WebView
                        ref={webview}
                        source={{ html: description, baseUrl: URL }}
                        textZoom={(cardWidth / Dimensions.get('window').width * 100)+15}
                        originWhitelist={['*']}
                        style={styles.webview}
                        onNavigationStateChange={onNavigationStateChange}
                    />
                </BottomSheetScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    webview:{
        backgroundColor: Color.transparent,
        height: 1000
    },
    thumbnail: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    text_summary: {
        paddingTop: 10,
    },
    text_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 10,
    },
    moreBtn_container: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginTop: 10,
    },
});

export default EventCard;
