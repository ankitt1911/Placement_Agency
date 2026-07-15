import { Download } from "lucide-react";
import CustomButton from "./customButton";

export default function ExportButton({ onClick, loading = false, label = "Export Excel" }) {
  return (
    <CustomButton variant="secondary" onClick={onClick} loading={loading}>
      <Download className="h-4 w-4" />
      {label}
    </CustomButton>
  );
}
