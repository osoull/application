import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ApplicationData, EmailAttachment } from "./types.ts";
import { generatePDF } from "./pdf-generator.ts";
import { downloadFile } from "./file-service.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const TO_EMAIL = Deno.env.get('TO_EMAIL');
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL');

    if (!SENDGRID_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
      throw new Error('Missing required environment variables');
    }

    const applicationData: ApplicationData = await req.json();
    console.log('Processing application for:', applicationData.firstName, applicationData.lastName);

    // Generate PDF summary
    console.log('Generating PDF summary...');
    const pdfBytes = await generatePDF(applicationData);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    // Download CV and Cover Letter
    console.log('Downloading CV and Cover Letter...');
    const [cvBytes, coverLetterBytes] = await Promise.all([
      downloadFile(applicationData.resumeUrl),
      downloadFile(applicationData.coverLetterUrl)
    ]);

    if (!cvBytes || !coverLetterBytes) {
      throw new Error('Failed to download CV or Cover Letter');
    }

    const attachments: EmailAttachment[] = [
      {
        content: pdfBase64,
        filename: `application_${applicationData.firstName}_${applicationData.lastName}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      },
      {
        content: btoa(String.fromCharCode(...cvBytes)),
        filename: `cv_${applicationData.firstName}_${applicationData.lastName}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      },
      {
        content: btoa(String.fromCharCode(...coverLetterBytes)),
        filename: `cover_letter_${applicationData.firstName}_${applicationData.lastName}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ];

    const emailBody = `
      New Job Application Received from ${applicationData.firstName} ${applicationData.lastName}

      Please find attached:
      1. Application Summary (PDF)
      2. CV/Resume
      3. Cover Letter

      You can also access the documents directly via these links:
      - Cover Letter: ${applicationData.coverLetterUrl}
      - Resume: ${applicationData.resumeUrl}
    `;

    console.log('Sending email with attachments...');
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: TO_EMAIL }]
        }],
        from: { email: FROM_EMAIL },
        subject: `New Job Application from ${applicationData.firstName} ${applicationData.lastName}`,
        content: [{
          type: 'text/plain',
          value: emailBody
        }],
        attachments
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SendGrid API error:', errorData);
      throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
    }

    console.log('Email sent successfully');
    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-application-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});