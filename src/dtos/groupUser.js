
export default (groupUser) => {
    return {
        id: groupUser.id,
        userId: groupUser.userId,
        groupId: groupUser.groupId,
        roleName: groupUser.roleName,
    }
}
