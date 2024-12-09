import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    if (!SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not set')
    }

    const TO_EMAIL = Deno.env.get('TO_EMAIL')
    if (!TO_EMAIL) {
      throw new Error('TO_EMAIL is not set')
    }

    const applicationData: ApplicationData = await req.json()
    console.log('Received application data:', applicationData)

    const emailBody = `
      New Job Application Received

      Candidate Information:
      - Name: ${applicationData.firstName} ${applicationData.lastName} (${applicationData.firstNameAr} ${applicationData.lastNameAr})
      - Email: ${applicationData.email}
      - Phone: ${applicationData.phone}
      - LinkedIn: ${applicationData.linkedin}
      - Portfolio: ${applicationData.portfolioUrl}

      Professional Information:
      - Position Applied For: ${applicationData.positionAppliedFor}
      - Current Position: ${applicationData.currentPosition}
      - Current Company: ${applicationData.currentCompany}
      - Years of Experience: ${applicationData.yearsOfExperience}
      - Expected Salary: ${applicationData.expectedSalary}
      - Current Salary: ${applicationData.currentSalary}
      - Notice Period: ${applicationData.noticePeriod}

      Education:
      - Level: ${applicationData.educationLevel}
      - University: ${applicationData.university}
      - Major: ${applicationData.major}
      - Graduation Year: ${applicationData.graduationYear}

      Documents:
      - Cover Letter: ${applicationData.coverLetterUrl}
      - Resume: ${applicationData.resumeUrl}
    `

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
        from: { email: 'noreply@yourdomain.com' },
        subject: `New Job Application from ${applicationData.firstName} ${applicationData.lastName}`,
        content: [{
          type: 'text/plain',
          value: emailBody
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('SendGrid API error:', errorData)
      throw new Error(`SendGrid API error: ${response.status}`)
    }

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})