"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../index";
import Image from "next/image";

type ModalVariant = "sheet" | "center";

type ModalProps = {
  title: string;
  body: React.ReactNode;
  openButtonText?: string;
  isOpen?: boolean;
  onClose?: () => void;
  /** Layout skin: `sheet` (right drawer, default) or `center` (floating dialog). */
  variant?: ModalVariant;
};

const sheetPanelClasses =
  "fixed top-0 right-0 z-50 flex h-[calc(100vh-2rem)] max-w-[calc(100%-2rem)] md:max-w-6xl min-w-0 flex-col rounded-l-[8px] bg-prontera-cream shadow-xl transition-transform duration-600 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform p-4 my-4 overflow-y-auto overflow-x-hidden";

/** Center dialog: max-w-lg keeps short/medium content readable; near-full width on mobile via inset margins.
 *  z-[70] sits above a parent sheet (z-50) when nested (e.g. activity inside event detail). */
const centerPanelClasses =
  "fixed left-1/2 top-1/2 z-[70] flex max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-lg min-w-0 -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-prontera-cream shadow-xl transition-[opacity,transform] duration-300 ease-out will-change-[opacity,transform] p-4 overflow-y-auto overflow-x-hidden";

export const Modal = ({
  title,
  body,
  openButtonText,
  isOpen: isOpenProp,
  onClose,
  variant = "sheet",
}: ModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const open = isOpenProp ?? internalIsOpen;
  const year = new Date().getFullYear();
  const isCenter = variant === "center";

  function handleClose() {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  }

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (onClose) {
        onClose();
      } else {
        setInternalIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const panelOpenClasses = isCenter
    ? open
      ? "opacity-100 scale-100"
      : "pointer-events-none opacity-0 scale-95"
    : open
      ? "translate-x-0"
      : "pointer-events-none translate-x-full";

  const overlay = (
    <div
      className={`fixed inset-0 bg-black/40 transition-opacity duration-600 ease-out ${
        isCenter ? "z-[60]" : "z-40"
      } ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={handleClose}
      aria-hidden={!open}
    />
  );

  const panel = (
    <div
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      className={`${isCenter ? centerPanelClasses : sheetPanelClasses} ${panelOpenClasses}`}
    >
      <header className="relative flex  min-w-0 flex-row items-center justify-center p-4 pr-12 max-w-full">
        <h1 className="min-w-0 w-full max-w-[calc(100%-3rem)] wrap-break-word text-center text-4xl font-display font-bold leading-relaxed text-prontera-blue">
          {title}
        </h1>
        <Button
          variant="transparent"
          onClick={handleClose}
          className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center p-4 focus-visible:outline focus-visible:ring-2 focus-visible:ring-prontera-blue focus-visible:ring-offset-2"
        >
          <Image
            src="/close.svg"
            alt="Close Modal"
            width={18}
            height={18}
            className="cursor-pointer"
          />
        </Button>
      </header>
      <main className="flex w-full min-w-0 max-w-full flex-col items-stretch p-4 sm:p-8">
        <div className="w-full min-w-0 max-w-full wrap-break-word">{body}</div>
      </main>
      {!isCenter && (
        <footer className="mt-auto w-full min-w-0 border-t border-prontera-light-blue/50 bg-white/30">
          <div className="mx-auto flex w-fit justify-center gap-4 px-6 py-8 text-sm text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} Espaço Prontera</p>
          </div>
        </footer>
      )}
    </div>
  );

  return (
    <div>
      {openButtonText && (
        <Button
          variant="modal"
          href="#"
          onClick={() => setInternalIsOpen(true)}
          className="text-sm font-semibold text-prontera-blue underline decoration-prontera-pink decoration-2 underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-prontera-blue focus-visible:ring-offset-2"
        >
          {openButtonText}
        </Button>
      )}

      {/* Portal to body so nested modals (center inside sheet) are not clipped by the parent panel's overflow/transform. */}
      {portalReady
        ? createPortal(
            <>
              {overlay}
              {panel}
            </>,
            document.body,
          )
        : null}
    </div>
  );
};
