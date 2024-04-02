import jwt from 'jsonwebtoken';

export const verify = async (req, res, next) => {
    const accessToken = req.cookies.accessToken; 

    if (!accessToken) {
        return res.status(401).json({ message: 'No access token found' });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        req.email = decoded.email;
        res.status(200)
        next();
    } catch (error) {
        console.error("Error in verify:", error);
        return res.status(401).json({ message: "Invalid Access Token" });
    }
};