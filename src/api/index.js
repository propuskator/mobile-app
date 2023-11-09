import ApiClient        from './ApiClient';
import UsersAPI         from './Users';
import SessionsAPI      from './Sessions';
import AccessPointsAPI  from './AccessPoints';
import SubjectTokensAPI from './SubjectTokens';
import ReaderGroupsAPI  from './ReaderGroups';
import IssuesAPI        from './Issues';

export default function apiConstruct({ apiUrl, prefix, onError, onNetworkError, onConnectionError, onTimeoutError }) {
    if (!apiUrl) {
        throw new Error('[apiUrl] required');
    }

    const apiClient = new ApiClient({
        apiUrl,
        prefix,
        onError,
        onNetworkError,
        onConnectionError,
        onTimeoutError
    });

    return {
        apiClient,
        users         : new UsersAPI({ apiClient }),
        sessions      : new SessionsAPI({ apiClient }),
        accessPoints  : new AccessPointsAPI({ apiClient }),
        subjectTokens : new SubjectTokensAPI({ apiClient }),
        readerGroups  : new ReaderGroupsAPI({ apiClient }),
        issues        : new IssuesAPI({ apiClient })
    };
}
