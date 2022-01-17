import { ClassInvitation } from '@src/models/ClassInvitation';
import { UserClass } from '@src/models/UserClass';

import { GradeAssignment } from '@src/models/GradeAssignment';
import { Notification } from '@src/models/Notification';
import { Class } from '@src/models/Class';
import db from '@src/db';

//notifyMessage!: string;
//	receiverId!: number;
//	senderId!: number;
export const createNotification = (
	notifyMessage: string,
	senderId: number,
	receiverId: number
) => {
	Notification.create({
		notifyMessage: notifyMessage,
		receiverId: receiverId,
		senderId: senderId
	});
};

export const findIdTeachersByClassId = async (classId: number) => {
	const strquery = `select I."inviterId" from "class_invitations" as I where "classId" = ${classId} and "role" = 1`;
	const Ids: any = await db.query(strquery);

	// const Ids: any = await ClassInvitation.findAll({
	// 	attributes:['inviterId'],
	// 	where:{
	// 		classId: classId,
	// 		role: 1
	// 	}
	// })
	const result = [];
	if (Ids == null || Ids == undefined) {
		return [];
	}

	for (let i = 0; i < Ids[0].length; i++) {
		result.push(Ids[0][i].inviterId);
	}
	return result;
};

export const findOwnerOfClassId = async (classId: number) => {
	const owner: any = await Class.findOne({
		attributes: ['ownerId'],
		where: {
			id: classId
		}
	});

	return owner.dataValues.ownerId;
};

export const findAllNotify = async (userId: number) =>{
	const notitication = await Notification.findAll({
		where: {
			receiverId: userId
		}
	})

	return notitication;
}