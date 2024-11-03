import { useState } from "react";

export function useFormData<T>(initialValues: T) {
  const [formData, setFormData] = useState<T>(initialValues);

  const bindFormData = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return [formData, bindFormData] as const;
}
