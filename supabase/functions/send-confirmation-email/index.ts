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
Dear ${formData.first_name} ${formData.last_name},

Thank you for submitting your application for the ${formData.current_position} position at Rasin Investment Company. We appreciate your interest in joining our team.

Our hiring team will carefully review your application and will contact you if your qualifications match our requirements.

Please note that due to the high volume of applications we receive, we may not be able to respond to every application individually.

Best regards,
Rasin Investment Company HR Team

---

عزيزي/عزيزتي ${formData.first_name_ar} ${formData.last_name_ar}،

نشكرك على تقديم طلبك لوظيفة ${formData.current_position} في شركة رسين للاستثمار. نقدر اهتمامك بالانضمام إلى فريقنا.

سيقوم فريق التوظيف لدينا بمراجعة طلبك بعناية وسيتواصل معك إذا كانت مؤهلاتك تتناسب مع متطلباتنا.

يرجى ملاحظة أنه نظراً للعدد الكبير من الطلبات التي نتلقاها، قد لا نتمكن من الرد على كل طلب بشكل فردي.

مع أطيب التحيات،
فريق الموارد البشرية - شركة رسين للاستثمار
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
          name: "شركة رسين للاستثمار"
        },
        subject: `Application Received - ${formData.current_position} / تم استلام طلبك - ${formData.current_position}`,
        content: [{
          type: 'text/plain',
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