/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, EyeIcon, EyeOffIcon, LucideIcon } from "lucide-react";
import React, { HTMLInputTypeAttribute, useState } from "react";
import { Matcher } from "react-day-picker";
import { Control } from "react-hook-form";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/app/lib/utils";
import { Textarea } from "../ui/textarea";
import { SortableTechSelector } from "../../(dashboard)/personal_projects/components/sortable-tech-selector";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  NUMERICFORMAT = "NumericFormat",
  POPOVERCALENDER = "popover",
  SKELETON = "skeleton",
  SORTABLE_TECH_SELECTOR = "sortableTechSelector",
}

interface CustomFormFieldPros {
  control: Control<any>;
  fieldType: FormFieldType;
  formItemsClassName?: string;
  optional?: boolean;
  name: string;
  label: string;
  typeInput?: HTMLInputTypeAttribute | undefined;
  placeholder?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  disabled?: boolean;
  textareaClassName?: string;
  disabledCalendar?: Matcher | Matcher[] | undefined;
  renderSkeleton?: (field: any) => React.ReactNode;
  allTechnologies?: Array<{
    id: string;
    name: string;
    iconURL: string;
    description?: string;
  }>;
}

const RenderField = ({
  field,
  props,
}: {
  field: any;
  props: CustomFormFieldPros;
}) => {
  const {
    typeInput,
    placeholder,
    icon,
    fieldType,
    children,
    disabled,
    textareaClassName,
    disabledCalendar,
    renderSkeleton,
  } = props;
  const Icon = icon;

  const [showPassword, setShowPassword] = useState(false);

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center rounded-md border">
          {Icon && <Icon className="ml-3 size-5 text-primary/70" />}

          <FormControl>
            <Input
              type={
                typeInput === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : typeInput
              }
              placeholder={placeholder}
              {...field}
              className="h-11 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </FormControl>

          {typeInput === "password" && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="mr-3 size-5 cursor-pointer text-primary/70"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={field.value === "" && field.value !== undefined}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </Button>
          )}
        </div>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            className={textareaClassName}
            disabled={props.disabled}
            {...field}
          />
        </FormControl>
      );

    case FormFieldType.SELECT:
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          disabled={disabled}
        >
          <FormControl>
            <SelectTrigger className="!h-11 w-full cursor-pointer focus:!border-input focus:!ring-0 focus:!ring-offset-0">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>

          <SelectContent className="shad-select-content">
            {children}
          </SelectContent>
        </Select>
      );

    case FormFieldType.POPOVERCALENDER:
      return (
        <Popover>
          <PopoverTrigger asChild className="cursor-pointer">
            <FormControl>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn(
                  "h-11 w-full justify-start text-left font-normal focus-visible:border-border focus-visible:ring-0 focus-visible:ring-offset-0",
                  !field.value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="size-5 text-primary/70" />
                {field.value ? (
                  format(field.value, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={disabledCalendar}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      );

    case FormFieldType.SORTABLE_TECH_SELECTOR:
      return (
        <FormControl>
          <SortableTechSelector
            selectedTechnologies={field.value || []}
            allTechnologies={props.allTechnologies || []}
            onChange={field.onChange}
          />
        </FormControl>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    default:
      break;
  }
};

const CustomFormField = (props: CustomFormFieldPros) => {
  const { control, name, label, formItemsClassName, optional } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", formItemsClassName)}>
          <FormLabel className="flex gap-1.5">
            <p>
              {label} {!optional && <span className="text-destructive">*</span>}
            </p>
            {optional && (
              <span className="text-xs text-muted-foreground">(opcional)</span>
            )}
          </FormLabel>
          <RenderField field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
