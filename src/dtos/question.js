
export default (question) => {
    return {
        id: question.id,
        title: question.title,
        description: question.description,
        userId: question.userId,
        groupId: question.groupId,
        username: question.user_username,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
    }
}
