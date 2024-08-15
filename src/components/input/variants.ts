import { cva } from "class-variance-authority";

export const InputVariants = cva(
  `peer h-full w-full rounded-[7px] border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-t-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:cursor-not-allowed disabled:border disabled:bg-gray-50`,
  {
    variants: {
      invalid: {
        default: "",
        true: "border-red-500 border-t-transparent placeholder-shown:border-t-red-500 focus:border-red-500 focus:border-t-transparent",
      },
      success: {
        default: "",
        true: "border-green-500 border-t-transparent placeholder-shown:border-t-green-500 focus:border-green-500 focus:border-t-transparent",
      },
    },
    defaultVariants: {
      invalid: "default",
      success: "default",
    },
  },
);

export const LabelVariants = cva(
  `"before:content-[' '] after:content-[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-[1.5] text-gray-400 transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-gray-200 before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-gray-200 after:transition-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-[1.5] peer-focus:text-blue-500 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:border-blue-500 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:border-blue-500 peer-disabled:text-gray-400/80"`,
  {
    variants: {
      invalid: {
        default: "",
        true: "text-red-500 before:border-red-500 after:border-red-500 peer-focus:text-red-500 peer-focus:before:border-red-500 peer-focus:after:border-red-500",
      },
      success: {
        default: "",
        true: "text-green-500 before:border-green-500 after:border-green-500 peer-focus:text-green-500 peer-focus:before:border-green-500 peer-focus:after:border-green-500",
      },
    },
    defaultVariants: {
      invalid: "default",
      success: "default",
    },
  },
);
