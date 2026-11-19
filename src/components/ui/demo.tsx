import { GlyphBackground } from "@/components/ui/backgrounds-glyph";

export default function GlyphBackgroundDemo() {
  return (
    <div className="relative w-full h-screen bg-background text-foreground">
      <GlyphBackground className="absolute inset-0" />
    </div>
  );
}
