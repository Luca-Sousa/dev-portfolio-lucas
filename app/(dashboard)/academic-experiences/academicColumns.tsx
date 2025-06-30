// "use client";

// import { Button } from "@/app/components/ui/button";
// import { ColumnDef } from "@tanstack/react-table";
// import {
//   EditIcon,
//   MoreHorizontalIcon,
//   Trash2Icon,
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
// } from "@/app/components/ui/alert-dialog";
// import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/app/components/ui/dropdown-menu";
// import { useState } from "react";
// import {
//   FaGithub,
//   FaRocket,
// } from "react-icons/fa6";
// import { AcademicExperience } from "@prisma/client";

// export const academicTableColumns: ColumnDef<AcademicExperience>[] = [
//   {
//     accessorKey: "imageUrl",
//     header: "",
//     cell: ({ row: { original: academic } }) => {
//       return (
//         <div className="relative size-12 overflow-hidden rounded-md">
//           <Image
//             alt="Imagem do projeto"
//             src={academic.imageUrl}
//             fill
//             className="object-cover"
//           />
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "title",
//     header: "Título",
//     cell: ({ row: { original: academic } }) => {
//       return (
//         <div className="line-clamp-1 max-w-40 truncate text-sm">
//           {academic.title}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "type",
//     header: "Tipo",
//     cell: ({ row: { original: academic } }) => {
//       return <div className="text-sm">{academic.type}</div>;
//     },
//   },
//   {
//     accessorKey: "institution",
//     header: "Instituição",
//     cell: ({ row: { original: academic } }) => {
//       return <div className="text-sm">{academic.type}</div>;
//     },
//   },
//   {
//     accessorKey: "deployUrl",
//     header: "Deploy",
//     cell: ({ row: { original: project } }) => {
//       if (!project.deployUrl) return;

//       return (
//         <Button variant={"ghost"} asChild>
//           <Link target="_blank" href={project.deployUrl}>
//             <FaRocket className="size-5" />
//           </Link>
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "repositoryUrl",
//     header: "Repositório",
//     cell: ({ row: { original: project } }) => {
//       return (
//         <Button variant={"ghost"} asChild>
//           <Link target="_blank" href={project.repositoryUrl}>
//             <FaGithub className="size-5" />
//           </Link>
//         </Button>
//       );
//     },
//   },
//   {
//     accessorKey: "actions",
//     id: "actions",
//     header: "Ações",
//     cell: ({ row: { original: project } }) => {
//       // eslint-disable-next-line react-hooks/rules-of-hooks
//       const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

//       return (
//         <AlertDialog>
//           <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <MoreHorizontalIcon size={16} />
//                 </Button>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent align="end">
//                 <DropdownMenuLabel className="text-center">
//                   Actions
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />

//                 <DialogTrigger asChild>
//                   <Link href={`/dashboard/projects/${project.id}`}>
//                     <DropdownMenuItem className="cursor-pointer gap-1.5">
//                       <EditIcon size={14} />
//                       Editar
//                     </DropdownMenuItem>
//                   </Link>
//                 </DialogTrigger>

//                 <DropdownMenuSeparator />
//                 <AlertDialogTrigger asChild>
//                   <DropdownMenuItem className="cursor-pointer gap-1.5 bg-destructive/60 focus:bg-destructive/45">
//                     <Trash2Icon size={14} />
//                     Deletar
//                   </DropdownMenuItem>
//                 </AlertDialogTrigger>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </Dialog>
//         </AlertDialog>
//       );
//     },
//   },
// ];
