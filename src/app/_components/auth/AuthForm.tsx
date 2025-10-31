"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/CheckBox";
import { Input } from "../ui/Input";

type Field = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
};

type AuthFormProps = {
  imageLink: string;
  fields?: Field[]; // ✅ Now optional
  buttonLabel: string;
  onSubmit: (values: Record<string, string | boolean>) => void;
  showRemember?: boolean;
  showForgotLink?: boolean;
  heading: string;
  description: string;
  extraContent?: React.ReactNode; // ✅ Should also be optional ideally
  btnLink?: string;
};

export const AuthForm = ({
  imageLink,
  fields,
  buttonLabel,
  onSubmit,
  showRemember = false,
  showForgotLink = false,
  heading,
  description,
  extraContent,
  btnLink,
}: AuthFormProps) => {
  const initialValues =
    fields?.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}) || {};

  const [formValues, setFormValues] =
    useState<Record<string, string | boolean>>(initialValues);
  const [remember, setRemember] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formValues, remember });
    console.log("🚀 ~ handleSubmit ~ formValues:", formValues);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white grid grid-cols-1 md:grid-cols-2 min-h-screen shadow-md">
        {/* Left Image */}
        <div className="relative hidden md:block">
          <Image
            src={imageLink}
            alt="Login Image"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>

        {/* Right Login Form */}
        <div className="p-10 flex flex-col justify-evenly items-center  h-[90%]">
          <div className="flex justify-center mb-6 p-5 bg-zinc-200 size-[200px] mx-auto rounded-full">
            <Image
              src="/images/auth/logo.png"
              alt="KBA Logo"
              width={150}
              height={150}
              objectFit="cover"
            />
          </div>

          <div className="w-full">
            <h2 className="text-3xl font-semibold text-start mb-2 text-zinc-950">
              {heading}
            </h2>
            <p className="text-md text-start text-zinc-800 mb-6">
              {description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {/* ✅ Only map fields if they exist */}
              {fields?.map((field) => (
                <div key={field.name}>
                  <label className="text-zinc-950 text-sm font-medium">
                    {field.label}
                  </label>
                  <Input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={String(formValues[field.name] || "")}
                    onChange={handleChange}
                    className="mt-1 text-zinc-700"
                  />
                </div>
              ))}

              {(showRemember || showForgotLink) && (
                <div className="flex items-center justify-between text-sm text-zinc-900">
                  {showRemember && (
                    <label className="text-zinc-950 flex items-center gap-2">
                      <Checkbox
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      Remember password
                    </label>
                  )}
                  {showForgotLink && (
                    <Link
                      href="/forgot-pass"
                      className="text-zinc-800 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
              )}

              {/* Optional extra content */}
              {extraContent && <div className="mt-4">{extraContent}</div>}
              {btnLink ? (
                <Link href={btnLink}>
                  <Button
                    type="submit"
                    className="w-full text-white py-2 bg-gradient-to-tl from-[#002B14] via-[#4F7E65] to-[#002B14] hover:from-[#4F7E65] hover:via-[#002B14] hover:to-[#4F7E65]"
                  >
                    <span> {buttonLabel}</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  type="submit"
                  className="w-full text-white py-2 bg-gradient-to-tl from-[#002B14] via-[#4F7E65] to-[#002B14] hover:from-[#4F7E65] hover:via-[#002B14] hover:to-[#4F7E65]"
                >
                  <span> {buttonLabel}</span>
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
