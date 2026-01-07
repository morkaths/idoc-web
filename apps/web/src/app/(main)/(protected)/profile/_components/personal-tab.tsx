"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useProfile, useUpdateProfile } from "@/hooks/data/useProfile";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { DatePicker } from "@/components/form/date-picker";

export function PersonalTab() {
    const { data: session } = useSession();
    const user = session?.user;
    const { data: profile } = useProfile(user?.id?.toString() ?? '');
    const updateProfile = useUpdateProfile();

    const [fullName, setFullName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [birthday, setBirthday] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (profile) {
            setFullName(profile.fullName || "");
            setBio(profile.bio || "");
            setLocation(profile.location || "");
            setBirthday(profile.birthday ? new Date(profile.birthday) : undefined);
        }
    }, [profile]);

    const handleSave = () => {
        if (!profile?._id) return;

        updateProfile.mutate({
            id: profile._id,
            data: {
                fullName,
                bio,
                location,
                birthday: birthday,
            }
        }, {
            onSuccess: () => {
                toast.success("Profile updated successfully");
            },
            onError: (error) => {
                toast.error("Failed to update profile");
                console.error(error);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="bg-muted"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="birthday">Date of Birth</Label>
                        <div className="flex flex-col">
                            <DatePicker
                                selected={birthday}
                                onSelect={setBirthday}
                                placeholder="Pick a date"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. San Francisco, CA"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                    />
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
