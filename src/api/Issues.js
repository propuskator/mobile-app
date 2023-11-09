import Base from './Base.js';

export default class IssuesAPI extends Base {
    send(payload) {
        return this.apiClient.post('reported-issues', payload);
    }
}
