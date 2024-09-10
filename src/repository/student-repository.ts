import Record from "../models/PUC_RECORDS";
import CrudRepository from "./crud-repository";
const StudentRepository=
{
    async getStudentById(data:String)
    {
        try{
            const response=await CrudRepository.findBy(Record,data);
            return response;
        }catch(error)
        {
            throw error;
        }
    },
    async getAllStudentsByBatch(batch:String)
    {
        try{
            const response=await CrudRepository.findAllBy(Record,batch);
            return response;
        }catch(error)
        {
            throw error;
        }
    },
}

export default StudentRepository;