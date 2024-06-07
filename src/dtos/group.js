
export default (group) => {
    return {
        id: group.id,
        name: group.name,
        description: group.description,
        coverUrl: group.coverUrl,
        isPrivate: group.isPrivate,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
    }
}
