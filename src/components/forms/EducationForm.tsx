import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EducationFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const EducationForm = ({ formData, handleInputChange, handleSelectChange }: EducationFormProps) => {
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
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high_school">High School / ثانوي</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree / بكالوريوس</SelectItem>
              <SelectItem value="masters">Master's Degree / ماجستير</SelectItem>
              <SelectItem value="phd">PhD / دكتوراه</SelectItem>
            </SelectContent>
          </Select>
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
          />
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="graduationYear">Graduation Year / سنة التخرج <span className="text-red-500">*</span></Label>
          <Select
            name="graduationYear"
            value={formData.graduationYear?.toString()}
            onValueChange={(value) => handleSelectChange("graduationYear", value)}
          >
            <SelectTrigger>
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
        </div>
      </div>
    </div>
  );
};

export default EducationForm;