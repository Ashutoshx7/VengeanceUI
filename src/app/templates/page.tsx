import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TemplatesPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
            <div className="space-y-6 max-w-lg">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                    Templates <br />
                    <span className="text-muted-foreground">Coming Soon</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    We are crafting high-quality templates to help you build even faster.
                    Stay tuned for updates.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
