// import { SignupFormSchema, FormState } from '@/app/lib/definitions'
// import { redirect } from "next/dist/server/api-utils"
import { SignupFormSchema, type FormState } from "../../lib/definitions"
import { createSession } from "../../lib/session"
// import { deleteSession } from '../../lib/session'

// export async function signup(formData: FormData) {}

// import bcrypt from 'bcrypt';
 
export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    surname: formData.get('surname'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    console.log("Bad form.")
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { 
    name, 
    surname, 
    email, 
    password, 
    confirmPassword 
  } = validatedFields.data

  // const hashedPassword = await bcrypt.hash(password, 10)
  // Call API to create user on DB. Send hashedPassword.
  console.log("Creadndo usuario en la BD via API...")

  // Call the provider or db to create a user...
  const user_id = "5"; // Replace with actual user ID from DB

  await createSession("5")

  // create view home to send the user after creating session.
  // redirect('/home')
  
}
 
export async function logout() {
  // await deleteSession()
  // redirect('/login')
}