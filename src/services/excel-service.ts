import excelRepository from "../repository/excel-repository";

const excelServices={
    async uploadExcelFile(data:{})
    {
        try{
            return await excelRepository.uploadExcelFile(data);
        }catch(error)
        {
            throw error;
        }
    }
}
export default excelServices;