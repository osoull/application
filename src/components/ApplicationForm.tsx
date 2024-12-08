import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
    coverLetter: null as File | null,
    resume: null as File | null,
    expectedSalary: "",
    currentSalary: "",
    noticePeriod: "",
    yearsOfExperience: "",
    currentCompany: "",
    currentPosition: "",
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

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Application Submitted! / تم إرسال الطلب!",
      description: "We will contact you soon. / سنتواصل معك قريباً.",
    });

    setIsSubmitting(false);
    setFormData({
      firstName: "",
      firstNameAr: "",
      lastName: "",
      lastNameAr: "",
      email: "",
      phone: "",
      linkedin: "",
      coverLetter: null,
      resume: null,
      expectedSalary: "",
      currentSalary: "",
      noticePeriod: "",
      yearsOfExperience: "",
      currentCompany: "",
      currentPosition: "",
      specialMotivation: "",
    });
    setDate(undefined);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name / الاسم الأول</Label>
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
              <Label htmlFor="lastName">Last Name / اسم العائلة</Label>
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
              <Label htmlFor="email">Email / البريد الإلكتروني</Label>
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
              <Label htmlFor="phone">Phone / رقم الهاتف</Label>
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
              <Label htmlFor="currentCompany">Current Company / الشركة الحالية</Label>
              <Input
                id="currentCompany"
                name="currentCompany"
                required
                value={formData.currentCompany}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPosition">Current Position / المنصب الحالي</Label>
              <Input
                id="currentPosition"
                name="currentPosition"
                required
                value={formData.currentPosition}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary (SAR) / الراتب المتوقع</Label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                type="number"
                required
                value={formData.expectedSalary}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentSalary">Current Salary (SAR) / الراتب الحالي</Label>
              <Input
                id="currentSalary"
                name="currentSalary"
                type="number"
                required
                value={formData.currentSalary}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Availability Date / تاريخ الإتاحة</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date / اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noticePeriod">Notice Period / فترة الإشعار</Label>
              <Input
                id="noticePeriod"
                name="noticePeriod"
                required
                value={formData.noticePeriod}
                onChange={handleInputChange}
                placeholder="e.g., 2 months / مثال: شهرين"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialMotivation">Special Motivation for this Position / الدافع الخاص لهذا المنصب</Label>
            <Textarea
              id="specialMotivation"
              name="specialMotivation"
              required
              value={formData.specialMotivation}
              onChange={handleInputChange}
              placeholder="Please explain your special motivation for this position / يرجى توضيح دافعك الخاص لهذا المنصب"
              className="resize-none"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter / خطاب التقديم (PDF)</Label>
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
            <Label htmlFor="resume">CV/Resume (PDF) / السيرة الذاتية</Label>
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
