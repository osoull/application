import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SuccessNotificationProps {
  firstName: string;
  firstNameAr: string;
}

const SuccessNotification = ({ firstName, firstNameAr }: SuccessNotificationProps) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 text-center space-y-6 bg-rasin-gray border-none shadow-xl">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-rasin-primary">
            Application Submitted! / تم إرسال الطلب!
          </h2>
          
          <div className="space-y-2">
            <p className="text-lg text-rasin-text">
              Thank you {firstName}, we will contact you soon.
            </p>
            <p className="text-lg text-rasin-text" dir="rtl">
              شكراً {firstNameAr}، سنتواصل معك قريباً.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <img 
            src="https://haovnjkyayiqenjpvlfb.supabase.co/storage/v1/object/public/platform-assets/logo.svg" 
            alt="Racine Investment Company Logo" 
            className="h-12" 
          />
        </div>
      </Card>
    </div>
  );
};

export default SuccessNotification;