import { useForm } from "react-hook-form";
import { useState } from "react"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Loader2 } from "lucide-react"
import { SignupFormSchema } from "../lib/definitions";

// Tipo derivado del esquema con zod
type FormData = z.infer<typeof SignupFormSchema>;

function RegisterForm() {
  // Estados reactivos que re-renderizan el componente al actualizarse.
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },  
  } = useForm<FormData>({
    resolver: zodResolver(SignupFormSchema),
  });


  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    setPending(true);

    console.log("Valid data:", data);

    // TODO: Llamar API.
    setTimeout(() => {
      setIsLoading(false);
    }, 1500)
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700"></span>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-gray-800 px-2 text-gray-400"></span>
          </div>
        </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <div>
          <Label htmlFor="name" className="text-gray-300">
            Name
          </Label>
        </div>
        <Input {...register("name")}
          id="name"
          name="name"
          type="name"
          placeholder="name"
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <div>
          <Label htmlFor="surname" className="text-gray-300">
            Surname
          </Label>
        </div>
        <Input {...register("surname")}
          id="surname"
          name="surname"
          type="surname"
          placeholder="surname"
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
        />
        {errors.surname && <p style={{ color: "red" }}>{errors.surname.message}</p>}
      </div>

      <div className="space-y-2">
        <div>
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
        </div>
        <Input {...register("email")}
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="password" className="text-gray-300">
                Password
            </Label>
          </div>
        </div>
        <Input {...register("password")}
          id="password"
          name="password"
          type="password"
          placeholder="password"
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Input {...register("confirmPassword")}
          id="password"
          name="confirmPassword"
          type="password"
          placeholder="confirm password"
          required
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
          />
          {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>}
      </div>

      <Button
        disabled={pending}
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
              Registering...
            </>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>

    </div>
  </div>
  );
}

export default RegisterForm;
