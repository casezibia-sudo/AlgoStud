import { Component, useSyncExternalStore, type ReactNode } from 'react';
import { Button } from '@/components/ui';

/** Every Overview card sits on this. */
export const CARD = 'min-w-0 rounded-[18px] bg-[#FAFAFA] p-6 shadow-[0_0_0_1px_rgba(0,0,0,.05),0_1px_3px_rgba(0,0,0,.04)]';

/** Rupees the way the design prints them: ₹1,12,000 (no space). */
export const rupee = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

const QUERY = '(prefers-reduced-motion: reduce)';
const subscribe = (cb: () => void) => { const m = matchMedia(QUERY); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); };
/** True when the person has asked their system for less motion. Read live. */
export const useReducedMotion = () => useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);

/** Catches a render crash in ONE card so the rest of the page keeps working. It only shows a message and never
 *  navigates, so it cannot send anyone to /login. A failed data request is a different case: see DataError. */
export class Boundary extends Component<{ title: string; className?: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: unknown) { console.error('[overview] card crashed:', this.props.title, e); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section role="alert" className={`${CARD} flex flex-col items-start gap-2 ${this.props.className || ''}`}>
        <h2 className="m-0 text-base font-semibold">{this.props.title}</h2>
        <p className="m-0 text-[13px] font-medium text-muted">This card couldn't be shown. The rest of your overview is fine.</p>
        <Button size="sm" onClick={() => this.setState({ failed: false })}>Try again</Button>
      </section>
    );
  }
}

/** A failed data request: inline message with a retry. The retry re-reads the account; nothing here redirects. */
export function DataError({ onRetry }: { onRetry: () => void }) {
  return (
    <section role="alert" className={`${CARD} flex flex-col items-start gap-2`}>
      <h2 className="m-0 text-base font-semibold">Couldn't load your deals</h2>
      <p className="m-0 text-[13px] font-medium text-muted">Check your connection and try again. Your data is safe.</p>
      <Button variant="primary" size="sm" onClick={onRetry}>Try again</Button>
    </section>
  );
}
