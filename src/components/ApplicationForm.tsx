import { Card } from "@/components/ui/card";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import EducationForm from "./forms/EducationForm";
import ProfessionalInfoForm from "./forms/ProfessionalInfoForm";
import DocumentsForm from "./forms/DocumentsForm";
import SuccessNotification from "./SuccessNotification";
import FormHeader from "./forms/FormHeader";
import FormSubmitButton from "./forms/FormSubmitButton";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import { submitApplication } from "@/utils/formSubmission";

const ApplicationForm = () => {
  const {
    formData,
    date,
    setDate,
    errors,
    isSubmitting,
    isSubmitted,
    setIsSubmitting,
    setIsSubmitted,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    validateForm,
    setFormData,
  } = useApplicationForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.error("Validation failed", errors);
      return;
    }

    if (!date) {
      console.error("Date is required");
      return;
    }

    await submitApplication(
      formData,
      date,
      setIsSubmitting,
      () => {
        setIsSubmitted(true);
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
      },
      (error) => {
        console.error('Error submitting application:', error);
      }
    );
  };

  if (isSubmitted) {
    return <SuccessNotification firstName={formData.firstName} firstNameAr={formData.firstNameAr} />;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <FormHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Personal Information / المعلومات الشخصية</h2>
            <PersonalInfoForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Education / التعليم</h2>
            <EducationForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              errors={errors}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Professional Information / المعلومات المهنية</h2>
            <ProfessionalInfoForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              date={date}
              setDate={setDate}
              errors={errors}
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Documents / المستندات</h2>
            <DocumentsForm handleFileChange={handleFileChange} />
          </div>

          <FormSubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </Card>
  );
};

export default ApplicationForm;