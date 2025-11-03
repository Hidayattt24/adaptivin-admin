"use client";

import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showLogo?: boolean;
}

export default function AuthHeader({ title, subtitle, showLogo = true }: AuthHeaderProps) {
  return (
    <div className="text-center space-y-3">
      {showLogo && (
        <div className="flex justify-center mb-6">
          <Image
            src="/logo/logo-with-name.svg"
            alt="Adaptivin Logo"
            width={160}
            height={56}
            priority
          />
        </div>
      )}
      <h1 className="text-2xl font-semibold text-primary">
        {title}
      </h1>
      <p className="text-sm text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}
