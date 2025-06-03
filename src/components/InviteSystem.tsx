
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Mail, MessageSquare, Users, Gift } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface InviteSystemProps {
  onClose: () => void;
}

export const InviteSystem = ({ onClose }: InviteSystemProps) => {
  const [email, setEmail] = useState("");
  const [invitesSent, setInvitesSent] = useState(0);
  
  // Generate unique referral code
  const referralCode = "GNO" + Math.random().toString(36).substr(2, 8).toUpperCase();
  const inviteLink = `${window.location.origin}/?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied!",
      description: "Invite link has been copied to your clipboard.",
    });
  };

  const handleEmailInvite = () => {
    if (!email) return;
    
    // In a real app, this would send an actual email
    setInvitesSent(prev => prev + 1);
    setEmail("");
    
    toast({
      title: "Invite Sent!",
      description: `Quiz invitation sent to ${email}`,
    });
  };

  const handleSocialShare = (platform: string) => {
    const message = `Join me on Global Night Out - the ultimate world quiz game! Test your knowledge of 195 countries. ${inviteLink}`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-primary" size={24} />
            <div>
              <h2 className="text-xl font-bold">Invite Friends</h2>
              <p className="text-sm text-muted-foreground">Challenge friends to beat your quiz scores!</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your Referral Link</label>
            <div className="flex gap-2 mt-1">
              <Input value={inviteLink} readOnly className="text-xs" />
              <Button size="sm" onClick={handleCopyLink}>
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Send Email Invitation</label>
            <div className="flex gap-2 mt-1">
              <Input 
                type="email" 
                placeholder="friend@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button size="sm" onClick={handleEmailInvite}>
                <Mail size={16} />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSocialShare('twitter')}>
                <MessageSquare size={16} className="mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSocialShare('facebook')}>
                <Share2 size={16} className="mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSocialShare('whatsapp')}>
                <MessageSquare size={16} className="mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSocialShare('telegram')}>
                <MessageSquare size={16} className="mr-2" />
                Telegram
              </Button>
            </div>
          </div>

          <div className="bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="text-amber-500" size={20} />
              <span className="font-medium">Referral Rewards</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• You get 100 bonus points for each friend who joins</p>
              <p>• Your friend gets 50 welcome bonus points</p>
              <p>• Unlock premium features after 5 successful referrals</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{invitesSent} invites sent</Badge>
              <Badge variant="outline">Code: {referralCode}</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
