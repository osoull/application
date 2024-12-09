import { ApplicationData } from "./types.ts";

export function generateEmailContent(applicationData: ApplicationData): string {
  return `
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
}