import { StudentRepository } from "../repository";

const studentServices={
    async getStudentById(data:String)
    {
        try{
            const response= StudentRepository.getStudentById(data);
            return response;
        }
        catch(error)
        {
            throw error;
        }
    },
    async getAllStudentsByBatch(batch:string)
    {
        try{
            const response=StudentRepository.getAllStudentsByBatch(batch);
            return response;
        }catch(error)
        {
            throw error;
        }
    }
}

export default studentServices;