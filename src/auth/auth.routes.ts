import { findUserById, createUser } from './users.model';
import { register, login, changePassWord } from './auth.controllers';
import { config } from '@src/config';
import express from 'express';
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.CLIENT_ID);

router.post('/register', (req, res, next) => {
	const fullname = req.body.fullname;
	const email = req.body.email;
	const password = req.body.password;

	register(fullname, email, password).then(result => {
		if (result) {
			res.json({
				message: 'register successfully.'
			});
		} else {
			res.status(409).json({
				message: 'Email already exists'
			});
		}
	});
});

router.post('/login', (req: any, res: any, next: any) => {
	const email = req.body.email;
	const password = req.body.password;

	login(email, password).then(result => {
		if (result == null) {
			res.status(401).json({
				message: 'Email or Password is not correct'
			});
		} else {
			req.user = result.user;
			res.json(result);
		}
	});
});

router.post('/changePwd/:id', (req, res, next) => {
	const id = req.params.id;
	const newPass = req.body.newPass;
	const oldPass = req.body.oldPass;


	changePassWord(parseInt(id), oldPass, newPass)
		.then(result => {
			if(result){

				res.json({
					message: 'Change password successfully.'
				});
			}
			else{
				res.status(400).json({
					message: `New password does not match the old password!`
				});
			}
		
		})
		.catch(err => {
			res.status(500).json({
				message: 'Internal Server Error! '
			});
		});
});


router.post("/google", async (req, res) => {
    const { token }  = req.body.tokenId

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.CLIENT_ID
    });

	if(!ticket){
		res.status(401)
			.json({
                message: "tokenId is invalid or expired!",
               
            });
	}
    const { name, email} = ticket.getPayload();    
	await createUser(name, email, "").then((result) => {
		res.json({
			name: name,
			email: email
		})
	}).catch((err) => {
		console.log("Cannot create new user");
		
	});
    // const user = await db.user.upsert({ 
    //     where: { email: email },
    //     update: { name, picture },
    //     create: { name, email, picture }
    // })
    // res.status(201)
    // res.json(user)
})
export default router;
