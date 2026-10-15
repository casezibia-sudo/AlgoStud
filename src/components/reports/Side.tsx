import { CARD } from '@/components/overview/shared';
import { cx } from '@/lib/format';

const shell = cx(CARD, 'flex flex-col rounded-[24px] p-[19px] lg:px-[25px] lg:pb-[19px] lg:pt-[22px]');

/** Slice 4 adds deliverable items with a format (Reel, Story...). Until then there is nothing to split income by. */
export function Income({ earned }: { earned: string }) {
  return (
    <section aria-label="Income by content type" className={shell}>
      <h2 className="m-0 text-[18px] font-medium">Income by content type</h2>
      <p className="m-0 mt-1 text-[13.5px] font-medium text-ink-2">Share of {earned} earned</p>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="m-0 text-[15px] font-semibold">Not available yet</p>
        <p className="m-0 mt-1 text-[13px] font-medium text-muted">Income by Reels, Stories and other formats appears once deliverables are tracked item by item.</p>
      </div>
    </section>
  );
}
