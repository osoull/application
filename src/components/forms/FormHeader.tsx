const FormHeader = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Senior Frontend Developer</h1>
      <p className="text-gray-600">
        Join our team! Please fill out the application form below. All fields marked with <span className="text-red-500">*</span> are required.
      </p>
      <p className="text-gray-600" dir="rtl">
        انضم إلى فريقنا! يرجى ملء نموذج الطلب أدناه. جميع الحقول المميزة بـ <span className="text-red-500">*</span> مطلوبة.
      </p>
    </div>
  );
};

export default FormHeader;