// emailLibrary.js
import nodemailer from 'nodemailer';
import {baseEmail} from "./email-templates/base";
import {loginEmail} from "./email-templates/login";

class EmailLibrary {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        this.baseTemplate = baseEmail;
    }

    async sendEmail(emailType, recipient, data) {
        try {
            const {subject, content} = await this.buildEmailContent(emailType, data);
            const mailOptions = {
                from: process.env.DEFAULT_FROM_EMAIL,
                to: recipient,
                subject: subject,
                html: content,
            };
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Failed to send email:', error);
            throw new Error('Failed to send email');
        }
    }

    async buildEmailContent(emailType, variables) {
        try {
            let emailTemplate;
            switch (emailType) {
                case 'login':
                    emailTemplate = loginEmail;
                    break;
                default:
                    new Error(`Email template not found for type: ${emailType}`);
            }

            return { subject: emailTemplate.subject, content: this.mergeTemplateWithData(emailTemplate, variables)};
        } catch (error) {
            console.error('Failed to build email content:', error);
            throw new Error('Failed to build email content');
        }
    }

    mergeTemplateWithData(templateContent, variables) {
        const date = new Date()

        const utcStr = date.toUTCString()

        let mergedContent = this.baseTemplate
            .replace('{{upperContent}}', templateContent.upperContent)
            .replace('{{buttonText}}', templateContent.buttonText)
            .replace('{{lowerContent}}', templateContent.lowerContent)
            .replace('{{dateTime}}', utcStr);

        // Perform any additional merging of template variables here
        for (const [key, value] of Object.entries(variables)) {
            mergedContent = mergedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }

        return mergedContent;
    }
}

export default new EmailLibrary();
