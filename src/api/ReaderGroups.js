import Base from './Base.js';

export default class ReadersGroupsAPI extends Base {
    list() {
        return this.apiClient.get('access-reader-groups');
    }

    create(payload) {
        return this.apiClient.post('access-reader-groups', payload);
    }

    update(id, payload) {
        return this.apiClient.patch(`access-reader-groups/${id}`, payload);
    }

    getLogos() {
        return this.apiClient.get('access-reader-groups/logos');
    }

    show(id) {
        return this.apiClient.get(`access-reader-groups/${id}`);
    }

    delete(id) {
        return this.apiClient.delete(`access-reader-groups/${id}`);
    }
}
