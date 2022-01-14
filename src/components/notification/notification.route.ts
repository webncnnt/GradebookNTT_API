import { findAllNotify } from './notification.model';
import express from 'express'
const NotificationRouter = express.Router();

//get all of notifications at reveiverId
NotificationRouter.get('/notificationsOfUser/:userId', async(req, res) =>{

    const userId = req.params.userId;
    const result = await findAllNotify(parseInt(userId));
    res.status(200).json(result);
})

export default NotificationRouter