import { InfoIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Tooltip = ({ message }: { message: string }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [canHover, setCanHover] = useState(false);

  const position = useCallback(() => {
    if (!tooltipRef.current || !openerRef.current) return;

    const rect = openerRef.current.getBoundingClientRect();

    Object.assign(tooltipRef.current.style, {
      top: `${rect.top - 8}px`,
      left: `${rect.left + rect.width / 2}px`,
      transform: "translate(-50%, -100%)",
    });
  }, []);

  const show = useCallback(() => {
    position();
    tooltipRef.current?.showPopover();
    setOpen(true);
  }, [position]);

  const hide = useCallback(() => {
    tooltipRef.current?.hidePopover();
    setOpen(false);
  }, []);

  const handleMouseEnter = () => {
    if (canHover) show();
  };

  const handleMouseLeave = () => {
    if (canHover) hide();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!canHover) {
      e.preventDefault();
      open ? hide() : show();
    }
  };

  // Outside tap close for mobile
  useEffect(() => {
    if (!open || canHover) return;

    const close = (e: PointerEvent) => {
      if (
        !tooltipRef.current?.contains(e.target as Node) &&
        !openerRef.current?.contains(e.target as Node)
      ) {
        hide();
      }
    };

    document.addEventListener("pointerup", close);
    return () => document.removeEventListener("pointerup", close);
  }, [open, hide]);

  // Hide on scroll
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", hide, true);
    return () => window.removeEventListener("scroll", hide, true);
  }, [open, hide]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(hover: hover)");
    setCanHover(media.matches);

    const handler = (e: MediaQueryListEvent) => {
      setCanHover(e.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <div
        ref={tooltipRef}
        popover="manual"
        className="fixed bg-black text-white rounded-md p-2 text-xs z-50 pointer-events-none"
      >
        {message}
      </div>

      <div
        ref={openerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="mt-1 ml-1"
      >
        <InfoIcon className="h-5 w-5 text-muted-foreground" />
      </div>
    </>
  );
};
