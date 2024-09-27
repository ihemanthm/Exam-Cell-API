import { certificateRepository } from "../repository/index";

const certificateServices={
    async updatePUCIssuedDate(data:{})
    {
        try
        {
            const response=await certificateRepository.updatePUCIssuedDate(data);
            return response;
        }catch(error)
        {
            return error;
        }
    },
    async updateEnggIssuedDate(data:{})
    {
        try
        {
            const response=await certificateRepository.updateEnggIssuedDate(data);
            return response;
        }catch(error)
        {
            return error;
        }
    }
}

export default certificateServices;