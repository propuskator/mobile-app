const STATUS_MAP = {
    'DISCONNECTED' : 'disconnected',
    'ACTIVE'       : 'active',
    'INACTIVE'     : 'inactive'
};

export function mapAccessPoint(accessPoint) {
    const {
        id,
        code,
        name,
        stateStatus,
        connectionStatus,
        enabled,
        isArchived,
        accessCamera,
        phone,
        displayedTopics
    } = accessPoint;

    return {
        id,
        code,
        name,
        status       : STATUS_MAP[stateStatus],
        statusColor  : connectionStatus?.color,
        enabled,
        phone,
        isArchived,
        displayedTopics,
        accessCamera : {
            isShowCameraIcon : !!accessCamera?.rtspUrl,
            cameraStatus     : accessCamera?.status,
            rtspUrl          : accessCamera?.rtspUrl,
            poster           : accessCamera?.poster
        }
    };
}
