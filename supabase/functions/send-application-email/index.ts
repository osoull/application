import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { PDFDocument, rgb } from "https://cdn.skypack.dev/pdf-lib";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RECIPIENT_EMAIL = "gm@racine.sa";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  coverLetterUrl: string;
  resumeUrl: string;
}

async function generatePDF(data: ApplicationData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();
  let yOffset = height - 50;

  const addText = (text: string, offset: number = 20) => {
    page.drawText(text, { x: 50, y: yOffset });
    yOffset -= offset;
  };

  // Add application data to PDF
  addText(`Application Details - ${new Date().toLocaleDateString()}`, 40);
  addText(`Name: ${data.firstName} ${data.lastName} / ${data.firstNameAr} ${data.lastNameAr}`);
  addText(`Email: ${data.email}`);
  addText(`Phone: ${data.phone}`);
  addText(`LinkedIn: ${data.linkedin}`);
  addText(`Current Position: ${data.currentPosition}`);
  addText(`Current Company: ${data.currentCompany}`);
  addText(`Experience: ${data.yearsOfExperience}`);
  addText(`Education: ${data.educationLevel} in ${data.major}`);
  addText(`University: ${data.university}`);
  addText(`Graduation Year: ${data.graduationYear}`);
  addText(`Expected Salary: ${data.expectedSalary} SAR`);
  addText(`Notice Period: ${data.noticePeriod}`);
  addText("\nSpecial Motivation:", 40);
  
  // Split motivation text into multiple lines
  const words = data.specialMotivation.split(" ");
  let line = "";
  for (const word of words) {
    if ((line + word).length > 60) {
      addText(line);
      line = word + " ";
    } else {
      line += word + " ";
    }
  }
  if (line) addText(line);

  return await pdfDoc.save();
}

async function getFileFromStorage(supabase: any, path: string): Promise<Uint8Array> {
  const { data, error } = await supabase.storage
    .from('applications')
    .download(path);

  if (error) {
    throw new Error(`Error downloading file: ${error.message}`);
  }

  return new Uint8Array(await data.arrayBuffer());
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const applicationData: ApplicationData = await req.json();
    console.log("Received application data:", applicationData);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate PDF from application data
    console.log("Generating PDF...");
    const applicationPdf = await generatePDF(applicationData);

    // Get CV and Cover Letter from storage
    console.log("Downloading CV and Cover Letter...");
    const [cvFile, coverLetterFile] = await Promise.all([
      getFileFromStorage(supabase, applicationData.resumeUrl),
      getFileFromStorage(supabase, applicationData.coverLetterUrl),
    ]);

    // Prepare email with attachments
    console.log("Preparing email...");
    const emailData = {
      from: "Racine Jobs <onboarding@resend.dev>",
      to: [RECIPIENT_EMAIL],
      subject: `New Job Application: ${applicationData.firstName} ${applicationData.lastName}`,
      html: `
        <h2>New Job Application Received</h2>
        <p>A new job application has been submitted by ${applicationData.firstName} ${applicationData.lastName}.</p>
        <p>Please find attached:</p>
        <ul>
          <li>Application Summary (PDF)</li>
          <li>CV</li>
          <li>Cover Letter</li>
        </ul>
      `,
      attachments: [
        {
          filename: "application-summary.pdf",
          content: Buffer.from(applicationPdf).toString('base64'),
        },
        {
          filename: "cv.pdf",
          content: Buffer.from(cvFile).toString('base64'),
        },
        {
          filename: "cover-letter.pdf",
          content: Buffer.from(coverLetterFile).toString('base64'),
        },
      ],
    };

    // Send email using Resend
    console.log("Sending email...");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!res.ok) {
      const error = await res.text();
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);