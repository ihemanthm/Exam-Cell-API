import { StudentRepository } from "../repository";

const studentServices={
    async getPUCDetails(data:string)
    {
        try{
            const response= StudentRepository.getPUCDetails(data);
            return response;
        }
        catch(error)
        {
            return error;
        }
    },

    async getEnggDetails(data:string)
    {
        try{
            const response= StudentRepository.getEnggDetails(data);
            return response;
        }
        catch(error)
        {
            return error;
        }
    },
    async getPUCDetailsByBatch(batch:string)
    {
        try{
            const response=StudentRepository.getPUCDetailsByBatch(batch);
            return response;
        }catch(error)
        {
            return error;
        }
    },
    async getEnggDetailsByBatch(batch:string)
    {
        try{
            const response=StudentRepository.getEnggDetailsByBatch(batch);
            return response;
        }catch(error)
        {
            return error;
        }
    }
}

export default studentServices;