import type { Creator, Deal, Template } from './types';

// Demo seed data. Replace with the backend once it exists.
export const SEED: { creator: Partial<Creator> & { email: string }; deals: Deal[]; templates: Template[] } = {
  creator: { email: 'ananya@gmail.com', name: 'Ananya Rao', handle: 'ananya.creates', paymentLink: 'upi://pay?pa=ananya@okhdfc', defaultTrigger: 'On approval' },
  deals: [
    { id: 'hearth', brand: 'Hearth Coffee', contact: 'Rohan Mehta', email: 'r•••@hearthcoffee.in', del: '1 Reel', first: 'Reel 1', n: 12000, stage: 'overdue', due: '01 Oct 2026', trigger: 'On approval', usage: 'Brand can repost on Instagram for 60 days', rev: '1 included', src: 'WhatsApp' },
    { id: 'kora', brand: 'Kora Threads', contact: 'Isha Kapoor', email: 'i•••@korathreads.com', del: '3 Stories', first: 'Story 2', n: 8500, stage: 'revision', due: '20 Oct 2026', trigger: 'On approval', usage: 'Brand can repost on its own channels for 30 days', rev: '2 included', notes: 'At 0:04, show the full label on the kurta. The music is too loud over the voiceover.', src: 'Instagram DM' },
    { id: 'pebble', brand: 'Pebble Kids', contact: 'Anil Joseph', email: 'a•••@pebblekids.in', del: '2 Stories', first: 'Story 1', n: 5000, stage: 'expired', due: '—', trigger: 'On posting', usage: 'Not added', rev: '1 included', src: 'Email' },
    { id: 'mitti', brand: 'Mitti Home', contact: 'Sana Qureshi', email: 's•••@mittihome.in', del: '1 Reel', first: 'Reel 1', n: 6000, stage: 'draft', due: null, trigger: 'On approval', usage: null, rev: '2 included', missing: ['payment due date', 'usage rights'], src: 'Instagram DM' },
    { id: 'urban', brand: 'Urban Pedal', contact: 'Karan Bhatia', email: 'k•••@urbanpedal.co', del: '1 Reel', first: 'Reel 1', n: 11000, stage: 'approved', due: '30 days after posting', trigger: 'Days after posting', usage: 'Brand can repost on its own channels for 90 days', rev: '2 included', src: 'Email' },
    { id: 'veda', brand: 'Veda Ayurveda', contact: 'Lakshmi Iyer', email: 'l•••@vedaayurveda.in', del: '1 Reel, 2 Stories', first: 'Reel 1', n: 9000, stage: 'due', due: '09 Oct 2026', trigger: 'On approval', usage: 'Brand can repost on its own channels for 90 days', rev: '2 included', src: 'WhatsApp' },
    { id: 'glow', brand: 'GlowSkin India', contact: 'Priya Nair', email: 'p•••@glowskin.in', del: '2 Reels, 1 Story', first: 'Reel 1', n: 25000, stage: 'sent', due: '28 Nov 2026', trigger: 'On approval', usage: 'Brand can repost on its own channels for 90 days', rev: '2 included', version: 2, src: 'Instagram DM' },
    { id: 'nila', brand: 'Nila Foods', contact: 'Deepa Rao', email: 'd•••@nilafoods.in', del: '1 Post', first: 'Post 1', n: 4000, stage: 'submitted', due: 'On approval + 15 days', trigger: 'On approval', usage: 'Brand can share the post on its own page', rev: '1 included', src: 'Email' },
    { id: 'tara', brand: 'Tara Jewels', contact: 'Nandini Shah', email: 'n•••@tarajewels.com', del: '1 Reel', first: 'Reel 1', n: 15000, stage: 'confirmed', due: '15 Nov 2026', trigger: 'Fixed date', usage: 'Brand can run the Reel as an ad for 30 days', rev: '2 included', src: 'Instagram DM' },
    { id: 'bloom', brand: 'Bloom Botanics', contact: 'Farah Ali', email: 'f•••@bloombotanics.in', del: '2 Stories', first: 'Story 1', n: 7000, stage: 'wip', due: 'On approval', trigger: 'On approval', usage: 'Brand can repost on Instagram for 30 days', rev: '1 included', src: 'WhatsApp' },
    { id: 'saffron', brand: 'Saffron Studio', contact: 'Vikram Sen', email: 'v•••@saffronstudio.in', del: '2 Reels', first: 'Reel 1', n: 18000, stage: 'paid', due: '30 Sep 2026', trigger: 'On approval', usage: 'Brand can repost on its own channels for 90 days', rev: '2 included', ref: '4521 8890', src: 'Email' },
    { id: 'lumen', brand: 'Lumen Audio', contact: 'Tom D’Souza', email: 't•••@lumenaudio.in', del: '1 Reel', first: 'Reel 1', n: 20000, stage: 'declined', due: '15 Oct 2026', trigger: 'On approval', usage: 'Brand can run the Reel as an ad for 60 days', rev: '2 included', reason: 'Budget', src: 'Email' },
    { id: 'cove', brand: 'Cove Travel', contact: 'Mira Pillai', email: 'm•••@covetravel.in', del: '3 Reels', first: 'Reel 1', n: 30000, stage: 'cancelled', due: '—', trigger: 'On posting', usage: 'Brand can repost on its own channels for 90 days', rev: '2 included', src: 'Instagram DM' },
    { id: 'orbit', brand: 'Orbit Fitness', contact: 'Raj Malhotra', email: 'r•••@orbitfit.in', del: '1 Reel', first: 'Reel 1', n: 10000, stage: 'archived', due: '05 Sep 2026', trigger: 'On approval', usage: 'Brand can repost on Instagram for 30 days', rev: '1 included', src: 'WhatsApp' },
  ],
  templates: [
    { id: 't1', name: 'Reel + Story bundle', del: '1 Reel, 2 Stories', usage: '90 days usage', usageFull: 'Brand can repost on its own channels for 90 days', trigger: 'On approval', rev: '2 included', used: 6 },
    { id: 't2', name: 'Single Reel', del: '1 Reel', usage: '60 days usage', usageFull: 'Brand can repost on Instagram for 60 days', trigger: 'On approval', rev: '1 included', used: 4 },
    { id: 't3', name: 'Story set', del: '3 Stories', usage: '30 days usage', usageFull: 'Brand can repost on its own channels for 30 days', trigger: 'Days after posting', rev: '1 included', used: 2 },
  ],
};
