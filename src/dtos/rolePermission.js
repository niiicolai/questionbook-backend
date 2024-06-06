
export default (rolePermission) => {
    return {
        id: rolePermission.id,
        permissionName: rolePermission.permissionName,
        roleName: rolePermission.roleName,
    }
}
