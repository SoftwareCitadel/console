import AuthLayout from '@/layouts/auth_layout'
import { Link, useForm } from '@inertiajs/react'
import * as React from 'react'
import clsx from 'clsx'
import Button, { buttonVariants } from '@/components/button'
import useError from '@/hooks/use_error'
import Input from '@/components/input'
import Label from '@/components/label'
import SignInWithGitHub from '@/concerns/auth/components/sign_in_with_github'
import PasswordField from '@/components/password_field'
import isFeatureEnabled from '@/lib/is_feature_enabled'

interface SignInProps {}

const SignIn: React.FunctionComponent<SignInProps> = () => {
  const form = useForm({
    email: '',
    password: '',
  })
  const error = useError('auth')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let path = `/auth/sign_in`
    if (window.location.search.includes('next=')) {
      path += window.location.search
    }
    form.post(path)
  }

  return (
    <AuthLayout>
      {isFeatureEnabled('sign_up') && (
        <Link
          className={clsx(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
          // Preserve the query string when redirecting to the sign up page
          href={'/auth/sign_up' + window.location.search}
        >
          Create an account
        </Link>
      )}

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight font-clash">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Software Citadel account.
            </p>
          </div>
          <div className="grid gap-6">
            {isFeatureEnabled('sign_in:github') && <SignInWithGitHub />}

            <form onSubmit={onSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label>Email Address</Label>
                  <Input
                    id="email"
                    placeholder="john.doe@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={form.processing}
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                  />
                </div>
                <PasswordField
                  id="password"
                  name="password"
                  divClassName="grid gap-1"
                  label="Password"
                  disabled={form.processing}
                  value={form.data.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                />
                <div className="flex justify-end text-sm">
                  <Link className="link" href="/auth/forgot_password">
                    Forgot your password?
                  </Link>
                </div>
                {error && (
                  <p className="text-sm text-red-500" id="auth-error">
                    {error}
                  </p>
                )}
                <Button loading={form.processing} type="submit">
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default SignIn
