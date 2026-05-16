import { useCallback, useState } from "react";

export interface ValidationRule {
  required?: boolean | string;
  email?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: string) => string | true;
}

export interface FormConfig<T extends Record<string, string>> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule>>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, string>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: FormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: string): string => {
      const rules = validationRules[name];
      if (!rules) return "";

      if (rules.required && !value.trim()) {
        return typeof rules.required === "string"
          ? rules.required
          : `${String(name)} 是必填项`;
      }

      if (rules.email && value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return typeof rules.email === "string"
            ? rules.email
            : "请输入有效的邮箱地址";
        }
      }

      if (rules.minLength && value.length < rules.minLength.value) {
        return rules.minLength.message;
      }

      if (rules.maxLength && value.length > rules.maxLength.value) {
        return rules.maxLength.message;
      }

      if (rules.pattern && !rules.pattern.value.test(value)) {
        return rules.pattern.message;
      }

      if (rules.validate) {
        const result = rules.validate(value);
        if (typeof result === "string") return result;
      }

      return "";
    },
    [validationRules],
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let valid = true;
    for (const key of Object.keys(validationRules) as (keyof T)[]) {
      const err = validateField(key, values[key] ?? "");
      if (err) {
        newErrors[key] = err;
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  }, [values, validationRules, validateField]);

  const handleChange = useCallback(
    (name: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => {
        if (!prev[name]) return prev;
        // Re-validate only if already touched
        const err = validateField(name, value);
        setErrors((e) => ({ ...e, [name]: err || undefined }));
        return prev;
      });
    },
    [validateField],
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const err = validateField(name, values[name] ?? "");
      setErrors((prev) => ({ ...prev, [name]: err || undefined }));
    },
    [values, validateField],
  );

  const handleSubmit = useCallback(async () => {
    const allTouched: Partial<Record<keyof T, boolean>> = {};
    for (const key of Object.keys(validationRules) as (keyof T)[]) {
      allTouched[key] = true;
    }
    setTouched(allTouched);

    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, validateAll, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setValue = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
  };
}
