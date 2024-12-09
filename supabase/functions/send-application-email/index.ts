import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { ApplicationData, EmailAttachment } from "./types.ts";
import { generateEmailContent } from "./email-template.ts";
import { downloadFileAndConvertToBase64 } from "./file-service.ts";

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || '';
const TO_EMAIL = Deno.env.get('TO_EMAIL') || '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting email function execution');
    const requestData = await req.json();
    console.log('Received request data:', JSON.stringify(requestData, null, 2));

    if (!requestData || !requestData.formData) {
      console.error('Invalid request data structure');
      throw new Error('Invalid request data structure');
    }

    const applicationData: ApplicationData = requestData.formData;
    console.log('Processing application for:', applicationData.first_name, applicationData.last_name);

    if (!SENDGRID_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
      console.error('Missing required environment variables');
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download and convert files to base64
    console.log('Downloading resume from:', applicationData.resume_url);
    const resumeBase64 = await downloadFileAndConvertToBase64(supabase, applicationData.resume_url);
    
    console.log('Downloading cover letter from:', applicationData.cover_letter_url);
    const coverLetterBase64 = await downloadFileAndConvertToBase64(supabase, applicationData.cover_letter_url);

    // Extract file names from URLs
    const resumeFileName = applicationData.resume_url.split('/').pop() || 'resume.pdf';
    const coverLetterFileName = applicationData.cover_letter_url.split('/').pop() || 'cover_letter.pdf';

    const attachments: EmailAttachment[] = [
      {
        content: resumeBase64,
        filename: resumeFileName,
        type: 'application/pdf',
        disposition: 'attachment'
      },
      {
        content: coverLetterBase64,
        filename: coverLetterFileName,
        type: 'application/pdf',
        disposition: 'attachment'
      }
    ];

    // Send email using SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: TO_EMAIL }]
        }],
        from: { 
          email: FROM_EMAIL,
          name: "شركة رسين للاستثمار"
        },
        subject: `New Job Application from ${applicationData.first_name} ${applicationData.last_name} / طلب وظيفة جديد من ${applicationData.first_name_ar} ${applicationData.last_name_ar}`,
        content: [{
          type: 'text/plain',
          value: generateEmailContent(applicationData)
        }],
        attachments
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API error response:', errorText);
      throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
    }

    console.log('Email sent successfully with attachments');
    return new Response(
      JSON.stringify({ message: 'Application submitted successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-application-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});