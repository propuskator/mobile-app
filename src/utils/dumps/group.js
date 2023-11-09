export function dumpGroup(group) {
    return {
        name                 : group?.name,
        logoType             : group?.logo,
        logoColor            : group?.logoColor,
        accessTokenReaderIds : group?.accessPoints?.length ? group?.accessPoints : void 0
    };
}
