"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { PersonalTab } from "./personal-tab";
import { AccountTab } from "./account-tab";
import { SecurityTab } from "./security-tab";
import { NotificationsTab } from "./notifications-tab";

export function ProfileContent() {
    return (
        <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
                <PersonalTab />
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
                <AccountTab />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
                <SecurityTab />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
                <NotificationsTab />
            </TabsContent>
        </Tabs>
    );
}
