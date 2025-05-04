import { number, z } from 'zod'
 
export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    surname: z
        .string()
        .min(2, { message: 'Surname must be at least 2 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(4, { message: 'Be at least 4 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        // .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
        .trim(),
    confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
})
 
export type FormState =
    | {
        errors?: {
            name?: string[]
            surname?: string[]
            email?: string[]
            password?: string[]
            confirmPassword?: string[]
        }
        message?: string
        }
    | undefined


export type SessionPayload = {
    userId: string,
    expiresAt: Date
    // role: String,
}