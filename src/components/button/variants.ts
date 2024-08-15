import { cva } from "class-variance-authority";

export type ButtonColorType = "default" | "red" | "blue" | "green" | "yellow";

export type ButtonSizeType = "md" | "lg" | "sm" | "xl";

export const ButtonVariants = cva(
  `flex h-12 select-none items-center justify-center rounded-lg bg-gray-900 px-4 py-2 font-sans text-base font-bold text-white shadow-md shadow-gray-900/10 transition-all focus:opacity-[0.85] focus:shadow-none focus:outline-2 focus:outline-gray-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none [&:not(:disabled)]:hover:shadow-gray-900/20 [&:not(:disabled)]:active:opacity-[0.85] [&:not(:disabled)]:active:shadow-none`,
  {
    variants: {
      color: {
        default: "",
        blue: "bg-blue-500 focus:outline-blue-300",
        red: "bg-red-500 focus:outline-red-300",
        green: "bg-green-500 focus:outline-green-200",
        yellow: "bg-yellow-400 focus:outline-yellow-300",
      },
      size: {
        default: "",
        md: "",
      },
    },
    defaultVariants: {
      color: "default",
      size: "default",
    },
  },
);
