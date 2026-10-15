import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api, isRemote, useAccount, type Template, type Trigger } from '@/api';
import { Button, Card, Empty, Field, Input, Select, Sheet, useToast } from '@/components/ui';
import { PageHead } from '@/components/deal';

type Draft = Omit<Template, 'id' | 'used'>;
const BLANK: Draft = { name: '', del: '', usage: '', usageFull: '', trigger: 'On approval', rev: '2 included' };

export default function Templates() {
  const a = useAccount()!;
  const toast = useToast();
  const nav = useNavigate();
  const [edit, setEdit] = useState<{ id?: string; f: Draft } | null>(null);
  const save = async () => {
    if (!edit || !edit.f.name || !edit.f.del) return;
    const m = edit.f.usageFull.match(/\d+ days/);
    const f = { ...edit.f, usage: edit.f.usage || (m ? m[0] + ' usage' : 'Usage not set') };
    try { if (edit.id) await api.templates.update(edit.id, f); else await api.templates.add(f); toast('Template saved.'); setEdit(null); }
    catch (e) { toast((e as Error).message); }
  };
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setEdit(e => e && { ...e, f: { ...e.f, [k]: v } });
  return (
    <>
      <PageHead title="Templates" sub="Use them from Create deal → Start from template." actions={<Button variant="primary" onClick={() => setEdit({ f: BLANK })}><Plus size={16} />New template</Button>} />
      <Card className="overflow-hidden">
        {a.templates.length === 0 ? <Empty title="No templates yet" body="Save the terms you send often." /> : (
          <div className="divide-y divide-line">
            {a.templates.map(t => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 px-4 py-3.5 lg:px-6">
                <span className="flex min-w-0 flex-1 flex-col gap-0.5"><span className="text-sm font-bold">{t.name}</span><span className="text-[13px] font-medium text-muted">{t.del} · {t.usage} · paid {t.trigger.toLowerCase()} · {t.rev} revisions · used {t.used}×</span></span>
                {isRemote && <Button size="sm" onClick={async () => { try { nav(`/app/deals/${await api.templates.createDeal(t.id)}/edit`); } catch (e) { toast((e as Error).message); } }}>Create deal</Button>}
                <Button size="sm" onClick={() => setEdit({ id: t.id, f: { name: t.name, del: t.del, usage: t.usage, usageFull: t.usageFull, trigger: t.trigger, rev: t.rev } })}>Edit</Button>
                <button type="button" aria-label={`Delete ${t.name}`} onClick={async () => { try { await api.templates.remove(t.id); toast('Template deleted.'); } catch (e) { toast((e as Error).message); } }} className="grid size-8 place-items-center rounded-full text-muted hover:bg-danger-tint hover:text-danger cursor-pointer"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Sheet open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit template' : 'New template'} footer={<><Button onClick={() => setEdit(null)}>Cancel</Button><Button variant="primary" onClick={save} disabled={!edit?.f.name || !edit?.f.del}>Save template</Button></>}>
        {edit && <>
          <Field label="Name">{id => <Input id={id} value={edit.f.name} onChange={e => set('name', e.target.value)} />}</Field>
          <Field label="Deliverables" hint="For example: 1 Reel, 2 Stories">{id => <Input id={id} value={edit.f.del} onChange={e => set('del', e.target.value)} />}</Field>
          <Field label="Usage rights">{id => <Input id={id} value={edit.f.usageFull} onChange={e => set('usageFull', e.target.value)} />}</Field>
          <Field label="Payment is due">{id => <Select id={id} value={edit.f.trigger} onChange={e => set('trigger', e.target.value as Trigger)}>{['On approval', 'On posting', 'Days after posting', 'Fixed date'].map(x => <option key={x}>{x}</option>)}</Select>}</Field>
          <Field label="Revisions">{id => <Select id={id} value={edit.f.rev} onChange={e => set('rev', e.target.value)}>{['1 included', '2 included', '3 included'].map(x => <option key={x}>{x}</option>)}</Select>}</Field>
        </>}
      </Sheet>
    </>
  );
}
