import { FlipText } from "@/components/ui/flip-text";

export default function FlipTextStyles() {
    return (
        <div className="flex flex-col gap-8 items-center">
            <FlipText className="text-5xl font-black text-blue-600 dark:text-blue-400">
                Bold & Colorful
            </FlipText>

            <FlipText className="text-3xl font-light italic text-muted-foreground">
                Light & Italic
            </FlipText>

            <FlipText className="text-2xl font-mono tracking-wider">
                Monospace Text
            </FlipText>
        </div>
    );
}
