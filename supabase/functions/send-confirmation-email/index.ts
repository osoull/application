import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApplicationData {
  first_name: string;
  first_name_ar: string;
  last_name: string;
  last_name_ar: string;
  email: string;
  current_position: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();
    console.log('Sending confirmation email for application:', formData);

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .divider { border-top: 1px solid #ccc; margin: 20px 0; }
    .logo { text-align: center; margin-top: 30px; }
    .logo img { max-width: 200px; height: auto; }
    [dir="rtl"] { direction: rtl; text-align: right; }
    [dir="ltr"] { direction: ltr; text-align: left; }
    .signature { margin-top: 20px; }
    .signature-logo { display: inline-block; vertical-align: middle; margin: 0 10px; }
    .signature-logo img { height: 40px; width: auto; }
    .signature-text { display: inline-block; vertical-align: middle; }
  </style>
</head>
<body>
  <div class="email-container">
    <div dir="ltr">
      <p>Dear ${formData.first_name} ${formData.last_name},</p>

      <p>Thank you for submitting your application for the ${formData.current_position} position at Racine Investment Company. We appreciate your interest in joining our team.</p>

      <p>Our hiring team will carefully review your application and will contact you if your qualifications match our requirements.</p>

      <p>Please note that due to the high volume of applications we receive, we may not be able to respond to every application individually.</p>

      <div class="signature">
        <p>Best regards,<br>
        <span class="signature-text">Racine Investment Company HR Team</span>
        <span class="signature-logo">
          <img src="https://pyofrbpibmwcvgmzvhhk.supabase.co/storage/v1/object/public/applications/logo.png" alt="Racine Investment Company Logo">
        </span>
        </p>
      </div>
    </div>

    <div class="divider"></div>

    <div dir="rtl">
      <p>عزيزي/عزيزتي ${formData.first_name_ar} ${formData.last_name_ar}،</p>

      <p>نشكرك على تقديم طلبك لوظيفة ${formData.current_position} في شركة راسين للاستثمار. نقدر اهتمامك بالانضمام إلى فريقنا.</p>

      <p>سيقوم فريق التوظيف لدينا بمراجعة طلبك بعناية وسيتواصل معك إذا كانت مؤهلاتك تتناسب مع متطلباتنا.</p>

      <p>يرجى ملاحظة أنه نظراً للعدد الكبير من الطلبات التي نتلقاها، قد لا نتمكن من الرد على كل طلب بشكل فردي.</p>

      <div class="signature">
        <p>مع أطيب التحيات،<br>
        <span class="signature-logo">
          <img src="https://pyofrbpibmwcvgmzvhhk.supabase.co/storage/v1/object/public/applications/logo.png" alt="Racine Investment Company Logo">
        </span>
        <span class="signature-text">فريق الموارد البشرية - شركة راسين للاستثمار</span>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: formData.email }]
        }],
        from: {
          email: Deno.env.get('FROM_EMAIL'),
          name: "شركة راسين للاستثمار"
        },
        subject: `Application Received - ${formData.current_position} / تم استلام طلبك - ${formData.current_position}`,
        content: [{
          type: 'text/html',
          value: emailContent
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid API error response:', errorText);
      throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
    }

    console.log('Confirmation email sent successfully to:', formData.email);
    return new Response(JSON.stringify({ message: 'Confirmation email sent successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});