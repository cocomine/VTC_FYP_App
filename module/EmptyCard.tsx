import React from 'react';
import { Text } from 'react-native-paper';
import { Dimensions, View } from 'react-native';
import Lottie from 'lottie-react-native';

/**
 * 空卡片
 * @constructor
 */
const EmptyCard: React.FC = () => {
    const windowWidth = Dimensions.get('window').width;

    return (
        <View style={{width: windowWidth, alignItems: 'center', marginLeft: -20}}>
            <Lottie source={require('../resource/shake-a-empty-box.json')}
                    autoPlay={true}
                    loop={true}
                    style={{width: 100, height: 100}}
            />
            <Text style={{ width: 'auto' }}>該區域沒有任何活動</Text>
        </View>
    );
};

export default EmptyCard;
