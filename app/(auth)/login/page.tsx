import LoginCard from './login-card'

export default async function Login() {
  return (
    <div className=" flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Log in to SnapNext
      </h1>
      <LoginCard />
    </div>
  )
}
