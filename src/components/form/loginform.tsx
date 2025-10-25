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
    <div className="min-h-screen flex items-center justify-center ">

      {/* orb*/}

      {/* <div className="absolute inset-0 -z-10 pointer-events-none"> */}

      <div className="orb-layer">
        <div className="gradient-orb"></div>
        <div className="gradient-orb2"></div>
      </div>
      {/* </div> */}

      {/* 🧱 Card container */}
      <div className="w-full  max-w-[560px] rounded-2xl">
        <Card className="card-container  md:flex relative z-10  w-full font-popins border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl">

          {/* โลโก้ลอย มุมขวาบน */}
          <div className="absolute top-5 right-9 w-16 h-16 rounded-full  shadow-lg bg-white/80 backdrop-blur">
            <img src="/logo.png" alt="Logo" className="object-cover w-full h-full rounded-full " />
          </div>
          <form className="p-6 md:p-8">
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
     .orb-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.gradient-orb,
.gradient-orb2 {
  position: absolute;
  width: 35vmin;
  height: 35vmin;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.75;
  mix-blend-mode: lighten;
  animation: floatOrb 10s ease-in-out infinite alternate;
}

.gradient-orb {
  background: radial-gradient(circle at 30% 30%, #c48aff 0%, #b294fa 45%, transparent 75%);
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.gradient-orb2 {
  background: radial-gradient(circle at 70% 70%, #b294fa 0%, #c48aff 45%, transparent 75%);
  bottom: 10%;
  right: 10%;
  opacity: 0.6;
  animation-delay: 0s;
}

@keyframes floatOrb {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(8vw, -5vh) scale(1.05); }
  50%  { transform: translate(-3vw, 8vh) scale(0.95); }
  75%  { transform: translate(6vw, 4vh) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}`
}

      </style>
    </div>
  );
}