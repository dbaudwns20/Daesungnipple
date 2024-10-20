import { cva } from "class-variance-authority";

export type ButtonColorType =
  | "black"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "white";

export type ButtonSizeType = "xs" | "sm" | "md" | "lg" | "xl";

export const ButtonVariants = cva(
  `flex
   items-center
   justify-center
   rounded-lg
   select-none
   font-sans
   font-semibold
   text-white
   shadow-md
   shadow-gray-900/10
   transition-all
   focus:opacity-[0.85]
   focus:shadow-none
   focus:outline-2
   disabled:cursor-not-allowed
   disabled:opacity-50 disabled:shadow-none
   [&:not(:disabled)]:hover:shadow-gray-900/20
   [&:not(:disabled)]:active:opacity-[0.85]
   [&:not(:disabled)]:active:shadow-none`,
  {
    variants: {
      color: {
        black: "bg-gray-900 focus:outline-gray-400",
        blue: "bg-blue-500 focus:outline-blue-300",
        red: "bg-red-500 focus:outline-red-300",
        green: "bg-green-500 focus:outline-green-200",
        yellow: "bg-yellow-400 focus:outline-yellow-300",
        white: "bg-white text-gray-900 focus:outline-gray-200",
      },
      size: {
        xs: "h-7 px-1.5 text-xs",
        sm: "h-9 px-2 text-sm",
        md: "h-10 px-3 text-base",
        lg: "h-12 px-4 text-lg",
        xl: "h-14 px-5 text-xl",
      },
    },
    defaultVariants: {
      color: "black",
      size: "md",
    },
  },
);
