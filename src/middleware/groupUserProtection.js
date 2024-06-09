import GroupMemberService from "../services/groupMemberService.js";

const groupMemberService = new GroupMemberService();

export default async function groupUserProtection(req, res, next) {
    const { sub: userId } = req.user;
    const { id: groupUserId } = req.params;
    console.log(userId, groupUserId);
    try {
        console.log(userId, groupUserId);
        const isMember = await groupMemberService.isPartOfGroup(userId, groupUserId);
        if (!isMember) {
            res.status(403).json('Forbidden');
            return;
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(403).json('Forbidden');
    }
}
