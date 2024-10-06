import { cva } from "class-variance-authority";

export type ToastColorType =
  | "black"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "white";

export type ToastSizeType = "xs" | "sm" | "md" | "lg" | "xl";

export const ToastVariants = cva(
  `absolute
   bottom-[10%]
   left-1/2
   z-40
   h-auto
   w-auto
   max-w-[30%]
   -translate-x-1/2
   animate-fadeIn
   whitespace-break-spaces
   rounded-lg
   text-center
   shadow-xl
   sm:max-w-[85%]
   md:max-w-[85%]`,
  {
    variants: {
      color: {
        black: "text-white bg-black/85",
        blue: "text-white bg-blue-500/85",
        red: "text-white bg-red-500/85",
        green: "text-white bg-green-500/85",
        yellow: "text-black bg-yellow-400/85",
        white: "text-black bg-white/85",
      },
      size: {
        xs: "text-xs px-8 py-1.5",
        sm: "text-sm px-10 py-2",
        md: "text-base px-12 py-2.5",
        lg: "text-lg px-14 py-3",
        xl: "text-xl px-16 py-3.5",
      },
    },
    defaultVariants: {
      color: "black",
      size: "md",
    },
  },
);
