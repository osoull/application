import React from "react";
import { Button } from "@/components/ui/button";

interface FormSubmitButtonProps {
  isSubmitting: boolean;
}

const FormSubmitButton = ({ isSubmitting }: FormSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full bg-rasin-primary hover:bg-opacity-90"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting... / جارٍ الإرسال..." : "Submit Application / إرسال الطلب"}
    </Button>
  );
};

export default FormSubmitButton;