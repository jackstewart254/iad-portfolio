import RegisterForm from "@/components/register-form";

const Register = () => {
  return (
    <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register;