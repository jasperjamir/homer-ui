"use client";

import {
  LOGO_HORIZONTAL_URL,
  LOGO_LOGIN_URL,
  LOGO_SQUARE_URL,
} from "@/Shared/config/brand";
import { cn } from "@/Shared/utils";

type BrandLogoVariant = "square" | "horizontal" | "login";

const variantToUrl: Record<BrandLogoVariant, string | undefined> = {
  square: LOGO_SQUARE_URL,
  horizontal: LOGO_HORIZONTAL_URL,
  login: LOGO_LOGIN_URL,
};

export function BrandLogo({
  variant,
  className,
  alt = "Logo",
}: {
  variant: BrandLogoVariant;
  className?: string;
  alt?: string;
}) {
  const url = variantToUrl[variant];

  if (!url) {
    return null;
  }

  return (
    <img
      src={url}
      alt={alt}
      className={cn("select-none object-contain", className)}
    />
  );
}
