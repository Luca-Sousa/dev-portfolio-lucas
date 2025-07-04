"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcademicExperience } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Form } from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  FileText,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upsertAcademicExperience } from "@/app/_actions/academic-experience/academic-experience.actions";
import {
  upsertAcademicExperienceSchema,
  UpsertAcademicExperienceSchema,
} from "@/app/_actions/academic-experience/schema";
import CustomFormField, {
  FormFieldType,
} from "@/app/components/form/custom-form-field";

interface UpsertAcademicExperienceFormProps {
  isOpen: boolean;
  onSuccess: () => void;
  academicExperience?: AcademicExperience;
}

const STEPS = [
  {
    id: 1,
    title: "Informações Básicas",
    description: "Dados principais da formação",
    icon: GraduationCap,
    fields: ["title", "type", "dateDuration"],
  },
  {
    id: 2,
    title: "Instituição",
    description: "Detalhes da instituição de ensino",
    icon: Building2,
    fields: ["institution", "institutionUrl"],
  },
  {
    id: 3,
    title: "Descrição",
    description: "Descrição detalhada da formação",
    icon: FileText,
    fields: ["description"],
  },
  {
    id: 4,
    title: "Mídia e Certificados",
    description: "Imagens e documentos",
    icon: ImageIcon,
    fields: ["imageUrl", "certificateUrl", "declarationUrl"],
  },
];

const UpsertAcademicExperienceForm = ({
  isOpen,
  onSuccess,
  academicExperience,
}: UpsertAcademicExperienceFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<UpsertAcademicExperienceSchema>({
    resolver: zodResolver(upsertAcademicExperienceSchema),
    defaultValues: {
      id: academicExperience?.id || undefined,
      title: academicExperience?.title || "",
      type: academicExperience?.type || "",
      dateDuration: academicExperience?.dateDuration || "",
      institution: academicExperience?.institution || "",
      description: academicExperience?.description || "",
      imageUrl: academicExperience?.imageUrl || "",
      institutionUrl: academicExperience?.institutionUrl || "",
      certificateUrl: academicExperience?.certificateUrl || "",
      declarationUrl: academicExperience?.declarationUrl || "",
    },
  });

  const onSubmit = (data: UpsertAcademicExperienceSchema) => {
    startTransition(async () => {
      try {
        const result = await upsertAcademicExperience(data);

        if (result?.serverError) {
          toast.error(result.serverError);
          return;
        }

        toast.success(
          academicExperience
            ? "Experiência acadêmica atualizada com sucesso!"
            : "Experiência acadêmica criada com sucesso!",
        );

        form.reset();
        setCurrentStep(1);
        onSuccess();
        router.refresh();
      } catch (error) {
        toast.error("Erro ao salvar experiência acadêmica");
        console.error(error);
      }
    });
  };

  const nextStep = () => {
    const currentStepData = STEPS.find((step) => step.id === currentStep);
    if (currentStepData) {
      const fieldsToValidate = currentStepData.fields as Array<
        keyof UpsertAcademicExperienceSchema
      >;
      const isCurrentStepValid = fieldsToValidate.every((field) => {
        const fieldState = form.getFieldState(field);
        return !fieldState.error && form.getValues(field);
      });

      if (isCurrentStepValid) {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      } else {
        fieldsToValidate.forEach((field) => {
          form.trigger(field);
        });
      }
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const currentStepData = STEPS.find((step) => step.id === currentStep);

  return (
    <Dialog open={isOpen} onOpenChange={onSuccess}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {academicExperience
              ? "Editar Experiência Acadêmica"
              : "Nova Experiência Acadêmica"}
          </DialogTitle>
          <DialogDescription>
            {academicExperience
              ? "Atualize os dados da sua experiência acadêmica"
              : "Adicione uma nova experiência acadêmica ao seu portfólio"}
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de passos */}
        <div className="mb-6 flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    currentStep >= step.id
                      ? "border-primary bg-primary text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                  } `}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-12 transition-all ${currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"} `}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Título e descrição do passo atual */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {currentStepData && (
                <>
                  <currentStepData.icon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">{currentStepData.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentStepData.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Informações Básicas */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="title"
                  label="Título da Formação"
                  placeholder="Ex: Bacharelado em Ciência da Computação"
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="type"
                  label="Tipo de Formação"
                  placeholder="Ex: Graduação, Pós-graduação, Curso"
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="dateDuration"
                  label="Duração"
                  placeholder="Ex: 2020 - 2024, Jan 2023 - Dez 2023"
                />
              </div>
            )}

            {/* Step 2: Instituição */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="institution"
                  label="Instituição de Ensino"
                  placeholder="Ex: Universidade Federal de São Paulo"
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="institutionUrl"
                  label="Site da Instituição"
                  placeholder="https://www.unifesp.br"
                  typeInput="url"
                />
              </div>
            )}

            {/* Step 3: Descrição */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.TEXTAREA}
                  name="description"
                  label="Descrição da Formação"
                  placeholder="Descreva sua formação, principais disciplinas, projetos desenvolvidos..."
                  textareaClassName="min-h-[120px]"
                />
              </div>
            )}

            {/* Step 4: Mídia e Certificados */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="imageUrl"
                  label="URL da Imagem"
                  placeholder="https://exemplo.com/logo-instituicao.png"
                  typeInput="url"
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="certificateUrl"
                  label="URL do Certificado"
                  placeholder="https://exemplo.com/certificado.pdf"
                  typeInput="url"
                  optional
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="declarationUrl"
                  label="URL da Declaração"
                  placeholder="https://exemplo.com/declaracao.pdf"
                  typeInput="url"
                  optional
                />
              </div>
            )}

            {/* Botões de navegação */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2"
                >
                  {isPending
                    ? "Salvando..."
                    : academicExperience
                      ? "Atualizar"
                      : "Criar"}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertAcademicExperienceForm;
