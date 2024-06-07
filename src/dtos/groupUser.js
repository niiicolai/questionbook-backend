
export default (groupUser) => {
    return {
        id: groupUser.id,
        userId: groupUser.userId,
        groupId: groupUser.groupId,
        roleName: groupUser.roleName,
        username: groupUser.user_username,
        createdAt: groupUser.createdAt,
        updatedAt: groupUser.updatedAt,
    }
}
