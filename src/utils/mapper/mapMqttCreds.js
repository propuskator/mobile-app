export function mapMqttCred(cred) {
    const { username, password, syncMaxDelay, syncResetTimeout } = cred;

    return {
        password,
        username,
        syncMaxDelay     : syncMaxDelay || 10000,
        syncResetTimeout : syncResetTimeout || 1000
    };
}
