import UploadService from "../services/uploadService.js";

const uploadService = new UploadService({ path: 'uploads' });

async function putProtection(req, res, next) {
    const { sub: userId } = req.user;
    const { file } = req;
    const { type, uuid } = req.params;

    try {
        const filename = uploadService.filename(file, uuid, userId, type);
        const details = await uploadService.find(filename);
        if (!details) next(); // If the file does not exist, it is a new file.
        else {
            // If the file exists, check if the user is the owner.
            const { ownerId } = details;
            if (ownerId !== userId) {
                res.status(403).json('Forbidden');
                return;
            }
        }
    } catch (error) {
        res.status(404).json('Not found');
        return;
    }

    next();
}

async function deleteProtection(req, res, next) {
    const { sub: userId } = req.user;
    const { filename } = req.params;

    try {
        const { ownerId } = await uploadService.find(filename);
        if (ownerId !== userId) {
            res.status(403).json('Forbidden');
            return;
        }
    } catch (error) {
        res.status(404).json('Not found');
        return;
    }

    next();
}

export default  {
    putProtection,
    deleteProtection
}