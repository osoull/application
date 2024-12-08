import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PersonalInfoForm = ({ formData, handleInputChange }: PersonalInfoFormProps) => {
  return (
    <div className="space-y-6">
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
          />
          <Input
            id="firstNameAr"
            name="firstNameAr"
            required
            dir="rtl"
            value={formData.firstNameAr}
            onChange={handleInputChange}
            placeholder="أدخل اسمك الأول"
            className="mt-2"
          />
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
          />
          <Input
            id="lastNameAr"
            name="lastNameAr"
            required
            dir="rtl"
            value={formData.lastNameAr}
            onChange={handleInputChange}
            placeholder="أدخل اسم العائلة"
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email / البريد الإلكتروني <span className="text-red-500">*</span></Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@domain.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone / رقم الهاتف <span className="text-red-500">*</span></Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+966 XX XXX XXXX"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile <span className="text-red-500">*</span></Label>
          <Input
            id="linkedin"
            name="linkedin"
            type="url"
            required
            value={formData.linkedin}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio Website</Label>
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            type="url"
            value={formData.portfolioUrl}
            onChange={handleInputChange}
            placeholder="https://your-portfolio.com"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;