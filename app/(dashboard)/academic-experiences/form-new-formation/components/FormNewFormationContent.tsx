"use client";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().trim().min(1, {
    message: "O título é obrigatório.",
  }),
  type: z.string().trim().min(1, {
    message: "O tipo é obrigatório.",
  }),
  institution: z.string().trim().min(1, {
    message: "O nome da instituição é obrigatório.",
  }),
  institutionUrl: z.string().url("URL da instituição inválida"),
  description: z.string().trim().min(1, {
    message: "A descrição é obrigatório.",
  }),
  dataDuration: z.string().trim().min(1, {
    message: "A data de duração é obrigatório.",
  }),
  imageUrl: z.string().url("URL da imagem inválida"),
  certificateUrl: z.string().url("URL do certificado inválida").optional(),
  declarationUrl: z.string().url("URL da declaração inválida").optional(),
});

const FormNewFormationContent = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      dataDuration: "",
      institution: "",
      description: "",
      imageUrl: "",
      institutionUrl: "",
      certificateUrl: "",
      declarationUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex gap-12">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
            1
          </span>
          Informações Gerais
        </div>

        <div className="flex items-center gap-2 font-medium">
          <span className="flex size-8 items-center justify-center rounded-full bg-slate-800">
            2
          </span>
          Módulos
        </div>

        <div className="flex items-center gap-2 font-medium">
          <span className="flex size-8 items-center justify-center rounded-full bg-slate-800">
            3
          </span>
          Conteúdos do módulo
        </div>
      </div>

      <div className="h-2 w-full rounded-3xl bg-slate-800"></div>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>Forneça as informações abaixo.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem</FormLabel>
                    <FormControl>
                      <FileUpload singleFile {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o título da formação..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Típo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o típo da formação..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informe a descrição..."
                        className="min-h-28 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de duração</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe a data de duração..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instituição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o nome da instituição..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institutionUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da Instituição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o link da instituição..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificateUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Certificado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o link do certificado..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="declarationUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link da declaração</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informe o link da declaração..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter>
                <Button size="lg" type="submit">
                  Próximo
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormNewFormationContent;
