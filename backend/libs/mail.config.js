import nodemailer from 'nodemailer'

export const transport = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"fndrfcscnhcgfn@gmail.com",
        pass:"ctsj dmed kdaq rqac"
    }
})

