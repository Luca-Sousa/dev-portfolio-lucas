"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  MailCheckIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ContactMessageDialogContent from "./contact-message-dialog-content";
import { useEffect, useState } from "react";
import { ContactMessage } from "@prisma/client";
import { getContactMessages } from "@/app/data_access/get-contact-message";

export function NavUser() {
  const { isMobile, setOpenMobile } = useSidebar();
  const { data } = useSession();
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getContactMessages();
      setContactMessages(messages);
    };

    fetchMessages();
  }, []);

  const handleSignOutWithGoogleClick = () => {
    signOut();
    redirect("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                tooltip={"Perfil"}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    className="rounded-full"
                    src={"/perfil.png"}
                    alt="Imagem do usuário"
                  />
                  <AvatarFallback className="rounded-lg">LS</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {data?.user?.name}
                  </span>
                  <span className="truncate text-xs">{data?.user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      className="rounded-full"
                      src={"/perfil.png"}
                      alt="Imagem do usuário"
                    />
                    <AvatarFallback className="rounded-lg">LS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data?.user?.name}
                    </span>
                    <span className="truncate text-xs">
                      {data?.user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpenMobile(false)}
                  >
                    <span className="flex flex-1 items-center gap-2">
                      <MailCheckIcon />
                      Mensagens
                    </span>
                    {contactMessages.length > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-destructive font-bold">
                        {contactMessages.length}
                      </span>
                    )}
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem disabled className="cursor-pointer">
                  <BadgeCheck />
                  Configurar Conta
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Button
                  className="w-full cursor-pointer justify-start bg-destructive/60 focus:bg-destructive/45 focus-visible:ring-0"
                  variant="destructive"
                  onClick={handleSignOutWithGoogleClick}
                >
                  <LogOut />
                  Sair da Conta
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>

            <DialogContent className="flex h-[500px] w-[600px] flex-col overflow-hidden">
              <DialogHeader>
                <DialogTitle>Mensagens Recebidas</DialogTitle>
                <DialogDescription>
                  Mensagens de contato do Portfólio
                </DialogDescription>
              </DialogHeader>

              <ContactMessageDialogContent
                contactMessages={contactMessages}
                setContactMessages={setContactMessages}
              />
            </DialogContent>
          </DropdownMenu>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
