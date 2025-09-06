import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Shield, Eye } from 'lucide-react';

interface UserRoleDisplayProps {
  role?: 'Admin' | 'Researcher' | 'Viewer';
  username?: string;
}

export const UserRoleDisplay: React.FC<UserRoleDisplayProps> = ({ 
  role = 'Viewer', 
  username = 'Guest User' 
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-4 w-4" />;
      case 'Researcher':
        return <User className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'destructive';
      case 'Researcher':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-muted">
              {getRoleIcon(role)}
            </div>
            <div>
              <p className="font-medium">{username}</p>
              <p className="text-sm text-muted-foreground">Current Session</p>
            </div>
          </div>
          <Badge variant={getRoleColor(role) as any} className="flex items-center gap-1">
            {getRoleIcon(role)}
            {role}
          </Badge>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Session started: {new Date().toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};