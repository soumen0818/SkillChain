import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-border bg-background/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">SkillChain</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Learn, earn, and prove your skills on-chain with NFT credentials and SkillTokens.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link className="hover:text-primary" to="/courses">Courses</Link></li>
                            <li><Link className="hover:text-primary" to="/marketplace">Marketplace</Link></li>
                            <li><Link className="hover:text-primary" to="/about">About</Link></li>
                            <li><a className="hover:text-primary" href="#">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a className="hover:text-primary" href="#">Docs</a></li>
                            <li><a className="hover:text-primary" href="#">Help Center</a></li>
                            <li><a className="hover:text-primary" href="#">Community</a></li>
                            <li><a className="hover:text-primary" href="#">Blog</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Stay up to date</h4>
                        <p className="text-sm text-muted-foreground mb-3">Get the latest on new courses, airdrops, and governance votes.</p>
                        <div className="flex gap-2">
                            <Input type="email" placeholder="Email address" className="bg-background/80" />
                            <Button className="gradient-primary">Subscribe</Button>
                        </div>

                        <div className="flex items-center gap-3 mt-6 text-muted-foreground">
                            <a href="#" aria-label="Twitter" className="hover:text-primary"><Twitter className="w-5 h-5" /></a>
                            <a href="#" aria-label="LinkedIn" className="hover:text-primary"><Linkedin className="w-5 h-5" /></a>
                            <a href="#" aria-label="GitHub" className="hover:text-primary"><Github className="w-5 h-5" /></a>
                            <a href="mailto:hello@skillchain.io" aria-label="Email" className="hover:text-primary"><Mail className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} SkillChain. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-primary">Terms</a>
                        <a href="#" className="hover:text-primary">Privacy</a>
                        <a href="#" className="hover:text-primary">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
