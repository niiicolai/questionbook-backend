
export default {
    roles: [
        {
            name: 'System Administrator',
            description: 'A system administrator'
        },
        {
            name: 'User',
            description: 'A user of the application'
        },
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
        {
            name: 'group:bypass:membership',
            description: 'View all groups even if they are not members'
        },
        {
            name: 'question:bypass:ownership',
            description: 'Modify any question even if you are not the owner'
        },
        {
            name: 'answer:bypass:ownership',
            description: 'Modify any answer even if you are not the owner'
        },
        {
            name: 'comment:bypass:ownership',
            description: 'Modify any comment even if you are not the owner'
        },
    ],
    rolePermissions: [
        {
            roleName: 'System Administrator',
            permissionName: 'group:update'
        },
        {
            roleName: 'System Administrator',
            permissionName: 'group:delete'
        },
        {
            roleName: 'System Administrator',
            permissionName: 'group:bypass:membership'
        },
        {
            roleName: 'System Administrator',
            permissionName: 'question:bypass:ownership'
        },
        {
            roleName: 'System Administrator',
            permissionName: 'answer:bypass:ownership'
        },
        {
            roleName: 'System Administrator',
            permissionName: 'comment:bypass:ownership'
        },
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
            username: process.env.DEFAULT_ADMIN_USERNAME,
            email: process.env.DEFAULT_ADMIN_EMAIL,
            password: process.env.DEFAULT_ADMIN_PASSWORD,
            roleName: 'System Administrator'
        },
        {
            username: process.env.DEFAULT_USER_USERNAME,
            email: process.env.DEFAULT_USER_EMAIL,
            password: process.env.DEFAULT_USER_PASSWORD,
            roleName: 'User'
        },
    ],
    groups: [
        {
            name: 'Group 1',
            description: 'Description 1',
            coverUrl: 'https://via.placeholder.com/150',
            isPrivate: false
        },
        {
            name: 'Group 2',
            description: 'Description 2',
            coverUrl: 'https://via.placeholder.com/150',
            isPrivate: true
        },
    ],
    groupUsers: [
        {
            userId: 2,
            groupId: 1,
            roleName: 'Group Owner'
        },
        {
            userId: 1,
            groupId: 1,
            roleName: 'Group Member'
        },
        {
            userId: 1,
            groupId: 2,
            roleName: 'Group Owner'
        },
        {
            userId: 2,
            groupId: 2,
            roleName: 'Group Member'
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
        {
            title: 'Question 3',
            description: 'Body 3',
            userId: 2,
            groupId: 2
        }
    ],
    answers: [
        {
            description: 'Answer 1',
            userId: 2,
            questionId: 1
        },
        {
            description: 'Answer 2',
            userId: 2,
            questionId: 1
        },
        {
            description: 'Answer 3',
            userId: 1,
            questionId: 2
        }
    ],
    comments: [
        {
            description: 'Comment 1',
            userId: 2,
            answerId: 1
        },
        {
            description: 'Comment 2',
            userId: 2,
            answerId: 1
        },
        {
            description: 'Comment 3',
            userId: 1,
            answerId: 2
        }
    ]
}
