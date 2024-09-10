import { ImageRepository } from "../repository";
const imagesServices={
    async getImageById(data:any)
    {
        try{
            const response= await ImageRepository.getImageById(data);
            if(!response)
            {
                return null;
            }
            return {
                image: `http://localhost:8000/uploads/images/${data}.png` // Construct the image URL
            };
        }catch(error)
        {
            throw error;
        }
    }
}
export default imagesServices;