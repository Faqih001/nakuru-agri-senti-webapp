
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if Resend API key is available
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Email service is not configured. Please contact support." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { name, email, phone, subject, message }: ContactEmailRequest = await req.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, subject, and message are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to AgriSenti team
    const emailResponse = await resend.emails.send({
      from: "AgriSenti Contact <noreply@agrisenti.com>",
      to: ["fakiiahmad001@gmail.com"],
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #16a34a, #059669); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">🌾 New Contact Form Submission</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">AgriSenti Platform</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
              <h2 style="color: #16a34a; margin-top: 0;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 100px;">Name:</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #16a34a;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #16a34a;">${phone}</a></td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0;">${subject}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
              <h3 style="color: #16a34a; margin-top: 0;">Message:</h3>
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #6b7280;">
              <p style="margin: 0;">Sent from AgriSenti Contact Form</p>
              <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation email to user
    const confirmationResponse = await resend.emails.send({
      from: "AgriSenti Team <noreply@agrisenti.com>",
      to: [email],
      subject: "Thank you for contacting AgriSenti! 🌾",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Thank you for contacting AgriSenti</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #16a34a, #059669); color: white; padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🌾 Thank You!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your message has been received</p>
            </div>
            
            <div style="background: white; padding: 25px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="font-size: 16px; margin-top: 0;">Hello <strong>${name}</strong>,</p>
              
              <p>Thank you for reaching out to AgriSenti! We have successfully received your message and our team will get back to you within <strong>24 hours</strong>.</p>
              
              <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin: 0 0 10px 0;">📝 Your Message Summary:</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #16a34a;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <h3 style="color: #047857; margin: 0 0 10px 0;">🚀 What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Our support team will review your message</li>
                  <li>We'll respond within 24 hours during business days</li>
                  <li>For urgent matters, you can WhatsApp us at +254 741 140 250</li>
                </ul>
              </div>
              
              <p>In the meantime, feel free to explore our platform and check out our latest farming insights!</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="https://agrisenti.com/dashboard" style="background: #16a34a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Visit Dashboard
                </a>
              </div>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
              <h4 style="color: #16a34a; margin-top: 0;">Contact Information</h4>
              <p style="margin: 5px 0;"><strong>📧 Email:</strong> fakiiahmad001@gmail.com</p>
              <p style="margin: 5px 0;"><strong>📱 Phone:</strong> +254 741 140 250</p>
              <p style="margin: 5px 0;"><strong>💬 WhatsApp:</strong> <a href="https://wa.me/254741140250" style="color: #16a34a;">Chat with us</a></p>
              <p style="margin: 5px 0;"><strong>📍 Location:</strong> Nakuru, Kenya</p>
            </div>
            
            <div style="text-align: center; padding: 15px; font-size: 12px; color: #6b7280;">
              <p style="margin: 0;">Best regards,</p>
              <p style="margin: 5px 0 10px 0; font-weight: bold; color: #16a34a;">The AgriSenti Team</p>
              <p style="margin: 0;">Smart Farming Solutions for Nakuru County</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", { emailResponse, confirmationResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully",
      emailId: emailResponse.data?.id,
      confirmationId: confirmationResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    
    // More specific error messages
    let errorMessage = "Failed to send email. Please try again.";
    if (error.message?.includes("API key")) {
      errorMessage = "Email service configuration error. Please contact support.";
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "Too many requests. Please try again in a few minutes.";
    } else if (error.message?.includes("invalid email")) {
      errorMessage = "Invalid email address. Please check and try again.";
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
