import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import EducationForm from "./forms/EducationForm";
import ProfessionalInfoForm from "./forms/ProfessionalInfoForm";
import DocumentsForm from "./forms/DocumentsForm";
import { submitApplication } from "@/utils/formSubmission";
import type { FormData } from "@/types/form";

const initialFormData: FormData = {
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
};

const ApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<FormData>(initialFormData);

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
    
    await submitApplication(
      formData,
      date,
      setIsSubmitting,
      () => {
        toast({
          title: "Application Submitted! / تم إرسال الطلب!",
          description: "We will contact you soon. / سنتواصل معك قريباً.",
        });
        setFormData(initialFormData);
        setDate(undefined);
      },
      (error) => {
        console.error('Error submitting application:', error);
        toast({
          title: "Error / خطأ",
          description: "An error occurred while submitting your application. Please try again. / حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      }
    );
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