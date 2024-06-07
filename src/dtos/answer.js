
export default (answer) => {
    return {
        id: answer.id,
        description: answer.description,
        questionId: answer.questionId,
        userId: answer.userId,
        username: answer.user_username,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
    }
}
