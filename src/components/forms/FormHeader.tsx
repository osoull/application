import React from "react";

const FormHeader = () => {
  return (
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
  );
};

export default FormHeader;