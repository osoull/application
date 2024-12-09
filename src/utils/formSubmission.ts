import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/form";

export const handleFormSubmission = async (
  formData: FormData,
  date: Date | undefined,
  onSuccess: () => void,
  onError: (error: string) => void
) => {
  try {
    console.log('Starting form submission process...');
    
    if (!formData.resume || !formData.coverLetter) {
      throw new Error('Resume and cover letter are required');
    }

    // Upload resume
    console.log('Uploading resume...');
    const resumeFileName = `${Date.now()}-${formData.resume.name}`;
    const { data: resumeData, error: resumeError } = await supabase.storage
      .from('applications')
      .upload(resumeFileName, formData.resume);

    if (resumeError) {
      console.error('Resume upload error:', resumeError);
      throw resumeError;
    }

    const resumePath = resumeData?.path;
    console.log('Resume uploaded successfully:', resumePath);

    // Upload cover letter
    console.log('Uploading cover letter...');
    const coverLetterFileName = `${Date.now()}-${formData.coverLetter.name}`;
    const { data: coverLetterData, error: coverLetterError } = await supabase.storage
      .from('applications')
      .upload(coverLetterFileName, formData.coverLetter);

    if (coverLetterError) {
      console.error('Cover letter upload error:', coverLetterError);
      throw coverLetterError;
    }

    const coverLetterPath = coverLetterData?.path;
    console.log('Cover letter uploaded successfully:', coverLetterPath);

    // Prepare job data
    const jobData = {
      ...formData,
      resume_url: resumePath,
      cover_letter_url: coverLetterPath,
      availability_date: date?.toISOString(),
    };

    console.log('Inserting job application data...');
    const { error: insertError } = await supabase
      .from('jobs')
      .insert(jobData);

    if (insertError) {
      console.error('Database insertion error:', insertError);
      throw insertError;
    }

    console.log('Job application data inserted successfully');

    // Send email with Edge Function
    console.log('Invoking send-application-email function...');
    const { error: emailError } = await supabase.functions.invoke('send-application-email', {
      body: { formData: jobData }
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError;
    }

    console.log('Email sent successfully');
    onSuccess();
  } catch (error) {
    console.error('Form submission error:', error);
    onError(error instanceof Error ? error.message : 'An unexpected error occurred');
  }
};