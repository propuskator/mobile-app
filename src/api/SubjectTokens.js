import Base from './Base.js';

export default class AccessPointsAPI extends Base {
    list() {
        return this.apiClient.get('access-subject-tokens');
    }

    attach(payload) {
        return this.apiClient.post('access-subject-tokens/attach/id', payload);
    }

    detach(id) {
        return this.apiClient.post(`access-subject-tokens/${id}/detach`);
    }

    checkPermission() {
        return this.apiClient.get('access-subject');
    }

    enable(id) {
        return this.apiClient.post(`access-subject-tokens/${id}/enable`);
    }

    disable(id) {
        return this.apiClient.post(`access-subject-tokens/${id}/disable`);
    }
}
