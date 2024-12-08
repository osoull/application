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
  portfolioUrl?: string;
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

    // Prepare email content with both English and Arabic
    const emailContent = `
      <h2>New Job Application Received / تم استلام طلب وظيفة جديد</h2>
      <p>A new job application has been submitted with the following details:</p>
      <ul>
        <li>Name / الاسم: ${applicationData.firstName} ${applicationData.lastName} / ${applicationData.firstNameAr} ${applicationData.lastNameAr}</li>
        <li>Email / البريد الإلكتروني: ${applicationData.email}</li>
        <li>Phone / رقم الهاتف: ${applicationData.phone}</li>
        <li>LinkedIn: ${applicationData.linkedin}</li>
        <li>Current Position / المنصب الحالي: ${applicationData.currentPosition}</li>
        <li>Current Company / الشركة الحالية: ${applicationData.currentCompany}</li>
        <li>Years of Experience / سنوات الخبرة: ${applicationData.yearsOfExperience}</li>
        <li>Education / التعليم: ${applicationData.educationLevel} in ${applicationData.major}</li>
        <li>University / الجامعة: ${applicationData.university}</li>
        <li>Graduation Year / سنة التخرج: ${applicationData.graduationYear}</li>
        <li>Expected Salary / الراتب المتوقع: ${applicationData.expectedSalary} SAR</li>
        <li>Notice Period / فترة الإشعار: ${applicationData.noticePeriod}</li>
      </ul>
      <h3>Special Motivation / الدافع الخاص:</h3>
      <p>${applicationData.specialMotivation}</p>
      <p>Please find the CV and Cover Letter attached. / يرجى الاطلاع على السيرة الذاتية وخطاب التقديم المرفقين.</p>
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
        subject: `New Job Application: ${applicationData.firstName} ${applicationData.lastName} / طلب وظيفة جديد: ${applicationData.firstNameAr} ${applicationData.lastNameAr}`,
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