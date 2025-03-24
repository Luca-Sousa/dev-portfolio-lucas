import { deleteMessage } from "@/app/actions/contact-message/delete-message";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { ContactMessage } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2Icon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface ContactMessageDialogContentProps {
  contactMessages: ContactMessage[];
  setContactMessages: Dispatch<SetStateAction<ContactMessage[]>>;
}

const ContactMessageDialogContent = ({
  contactMessages,
  setContactMessages,
}: ContactMessageDialogContentProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-3 pr-3">
          {contactMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="space-y-1 p-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  {message.name}
                  <span>
                    {format(message.createdAt, "d 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </CardTitle>
                <CardDescription>{message.email}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col px-3 pb-3">
                <span>Assunto: {message.subject}</span>
                <span>Mensagem: {message.message}</span>
              </CardContent>

              <CardFooter className="justify-end px-3 pb-3">
                <Button
                  disabled
                  className="justify-items-end bg-destructive/70 focus:bg-destructive focus-visible:ring-0"
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await deleteMessage({ id: message.id });
                      setContactMessages(
                        contactMessages.filter((m) => m.id !== message.id),
                      );
                      toast.success(
                        `Mensagem de "${message.name}" deletada com seucesso!`,
                      );
                    } catch {
                      toast.error("Erro ao deletar a mensagem!");
                    }
                  }}
                >
                  <Trash2Icon />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ContactMessageDialogContent;
