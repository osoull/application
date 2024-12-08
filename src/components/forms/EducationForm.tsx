import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EducationFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  errors: Record<string, string>;
}

const EducationForm = ({ formData, handleInputChange, handleSelectChange, errors }: EducationFormProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="educationLevel">Education Level / المستوى التعليمي <span className="text-red-500">*</span></Label>
          <Select
            name="educationLevel"
            value={formData.educationLevel}
            onValueChange={(value) => handleSelectChange("educationLevel", value)}
          >
            <SelectTrigger className={errors.educationLevel ? "border-red-500" : ""}>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School / ثانوي</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree / بكالوريوس</SelectItem>
              <SelectItem value="masters">Master's Degree / ماجستير</SelectItem>
              <SelectItem value="phd">PhD / دكتوراه</SelectItem>
            </SelectContent>
          </Select>
          {errors.educationLevel && (
            <p className="text-sm text-red-500">{errors.educationLevel}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="major">Major / التخصص <span className="text-red-500">*</span></Label>
          <Input
            id="major"
            name="major"
            required
            value={formData.major}
            onChange={handleInputChange}
            placeholder="e.g., Computer Science"
            className={errors.major ? "border-red-500" : ""}
          />
          {errors.major && (
            <p className="text-sm text-red-500">{errors.major}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="university">University / الجامعة <span className="text-red-500">*</span></Label>
          <Input
            id="university"
            name="university"
            required
            value={formData.university}
            onChange={handleInputChange}
            placeholder="Enter university name"
            className={errors.university ? "border-red-500" : ""}
          />
          {errors.university && (
            <p className="text-sm text-red-500">{errors.university}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="graduationYear">Graduation Year / سنة التخرج <span className="text-red-500">*</span></Label>
          <Select
            name="graduationYear"
            value={formData.graduationYear?.toString()}
            onValueChange={(value) => handleSelectChange("graduationYear", value)}
          >
            <SelectTrigger className={errors.graduationYear ? "border-red-500" : ""}>
              <SelectValue placeholder="Select graduation year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.graduationYear && (
            <p className="text-sm text-red-500">{errors.graduationYear}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationForm;