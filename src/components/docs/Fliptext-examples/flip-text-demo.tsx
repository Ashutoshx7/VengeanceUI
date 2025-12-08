import { FlipText } from "@/components/ui/flip-text";

export default function FlipTextDemo() {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <FlipText
                className="text-4xl font-bold text-foreground"
                duration={2.2}
                delay={0}
            >
                Build beautiful interfaces
            </FlipText>
        </div>
    );
}
