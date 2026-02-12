import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animación de pulso continua
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Secuencia principal
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 40,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                // Animar la barra de progreso
                Animated.timing(progressAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(2000),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onFinish) {
                onFinish();
            }
        });
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#667eea" />

            {/* Círculos decorativos de fondo */}
            <Animated.View
                style={[
                    styles.decorativeCircle,
                    styles.circle1,
                    {
                        transform: [{ scale: pulseAnim }],
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.decorativeCircle,
                    styles.circle2,
                    {
                        transform: [{ scale: pulseAnim }],
                    },
                ]}
            />

            {/* Contenido principal */}
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* Logo con rotación */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            transform: [{ rotate: spin }],
                        },
                    ]}
                >
                    <View style={styles.logoOuter}>
                        <View style={styles.logoInner}>
                            {/* <Text style={styles.logoText}>N</Text> */}
                            <Ionicons name="location" size={60} color="#003D7A" />
                        </View>
                    </View>
                </Animated.View>

                {/* Texto principal */}         
                <View style={styles.textContainer}>
                    <Text style={styles.appName}>NearYou</Text>
                    <Text style={styles.tagline}>Descubre, explora y comparte experiencias</Text>
                </View> 


                {/* Barra de progreso - CORREGIDO */}
                <View style={styles.progressBarContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                transform: [
                                    { scaleX: progressAnim },
                                ],
                            },
                        ]}
                    />
                </View>
            </Animated.View>

            {/* Footer con versión */}
            <Animated.View
                style={[
                    styles.footer,
                    {
                        opacity: fadeAnim,
                    },
                ]}
            >
                <Text style={styles.version}>Version 1.0.9r21</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#667eea',
        justifyContent: 'center',
        alignItems: 'center',
    },
    decorativeCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    circle1: {
        width: width * 1.5,
        height: width * 1.5,
        top: -width * 0.5,
        right: -width * 0.3,
    },
    circle2: {
        width: width,
        height: width,
        bottom: -width * 0.3,
        left: -width * 0.2,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    logoContainer: {
        marginBottom: 40,
    },
    logoOuter: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    logoInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 15,
        },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 15,
    },
    logoText: {
        fontSize: 70,
        fontWeight: 'bold',
        color: '#667eea',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    appName: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    tagline: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '300',
        letterSpacing: 1,
    },
    progressBarContainer: {
        width: width * 0.6,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
        alignItems: 'flex-start',
    },
    progressBar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        transformOrigin: 'left',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
    },
    version: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '300',
    },
});

export default SplashScreen;