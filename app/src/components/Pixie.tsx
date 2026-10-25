import { FigmaFairy } from "@/components/FigmaFairy";
import { useFairy, type FairyLook } from "@/lib/fairy";

// Draft previews and saved fairies share the same artwork and color bindings.
export function Pixie({ size = 104, look }: { size?: number; look?: FairyLook }) {
  const saved = useFairy();
  return <FigmaFairy size={size} look={look ?? saved.look} />;
}
