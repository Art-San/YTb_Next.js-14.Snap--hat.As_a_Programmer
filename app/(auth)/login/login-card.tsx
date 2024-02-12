'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { authAction, authActionGoogle } from '@/lib/actions'
import { useFormStatus, useFormState } from 'react-dom'

export default function LoginCard() {
  const [errorMessage, dispatch] = useFormState(authAction, '') // или undefined

  return (
    <>
      <form action={dispatch} className="space-y-4">
        <LoginButton desc={'in with Github'} />
      </form>
      <form action={authActionGoogle} className="space-y-4">
        <LoginButton desc={'in with Google'} />
      </form>
      <div className="mt-4 text-center text-[13px]">
        <span>New To SnapNext? </span>
        <Link
          className="text-blue-500 hover:underline text-[13px] mr-1"
          href="/signup"
        >
          Sign Up
        </Link>
        {errorMessage ? (
          <p className="text-sm text-red-500">{errorMessage}</p>
        ) : null}
      </div>
    </>
  )
}

function LoginButton({ desc }: { desc: string }) {
  const { pending } = useFormStatus()
  return (
    <Button
      className="w-full flex gap-2"
      disabled={pending}
      aria-disabled={pending}
    >
      <Image src={'/github.svg'} width={20} height={20} alt="Github logo" /> Log
      {desc}
    </Button>
  )
}
