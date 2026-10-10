import { useState } from 'react';
import { Copy, Mail, MessageCircle } from 'lucide-react';
import { Sheet, Textarea, useToast, btn } from './ui';

/** Opens a channel on the creator's own device. AlgoStudio never messages a brand itself. */
export const waHref = (text: string) => 'https://wa.me/?text=' + encodeURIComponent(text);
export const mailHref = (text: string, subject = '') => `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
export async function copy(text: string) { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } }

/** Pick a channel. Picking one is the send. */
export function SendSheet({ open, onClose, title, message, subject, onSent, note }: {
  open: boolean; onClose: () => void; title: string; message: string; subject?: string; note?: string;
  onSent: (channel: 'WhatsApp' | 'Copy link' | 'Email', text: string) => void;
}) {
  const [text, setText] = useState(message);
  const toast = useToast();
  const done = (c: 'WhatsApp' | 'Copy link' | 'Email') => { onSent(c, text); onClose(); };
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <Textarea aria-label="Message" rows={5} value={text} onChange={e => setText(e.target.value)} />
      {note && <p className="m-0 text-xs font-medium text-muted">{note}</p>}
      <div className="flex flex-col gap-2">
        <a href={waHref(text)} target="_blank" rel="noopener" onClick={() => done('WhatsApp')} className={btn('primary', 'lg', 'w-full')}><MessageCircle size={18} />Share on WhatsApp</a>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={btn('secondary', 'lg')} onClick={async () => { await copy(text); toast('Copied.'); done('Copy link'); }}><Copy size={16} />Copy</button>
          <a href={mailHref(text, subject)} onClick={() => done('Email')} className={btn('secondary', 'lg')}><Mail size={16} />Email</a>
        </div>
      </div>
    </Sheet>
  );
}
