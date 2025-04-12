import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFonts, Rowdies_300Light, Rowdies_400Regular, Rowdies_700Bold } from '@expo-google-fonts/rowdies';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function UsersListScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    let [fontsLoaded] = useFonts({
        Rowdies_300Light,
        Rowdies_400Regular,
        Rowdies_700Bold,
    });

    const loadUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudieron cargar los usuarios',
                [
                    { text: 'OK', style: 'default' }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar sesión',
                    onPress: async () => {
                        await AsyncStorage.removeItem('user');
                        router.replace('/(auth)/login');
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

    const handleViewUser = (userId: number) => {
        router.push(`/user/${userId}`);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const userString = await AsyncStorage.getItem('user');
            if (!userString) {
                router.replace('/(auth)/login');
            } else {
                setCurrentUser(JSON.parse(userString));
                loadUsers();
            }
        };

        checkAuth();
    }, []);

    if (!fontsLoaded || loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3D2A6A" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.welcomeText}>Hola, {currentUser?.name}</Text>
                </View>
                <Pressable
                    onPress={handleLogout}
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutButtonPressed
                    ]}
                >
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Lista de Usuarios</Text>

                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.userCard}>
                            <View style={styles.userAvatar}>
                                <Text style={styles.avatarText}>
                                    {item.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userEmail}>{item.email}</Text>
                            </View>
                            <Pressable
                                onPress={() => handleViewUser(item.id)}
                                style={({ pressed }) => [
                                    styles.viewButton,
                                    pressed && styles.viewButtonPressed
                                ]}
                            >
                                <Text style={styles.viewButtonText}>Ver</Text>
                            </Pressable>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay usuarios para mostrar</Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    userInfo: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 18,
        color: '#000',
        fontFamily: 'Rowdies_700Bold',
    },
    logoutButton: {
        backgroundColor: '#f33',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    logoutButtonPressed: {
        backgroundColor: '#2A1C4D',
    },
    logoutText: {
        color: 'white',
        fontFamily: 'Rowdies_400Regular',
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        color: '#000',
        marginBottom: 20,
        fontFamily: 'Rowdies_700Bold',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F5FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EDE9FF',
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3D2A6A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    userDetails: {
        flex: 1,
    },
    avatarText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Rowdies_700Bold',
    },
    userName: {
        fontSize: 16,
        color: '#3D2A6A',
        fontFamily: 'Rowdies_400Regular',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#6A5ACD',
        fontFamily: 'Rowdies_300Light',
    },
    viewButton: {
        backgroundColor: '#6A5ACD',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    viewButtonPressed: {
        backgroundColor: '#5A4ABD',
    },
    viewButtonText: {
        color: 'white',
        fontFamily: 'Rowdies_400Regular',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#A0AEC0',
        fontFamily: 'Rowdies_300Light',
    },
});