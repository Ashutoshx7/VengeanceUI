import { FlipText } from "@/components/ui/flip-text";

export default function FlipTextDelay() {
    return (
        <div className="flex items-center justify-center min-h-[200px]">
            <FlipText
                className="text-3xl font-bold"
                duration={2.2}
                delay={0.5}
            >
                Delayed Start
            </FlipText>
        </div>
    );
}
