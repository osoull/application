import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "./cors.ts";
import { generatePDF } from "./pdf-generator.ts";
import { downloadFile } from "./file-service.ts";
import { ApplicationData } from "./types.ts";

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || '';
const TO_EMAIL = Deno.env.get('TO_EMAIL') || '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || '';

serve(async (req) => {
  // Handle CORS preflight requests
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

    const applicationData = requestData.formData;
    console.log('Processing application for:', applicationData.first_name, applicationData.last_name);

    // Validate required environment variables
    if (!SENDGRID_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
      console.error('Missing required environment variables');
      throw new Error('Missing required environment variables');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download files
    console.log('Downloading resume and cover letter...');
    console.log('Resume URL:', applicationData.resume_url);
    console.log('Cover Letter URL:', applicationData.cover_letter_url);
    
    const [resumeBuffer, coverLetterBuffer] = await Promise.all([
      downloadFile(supabase, applicationData.resume_url),
      downloadFile(supabase, applicationData.cover_letter_url)
    ]);

    console.log('Files downloaded successfully');

    // Generate PDF summary
    console.log('Generating PDF summary...');
    const pdfBuffer = await generatePDF(applicationData);
    console.log('PDF generated successfully');

    // Prepare email content
    const emailContent = `
English Version:
-----------------
New Job Application Received

We have received a new job application from ${applicationData.first_name} ${applicationData.last_name}.

Contact Information:
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}
- LinkedIn: ${applicationData.linkedin}
${applicationData.portfolio_url ? `- Portfolio: ${applicationData.portfolio_url}` : ''}

Professional Information:
- Current Position: ${applicationData.current_position}
- Current Company: ${applicationData.current_company}
- Years of Experience: ${applicationData.years_of_experience}
- Notice Period: ${applicationData.notice_period}
- Expected Salary: ${applicationData.expected_salary} SAR
- Current Salary: ${applicationData.current_salary} SAR

Education:
- Level: ${applicationData.education_level}
- University: ${applicationData.university || 'N/A'}
- Major: ${applicationData.major || 'N/A'}
- Graduation Year: ${applicationData.graduation_year || 'N/A'}

Special Motivation:
${applicationData.special_motivation}

Availability Date: ${new Date(applicationData.availability_date).toLocaleDateString()}

النسخة العربية:
-----------------
تم استلام طلب توظيف جديد

لقد تلقينا طلب توظيف جديد من ${applicationData.first_name_ar} ${applicationData.last_name_ar}

معلومات الاتصال:
- البريد الإلكتروني: ${applicationData.email}
- الهاتف: ${applicationData.phone}
- لينكد إن: ${applicationData.linkedin}
${applicationData.portfolio_url ? `- الموقع الشخصي: ${applicationData.portfolio_url}` : ''}

المعلومات المهنية:
- المنصب الحالي: ${applicationData.current_position}
- الشركة الحالية: ${applicationData.current_company}
- سنوات الخبرة: ${applicationData.years_of_experience}
- فترة الإشعار: ${applicationData.notice_period}
- الراتب المتوقع: ${applicationData.expected_salary} ريال سعودي
- الراتب الحالي: ${applicationData.current_salary} ريال سعودي

التعليم:
- المستوى: ${applicationData.education_level}
- الجامعة: ${applicationData.university || 'غير متوفر'}
- التخصص: ${applicationData.major || 'غير متوفر'}
- سنة التخرج: ${applicationData.graduation_year || 'غير متوفر'}

الدافع الخاص:
${applicationData.special_motivation}

تاريخ الإتاحة: ${new Date(applicationData.availability_date).toLocaleDateString('ar-SA')}
`;

    console.log('Preparing to send email...');
    console.log('To:', TO_EMAIL);
    console.log('From:', FROM_EMAIL);

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
          value: emailContent
        }],
        attachments: [
          {
            content: pdfBuffer.toString('base64'),
            filename: `${applicationData.first_name}_${applicationData.last_name}_Application_Summary.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          },
          {
            content: resumeBuffer.toString('base64'),
            filename: `${applicationData.first_name}_${applicationData.last_name}_Resume.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          },
          {
            content: coverLetterBuffer.toString('base64'),
            filename: `${applicationData.first_name}_${applicationData.last_name}_Cover_Letter.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API error response:', errorText);
      throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
    }

    console.log('Email sent successfully');
    return new Response(
      JSON.stringify({ message: 'Application submitted successfully' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-application-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});