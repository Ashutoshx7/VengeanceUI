"use client";

import { TeamRevealGrid, type TeamRevealMember } from "@/components/ui/team-reveal-grid";

const TEAM: readonly TeamRevealMember[] = [
  {
    id: "subh",
    name: "Aizen",
    role: "Web3 Lead",
    expertise: "Mastermind architect. Controls grand protocol vision and high-speed execution.",
    image: "/avatars/aizen.jpg",
  },
  {
    id: "narsi",
    name: "Batman",
    role: "Infrastructure Engineer",
    expertise: "Infrastructure sentinel. Operates in the dark to guarantee zero downtime.",
    image: "/avatars/batmaaanji.jpg",
  },
  {
    id: "ashwani",
    name: "Johan",
    role: "Backend Engineer",
    expertise: "Backend architect. Builds silent, ultra-precise distributed database systems.",
    image: "/avatars/johan.jpg",
  },
  {
    id: "ujjwal",
    name: "Shinji",
    role: "AI/ML Engineer",
    expertise: "Inverted AI engineer. Flips complex neural models and pipelines inside out.",
    image: "/avatars/shinji.jpg",
  },
  {
    id: "naman",
    name: "Kaname",
    role: "AI Platform Engineer",
    expertise: "DevOps specialist. Monitors cloud telemetry and logs without needing to look.",
    image: "/avatars/andha-aizen.jpg",
  },
  {
    id: "ashutoshx7",
    name: "Ashutoshx7",
    role: "Design Engineer",
    expertise: "UI/UX craftsman. Shapes expressive design systems with bold aesthetics.",
    image: "/avatars/rohit.png",
  },
];

export function TeamRevealGridDemo() {
  return (
    <TeamRevealGrid
      members={TEAM}
      className="rounded-xl"
    />
  );
}

export default TeamRevealGridDemo;
