'use client'

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, Control } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/ui/components/input";
import { FieldPath } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authState } from "@/app/state/authstate";

import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import { Alert, AlertDescription } from "@/ui/components/alert";
import { useAtom } from "jotai";
import { modalOpenState } from "../state/modalOpenState";

interface FormType {
  type: "signup" | "signin";
  onSuccess?: () => void;
}

const schemas = {
  signup: CreateUserSchema,
  signin: SigninSchema,
} as const;

type Errors = {
  fieldName: {
    "message": string,
    "type": string,
  }
}

export const SignupSigninForm = ({ type, onSuccess }: FormType) => {
  const [isAuthenticated, setIsAuthenticated] = useAtom(authState);
  const [authType, setAuthType] = useAtom(modalOpenState);
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const schema = schemas[type];

  const defaultValues =
    type && type === "signup"
      ? { name: "", username: "", password: ""}
      : { username: "", password: "" };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      const endpoint = type === "signup" 
        ? "http://localhost:5000/api/v1/user/signup" 
        : "http://localhost:5000/api/v1/user/signin";
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      if (data.token) {
        // Store JWT token in localStorage
        localStorage.setItem('authToken', data.token);
      }
      
      setIsAuthenticated(true);
      setAuthType(undefined);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      router.push('/lobby');
      
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: Errors) => {
    console.log(errors)
    const firstError = Object.values(errors)
      .find((fieldError) => fieldError?.message);
    if (firstError && firstError.message ) {
      setServerError(firstError.message as unknown as string);
    } else {
      setServerError("Please fix the errors in the form");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
        {serverError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        
        {type === "signup" && (
          <FormField name="name" label="Name" formControl={form.control} inputType="text"/>
        )}
        <FormField name="username" label="Email" formControl={form.control} inputType="email"/>
        <FormField
          name="password"
          label="Password"
          formControl={form.control}
          inputType="password"
        />
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : type === "signin" ? "Log in" : "Sign Up"}
        </button>
        {type === "signin" && (
          <div className="mt-2 text-sm text-gray-600">
            Forgot your password?{" "}
            <a href="/reset-password" className="text-blue-600 hover:underline">Reset it here</a>
          </div>
        )}
      </form>
    </Form>
  );
};

interface FormFieldProps<T extends z.ZodType<any, any>> {
  name: keyof z.infer<T>; // Ensures name matches the schema fields
  label: string;
  inputType?: string;
  placeholder?: string;
  description?: string;
  formControl: Control<z.infer<T>>;
}

const FormField = <T extends z.ZodType<any, any>>({
  name,
  label,
  inputType,
  placeholder,
  formControl,
  description,
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={formControl}
      name={name as FieldPath<z.infer<T>>}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-2">
          <FormLabel className="block mb-2">{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              {...field}
              className={`focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-300 ${
                fieldState.error ? "border-red-500" : ""
              }`}
            />
          </FormControl>
          {description && <FormDescription className="mt-1">{description}</FormDescription>}
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};