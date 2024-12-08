import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import EducationForm from "./forms/EducationForm";
import ProfessionalInfoForm from "./forms/ProfessionalInfoForm";
import DocumentsForm from "./forms/DocumentsForm";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];

const ApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: "",
    firstNameAr: "",
    lastName: "",
    lastNameAr: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolioUrl: "",
    coverLetter: null as File | null,
    resume: null as File | null,
    expectedSalary: "",
    currentSalary: "",
    noticePeriod: "",
    yearsOfExperience: "",
    currentCompany: "",
    currentPosition: "",
    educationLevel: "",
    university: "",
    major: "",
    graduationYear: "",
    specialMotivation: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload files to Supabase Storage
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

        // Insert job application into the database
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

        toast({
          title: "Application Submitted! / تم إرسال الطلب!",
          description: "We will contact you soon. / سنتواصل معك قريباً.",
        });

        // Reset form
        setFormData({
          firstName: "",
          firstNameAr: "",
          lastName: "",
          lastNameAr: "",
          email: "",
          phone: "",
          linkedin: "",
          portfolioUrl: "",
          coverLetter: null,
          resume: null,
          expectedSalary: "",
          currentSalary: "",
          noticePeriod: "",
          yearsOfExperience: "",
          currentCompany: "",
          currentPosition: "",
          educationLevel: "",
          university: "",
          major: "",
          graduationYear: "",
          specialMotivation: "",
        });
        setDate(undefined);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error / خطأ",
        description: "An error occurred while submitting your application. Please try again. / حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-rasin-primary">
            Application Form / نموذج التقديم
          </h1>
          <div className="flex justify-center items-center">
            <img 
              src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
              alt="Company Logo" 
              className="h-12" 
            />
          </div>
          <p className="text-muted-foreground">
            Please complete your information to submit your application / يرجى إكمال معلوماتك لتقديم طلبك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Personal Information / المعلومات الشخصية</h2>
            <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Education / التعليم</h2>
            <EducationForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Professional Information / المعلومات المهنية</h2>
            <ProfessionalInfoForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              date={date}
              setDate={setDate}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Documents / المستندات</h2>
            <DocumentsForm handleFileChange={handleFileChange} />
          </div>

          <Button
            type="submit"
            className="w-full bg-rasin-primary hover:bg-opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting... / جارٍ الإرسال..." : "Submit Application / إرسال الطلب"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ApplicationForm;
