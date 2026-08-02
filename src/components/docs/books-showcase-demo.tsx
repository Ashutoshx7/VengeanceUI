import { BooksShowcase, BookCfg } from "@/components/ui/books-showcase";

const DEMO_BOOKS: BookCfg[] = [
  {
    id: "book1",
    title: "Machine Learning",
    author: "Vengeance AI",
    year: "2024",
    stars: 5,
    desc: "A comprehensive guide to understanding machine learning algorithms and their applications in modern software engineering.",
    spineBg: "#1e1e1e",
    spineInk: "#ffffff",
    spineFont: "700 42px Georgia",
    backBg: "#1e1e1e",
    backInk: "255,255,255",
    edge: "#e0d6c8",
    images: {
      front: "/books-showcase/front-cover-ml.png",
      spine: "/books-showcase/center-cover-ml.png",
      back: "/books-showcase/back-cover-ml.png"
    }
  },
  {
    id: "book2",
    title: "Neural Networks",
    author: "Vengeance AI",
    year: "2024",
    stars: 5,
    desc: "Deep dive into the architecture, training, and deployment of neural networks across various domains.",
    spineBg: "#f0f0f0",
    spineInk: "#000000",
    spineFont: "700 42px sans-serif",
    backBg: "#f0f0f0",
    backInk: "0,0,0",
    edge: "#ffffff",
    images: {
      front: "/books-showcase/front-cover-neural-nets.png",
      spine: "/books-showcase/center-cover-neural-nets.png",
      back: "/books-showcase/back-oover-neural-nets.png"
    }
  },
  {
    id: "book3",
    title: "Large Language Models",
    author: "Vengeance AI",
    year: "2024",
    stars: 5,
    desc: "Exploring the fundamentals of transformers, attention mechanisms, and scaling laws that power today's LLMs.",
    spineBg: "#d9a05b",
    spineInk: "#3c2a1e",
    spineFont: "700 42px serif",
    backBg: "#d9a05b",
    backInk: "60,42,30",
    edge: "#c8b093",
    images: {
      front: "/books-showcase/front-cover-llms.png",
      spine: "/books-showcase/center-cover-llms.png",
      back: "/books-showcase/back-cover-llms.png"
    }
  },
  {
    id: "book4",
    title: "Inference & Serving",
    author: "Vengeance AI",
    year: "2024",
    stars: 5,
    desc: "Techniques for optimizing, deploying, and serving AI models efficiently in production environments.",
    spineBg: "#8b0000",
    spineInk: "#ffffff",
    spineFont: "700 42px sans-serif",
    backBg: "#8b0000",
    backInk: "255,255,255",
    edge: "#cccccc",
    images: {
      front: "/books-showcase/front-cover-inference.png",
      spine: "/books-showcase/center-cover-inference.png",
      back: "/books-showcase/back-cover-inference.png"
    }
  }
];

export function BooksShowcaseDemo() {
  return (
    <div className="relative h-full min-h-0 w-full">
      <BooksShowcase books={DEMO_BOOKS} className="h-full min-h-0" />
    </div>
  );
}

export default BooksShowcaseDemo;
