import { useState, type ReactNode } from "react";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ZoomLightboxProps = {
  children: ReactNode;
  /** When false, the expand control is disabled (e.g. content not ready yet). */
  expandable?: boolean;
  /** Accessible label for the expand control */
  expandLabel?: string;
  className?: string;
};

/**
 * Wraps dense diagrams or other inline output and opens a scrollable large
 * viewport with the same React subtree rendered again (no duplicate markup channel).
 */
export function ZoomLightbox({
  children,
  expandable = true,
  expandLabel = "View larger",
  className,
}: ZoomLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cn("relative group", className)}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!expandable}
          aria-hidden={open}
          tabIndex={open ? -1 : undefined}
          className={cn(
            "absolute top-2 right-2 z-10 h-8 w-8 rounded-md border border-border bg-background/90 shadow-sm backdrop-blur-sm",
            "opacity-90 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100",
            open && "pointer-events-none invisible",
          )}
          onClick={() => setOpen(true)}
          aria-label={expandLabel}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "flex max-h-[90vh] max-w-[min(95vw,1400px)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(95vw,1400px)]",
          )}
        >
          <DialogTitle className="sr-only">Expanded view</DialogTitle>
          <DialogDescription className="sr-only">
            Zoomed diagram — scroll if the content is wider than the screen.
          </DialogDescription>
          <div className="flex min-h-0 flex-1 overflow-auto bg-muted/40">
            {open ? (
              <div className="box-border m-auto max-h-none w-max max-w-full p-6">
                <div
                  className={cn(
                    "zoom-lightbox-markup min-w-0 max-w-full",
                    "[&>div]:w-full [&_.mermaid-host]:block [&_.mermaid-host]:w-full",
                    "[&_svg]:mx-auto [&_svg]:block [&_svg]:max-w-full [&_svg]:min-w-0 [&_svg]:h-auto",
                  )}
                  style={{
                    width: '100vw'
                  }}
                >
                  {children}
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
