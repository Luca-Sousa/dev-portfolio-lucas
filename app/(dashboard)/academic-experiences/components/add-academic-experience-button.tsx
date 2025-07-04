"use client";

import { Button } from "@/app/components/ui/button";
import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import { GraduationCap } from "lucide-react";

import { useState } from "react";
import UpsertAcademicExperienceForm from "./upsert-academic-experience-form";

const AddAcademicExperienceButton = () => {
  const [isOpenUpsertAcademicExperience, setIsOpenUpsertAcademicExperience] =
    useState(false);

  return (
    <Dialog
      open={isOpenUpsertAcademicExperience}
      onOpenChange={setIsOpenUpsertAcademicExperience}
    >
      <DialogTrigger asChild>
        <Button className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:via-primary hover:to-primary hover:shadow-xl dark:shadow-primary/25">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center gap-2 font-semibold">
            <div className="rounded-full bg-white/20 p-1 transition-transform group-hover:rotate-180">
              <GraduationCap size={14} />
            </div>
            Nova Formação
          </div>
        </Button>
      </DialogTrigger>

      <UpsertAcademicExperienceForm
        isOpen={isOpenUpsertAcademicExperience}
        onSuccess={() => setIsOpenUpsertAcademicExperience(false)}
      />
    </Dialog>
  );
};

export default AddAcademicExperienceButton;
