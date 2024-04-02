// refreshToken.js
import jwt from 'jsonwebtoken';

export const refresh = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token found' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        const accessToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET_KEY, { expiresIn: "30m" });
         res.cookie('accessToken', accessToken, { maxAge: 1800000 });
        res.status(200);
         next();
    } catch (error) {
        console.error("Error in refresh:", error);
        return res.status(401).json({ message: "Invalid Refresh Token" });
    }
};