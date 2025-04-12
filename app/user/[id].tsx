import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUserById } from '../../services/UserService';
import { useFonts, Rowdies_300Light, Rowdies_400Regular, Rowdies_700Bold } from '@expo-google-fonts/rowdies';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons

interface User {
    id: number;
    name: string;
    email: string;
    // Agrega más campos según necesites
}

export default function UserDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    let [fontsLoaded] = useFonts({
        Rowdies_300Light,
        Rowdies_400Regular,
        Rowdies_700Bold,
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userId = typeof id === 'string' ? parseInt(id) : 0;
                const userData = await getUserById(userId);
                setUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadUser();
    }, [id]);

    const handleBack = () => {
        // Intenta navegar hacia atrás, si no puede, redirige a /users
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/users');
        }
    };

    if (!fontsLoaded || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3D2A6A" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Usuario no encontrado</Text>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Botón de regreso */}
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>

            <View style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                
                <View style={styles.userInfo}>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.value}>{user.name}</Text>
                    
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{user.email}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3D2A6A',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: 'white',
        marginLeft: 8,
        fontFamily: 'Rowdies_400Regular',
        fontSize: 16,
    },
    card: {
        backgroundColor: '#F8F5FF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3D2A6A',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    avatarText: {
        color: 'white',
        fontSize: 32,
        fontFamily: 'Rowdies_700Bold',
    },
    userInfo: {
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        color: '#6A5ACD',
        fontFamily: 'Rowdies_400Regular',
        marginTop: 10,
    },
    value: {
        fontSize: 18,
        color: '#3D2A6A',
        fontFamily: 'Rowdies_700Bold',
        marginBottom: 5,
    },
    errorText: {
        fontSize: 18,
        color: '#e74a3b',
        fontFamily: 'Rowdies_400Regular',
        textAlign: 'center',
        marginBottom: 20,
    },
});