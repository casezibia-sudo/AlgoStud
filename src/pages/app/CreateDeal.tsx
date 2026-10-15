import { useNavigate, useParams } from 'react-router-dom';
import { NewDealModal } from '@/components/deals/NewDealModal';
import Deals from './Deals';
import EditDeal from './EditDeal';

/**
 * /app/deals/new opens the Create Deal pop-up over the Deals list, so links and a refresh still work.
 * /app/deals/:id/edit (editing a draft, or starting a new version) keeps the full-page form: there is no v3 design for it.
 */
export default function CreateDeal() {
  const { id } = useParams();
  if (id) return <EditDeal />;
  return <NewDeal />;
}

function NewDeal() {
  const nav = useNavigate();
  // Closing goes back to where the pop-up was opened from. On a fresh load (no history in the app) it goes to the Deals list.
  const close = () => { if ((window.history.state?.idx ?? 0) > 0) nav(-1); else nav('/app/deals', { replace: true }); };
  return (
    <>
      <Deals />
      <NewDealModal onCancel={close} onDone={(id, mode) => { if (mode === 'deal') nav(`/app/deals/${id}`, { replace: true }); else close(); }} />
    </>
  );
}
