"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { addToCart } from "@/lib/order";
import { BasketDrawer } from "./BasketDrawer";
import { MobileBasketBar } from "./MobileBasketBar";
import { updateBasket } from "./store";

type BasketUI = {
  openBasket: () => void;
  add: (item: { id: string; name: string }, price: number) => void;
};

const BasketContext = createContext<BasketUI | null>(null);

export function useBasketUI() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasketUI must be used inside <BasketProvider>");
  return ctx;
}

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  const openBasket = useCallback(() => {
    setToast(null); // the basket itself now shows what was added
    dialogRef.current?.showModal();
  }, []);

  const add = useCallback((item: { id: string; name: string }, price: number) => {
    updateBasket((s) => ({ ...s, cart: addToCart(s.cart, item, price) }));
    setToast({ id: Date.now(), text: `Added ${item.name} · GH₵${price}` });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <BasketContext.Provider value={{ openBasket, add }}>
      {children}
      <MobileBasketBar />
      <BasketDrawer ref={dialogRef} />
      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div className="toast" key={toast.id}>
            <span>{toast.text}</span>
            <button type="button" onClick={openBasket}>
              View basket
            </button>
          </div>
        )}
      </div>
    </BasketContext.Provider>
  );
}
