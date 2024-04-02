import express from 'express';
import {l, signin } from '../controllers/auth-controllers.js';
import bodyParser from 'body-parser'; 
import {verify} from '../middleware/verfiyToen.js';
import {refresh} from '../middleware/refreshToken.js';
const router = express.Router();
router.use(bodyParser.json());
router.post('/signup',signin);
router.post('/l',l);
router.get('/refresh',refresh,verify, (req, res) => {
    // Example implementation of the /api/user endpoint
    res.status(200).json({ message: 'User data retrieved successfully', user: req.user });
})
router.get('/user', verify, (req, res) => {
    // Example implementation of the /api/user endpoint
    res.status(200).json({ message: 'User data retrieved successfully', user: req.user });
});
export default router;

  

 

