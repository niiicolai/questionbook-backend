
export default (comment) => {
    return {
        id: comment.id,
        description: comment.description,
        answerId: comment.answerId,
        userId: comment.userId,
        username: comment.user_username,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
    }
}
