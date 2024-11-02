import { RegisterForm } from "../../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Регистрация</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
