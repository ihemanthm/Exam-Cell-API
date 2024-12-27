import { enggExcelRepository } from "../repository/index";
const enggExcelServices={

    async uploadExcelFile(data:{}){
        
        try{
            return await enggExcelRepository.uploadExcelFile(data);
        }catch(error)
        {
            return error;
        }
    }
}
export default enggExcelServices;