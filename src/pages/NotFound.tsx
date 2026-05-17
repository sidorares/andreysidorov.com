import { Link } from "react-router-dom";
import { PageMeta } from "@/components/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta title="Page not found" description="The page you requested does not exist." />
      <div className="container max-w-2xl py-32 text-center">
      <p className="mono-label mb-4">// 404</p>
      <h1 className="font-serif text-5xl mb-4">Lost in the stack</h1>
      <p className="text-muted-foreground mb-8">
        The page you&apos;re looking for didn&apos;t make it past the build.
      </p>
      <Link to="/" className="prose-link font-mono text-sm">
        ← back home
      </Link>
    </div>
    </>
  );
}
