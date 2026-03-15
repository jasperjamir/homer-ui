import type { TName } from "@/Shared/models";

export function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function formatName(name: TName): string {
  const middle = name.middle ? ` ${name.middle.charAt(0)}.` : "";
  return `${name.first}${middle} ${name.last}`;
}

export function getInitials(firstName: string = "", lastName: string = ""): string {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${firstInitial}${lastInitial}` || "U";
}

export function getInitialsFromName(name: string | TName | undefined): string {
  if (!name) return "U";
  if (typeof name === "string") {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return getInitials(parts[0], parts[parts.length - 1]);
  }
  return getInitials(name.first, name.last);
}
