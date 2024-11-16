import { forwardRef } from "react";

export const Textarea = forwardRef((props: any, ref) => {
  return (
    <textarea
      ref={ref}
      {...props}
      className="h-32 w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
});
Textarea.displayName = "Textarea";
