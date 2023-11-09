export function dumpUser(user) {
    const isUserDataExist = user.hasOwnProperty('id') &&
    (user.hasOwnProperty('workspaceAvatar') || user.hasOwnProperty('avatar'));


    return {
        jwt : user.jwt,
        ...(user.email) ? { email: user.email } : {},
        ...(user.workspaceAvatar) ? { avatarUrl: user.workspaceAvatar } : {},
        ...(user.workspace) ? { workspace: user.workspace } : {},
        ...(user.id) ? { userId: user.id } : {},
        isUserDataExist
    };
}
