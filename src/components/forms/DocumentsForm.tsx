import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DocumentsFormProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentsForm = ({ handleFileChange }: DocumentsFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter / خطاب التقديم (PDF) <span className="text-red-500">*</span></Label>
        <Input
          id="coverLetter"
          name="coverLetter"
          type="file"
          accept=".pdf"
          required
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">CV/Resume (PDF) / السيرة الذاتية <span className="text-red-500">*</span></Label>
        <Input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf"
          required
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default DocumentsForm;