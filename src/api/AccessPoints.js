import Base from './Base.js';

export default class AccessPointsAPI extends Base {
    list() {
        return this.apiClient.get('access-token-readers');
    }

    open({ id }) {
        return this.apiClient.post(`access-token-readers/${id}/open`);
    }

    save(points) {
        return this.apiClient.post('access-token-readers/saveOrder', points);
    }

    rename(payload) {
        return this.apiClient.put('access-token-readers', payload);
    }

    updateOrderInGroup(groupId, payload) {
        return this.apiClient.post(`access-token-readers/group/${groupId}/saveOrder`, payload);
    }
}
