import { FlipText } from "@/components/ui/flip-text";

export default function FlipTextDuration() {
    return (
        <div className="flex flex-col gap-8 items-center">
            <FlipText
                className="text-2xl font-semibold"
                duration={1.5}
            >
                Fast Animation
            </FlipText>

            <FlipText
                className="text-2xl font-semibold"
                duration={3.5}
            >
                Slow Animation
            </FlipText>
        </div>
    );
}
