import userdb from '../model/userSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userdb.findOne({ email });
        if (user) {
            return res.status(200).send({ 'msg': 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userdb({
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(200).send({ message: 'Password saved', state: true });
    } catch (error) {
        console.error("Error in signin:", error);
        return res.status(500).json({ message: "Internal server error" }); // Handle error gracefully
    }
};

export const l = async (req, res) => {
    const { email, password } = req.body;

    try {
        const exist = await userdb.findOne({ email });

        if (!exist) {
            return res.status(404).send({ 'msg': 'User not found!' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, exist.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign({ email: exist.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1m" });
        const refreshToken = jwt.sign({ email: exist.email }, process.env.JWT_SECRET_KEY, { expiresIn: "30min" });

        res.cookie('accessToken', accessToken, { maxAge: 60000 });
        res.cookie('refreshToken', refreshToken, { maxAge: 1800000, httpOnly: true, secure: true, sameSite: 'strict' });

        return res.status(200).json({ message: "Successfully logged in " });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};