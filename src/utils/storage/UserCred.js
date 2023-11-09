import Storage  from '../AsyncStorage';

export async  function getUserCredsFromStorage() {
    const email = await Storage.getItem('email') || '';
    const workspace = await Storage.getItem('workspace') || '';

    return { workspace, email };
}

// export async  function setUserCredsToStorage({ email, workspace }) {
//     await Storage.setItem('workspace', workspace);
//     await Storage.setItem('email', email);
// }
