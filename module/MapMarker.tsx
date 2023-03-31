import React, { useCallback, useEffect, useState } from 'react';
import { Marker } from 'react-native-maps';
import { Color } from './Color';
import { ResultData } from './resultData';

interface MapMarkerProps {
    data: ResultData;
    onPress: () => void;
    trigger: boolean;
}

/**
 * 地圖標記
 */
const MapMarker: React.FC<MapMarkerProps> = ({ data, onPress, trigger = false }) => {
    const [opacity, setOpacity] = useState(0.6);

    /* 處理按下 */
    const handlePress = useCallback(() => {
        if (opacity <= 0.6) {
            setOpacity(1);
        } else {
            setOpacity(0.6);
        }
        onPress && onPress();
    }, [onPress, opacity]);

    useEffect(() => {
        if (trigger) {
            setOpacity(1);
        } else {
            setOpacity(0.6);
        }
    }, [trigger, handlePress]);

    return (
        <Marker
            title={data.name}
            opacity={opacity}
            coordinate={{
                latitude: data.latitude,
                longitude: data.longitude
            }}
            pinColor={Color.primaryColor}
            onPress={handlePress}
        />
    );
};

export default MapMarker;