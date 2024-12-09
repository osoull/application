import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required / الاسم الأول مطلوب"),
  firstNameAr: z.string().min(1, "Arabic first name is required / الاسم الأول بالعربية مطلوب"),
  lastName: z.string().min(1, "Last name is required / اسم العائلة مطلوب"),
  lastNameAr: z.string().min(1, "Arabic last name is required / اسم العائلة بالعربية مطلوب"),
  email: z.string().email("Invalid email format / تنسيق البريد الإلكتروني غير صالح"),
  phone: z.string().regex(/^\+?[0-9\s-()]{8,}$/, "Invalid phone number format / تنسيق رقم الهاتف غير صالح"),
  linkedin: z.string().url("Invalid LinkedIn URL / رابط LinkedIn غير صالح").nullable(),
  portfolioUrl: z.string().url("Invalid portfolio URL / رابط المحفظة غير صالح").nullable(),
  expectedSalary: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Expected salary must be a positive number / يجب أن يكون الراتب المتوقع رقمًا موجبًا"
  }),
  currentSalary: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Current salary must be a positive number / يجب أن يكون الراتب الحالي رقمًا موجبًا"
  }),
  noticePeriod: z.string().min(1, "Notice period is required / فترة الإشعار مطلوبة"),
  yearsOfExperience: z.string().min(1, "Years of experience is required / سنوات الخبرة مطلوبة"),
  currentCompany: z.string().min(1, "Current company is required / الشركة الحالية مطلوبة"),
  currentPosition: z.string().min(1, "Current position is required / المنصب الحالي مطلوب"),
  positionAppliedFor: z.string().min(1, "Position applied for is required / المنصب المتقدم له مطلوب"),
  educationLevel: z.string().min(1, "Education level is required / المستوى التعليمي مطلوب"),
  university: z.string().nullable(),
  major: z.string().nullable(),
  graduationYear: z.string().nullable(),
  specialMotivation: z.string().min(20, "Special motivation must be at least 20 characters / يجب أن يكون الدافع الخاص 20 حرفًا على الأقل"),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;