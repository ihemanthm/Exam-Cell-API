import pucExcelRepository from "../repository/puc-excel-repository";

const pucExcelServices={
    async uploadExcelFile(data:{})
    {
        try{
            return await pucExcelRepository.uploadExcelFile(data);
        }catch(error)
        {
            throw error;
        }
    }
}
export default pucExcelServices;