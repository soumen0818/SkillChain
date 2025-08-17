import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Wallet, Award } from 'lucide-react';

export const UserInfo = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Username:</span>
                    <span>{user.username}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{user.email}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Wallet:</span>
                    <span className="font-mono text-sm">
                        {user.walletAddress ?
                            `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` :
                            'Not connected'
                        }
                    </span>
                </div>

                {user.bio && (
                    <div className="space-y-1">
                        <span className="font-medium">Bio:</span>
                        <p className="text-sm text-muted-foreground">{user.bio}</p>
                    </div>
                )}

                {user.role === 'teacher' && user.teachingTitle && (
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Title:</span>
                        <span>{user.teachingTitle}</span>
                    </div>
                )}

                <div className="text-xs text-muted-foreground mt-4">
                    Role: {user.role}
                </div>
            </CardContent>
        </Card>
    );
};
