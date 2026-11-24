import { ShieldCheck, FileText, Activity, CheckCircle2 } from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";

const content = {
  "/privacy": {
    title: "Privacy Policy",
    eyebrow: "Your data, handled carefully",
    icon: ShieldCheck,
    sections: [
      ["What we collect", "We collect the account details, delivery metadata, and configuration data needed to provide SMTPLite. Email content is used only to process the send request and show delivery history."],
      ["How we use it", "We use this information to authenticate requests, deliver messages, secure the service, troubleshoot failures, and improve reliability. We do not sell personal information."],
      ["Your choices", "You can review or remove credentials and API keys from your profile. Contact support if you need help with an account data request."],
    ],
  },
  "/terms": {
    title: "Terms of Service",
    eyebrow: "Simple rules for dependable sending",
    icon: FileText,
    sections: [
      ["Use responsibly", "Use SMTPLite only for lawful, permission-based email. You are responsible for your recipients, content, sender identity, and compliance with applicable email laws."],
      ["Keep access private", "Protect API keys and app credentials. Rotate them immediately if exposed. We may rate-limit or suspend abusive traffic to protect the service and its users."],
      ["Service expectations", "We work to keep the service available and delivery reliable, but third-party SMTP providers and recipient networks can affect final delivery."],
    ],
  },
};

export const InformationPage = ({ type = "/privacy" }) => {
  const { background, card, border, foreground, primary, mutedForeground } = useThemeStyles();
  const page = content[type] || content["/privacy"];
  const Icon = page.icon;
  return (
    <main className="min-h-screen px-4 py-12 md:py-16" style={{ backgroundColor: background.color }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${primary.color}18`, color: primary.color }}><Icon size={24} /></div>
          <div><p className="text-xs font-bold uppercase tracking-[.18em] mb-2" style={{ color: primary.color }}>{page.eyebrow}</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: foreground.color }}>{page.title}</h1><p className="mt-3" style={{ color: mutedForeground.color }}>Last updated November 24, 2026</p></div>
        </div>
        <div className="space-y-3">
          {page.sections.map(([heading, body]) => <section key={heading} className="p-6 md:p-7 rounded-2xl" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><h2 className="text-lg font-semibold mb-2" style={{ color: foreground.color }}>{heading}</h2><p className="leading-7" style={{ color: mutedForeground.color }}>{body}</p></section>)}
        </div>
      </div>
    </main>
  );
};

export const SystemStatus = () => {
  const { background, card, border, foreground, mutedForeground } = useThemeStyles();
  return <main className="min-h-screen px-4 py-12 md:py-16" style={{ backgroundColor: background.color }}><div className="max-w-3xl mx-auto"><div className="mb-10"><p className="text-xs font-bold uppercase tracking-[.18em] mb-2 text-emerald-600">Live service health</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: foreground.color }}>System Status</h1><p className="mt-3" style={{ color: mutedForeground.color }}>Current availability for SMTPLite components.</p></div><div className="p-6 rounded-2xl" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={22} /><div><p className="font-semibold" style={{ color: foreground.color }}>All systems operational</p><p className="text-sm mt-1" style={{ color: mutedForeground.color }}>API, dashboard, and email queue are operating normally.</p></div></div><div className="grid sm:grid-cols-3 gap-3 mt-7">{["API", "Dashboard", "Email delivery"].map((label) => <div key={label} className="p-4 rounded-xl" style={{ backgroundColor: background.color, border: `1px solid ${border.color}` }}><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-sm font-medium" style={{ color: foreground.color }}>{label}</span></div><p className="text-xs mt-2" style={{ color: mutedForeground.color }}>Operational</p></div>)}</div></div></div></main>;
};
