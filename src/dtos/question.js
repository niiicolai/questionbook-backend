
export default (question) => {
    return {
        id: question.id,
        title: question.title,
        description: question.description,
        userId: question.userId,
        groupId: question.groupId
    }
}
