import { number, z } from 'zod'

export const SignupFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: 'Name must be at least 2 characters long.' }),
    username: z
        .string()
        .trim()
        .min(2, { message: 'Username must be at least 2 characters long.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .trim()
        .min(4, { message: 'Be at least 4 characters long' })
        .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter.' })
        .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter.' })
        .regex(/[0-9]/, { message: 'Must contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Must contain at least one special character.' }),
    confirmPassword: z.string().trim(),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
    })

export const PasswordFormSchema = z.object({
    currentPassword: z.string(),
    newPassword: z
        .string()
        .trim()
        .min(4, { message: 'Be at least 4 characters long' })
        .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter.' })
        .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter.' })
        .regex(/[0-9]/, { message: 'Must contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Must contain at least one special character.' }),
    confirmNewPassword: z.string().trim(),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        path: ['confirmNewPassword'],
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