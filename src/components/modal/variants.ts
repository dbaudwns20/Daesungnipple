import { cva } from "class-variance-authority";

export const ModalVariants = cva(
  `absolute
   left-1/2
   top-1/2
   -translate-x-1/2
   -translate-y-1/2
   rounded-md
   overflow-hidden
   bg-white
   shadow-lg
   dark:bg-gray-800`,
  {
    variants: {},
    defaultVariants: {},
  },
);
