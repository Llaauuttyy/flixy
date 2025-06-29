import { number, z } from 'zod'

export const SignupFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: 'Name must be at least 2 characters long.' }),
    surname: z
        .string()
        .trim()
        .min(2, { message: 'Surname must be at least 2 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .trim()
        .min(4, { message: 'Be at least 4 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' }),
    // .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
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
    accessToken: string,
    expiresAt: Date
    // role: String,
}