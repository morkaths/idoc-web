"use client";

import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { useProfile } from "@/hooks/data/useProfile";

export default function ProfileHeader() {
    const { data: session } = useSession();
    const user = session?.user;
    const { data: profile } = useProfile(user?.id?.toString() ?? '');

    if (!user) return null;

    return (
        <Card>
            <CardContent>
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profile?.avatar || ''} alt={user.username || 'User'} />
                            <AvatarFallback className="text-2xl">
                                {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <h1 className="text-2xl font-bold">{user.username || 'User'}</h1>
                            <Badge variant="secondary">Pro Member</Badge>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="size-4" />
                                {user.email}
                            </div>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                {profile?.birthday ? new Date(profile.birthday).toLocaleDateString() : 'N/A'}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="size-4" />
                                {profile?.location ? profile.location : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}