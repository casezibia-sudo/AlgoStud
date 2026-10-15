// DRAFT legal text for the homepage Privacy / Terms pop-ups. Plain English, written for an Indian app under the Digital Personal
// Data Protection Act, 2023 (DPDP Act). It has NOT been reviewed by a lawyer. Everything in [SQUARE BRACKETS] is a placeholder
// to be filled in or confirmed before this is published as final. Remove the "Draft" banner only after legal review.

export type LegalDoc = 'privacy' | 'terms';
export interface Section { h: string; p: string[] }
export interface Legal { title: string; updated: string; intro: string; sections: Section[] }

const NAME = '[BUSINESS NAME]';

export const LEGAL: Record<LegalDoc, Legal> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: [EFFECTIVE DATE]',
    intro: `${NAME} ("we", "us") runs AlgoStudio, a tool that helps creators turn brand messages into clear deals and keep a record of what was agreed. This policy explains what personal data we collect, why, who sees it, and what rights you have under the Digital Personal Data Protection Act, 2023 ("DPDP Act"). Our registered address is [REGISTERED ADDRESS].`,
    sections: [
      { h: '1. Who this applies to', p: [
        'Creators who sign up for AlgoStudio, and brand contacts whose details a creator adds to a deal or who open a link a creator sends them. For the personal data of brand contacts that a creator enters, the creator decides what to add; we process it on their behalf to run the service.',
      ] },
      { h: '2. What we collect', p: [
        'From creators: your email address, name, handle, and payment link; settings you choose; and your sign-in details when you use Google sign-in (we receive your name, email address and profile identifier from Google, not your Google password).',
        'Deal content you enter or paste: brand names, brand contact names, email addresses and phone numbers, the messages you paste, deliverables, amounts, dates, notes, and the history of changes to each deal.',
        'From brands who open a link: their answer (confirm, ask for changes, decline or approve work), any note they write, and the time of that action.',
        'Technical data: device and browser type, the pages and actions used, and security logs, so that we can keep the service working and safe. [CONFIRM ANY ANALYTICS OR COOKIES USED.]',
        'We do not intentionally collect sensitive categories of data. Please do not paste bank account passwords, card numbers or government ID numbers into AlgoStudio.',
      ] },
      { h: '3. Why we use it, and our basis', p: [
        'We use your data to: create and show your account and deals; keep a timestamped record of terms, approvals and payments; send you service messages such as sign-in codes and reminders you ask for; keep the service secure; and improve it.',
        'We rely on your consent, which you give when you sign up and when you add information to the service. You can withdraw consent at any time (see "Your rights"). We may also process data where the DPDP Act permits it without consent, for example to comply with law or to protect against fraud.',
      ] },
      { h: '4. Who we share it with', p: [
        'We do not sell your personal data. We use service providers (data processors) to run AlgoStudio, under written terms that require them to protect it: [LIST PROVIDERS, e.g. database and authentication hosting, website hosting, email delivery, Google sign-in].',
        'When you send a link to a brand, that brand can see the deal details you chose to include in it. We may disclose data if the law or a court requires it.',
      ] },
      { h: '5. Where your data is stored', p: [
        'Your data is stored with our hosting providers in [DATA LOCATION / REGIONS]. If data is processed outside India, we will do so only where the DPDP Act and any government restrictions allow it.',
      ] },
      { h: '6. How long we keep it', p: [
        'We keep your data while your account is open. If you ask us to delete your account, it is scheduled for deletion after a cooling-off period of [30] days so that you can change your mind; after that your account data is erased, except what we must keep by law, which we keep only as long as required: [RETENTION PERIODS FOR LEGAL, TAX AND SECURITY RECORDS].',
      ] },
      { h: '7. Your rights', p: [
        'Under the DPDP Act you can: ask for a summary of the personal data we hold about you and how it is used; ask us to correct or complete it; ask us to erase it; withdraw your consent; get your complaints handled through our grievance process; and nominate another person to exercise these rights for you if you die or become unable to.',
        'To use a right, write to [CONTACT EMAIL]. We will reply within [TIME PERIOD, e.g. 30 days]. You can also delete your account from Settings inside the app.',
      ] },
      { h: '8. Grievance officer', p: [
        'If you have a complaint about how we handle your personal data, contact [GRIEVANCE OFFICER NAME], [DESIGNATION], at [GRIEVANCE OFFICER EMAIL], [POSTAL ADDRESS]. If you are not satisfied with our answer, you may complain to the Data Protection Board of India.',
      ] },
      { h: '9. Children', p: [
        'AlgoStudio is for adults. You must be 18 or older to create an account. We do not knowingly collect personal data of children. If you believe a child has given us data, tell us at [CONTACT EMAIL] and we will delete it.',
      ] },
      { h: '10. Security and breaches', p: [
        'We use reasonable technical and organisational safeguards, including encrypted connections and access controls. No system is perfectly secure. If a personal data breach affects you, we will tell you and the Data Protection Board of India as the DPDP Act requires.',
      ] },
      { h: '11. Changes to this policy', p: [
        'We may update this policy. If a change is important we will tell you in the app or by email before it takes effect. The date at the top shows when it was last changed.',
      ] },
      { h: '12. Contact', p: [`${NAME}, [REGISTERED ADDRESS]. Email: [CONTACT EMAIL].`] },
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Last updated: [EFFECTIVE DATE]',
    intro: `These terms are an agreement between you and ${NAME} ("we", "us") about your use of AlgoStudio. By creating an account or using the service you agree to them. If you do not agree, please do not use AlgoStudio.`,
    sections: [
      { h: '1. What AlgoStudio is', p: [
        'AlgoStudio helps creators organise brand deals: turn a message into terms, share the terms with a brand, track work and payments, and keep a timestamped record. It is a record-keeping and workflow tool.',
      ] },
      { h: '2. What AlgoStudio is not', p: [
        'We are not a law firm and nothing in the service is legal, tax or financial advice. AlgoStudio does not hold, send or collect money, and is not a party to any deal between a creator and a brand. A brand\'s confirmation through a link is a record of what they said; it is not a guarantee that they will perform, and it may not be a binding contract in every situation. Please get your own advice for important deals.',
      ] },
      { h: '3. Your account', p: [
        'You must be 18 or older and able to enter into a contract in India. Give accurate information and keep your sign-in secure. You are responsible for activity on your account.',
      ] },
      { h: '4. Your content and your responsibilities', p: [
        'You own the content you add. You give us permission to store, process and display it to run the service, including showing deal details to the brand you send a link to.',
        'You are responsible for the accuracy of the terms and dates you enter, for having the right to share any brand contact details you add, and for following the law, including data protection law, in how you use them.',
        'Do not use AlgoStudio to send spam, to harass anyone, to break the law, to upload malicious code, or to try to access other people\'s data or interfere with the service.',
      ] },
      { h: '5. Brand links', p: [
        'When you send a link, anyone who has it may be able to open it until it expires or you cancel it. Share links only with the intended brand contact.',
      ] },
      { h: '6. Availability and changes', p: [
        'We work to keep AlgoStudio available but it is provided "as is", and features may change, be added or be removed. Some features may be marked as arriving later; they are not promised until they are released.',
      ] },
      { h: '7. Fees', p: ['[STATE WHETHER THE SERVICE IS FREE OR PAID, PRICES, TAXES AND REFUND TERMS. DELETE THIS SECTION IF NOT APPLICABLE.]'] },
      { h: '8. Our rights in the service', p: [
        'AlgoStudio, its design, software and branding belong to us or our licensors. These terms give you a limited, non-exclusive, non-transferable right to use the service for your own business. They do not transfer any ownership.',
      ] },
      { h: '9. Limits on our responsibility', p: [
        'To the extent the law allows, we are not liable for indirect or consequential loss, loss of profit, or loss from a brand failing to pay or perform. Our total liability to you for any claim about the service is limited to [LIABILITY CAP, e.g. the fees you paid in the last 12 months]. Nothing in these terms limits liability that cannot be limited by law.',
      ] },
      { h: '10. Ending your use', p: [
        'You can stop using AlgoStudio and delete your account at any time from Settings. We may suspend or end an account that breaks these terms or the law. What happens to your data is explained in the Privacy Policy.',
      ] },
      { h: '11. Changes to these terms', p: [
        'We may update these terms. If a change is important we will tell you before it takes effect. If you keep using AlgoStudio after that, you accept the new terms.',
      ] },
      { h: '12. Governing law and disputes', p: [
        'These terms are governed by the laws of India. Courts at [GOVERNING LAW CITY], India have exclusive jurisdiction, subject to any dispute process required by law. [OPTIONAL: ARBITRATION CLAUSE, TO BE DRAFTED BY COUNSEL.]',
      ] },
      { h: '13. Contact', p: [`${NAME}, [REGISTERED ADDRESS]. Email: [CONTACT EMAIL].`] },
    ],
  },
};
