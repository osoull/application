import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.skypack.dev/pdf-lib';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationData {
  firstName: string;
  firstNameAr: string;
  lastName: string;
  lastNameAr: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolioUrl: string;
  expectedSalary: string;
  currentSalary: string;
  noticePeriod: string;
  yearsOfExperience: string;
  currentCompany: string;
  currentPosition: string;
  positionAppliedFor: string;
  educationLevel: string;
  university: string;
  major: string;
  graduationYear: string;
  coverLetterUrl: string;
  resumeUrl: string;
  specialMotivation: string;
}

async function generatePDF(data: ApplicationData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.276, 841.890]); // A4 size
  const { height } = page.getSize();
  
  // Fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let yOffset = height - 50; // Start from top
  const leftMargin = 50;
  const lineHeight = 25;
  
  // Colors
  const primaryColor = rgb(0.17, 0.13, 0.49); // #2B227C
  const textColor = rgb(0.10, 0.12, 0.17); // #1A1F2C
  
  // Header
  page.drawText('Job Application Details', {
    x: leftMargin,
    y: yOffset,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  yOffset -= lineHeight * 2;

  // Personal Information Section
  page.drawText('Personal Information', {
    x: leftMargin,
    y: yOffset,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  yOffset -= lineHeight;

  const addField = (label: string, value: string) => {
    page.drawText(`${label}:`, {
      x: leftMargin,
      y: yOffset,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    page.drawText(value, {
      x: leftMargin + 150,
      y: yOffset,
      size: 12,
      font: font,
      color: textColor,
    });
    yOffset -= lineHeight;
  };

  // Personal Information
  addField('Name', `${data.firstName} ${data.lastName} (${data.firstNameAr} ${data.lastNameAr})`);
  addField('Email', data.email);
  addField('Phone', data.phone);
  addField('LinkedIn', data.linkedin || 'Not provided');
  addField('Portfolio', data.portfolioUrl || 'Not provided');
  yOffset -= lineHeight;

  // Professional Information
  page.drawText('Professional Information', {
    x: leftMargin,
    y: yOffset,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  yOffset -= lineHeight;

  addField('Position Applied For', data.positionAppliedFor);
  addField('Current Position', data.currentPosition);
  addField('Current Company', data.currentCompany);
  addField('Years of Experience', data.yearsOfExperience);
  addField('Expected Salary', data.expectedSalary);
  addField('Current Salary', data.currentSalary);
  addField('Notice Period', data.noticePeriod);
  yOffset -= lineHeight;

  // Education
  page.drawText('Education', {
    x: leftMargin,
    y: yOffset,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  yOffset -= lineHeight;

  addField('Education Level', data.educationLevel);
  addField('University', data.university || 'Not provided');
  addField('Major', data.major || 'Not provided');
  addField('Graduation Year', data.graduationYear?.toString() || 'Not provided');
  yOffset -= lineHeight;

  // Special Motivation
  page.drawText('Special Motivation', {
    x: leftMargin,
    y: yOffset,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  yOffset -= lineHeight;

  // Split motivation text into multiple lines if needed
  const words = data.specialMotivation.split(' ');
  let currentLine = '';
  const maxWidth = 400;

  for (const word of words) {
    const testLine = currentLine + word + ' ';
    const width = font.widthOfTextAtSize(testLine, 12);
    
    if (width > maxWidth) {
      page.drawText(currentLine, {
        x: leftMargin,
        y: yOffset,
        size: 12,
        font: font,
        color: textColor,
      });
      yOffset -= lineHeight;
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    page.drawText(currentLine, {
      x: leftMargin,
      y: yOffset,
      size: 12,
      font: font,
      color: textColor,
    });
  }

  return await pdfDoc.save();
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set')
      throw new Error('SENDGRID_API_KEY is not set')
    }

    const TO_EMAIL = Deno.env.get('TO_EMAIL')
    if (!TO_EMAIL) {
      console.error('TO_EMAIL is not set')
      throw new Error('TO_EMAIL is not set')
    }

    const FROM_EMAIL = Deno.env.get('FROM_EMAIL')
    if (!FROM_EMAIL) {
      console.error('FROM_EMAIL is not set')
      throw new Error('FROM_EMAIL is not set')
    }

    const applicationData: ApplicationData = await req.json()
    console.log('Received application data:', applicationData)

    // Generate PDF
    console.log('Generating PDF...')
    const pdfBytes = await generatePDF(applicationData);
    const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));

    const emailBody = `
      New Job Application Received

      Please find the detailed application information in the attached PDF.
      
      Documents Links:
      - Cover Letter: ${applicationData.coverLetterUrl}
      - Resume: ${applicationData.resumeUrl}
    `

    console.log('Preparing to send email to:', TO_EMAIL)
    console.log('Sending from:', FROM_EMAIL)

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
        attachments: [{
          content: pdfBase64,
          filename: `application_${applicationData.firstName}_${applicationData.lastName}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      })
    })

    console.log('SendGrid API response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('SendGrid API error:', errorData)
      throw new Error(`SendGrid API error: ${response.status} - ${errorData}`)
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in send-application-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})