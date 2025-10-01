import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthClient from "./AuthClient";

export default function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex justify-center items-center bg-gray-200">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <AuthClient className="border-0! shadow-none" />
      </DialogContent>
    </Dialog>
  );
}
