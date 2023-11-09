import Base from './Base.js';

export default class UsersAPI extends Base {
    create(payload) {
        return this.apiClient.post('register', payload);
    }

    createRegistrationRequest(payload) {
        return this.apiClient.post('createRegistrationRequest', payload);
    }

    updatePassword(payload) {
        return this.apiClient.patch('profile', payload);
    }

    resetPasswordEmail(payload) {
        return this.apiClient.post('requestPasswordReset', payload);
    }

    resetPasswordCode(payload) {
        return this.apiClient.post('validatePasswordResetCode', payload);
    }

    resetPassword(payload) {
        return this.apiClient.post('passwordReset', payload);
    }

    getMqtt(payload) {
        return this.apiClient.get('mqttCredentials', payload);
    }

    removeUser() {
        return this.apiClient.delete('profile');
    }
}
