"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useSession } from "@/providers/SessionProvider"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const success = await login(email, password);
    if (success) {
      setLoading(false);
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🔮 Floating orbs behind everything */}
      <div className="absolute bsolute inset-0 -z-0 pointer-events-none ">
        <div className="gradient-orb"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      {/* 🧱 Card container */}
      <div className="w-full z-0 max-w-[720px] rounded-lg shadow-xl">
        <Card className="w-full overflow-hidden font-popins border-none">
          <div className="absolute top-[20px] right-[36px] w-16 h-16 rounded-full overflow-hidden shadow-lg bg-white">
            <img src="/logo.png" alt="Logo" className="object-cover w-full h-full" />
          </div>

          <form className="md:p-8 ">
            <FieldGroup>
              {/* Text first */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Lynx Track</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your email to sign in to your account.
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@lynx.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldError>{error && " "}</FieldError>
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#c48aff] to-[#b294fa] text-white hover:opacity-90 transition"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </Card>
      </div>
      <style jsx>{`
  .gradient-orb {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50vmin;
    height: 50vmin;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle at 40% 40%, #c48aff 0%, #b294fa 45%, transparent 75%);
    filter: blur(180px);
    opacity: 0.75;
    animation: bounceOrb 10s ease-in-out infinite;
  }

  .gradient-orb.orb-2 {
    width: 40vmin;
    height: 40vmin;
    opacity: 0.5;
    filter: blur(160px);
    animation: bounceOrb2 12s ease-in-out infinite;
  }

  @keyframes bounceOrb {
    0%   { transform: translate(-50%, -50%) scale(1); }
    25%  { transform: translate(calc(-50% - 25vw), calc(-50% - 10vh)) scale(1.1); }
    50%  { transform: translate(calc(-50% + 25vw), calc(-50% + 10vh)) scale(1.1); }
    75%  { transform: translate(calc(-50% - 25vw), calc(-50% + 5vh)) scale(1.05); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }

  @keyframes bounceOrb2 {
    0%   { transform: translate(-50%, -50%) scale(1); }
    30%  { transform: translate(calc(-50% + 20vw), calc(-50% - 15vh)) scale(1.1); }
    60%  { transform: translate(calc(-50% - 25vw), calc(-50% + 15vh)) scale(1.1); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }
`}</style>

    </div>
  );
}
