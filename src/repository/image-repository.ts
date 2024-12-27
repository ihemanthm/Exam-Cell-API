import CrudRepository from "./crud-repository";
const ImageRepository={
    async getImageById(data:string){
        
        try{
            const response=await CrudRepository.imageBy(data);
            return response;
        }catch(error)
        {
            throw error;
        }
    }
}

export default ImageRepository;