"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { RefreshCwIcon, Send } from "lucide-react";
import { toast } from "sonner";
import {
  ContactMessageSchema,
  contactMessageSchema,
} from "@/app/actions/contact-message/create-message/schema";
import { createContactMessage } from "@/app/actions/contact-message/create-message";
import { FaLocationArrow } from "react-icons/fa6";
import { Input } from "./ui/input-aceternity";
import { TextArea } from "./ui/textarea-aceternity";
import MagicLink from "./magic-link";

const Contact = () => {
  const form = useForm({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const handleTextareaResize = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const onSubmit = async (data: ContactMessageSchema) => {
    try {
      await createContactMessage({
        ...data,
      });

      form.reset();
      toast.success("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Ocorreu um erro ao enviar a mensagem.");
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-14">
      <div className="space-y-3">
        <h2 className="heading">
          Gostou do meu <span className="text-purple">trabalho?</span>
        </h2>
        <p className="mx-auto max-w-xl text-center text-3xl font-medium">
          Entre em contato comigo por <span className="text-purple">email</span>{" "}
          ou preencha o <span className="text-purple">formulário</span> abaixo.
        </p>
      </div>

      <MagicLink
        href="mailto:luke.sousa.dev@gmail.com"
        title="Enviar Email"
        icon={<FaLocationArrow />}
        position="right"
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="!z-50 w-full max-w-2xl space-y-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Seu nome" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Seu email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Assunto{" "}
                  <span className="text-xs text-muted-foreground">
                    (opcional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Assunto" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mensagem</FormLabel>
                <FormControl>
                  <TextArea
                    {...field}
                    placeholder="Escreva sua mensagem aqui..."
                    className="max-h-72 min-h-32 resize-none [&::-webkit-scrollbar]:hidden"
                    onInput={handleTextareaResize}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="focus-visible:ring-neutral-purple/50 !mt-12 flex w-full items-center gap-2 bg-black-200 text-white ring-2 ring-purple/50 transition-colors hover:bg-black-300"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <RefreshCwIcon size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {form.formState.isSubmitting ? "Enviando..." : "Enviar Mensagem"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Contact;
