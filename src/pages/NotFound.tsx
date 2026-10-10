import '@/index.css';
import { LinkButton } from '@/components/ui';

export default function NotFound({ inApp }: { inApp?: boolean }) {
  return (
    <div className={inApp ? 'grid place-items-center py-24' : 'grid min-h-dvh place-items-center bg-canvas px-4'}>
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <h1 className="m-0 text-2xl font-bold">{inApp ? 'This deal isn’t here' : 'Page not found'}</h1>
        <p className="m-0 text-sm font-medium text-muted">{inApp ? 'It may have been deleted, or it belongs to another account.' : 'Check the address, or go back to the start.'}</p>
        {inApp ? <LinkButton to="/app/deals">Back to deals</LinkButton> : <a href="/" className="text-sm font-semibold">Go to AlgoStudio</a>}
      </div>
    </div>
  );
}
