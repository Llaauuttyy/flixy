import { Button } from "components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";

interface ConfirmationBox {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  cancelText?: string;
  acceptText?: string;
  isAccepted: (value: boolean) => void;
}

export function ConfirmationBox({
  children,
  title,
  subtitle,
  cancelText,
  acceptText,
  isAccepted,
}: ConfirmationBox) {
  const { t } = useTranslation();

  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  return (
    <Dialog
      open={confirmationDialogOpen}
      onOpenChange={setConfirmationDialogOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{title || t("confirmation_box.title")}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {subtitle || t("confirmation_box.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setConfirmationDialogOpen(false)}
            className="border-slate-600 text-slate-300 hover:text-white bg-transparent"
          >
            {cancelText || t("confirmation_box.cancel")}
          </Button>
          <Button
            className="border-[#202135] px-6 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => isAccepted(true)}
          >
            {acceptText || t("confirmation_box.accept")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
