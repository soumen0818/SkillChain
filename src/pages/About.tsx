import SEO from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Coins, Vote, Store, Users, Building2, Rocket, Crown } from 'lucide-react';
import { useMemo } from 'react';

export default function About() {
  const faq = [
    { q: 'What is SkillChain?', a: 'SkillChain turns course completions into blockchain-verified NFT certificates and rewards learners with SkillTokens.' },
    { q: 'How do I earn tokens?', a: 'Complete lessons, quizzes, and courses to earn SkillTokens (ERC-20) which can be traded or used for governance.' },
    { q: 'Can employers verify credentials?', a: 'Yes, employers can verify NFT certificates on-chain instantly—no paperwork or manual checks.' },
  ];

  const structured = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.map(item => ({
      '@type': 'Question',
      'name': item.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': item.a }
    }))
  }), [faq]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <SEO
        title="About SkillChain | Learn‑to‑Earn, NFT Certificates & DAO"
        description="SkillChain issues NFT micro‑credentials, rewards learning with SkillTokens, powers a marketplace and DAO governance for education."
        structuredData={structured}
      />

      <header className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">About SkillChain</h1>
          <p className="text-muted-foreground">A decentralized learn‑to‑earn platform with fraud‑proof credentials and a thriving education economy.</p>
          <div className="flex gap-2 justify-center">
            <Badge className="gradient-primary text-white">Ethereum</Badge>
            <Badge variant="outline">NFT Credentials</Badge>
            <Badge variant="outline">DAO Governance</Badge>
          </div>
        </div>
      </header>

      <main className="mt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <section className="grid md:grid-cols-3 gap-6">
            {[{icon: Shield, title: 'Blockchain Certificates', text: 'Micro‑credentials minted as NFTs so every badge is tamper‑proof and portable.'},
              {icon: Coins, title: 'SkillTokens Economy', text: 'Learn‑to‑earn model where progress yields fungible tokens with real utility.'},
              {icon: Store, title: 'Peer‑to‑Peer Market', text: 'Trade certificates and tokens directly; creators get royalties on resales.'}].map((f, i) => (
              <Card key={i} className="p-6 space-y-3 animate-scale-in" style={{animationDelay: `${i*60}ms`}}>
                <f.icon className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.text}</p>
              </Card>
            ))}
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">How It Works</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                <li>Teachers onboard courses; content stored off‑chain.</li>
                <li>Students complete lessons and request credentials.</li>
                <li>NFT certificates minted; metadata stored on IPFS.</li>
                <li>SkillTokens issued to student wallets for achievements.</li>
                <li>Marketplace supports listing, buying, and royalties.</li>
                <li>Token holders propose and vote via DAO governance.</li>
              </ol>
            </Card>
            <Card className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">Who Benefits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Learners: ownable, verifiable credentials and token rewards.</li>
                <li className="flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> Educators: revenue from initial mints and secondary royalties.</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Employers: instant, fraud‑proof verification.</li>
                <li className="flex items-center gap-2"><Crown className="w-4 h-4 text-primary" /> Platform: fees grow a community‑owned treasury.</li>
              </ul>
            </Card>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            {[{title:'Unique Advantages', points:['Immutable NFT credentials','Learning‑to‑earn incentives','Secondary marketplace value','Decentralized governance']},
              {title:'Monetization', points:['2–5% transaction fees','Listing fees for new courses','Royalty split for creators','Premium analytics & launches']},
              {title:'Vision', points:['Global skills liquidity','Open, portable credentials','Incentivized lifelong learning','Community‑driven standards']}].map((col, i) => (
              <Card key={i} className="p-6 space-y-3 animate-scale-in" style={{animationDelay: `${i*60}ms`}}>
                <h3 className="text-lg font-semibold">{col.title}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {col.points.map((p, idx) => (<li key={idx}>{p}</li>))}
                </ul>
              </Card>
            ))}
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="text-xl font-semibold">FAQ</h3>
              <div className="space-y-4">
                {faq.map((f, i) => (
                  <div key={i} className="border-b border-border pb-4">
                    <p className="font-medium">{f.q}</p>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6 gradient-secondary">
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">We believe skills should be verifiable, portable, and valuable. SkillChain is building a transparent education economy where learning is rewarded and credentials are universally trusted.</p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <Rocket className="w-5 h-5 text-primary" />
                <span>Onwards to a fair, community‑governed future of education.</span>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
