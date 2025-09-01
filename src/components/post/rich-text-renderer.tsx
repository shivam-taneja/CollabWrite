import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

const RichTextRenderer = ({ html }: { html: string }) => {
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:scroll-m-20 prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:leading-7 prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-muted"
    >
      {parse(cleanHtml)}
    </div>
  );
};

export default RichTextRenderer