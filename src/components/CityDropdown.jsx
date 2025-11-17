import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    FlatList,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function CityDropdown({ cities, selectedCity, onSelect }) {
    const [open, setOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: open ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [open]);

    const dropdownHeight = 200;
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-dropdownHeight, 0],
    });

    const handleSelect = (city) => {
        onSelect(city);
        setOpen(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.selector} onPress={() => setOpen(true)}>
                <Text style={styles.selectedText}>{selectedCity}</Text>
            </TouchableOpacity>

            {open && (
                <TouchableWithoutFeedback onPress={() => setOpen(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            {open && (
                <Animated.View style={[styles.dropdown, { transform: [{ translateY }] }]}>
                    <FlatList
                        data={cities}
                        keyExtractor={(item) => item}
                        style={{ maxHeight: dropdownHeight }}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        zIndex: 10,
        paddingVertical: 10,
    },
    selector: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedText: {
        fontSize: 16,
        color: '#333',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000050',
    },
    dropdown: {
        position: 'absolute',
        top: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        elevation: 5,
    },
    option: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
        color: '#161616ff',
    },
});
