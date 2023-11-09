import Base from './Base.js';

export default class SessionsAPI extends Base {
    create(payload) {
        return this.apiClient.post('login', payload);
    }
}
