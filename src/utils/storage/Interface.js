import Storage            from '../AsyncStorage';

export async function setHideGroupsToStorage(hideGroups) {
    await Storage.setItem('HIDE_GROUPS', hideGroups);
}

export async function getHideGroupsFromStorage() {
    let hideGroups = await Storage.getItem('HIDE_GROUPS');

    if (![ true, false ]?.includes(hideGroups)) hideGroups = false;

    return !!hideGroups;
}
