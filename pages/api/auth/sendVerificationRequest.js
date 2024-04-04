import EmailLibrary from '@/lib/emailer';
import {allowedEmails, allowedDomains} from "@/lib/allow-emails";
import {addSubscriber, sendTransactionEmail} from "@/lib/listmonk";
import prisma from "@/lib/prisma";

async function sendVerificationRequest(
    {
        identifier: email,
        url,
        provider: { server, from },
    }) {

    const { host } = new URL(url)

    const emailDomain = email.split('@')[1];

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    // if (!(allowedEmails.includes(email) || allowedDomains.includes(emailDomain) || existingUser)) {
    //     throw new Error("User not exist")
    // }

    const data = {
        email: email,
        url: url
    };

    try {
        if (existingUser){
            try {
                await sendTransactionEmail('login', email, data)
            } catch {
                await EmailLibrary.sendEmail('login', email, data);
            }
        }
        else {
            await EmailLibrary.sendEmail('login', email, data);
        }
    } catch (error) {
        console.error('Failed to send login email:', error);
        throw new Error(`Email delivery failed. Try again later.`)
    }
}

export default sendVerificationRequest;