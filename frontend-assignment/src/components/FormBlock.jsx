import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import runUserLogic from "../utils/logicSandbox";

export default function FormBlock(props) {
  const {
    title,
    description,
    className,
    fields = [],
    submitText = "Submit",
    onSubmit: onSubmitLogicString,
  } = props;

  const normalizeFieldName = (labelOrName) =>
    String(labelOrName || "field")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const defaultValues = useMemo(() => {
    const values = {};
    fields.forEach((field, index) => {
      const key = normalizeFieldName(field.name || field.label || `field_${index}`);
      const defaultValue = field.defaultValue ?? (field.type === "checkbox" ? false : "");
      values[key] = defaultValue;
    });
    return values;
  }, [fields]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ defaultValues });

  const [submitMessage, setSubmitMessage] = useState("");
  const [submitIsError, setSubmitIsError] = useState(false);

  const buildValidation = (field) => {
    const validation = {};
    if (field.required) validation.required = `${field.label || field.name || "Field"} is required`;
    if (typeof field.min !== "undefined") validation.min = field.min;
    if (typeof field.max !== "undefined") validation.max = field.max;
    if (typeof field.minLength !== "undefined") validation.minLength = field.minLength;
    if (typeof field.maxLength !== "undefined") validation.maxLength = field.maxLength;
    if (field.type === "email") validation.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (field.pattern) {
      try {
        // support both plain strings and "/expr/flags" style
        const patternSource = String(field.pattern);
        const match = patternSource.match(/^\/(.*)\/([gimsuy]*)$/);
        validation.pattern = match ? new RegExp(match[1], match[2]) : new RegExp(patternSource);
      } catch {
        // ignore invalid pattern
      }
    }
    return validation;
  };

  const onSubmit = (values) => {
    try {
      if (onSubmitLogicString && typeof onSubmitLogicString === "string") {
        const result = runUserLogic(onSubmitLogicString, values);
        if (typeof result === "string") {
          setSubmitMessage(result);
          setSubmitIsError(true);
          return;
        }
      }
      setSubmitMessage("Submitted!" + "\n" + JSON.stringify(values, null, 2));
      setSubmitIsError(false);
    } catch (err) {
      setSubmitMessage(`Submission error: ${err.message}`);
      setSubmitIsError(true);
    }
  };

  const renderInput = (field, index) => {
    const key = normalizeFieldName(field.name || field.label || `field_${index}`);
    const commonProps = {
      id: key,
      className:
        "mt-1 block w-full border border-gray-300 bg-white px-3 py-2 text-sm  focus:shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all duration-300 ease-in-out  focus:outline-none ",
      placeholder: field.placeholder,
      ...register(key, buildValidation(field)),
    };

    switch (field.type) {
      case "textarea":
        return <textarea rows={field.rows || 4} {...commonProps} />;
      case "select":
        return (
          <select {...commonProps}>
            <option value="" disabled={!!field.required}>
              {field.placeholder || "Select..."}
            </option>
            {(field.options || []).map((opt, i) => {
              const [value, label] = Array.isArray(opt) ? opt : [opt?.value ?? opt, opt?.label ?? String(opt)];
              return (
                <option key={`${key}-opt-${i}`} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register(key, buildValidation(field))}
          />
        );
      case "number":
      case "email":
      case "password":
      case "text":
      default:
        return <input type={field.type || "text"} {...commonProps} />;
    }
  };

  return (
    <div className={className || "bg-[#FEFDDD]  p-8"}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        {fields.map((field, index) => {
          const key = normalizeFieldName(field.name || field.label || `field_${index}`);
          const labelText = field.label ?? field.name ?? key;
          return (
            <div key={`${key}-${index}`} className="flex flex-col gap-1.5">
              <label htmlFor={key} className="text-sm font-medium text-gray-800">
                {labelText}
                {field.required && <span className="text-red-500"> *</span>}
              </label>
              {renderInput(field, index)}
              {errors?.[key] && (
                <p className="text-xs text-red-600">{errors[key]?.message || "Invalid value"}</p>
              )}
            </div>
          );
        })}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center  bg-[#FE8EC8] cursor-pointer px-5 py-3 text-sm font-medium hover:scale-95 active:scale-90 transition-all duration-300 ease-in-out shadow-[5px_5px_0px_rgba(0,0,0,1)]  text-black focus:outline-none  disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : submitText}
          </button>
          <button
            type="button"
            onClick={() => {
              reset(defaultValues);
              setSubmitMessage("");
              setSubmitIsError(false);
            }}
            className="inline-flex items-center justify-center  bg-[#628AFB] cursor-pointer px-3.5 py-1.5 hover:scale-95 active:scale-90 transition-all duration-300 ease-in-out shadow-[5px_5px_0px_rgba(0,0,0,1)]  text-sm font-medium text-gray-800  focus:outline-none"
          >
            Reset
          </button>
        </div>
      </form>

      {submitMessage && (
        <pre
          className={`${
            submitIsError ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
          } mt-5 whitespace-pre-wrap break-words rounded-md border px-3 py-2 text-sm`}
        >
          {submitMessage}
        </pre>
      )}
    </div>
  );
}
