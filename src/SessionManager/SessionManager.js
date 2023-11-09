import Storage               from '../utils/AsyncStorage';
import api                   from '../apiSingleton';

import toast                 from '../utils/Toast';
import { setAppUrls }        from '../utils/urlSettings';
import i18n                  from '../utils/i18n';
import config from '../config';

class SessionManager {
    constructor() {
        this.initialActiveUser = {
            email     : '',
            avatarUrl : '',
            url       : '',
            workspace : '',
            jwt       : ''
        };

        this.sessions   = {};
        this.activeUser = this.initialActiveUser;
    }

    async init(isAppOpenByDeepLink) {
        const sessionsData = await this.getUsersDataFromStorage() || {};
        const activeUser   = await this.getActiveUserFromStorage();
        const jwt          = await Storage.getItem('jwt') || '';
        const email        = await Storage.getItem('email') || '';
        const workspace    = await Storage.getItem('workspace') || '';
        const apiUrl       = await Storage.getItem('apiUrl') || config.API_URL;


        if (jwt) Storage.setItem('jwt', null);
        if (email) Storage.setItem('email', null);
        if (workspace) Storage.setItem('workspace', null);

        api.apiClient.setToken(jwt);
        this.sessions   = sessionsData;
        this.activeUser = activeUser
            ? {
                ...activeUser,
                email           : activeUser.email || '',
                avatarUrl       : activeUser.avatarUrl || '',
                url             : activeUser.url || apiUrl,
                workspace       : activeUser.workspace || '',
                jwt             : activeUser.jwt || '',
                isAuthenticated : null
            }
            : {
                jwt,
                workspace,
                email,
                url             : apiUrl,
                isAuthenticated : null
            };

        // if (!this.activeUser?.jwt) NavigationHelper.navigate(screens.LOGIN);
        const isInitSessionData = this.activeUser.userId && (Object.keys(sessionsData).length === 0 || !sessionsData);

        if (isInitSessionData) this.initSessionsData();
        if (!isAppOpenByDeepLink) setAppUrls(this.activeUser.url);
    }

    setActiveUserToStorage = async (userData) => Storage.setItem('activeUser', userData);
    getActiveUserFromStorage  = async () => Storage.getItem('activeUser');

    setUsersDataToStorage = async (availableUsers) => Storage.setItem('AVAILABLE_USERS', availableUsers);
    getUsersDataFromStorage = async () => Storage.getItem('AVAILABLE_USERS');

    initSessionsData = () => {
        const { url, userId, workspace, email, avatarUrl, jwt } = this.activeUser;
        const id = this.constructUnicId({ userId, workspace });
        const dumpedUserData = {
            email,
            avatarUrl : avatarUrl || '',
            workspace,
            url,
            id,
            jwt
        };


        this.addNewUser({ url, id, dumpedUserData  });
    }

    async setActiveUser(userData) {
        api.apiClient.setToken(userData.jwt);

        this.activeUser = userData;

        await this.setActiveUserToStorage(this.activeUser);

        const newUsersData = {
            ...this.sessions,
            [userData?.url] : {
                ...this.sessions[userData?.url],
                [userData?.id] : userData
            }
        };

        setAppUrls(this.activeUser.url);
        await this.setUsersDataToStorage(newUsersData);

        if (this.getSessions().length > 0 && this.activeUser.isAuthenticated) {
            setTimeout(() => toast.show(i18n.t('SwitchTitle', { workspace: this.activeUser.workspace }), 5), 100);
        }
    }


    getActiveUser() {
        return this.activeUser;
    }


    getSessions() {
        return Object
            .values(this.sessions)
            .map(dataByUrl =>  Object.values(dataByUrl))
            .flat();
    }


    isMultiUserEnabled() {
        const sessionslist = this.getSessions();

        return !!sessionslist.length;
    }


    async addNewUser({ url, id, dumpedUserData }) {
        await this.setActiveUser({
            ...dumpedUserData,
            isAuthenticated : true
        });
        const newData = {
            ...this.sessions,
            [url] : {
                ...this.sessions[url],
                [id] : dumpedUserData
            }
        };


        this.sessions = newData;

        await this.setUsersDataToStorage(newData);
    }


    async removeUser({ url, id }) {
        const isUserAuthenticated = this.getDataByUser({ id, url });

        if (isUserAuthenticated) {
            if (Object.values(this.sessions[url])?.length > 1) {
                delete this.sessions[url][id];
            } else delete this.sessions[url];
        }

        await this.setUsersDataToStorage(this.sessions);
    }


    async logoutWithAccountSwitch(isBiometricAvailable) {
        const { url, id } = this.activeUser;
        const usersArray = this.getSessions();


        if (usersArray.length > 1) {
            const currentUserInndex = usersArray.findIndex(user => user.id === id);
            const lastUserIndex = usersArray.length - 1;

            let userToSwitch;

            if (lastUserIndex > currentUserInndex)  userToSwitch = usersArray[currentUserInndex + 1];
            else userToSwitch = usersArray[currentUserInndex - 1];


            await this.removeUser({ url, id });
            this.setActiveUser({
                ...userToSwitch,
                isAuthenticated : false
            });

            return  {
                user   : userToSwitch,
                isLast : false
            };
        }
        await this.removeUser({ url, id });
        this.logout(isBiometricAvailable);

        return {
            user   : this.activeUser,
            isLast : true
        };
    }


    async logout(isBiometricAvailable) {
        if (isBiometricAvailable) {
            await this.setActiveUser(
                {
                    ...this.activeUser,
                    isAuthenticated : false
                }
            );
        } else {
            await this.setActiveUser({
                ...this.activeUser,
                jwt             : '',
                isAuthenticated : false
            });
            Storage.setItem('jwt', '');
        }
    }

    constructUnicId({ userId, workspace }) {
        return `${userId}/${workspace}`;
    }


    getDataByUser({ id, url }) {
        const isUrlExist  = this.sessions[url];

        if (isUrlExist) {
            const userData = this.sessions[url][id];

            if (userData) return userData;
        }

        return null;
    }


    async authenticateUser({ data, url }) {
        const {  workspace, email, jwt } = data;
        const dumpedUserData = {
            email,
            avatarUrl : '',
            url,
            workspace,
            jwt
        };

        await this.setActiveUser(dumpedUserData);
        this.activeUser.isAuthenticated = true;
    }

    async authenticateMultiUser({ data, url }) {
        const { userId, workspace, email, avatarUrl, jwt } = data;

        if (!(userId && workspace && url)) throw new Error('DATA_REQUIRED', 'Id and workspace are required');

        const id = this.constructUnicId({ userId, workspace });
        const isUserWasAuthenticated = !!this.getDataByUser({ id, url });

        const dumpedUserData = {
            email,
            avatarUrl : avatarUrl || '',
            workspace,
            url,
            id,
            jwt
        };

        if (isUserWasAuthenticated) {
            await this.setActiveUser({
                ...dumpedUserData,
                isAuthenticated : true
            });
            this.updateUsedDataById({
                id,
                url,
                dataToUpdate : dumpedUserData
            });
        } else  await this.addNewUser({ url, id, dumpedUserData });
    }

    updateUsedDataById({ id, url, dataToUpdate }) {
        const userData = this.getDataByUser({ id, url });

        if (userData) {
            const newData = {
                ...this.sessions,
                [url] : {
                    ...this.sessions[url],
                    [id] : {
                        ...userData,
                        ...dataToUpdate

                    }
                }
            };

            this.sessions = newData;
        } else this.addNewUser({ url, id, dumpedUserData: dataToUpdate });
    }


    async checkSessionSuccess(data) {
        const { jwt } = data;

        this.activeUser = {
            ...this.activeUser,
            ...data
        };
        api.apiClient.setToken(jwt);

        await this.setActiveUserToStorage(this.activeUser);

        const isInitSessionData = data.userId && (Object.keys(this.sessions).length === 0);

        if (this.activeUser.id) {
            this.updateUsedDataById({
                id           : this.activeUser.id,
                url          : this.activeUser.url,
                dataToUpdate : this.activeUser
            });
        } else if (isInitSessionData) this.initSessionsData();
        this.activeUser.isAuthenticated = true;
    }


    async changeUserSuccess({ user }) {
        this.setActiveUser(user);
        this.activeUser.isAuthenticated = true;


        if (this.activeUser.id) {
            this.updateUsedDataById({
                id           : this.activeUser.id,
                url          : this.activeUser.url,
                dataToUpdate : user
            });
        }
    }

    async discardUserChange(user) {
        this.setPreviousSettings();
        await this.removeUser({ url: user.url, id: user.id });
    }

    // async changeUser({ id, url }) {
    //     const data = this.getDataByUser({ id, url });

    //     if (data) {
    //         await this.setActiveUser(data);
    //     }
    // }


    checkSessionError() {
        this.activeUser.isAuthenticated = false;
    }

    setPreviousSettings() {
        const activeUser = this.getActiveUser();

        setAppUrls(activeUser.url);
    }
}

export default SessionManager;

function Error(code, message) {
    this.message = message;
    this.code = code;
}
