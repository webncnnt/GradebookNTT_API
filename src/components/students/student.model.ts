
import { Class } from "@src/models/Class";
import { GradeAssignment } from "@src/models/GradeAssignment";
import { Student } from "@src/models/Student";
import database from '@src/db';



export const saveStudent = async (studentId: string, studentName:string, userId: number, classId: number) =>{

   Student.create({
       fullName: studentName,
       studentId: studentId,
       userId: userId,
       classId: classId
   });
}

export const findStudentsByClassId = async (classId: number) =>{
    const result = await Student.findAll({
        where:{
            classId: classId,
        }
    })

    return result;
}

export const findAssignmentById = async (id: number) =>{
    const result = await GradeAssignment.findOne({
        where:{
            id: id
        }
    })

    return result;
}

export const findClassNameByClassId = async(id: number) =>{
    const result = await Class.findOne({
        where: {
            id: id
        }
    })
    if(result != null)
        return result.clsName;
    return null;
}
export const findEmailStudentByClassId = async(id: number) =>{
    const strQuery = `select u."email" from "Users" as u, "Students" as s where s."userId" is not null
    and s."classId" = ${id}
    and u.id = s."userId" `
    const result = await database.query(strQuery);
    const emails: any = result[0];

    const emailList = [];
    for(var i = 0; i < emails.length; i++){
        emailList[i] = emails[i].email;
    }
    return emailList;

}

export const deleteDataStudent = () =>{
    const strQuery = `delete from "Students"`;
    database.query(strQuery)
}
