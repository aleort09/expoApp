const BASE_URL = "https://jacky.jeotech.x10.mx/";

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}users/`);
        if (!response.ok) {
            throw new Error(`Error al obtener usuarios: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getAllUsers:", error);
        throw error;
    }
};

export const getUserById = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}users/${id}`);
        if (!response.ok) {
            throw new Error(`Error al obtener usuario: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getUserById:", error);
        throw error;
    }
};

export const createUser = async (user: { name: string; email: string; password: string }) => {
    try {
        const response = await fetch(`${BASE_URL}users/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (!response.ok) {
            // Si el backend devuelve un mensaje de error en la propiedad 'message'
            throw new Error(data.message || 'Error en el registro');
        }

        // Aceptamos diferentes formatos de respuesta
        return data;
    } catch (error) {
        console.error("Error en createUser:", error);
        throw error;
    }
};

export const updateUser = async (id: number, user: { name?: string; email?: string; password?: string }) => {
    try {
        const response = await fetch(`${BASE_URL}users/edit/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar usuario: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en updateUser:", error);
        throw error;
    }
};

export const deleteUser = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}users/delete/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar usuario: ${response.status}`);
        }
    } catch (error) {
        console.error("Error en deleteUser:", error);
        throw error;
    }
};

export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await fetch(`${BASE_URL}users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`Error en el login: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.user) {
            throw new Error('Datos de usuario no recibidos');
        }

        return data;
    } catch (error) {
        console.error("Error en loginUser:", error);
        throw error;
    }
};