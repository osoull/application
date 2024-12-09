import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/form";

interface NameFieldsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
}

const NameFields = ({ formData, handleInputChange, errors }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name / الاسم الأول <span className="text-red-500">*</span></Label>
        <Input
          id="firstName"
          name="firstName"
          required
          dir="ltr"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          className={errors.firstName ? "border-red-500" : ""}
        />
        {errors.firstName && (
          <p className="text-sm text-red-500">{errors.firstName}</p>
        )}
        <Input
          id="firstNameAr"
          name="firstNameAr"
          required
          dir="rtl"
          value={formData.firstNameAr}
          onChange={handleInputChange}
          placeholder="أدخل اسمك الأول"
          className={`mt-2 ${errors.firstNameAr ? "border-red-500" : ""}`}
        />
        {errors.firstNameAr && (
          <p className="text-sm text-red-500">{errors.firstNameAr}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name / اسم العائلة <span className="text-red-500">*</span></Label>
        <Input
          id="lastName"
          name="lastName"
          required
          dir="ltr"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          className={errors.lastName ? "border-red-500" : ""}
        />
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName}</p>
        )}
        <Input
          id="lastNameAr"
          name="lastNameAr"
          required
          dir="rtl"
          value={formData.lastNameAr}
          onChange={handleInputChange}
          placeholder="أدخل اسم العائلة"
          className={`mt-2 ${errors.lastNameAr ? "border-red-500" : ""}`}
        />
        {errors.lastNameAr && (
          <p className="text-sm text-red-500">{errors.lastNameAr}</p>
        )}
      </div>
    </div>
  );
};

export default NameFields;