import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser } from '../../services/UserService';
import { useFonts, Rowdies_300Light, Rowdies_400Regular, Rowdies_700Bold } from '@expo-google-fonts/rowdies';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    let [fontsLoaded] = useFonts({
        Rowdies_300Light,
        Rowdies_400Regular,
        Rowdies_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert(
                'Error',
                'Todos los campos son obligatorios',
                [{ text: 'OK', style: 'default' }]
            );
            return;
        }

        setLoading(true);
        try {
            const response = await createUser({
                name,
                email,
                password
            });

            if (response && (response.user || response.id)) {
                const userData = response.user || {
                    id: response.id,
                    name: response.name || name,
                    email: response.email || email
                };

                await AsyncStorage.setItem('user', JSON.stringify(userData));

                Alert.alert(
                    '¡Registro exitoso!',
                    `Bienvenido ${userData.name}`,
                    [
                        { 
                            text: 'OK',
                            onPress: () => router.replace('/(tabs)/users')
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Registro completo',
                    'Por favor inicia sesión con tus credenciales',
                    [
                        { 
                            text: 'OK',
                            onPress: () => router.replace('/login')
                        }
                    ]
                );
            }
        } catch (error: any) {
            let errorMessage = 'Error al registrar el usuario';
            
            if (error.message.includes('email')) {
                errorMessage = 'El correo electrónico ya está registrado';
            } else if (error.message.includes('password')) {
                errorMessage = 'La contraseña no cumple los requisitos';
            } else if (error.message) {
                errorMessage = error.message;
            }

            Alert.alert(
                'Error',
                errorMessage,
                [{ text: 'OK', style: 'default' }]
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/flor.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.overlay} />

                <View style={styles.container}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>Regístrate para comenzar</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Nombre completo</Text>
                            <TextInput
                                placeholder="Tu nombre"
                                placeholderTextColor="#A0AEC0"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Correo electrónico</Text>
                            <TextInput
                                placeholder="tu@email.com"
                                placeholderTextColor="#A0AEC0"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Contraseña</Text>
                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#A0AEC0"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                        </View>

                        <Pressable
                            onPress={handleRegister}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                                loading && styles.buttonDisabled
                            ]}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Registrando...' : 'Crear Cuenta'}
                            </Text>
                        </Pressable>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                            <Pressable onPress={() => router.push('/login')}>
                                <Text style={styles.footerLink}>Inicia Sesión</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: 'Rowdies_700Bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Rowdies_300Light',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#4A5568',
        marginBottom: 8,
        fontWeight: '600',
        fontFamily: 'Rowdies_400Regular',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#FFF',
        color: '#1A202C',
        fontFamily: 'Rowdies_400Regular',
    },
    button: {
        backgroundColor: '#6A537F',
        borderRadius: 12,
        padding: 18,
        marginTop: 10,
        shadowColor: '#3D2A6A',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonPressed: {
        backgroundColor: '#2A1C4D',
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        backgroundColor: '#A0AEC0',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Rowdies_700Bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#718096',
        marginRight: 5,
        fontFamily: 'Rowdies_300Light',
    },
    footerLink: {
        color: '#6A537F',
        fontWeight: 'bold',
        fontFamily: 'Rowdies_400Regular',
    },
});