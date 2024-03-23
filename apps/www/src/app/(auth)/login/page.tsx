import { __env } from '@/config/env'

import Link from 'next/link'
import { UserAuthForm } from '@/client/components/user-auth-form'
export default async function LoginForm({ searchParams }: { searchParams?: { message?: string } }) {
  /*   const cookieStore = cookies()

  const supabase = createClient(cookieStore)

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  console.log('session', session)
  console.log('error', error)
  if (session) {
    redirect(`/profile/settings?message=You are al`)
  }
  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `http://localhost:3000/api/github/oauth/callback`,
      },
    })

    if (error) {
      console.log(error.message)
      return redirect(`/login?message=${error.message}`)
    } else {
      return redirect(data.url)
    }
  } */

  return (
    <div className="flex min-h-[400px] min-w-[400px] flex-col items-center rounded-md border-2 bg-white/20 p-7">
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/signup" className="hover:text-brand underline underline-offset-4">
          Don&apos;t have an account? Sign Up
        </Link>
      </p>
    </div>
  )
}
