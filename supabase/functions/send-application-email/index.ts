import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RECIPIENT_EMAIL = "gm@racine.sa";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ApplicationData {
  firstName: string;
  firstNameAr: string;
  lastName: string;
  lastNameAr: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolioUrl: string;
  coverLetterUrl: string;
  resumeUrl: string;
  expectedSalary: string;
  currentSalary: string;
  noticePeriod: string;
  yearsOfExperience: string;
  currentCompany: string;
  currentPosition: string;
  educationLevel: string;
  university: string;
  major: string;
  graduationYear: string;
  specialMotivation: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send-application-email function");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("RESEND_API_KEY is not configured");
    }

    const applicationData: ApplicationData = await req.json();
    console.log("Received application data:", applicationData);

    // Prepare email content
    const emailContent = `
      <h2>New Job Application Received</h2>
      <p>A new job application has been submitted with the following details:</p>
      <ul>
        <li>Name: ${applicationData.firstName} ${applicationData.lastName} / ${applicationData.firstNameAr} ${applicationData.lastNameAr}</li>
        <li>Email: ${applicationData.email}</li>
        <li>Phone: ${applicationData.phone}</li>
        <li>LinkedIn: ${applicationData.linkedin}</li>
        <li>Current Position: ${applicationData.currentPosition}</li>
        <li>Current Company: ${applicationData.currentCompany}</li>
        <li>Years of Experience: ${applicationData.yearsOfExperience}</li>
        <li>Education: ${applicationData.educationLevel} in ${applicationData.major}</li>
        <li>University: ${applicationData.university}</li>
        <li>Graduation Year: ${applicationData.graduationYear}</li>
        <li>Expected Salary: ${applicationData.expectedSalary} SAR</li>
        <li>Notice Period: ${applicationData.noticePeriod}</li>
      </ul>
      <h3>Special Motivation:</h3>
      <p>${applicationData.specialMotivation}</p>
      <p>Please find the CV and Cover Letter attached.</p>
    `;

    console.log("Sending email via Resend API");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Racine Jobs <onboarding@resend.dev>",
        to: [RECIPIENT_EMAIL],
        subject: `New Job Application: ${applicationData.firstName} ${applicationData.lastName}`,
        html: emailContent,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Error response from Resend:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-application-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);