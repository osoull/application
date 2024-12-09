import { supabase } from "@/integrations/supabase/client";
import type { FormData, JobInsert } from "@/types/form";

export const submitApplication = async (
  formData: FormData,
  date: Date | undefined,
  setIsSubmitting: (value: boolean) => void,
  onSuccess: () => void,
  onError: (error: Error) => void
) => {
  setIsSubmitting(true);

  try {
    const coverLetterPath = `cover-letters/${Date.now()}-${formData.coverLetter?.name}`;
    const resumePath = `resumes/${Date.now()}-${formData.resume?.name}`;

    if (formData.coverLetter && formData.resume) {
      const [coverLetterUpload, resumeUpload] = await Promise.all([
        supabase.storage.from('applications').upload(coverLetterPath, formData.coverLetter),
        supabase.storage.from('applications').upload(resumePath, formData.resume)
      ]);

      if (coverLetterUpload.error || resumeUpload.error) {
        throw new Error('Error uploading files');
      }

      const jobData: JobInsert = {
        first_name: formData.firstName,
        first_name_ar: formData.firstNameAr,
        last_name: formData.lastName,
        last_name_ar: formData.lastNameAr,
        email: formData.email,
        phone: formData.phone,
        linkedin: formData.linkedin || null,
        github: null,
        portfolio_url: formData.portfolioUrl || null,
        cover_letter_url: coverLetterPath,
        resume_url: resumePath,
        expected_salary: Number(formData.expectedSalary),
        current_salary: Number(formData.currentSalary),
        notice_period: formData.noticePeriod,
        years_of_experience: formData.yearsOfExperience,
        current_company: formData.currentCompany,
        current_position: formData.currentPosition,
        education_level: formData.educationLevel,
        university: formData.university || null,
        major: formData.major || null,
        graduation_year: formData.graduationYear ? Number(formData.graduationYear) : null,
        special_motivation: formData.specialMotivation,
        availability_date: date?.toISOString() || new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from('jobs')
        .insert(jobData);

      if (insertError) {
        throw insertError;
      }

      // Send email with Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-application-email', {
        body: { formData: jobData }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        throw emailError;
      }

      onSuccess();
    }
  } catch (error) {
    onError(error as Error);
  } finally {
    setIsSubmitting(false);
  }
};