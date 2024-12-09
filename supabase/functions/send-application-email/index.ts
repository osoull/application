import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "./cors.ts";
import { generatePDF } from "./pdf-generator.ts";
import { downloadFile } from "./file-service.ts";
import { ApplicationData } from "./types.ts";

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') || '';
const TO_EMAIL = Deno.env.get('TO_EMAIL') || '';
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { applicationData } = await req.json();

    console.log('Processing application for:', applicationData.firstName, applicationData.lastName);

    // Download files
    console.log('Downloading resume and cover letter...');
    const [resumeBuffer, coverLetterBuffer] = await Promise.all([
      downloadFile(supabase, applicationData.resumeUrl),
      downloadFile(supabase, applicationData.coverLetterUrl)
    ]);

    // Generate PDF summary
    console.log('Generating PDF summary...');
    const pdfBuffer = await generatePDF(applicationData);

    // Prepare email content
    const emailContent = `
English Version:
-----------------
New Job Application Received

We have received a new job application from ${applicationData.firstName} ${applicationData.lastName}.

Contact Information:
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}
- LinkedIn: ${applicationData.linkedin}
${applicationData.portfolioUrl ? `- Portfolio: ${applicationData.portfolioUrl}` : ''}

Professional Information:
- Current Position: ${applicationData.currentPosition}
- Current Company: ${applicationData.currentCompany}
- Years of Experience: ${applicationData.yearsOfExperience}
- Notice Period: ${applicationData.noticePeriod}
- Expected Salary: ${applicationData.expectedSalary} SAR
- Current Salary: ${applicationData.currentSalary} SAR
- Position Applied For: ${applicationData.positionAppliedFor}

Education:
- Level: ${applicationData.educationLevel}
- University: ${applicationData.university || 'N/A'}
- Major: ${applicationData.major || 'N/A'}
- Graduation Year: ${applicationData.graduationYear || 'N/A'}

Special Motivation:
${applicationData.specialMotivation}

Availability Date: ${new Date(applicationData.availabilityDate).toLocaleDateString()}

النسخة العربية:
-----------------
تم استلام طلب توظيف جديد

لقد تلقينا طلب توظيف جديد من ${applicationData.firstNameAr} ${applicationData.lastNameAr}

معلومات الاتصال:
- البريد الإلكتروني: ${applicationData.email}
- الهاتف: ${applicationData.phone}
- لينكد إن: ${applicationData.linkedin}
${applicationData.portfolioUrl ? `- الموقع الشخصي: ${applicationData.portfolioUrl}` : ''}

المعلومات المهنية:
- المنصب الحالي: ${applicationData.currentPosition}
- الشركة الحالية: ${applicationData.currentCompany}
- سنوات الخبرة: ${applicationData.yearsOfExperience}
- فترة الإشعار: ${applicationData.noticePeriod}
- الراتب المتوقع: ${applicationData.expectedSalary} ريال سعودي
- الراتب الحالي: ${applicationData.currentSalary} ريال سعودي
- المنصب المتقدم له: ${applicationData.positionAppliedFor}

التعليم:
- المستوى: ${applicationData.educationLevel}
- الجامعة: ${applicationData.university || 'غير متوفر'}
- التخصص: ${applicationData.major || 'غير متوفر'}
- سنة التخرج: ${applicationData.graduationYear || 'غير متوفر'}

الدافع الخاص:
${applicationData.specialMotivation}

تاريخ الإتاحة: ${new Date(applicationData.availabilityDate).toLocaleDateString('ar-SA')}
`;

    // Send email using SendGrid
    console.log('Sending email...');
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
        subject: `New Job Application from ${applicationData.firstName} ${applicationData.lastName} / طلب وظيفة جديد من ${applicationData.firstNameAr} ${applicationData.lastNameAr}`,
        content: [{
          type: 'text/plain',
          value: emailContent
        }],
        attachments: [
          {
            content: pdfBuffer.toString('base64'),
            filename: `${applicationData.firstName}_${applicationData.lastName}_Application_Summary.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          },
          {
            content: resumeBuffer.toString('base64'),
            filename: `${applicationData.firstName}_${applicationData.lastName}_Resume.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          },
          {
            content: coverLetterBuffer.toString('base64'),
            filename: `${applicationData.firstName}_${applicationData.lastName}_Cover_Letter.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
    }

    console.log('Email sent successfully');
    return new Response(
      JSON.stringify({ message: 'Application submitted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing application:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});