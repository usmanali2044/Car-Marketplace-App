import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail =async (email,verificationToken) =>{
    const recipient = [{email}];
    try {
        
        const response = await mailtrapClient.send({
            from:sender,
            to : recipient,
            subject : "Verify your email",
            html :VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category : "Email Verification"
        })

        console.log("Email send Successfully",response);

    } catch (error) {
        console.log("Error sending Verification ",error);
        throw new Error(`Error sending Email :  ${error}`);
    }
}

export const sendWelcomeEmail = async (email,name) =>{
    const recipient = [{email}]
    try {
       const response =  await mailtrapClient.send({
            from :sender,
            to : recipient,
            template_uuid:"d2cfab96-3af7-4267-8ab3-d3ab0188fbe3",
             template_variables: {
            "company_info_name": "CarLink",
            "name": name,
    }

        });

        console.log(`Email is sent Successfully`,response);
    } catch (error) {
        console.log("error Failed Sending Welcome Email",error);
    }
}


export const sendResetPasswordEmail = async (email, resetUrl) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password", // must include subject
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            category: "Password Reset"
        });

        console.log("Email sent successfully", response);
    } catch (error) {
        console.log("Error Sending Forgot password Email", error);
        throw new Error(`Error sending Email: ${error}`);
    }
};


export const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from : sender,
            to : recipient,
            Subject : "Password Reset Successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password Reset Success "
        })

        console.log("Email Sent Successfully Password Reset",response);
    } catch (error) {
        console.log("Error Reseting password", error);
        throw new Error(`Error Reseting password: ${error}`);
    }
}

export const sendBuyRequestEmail = async (sellerEmail, buyerName, carBrand, carModel) => {
    const recipient = [{ email: sellerEmail }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `New Buy Request for ${carBrand} ${carModel}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>New Buy Request</h2>
                    <p>Hello,</p>
                    <p><strong>${buyerName}</strong> has sent a buy request for your <strong>${carBrand} ${carModel}</strong>.</p>
                    <p>Please check your dashboard to accept or decline the request.</p>
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" 
                       style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        View Dashboard
                    </a>
                </div>
            `,
            category: "Buy Request"
        });
        console.log("Buy request email sent successfully", response);
    } catch (error) {
        console.log("Error sending buy request email", error);
        throw new Error(`Error sending buy request email: ${error}`);
    }
};

export const sendBuyRequestAcceptedEmail = async (buyerEmail, buyerName, carBrand, carModel) => {
    const recipient = [{ email: buyerEmail }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `Your Buy Request for ${carBrand} ${carModel} Has Been Accepted!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Buy Request Accepted</h2>
                    <p>Hello ${buyerName},</p>
                    <p>Great news! Your buy request for <strong>${carBrand} ${carModel}</strong> has been accepted by the seller.</p>
                    <p>The car has been marked as sold. Please contact the seller to complete the transaction.</p>
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" 
                       style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        View Dashboard
                    </a>
                </div>
            `,
            category: "Buy Request Accepted"
        });
        console.log("Buy request accepted email sent successfully", response);
    } catch (error) {
        console.log("Error sending buy request accepted email", error);
        throw new Error(`Error sending buy request accepted email: ${error}`);
    }
};

export const sendBuyRequestDeclinedEmail = async (buyerEmail, buyerName, carBrand, carModel) => {
    const recipient = [{ email: buyerEmail }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `Buy Request Update for ${carBrand} ${carModel}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Buy Request Declined</h2>
                    <p>Hello ${buyerName},</p>
                    <p>Unfortunately, your buy request for <strong>${carBrand} ${carModel}</strong> has been declined by the seller.</p>
                    <p>Don't worry! You can browse other available cars on our platform.</p>
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/cars" 
                       style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        Browse Cars
                    </a>
                </div>
            `,
            category: "Buy Request Declined"
        });
        console.log("Buy request declined email sent successfully", response);
    } catch (error) {
        console.log("Error sending buy request declined email", error);
        throw new Error(`Error sending buy request declined email: ${error}`);
    }
};