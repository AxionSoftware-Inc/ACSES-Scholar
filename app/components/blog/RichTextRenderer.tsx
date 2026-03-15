"use client";

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { motion } from 'framer-motion';

interface RichTextRendererProps {
  content: string;
  hasAnimation?: boolean;
}

export function RichTextRenderer({ content, hasAnimation }: RichTextRendererProps) {
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  const components = {
    p: ({children}: any) => <div className="mb-6">{children}</div>,
    h1: ({children}: any) => <h1 className="text-3xl font-bold mb-8 mt-12">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-2xl font-semibold mb-6 mt-10">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-xl font-semibold mb-4 mt-8">{children}</h3>,
    li: ({children}: any) => <li className="mb-2">{children}</li>,
    blockquote: ({children}: any) => (
      <blockquote className="border-l-4 border-primary pl-6 italic my-8 text-lg">
        {children}
      </blockquote>
    ),
    img: ({node, ...props}: any) => (
      <img 
        className="w-full rounded-2xl border border-border my-10 shadow-lg" 
        {...props} 
        alt={props.alt || "Maqola rasmi"}
      />
    ),
  };

  if (hasAnimation) {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ staggerChildren: 0.1 }}
        className="prose prose-neutral dark:prose-invert max-w-none 
                   prose-headings:scroll-mt-20 prose-p:leading-relaxed 
                   prose-img:rounded-2xl prose-img:border prose-img:border-border"
      >
        <ReactMarkdown 
          remarkPlugins={[remarkMath]} 
          rehypePlugins={[rehypeKatex]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </motion.div>
    );
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none 
                    prose-headings:scroll-mt-20 prose-p:leading-relaxed">
      <ReactMarkdown 
        remarkPlugins={[remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
