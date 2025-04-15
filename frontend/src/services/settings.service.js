import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetch user settings from the API
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} User settings data
 */
export const getUserSettings = async (userId) => {
    try {
        const response = await API.get('/settings/view', {
            params: {
                user_id: userId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user settings:', error);
        throw error;
    }
};

/**
 * Update user settings
 * @param {Object} params - Update parameters
 * @param {string} params.userId - The user's ID
 * @param {string} [params.username] - New username
 * @param {string} [params.email] - New email
 * @param {string} [params.currentPassword] - Current password for verification
 * @param {string} [params.newPassword] - New password
 * @param {Object} [params.preferences] - User preferences
 * @returns {Promise<Object>} Updated settings data
 */
export const updateUserSettings = async ({
    userId,
    username,
    email,
    currentPassword,
    newPassword,
    preferences
}) => {
    try {
        const response = await API.post('/settings/update', {
            data: {
                user_id: userId,
                username,
                email,
                current_password: currentPassword,
                new_password: newPassword,
                preferences
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
};

/**
 * Upload user profile image
 * @param {Object} params - Upload parameters
 * @param {string} params.userId - The user's ID
 * @param {File} params.imageFile - The image file to upload
 * @returns {Promise<Object>} Upload response data
 */
export const uploadProfileImage = async ({ userId, imageFile }) => {
    try {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('image', imageFile);

        const response = await API.post('/user/profile-image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
}; 