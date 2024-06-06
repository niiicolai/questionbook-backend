
export default {
    roles: [
        {
            name: 'Group Owner',
            description: 'The owner of a group'
        },
        {
            name: 'Group Member',
            description: 'A member of a group'
        },
    ],
    permissions: [        
        {
            name: 'group:update',
            description: 'Update a group'
        },
        {
            name: 'group:delete',
            description: 'Delete a group'
        },
    ],
    rolePermissions: [
        {
            roleName: 'Group Owner',
            permissionName: 'group:update'
        },
        {
            roleName: 'Group Owner',
            permissionName: 'group:delete'
        },
    ],
    users: [
        {
            username: process.env.DEFAULT_USER_USERNAME,
            email: process.env.DEFAULT_USER_EMAIL,
            password: process.env.DEFAULT_USER_PASSWORD
        },
    ],
    groups: [
        {
            name: 'Group 1',
            description: 'Description 1',
            coverUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'Group 2',
            description: 'Description 2',
            coverUrl: 'https://via.placeholder.com/150',
        },
    ],
    groupUsers: [
        {
            userId: 1,
            groupId: 1,
            roleName: 'Group Owner'
        },
    ],
    questions: [
        {
            title: 'Question 1',
            description: 'Body 1',
            userId: 1,
            groupId: 1
        },
        {
            title: 'Question 2',
            description: 'Body 2',
            userId: 1,
            groupId: 1
        },
    ],
    answers: [
        {
            description: 'Answer 1',
            userId: 1,
            questionId: 1
        },
        {
            description: 'Answer 2',
            userId: 1,
            questionId: 1
        },
    ],
    comments: [
        {
            description: 'Comment 1',
            userId: 1,
            answerId: 1
        },
        {
            description: 'Comment 2',
            userId: 1,
            answerId: 1
        },
    ]
}
