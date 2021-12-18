import { Student } from "@src/models/Student";

export const saveStudent = async (studentId: string, studentName:string, userId: number) =>{

   Student.create({
       fullName: studentName,
       studentId: studentId,
       userId: userId,
   });
}