export default function VerifyNotice({ email, isDark }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="rounded-3xl border p-8 text-center shadow-xl max-w-md">
        <h1 className="text-2xl font-bold">Verify your email 📧</h1>

        <p className="mt-4 text-sm text-slate-500">
          We’ve sent a verification link to:
        </p>

        <p className="mt-2 font-semibold text-cyan-500">
          {email || "your email"}
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Please check your inbox and click the link to activate your account.
        </p>

      </div>
    </div>
  );
}