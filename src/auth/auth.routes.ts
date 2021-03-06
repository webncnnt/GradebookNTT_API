import { getUserByToken } from './auth.middleware';
import { findUserById, createUser } from './users.model';
import { register, login, changePassWord, resetPassword, activateAccount } from './auth.controllers';
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
    const { token }  = req.body;

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
		res.json(result)
	}).catch((err) => {
		console.log("Cannot create new user");
		
	});

})

router.post('/forgot', (req, res)=>{
	const email = req.body.email;
	resetPassword(email).then((result) => {
		if(result){
			res.status(200).json({
				message: 'Reset password successfully.'
			})
		}
		else{
			res.status(404).json({
				message: `Email doesn't exist!`
			})
		}
	}).catch((err) => {
		console.log(err);
		
		res.status(500).json({
			message: 'Error internal server'
		})
	});
})

router.get('/getUserByToken/:token', (req, res) =>{
	const token = req.params.token;
	getUserByToken(token).then((result) => {
		if(result == null || result == undefined)	res.status(400).json({ message: "Token is invalid!!"})
		else{

			res.status(200).json(
				{"user" : result.payload}
			)

		}
	
	}).catch((err) => {

		res.status(500).json({ message: "error at internal server"})
		console.log("error get User by token");
		
	});
})

router.get('/activate/:token', async(req, res)=>{
	const token = req.params.token;
	const result = await activateAccount(token);
	if(result){
		res.status(200).send(`<h2>Activated account successfully.</h2>`)
	}
	else{
		res.status(400).send('<h2>Error activating account!</h2>')
	}
})
export default router;
