import { cn } from "@/lib/utils";
import Container from "./container";
import Heading from "./heading";
import SubHeading from "./subheading";
import { FeatureCard1, FeatureCard2, FeatureCard3, FeatureCard4 } from "./ui/features-cards";

export default function Features() {
    return <section>
        <Container>
            <div className="md:border-x border-b overflow-hidden">
                <div className="flex-1 flex flex-col gap-4 md:gap-8 justify-center px-4 md:px-8 py-8 md:py-16 lg:py-24">
                    <Heading variant="big" className="text-center">Why Vengeance?</Heading>
                    <SubHeading variant="big" className="text-center mx-auto w-full max-w-2xl">
                        Vengeance UI is built to explore unique interaction patterns from displacement hover effects to animated tooltips and scroll-driven components.
                    </SubHeading>
                </div>

                <FeatureCardHolder
                    card1={
                        <FeatureCard
                            title="Components You Won’t Find Anywhere"
                            description="Vengeance UI focuses on unique interaction patterns like displacement hover effects, animated tooltips, and scroll-driven cards that stand out from typical UI libraries."
                            order="normal"
                            card={() => <FeatureCard1 />}
                        />
                    }
                    card2={


                        <FeatureCard
                            title="Built with modern frameworks"
                            description="Designed to work seamlessly with popular frameworks like React and Next.js, making it easy to integrate into real-world production projects."
                            order="reverse"
                            card={() => <FeatureCard2 />}
                        />
                    }
                />

                <FeatureCardHolder
                    card1={
                        <FeatureCard
                            title="Open Source With Story"
                            description="Every component is open source and crafted with intention. Each block explores a unique interaction pattern and the reasoning behind its design."
                            order="normal"
                            card={() => <FeatureCard3 />}
                        />
                    }
                    card2={
                        <FeatureCard
                            title="Build Landing Pages Faster"
                            description="Launch polished landing pages in minutes using pre-built UI blocks designed for speed and consistency. Skip repetitive work and focus on shipping your ideas."
                            order="reverse"
                            card={() => <FeatureCard4 />}
                        />
                    }
                />
            </div>
        </Container>
    </section>
}

function FeatureCardHolder({ card1: Card1, card2: Card2 }: { card1: React.ReactNode, card2: React.ReactNode }) {
    return <div className="grid grid-cols-1 md:grid-cols-2 divide-x border-t">
        {Card1}
        {Card2}
    </div>
}

const FeatureCard = ({ title, description, order = "normal", card: Card }: { title: string, description: string, order: "reverse" | "normal", card: React.ComponentType }) => {
    return (
        <div className={cn("flex flex-col", order === "reverse" ? "md:flex-col-reverse" : "flex-col")}>
            <div className="p-4 md:p-8 flex flex-col gap-4">
                <Heading>{title}</Heading>
                <SubHeading>{description}</SubHeading>
            </div>
            <div className="flex-1 min-h-96">
                <Card />
            </div>
        </div>
    )
}