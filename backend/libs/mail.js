import { Verification_Email_Template } from "./emailtemplate.js";
import { transport } from "./mail.config.js";

export const sendcode = async (email, verificationOtp) => {
    try {
        const response = await transport.sendMail({
            from:'"VOID"<fndrfcscnhcgfn@gmail.com>',
            to:email,
            subject:"verify your email",
            text:"verify your email",
            html:Verification_Email_Template.replace("{verificationCode}",verificationOtp)
        })
        console.log('Email sent successfully to:', email, 'Message ID:', response.messageId)
        return response
    } catch (error) {
        console.error('Error sending email to', email, ':', error.message)
        throw error
    }
}

