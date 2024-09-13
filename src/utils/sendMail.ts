import { text } from 'body-parser';
import nodemailer from 'nodemailer';

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:
    {
        user:"asifsayyad200483@gmail.com",
        pass:'ijjcgkfmlenayajg'
    },
});

async function sendMail(OTP:number) 
{
    const mailOptions={
        from:"coe@gmail.com",
        to:["asifbasha4873@gmail.com","rr200483@rguktrkv.ac.in"],
        subject:"OTP Authentication",
        text:`OTP authentication of OTP ${OTP}`
    };
    await transporter.sendMail(mailOptions,(error,info)=>
    {
        if(error)
        {
            return console.log(error);
        }
        return console.log(info.response);
    });
}
export default sendMail;



