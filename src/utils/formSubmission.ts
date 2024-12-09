import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/form";

const transformFormDataToDbFormat = (formData: FormData, date: Date, resumeUrl: string, coverLetterUrl: string) => {
  return {
    first_name: formData.firstName,
    first_name_ar: formData.firstNameAr,
    last_name: formData.lastName,
    last_name_ar: formData.lastNameAr,
    email: formData.email,
    phone: formData.phone,
    linkedin: formData.linkedin,
    portfolio_url: formData.portfolioUrl,
    resume_url: resumeUrl,
    cover_letter_url: coverLetterUrl,
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
    availability_date: date.toISOString(),
  };
};

export const submitApplication = async (
  formData: FormData,
  date: Date,
  setIsSubmitting: (value: boolean) => void,
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  try {
    console.log('Starting form submission process...');
    setIsSubmitting(true);

    // Check for existing application with the same email
    const { data: existingApplication } = await supabase
      .from('jobs')
      .select('id, email')
      .eq('email', formData.email)
      .single();

    if (existingApplication) {
      throw new Error('Une candidature avec cet email existe déjà / An application with this email already exists');
    }
    
    if (!formData.resume || !formData.coverLetter) {
      throw new Error('Resume and cover letter are required');
    }

    // Upload resume to resumes folder
    console.log('Uploading resume...');
    const resumeFileName = `resumes/${Date.now()}-${formData.resume.name}`;
    const { data: resumeData, error: resumeError } = await supabase.storage
      .from('applications')
      .upload(resumeFileName, formData.resume);

    if (resumeError) {
      console.error('Resume upload error:', resumeError);
      throw resumeError;
    }

    const resumePath = resumeData?.path;
    console.log('Resume uploaded successfully:', resumePath);

    // Upload cover letter to cover-letters folder
    console.log('Uploading cover letter...');
    const coverLetterFileName = `cover-letters/${Date.now()}-${formData.coverLetter.name}`;
    const { data: coverLetterData, error: coverLetterError } = await supabase.storage
      .from('applications')
      .upload(coverLetterFileName, formData.coverLetter);

    if (coverLetterError) {
      console.error('Cover letter upload error:', coverLetterError);
      throw coverLetterError;
    }

    const coverLetterPath = coverLetterData?.path;
    console.log('Cover letter uploaded successfully:', coverLetterPath);

    // Transform and insert data
    const dbData = transformFormDataToDbFormat(formData, date, resumePath!, coverLetterPath!);
    console.log('Inserting job application data...', dbData);
    
    const { error: insertError } = await supabase
      .from('jobs')
      .insert(dbData);

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw insertError;
    }

    console.log('Job application data inserted successfully');

    // Send email to HR with Edge Function
    console.log('Invoking send-application-email function...');
    const { error: emailError } = await supabase.functions.invoke('send-application-email', {
      body: { formData: dbData }
    });

    if (emailError) {
      console.error('Error sending email to HR:', emailError);
      throw emailError;
    }

    // Send confirmation email to candidate
    console.log('Sending confirmation email to candidate...');
    const { error: confirmationEmailError } = await supabase.functions.invoke('send-confirmation-email', {
      body: { formData: dbData }
    });

    if (confirmationEmailError) {
      console.error('Error sending confirmation email:', confirmationEmailError);
      throw confirmationEmailError;
    }

    console.log('All emails sent successfully');
    onSuccess();

  } catch (error) {
    console.error('Form submission error:', error);
    onError(error instanceof Error ? error.message : 'An unexpected error occurred');
  } finally {
    setIsSubmitting(false);
  }
};
