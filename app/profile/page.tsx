"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const userProfile = {
  name: "Justin Ambar",
  role: "Cultivation Manager",
  email: "justin.ambar@vervana.com",
  phone: "+1 (555) 123-4567",
  location: "Denver, CO",
  joinDate: "2022-03-15",
  membershipStatus: "Active Employee",
};

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto flex gap-8">
        <div className="flex-grow">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/images/justin-ambar.jpg" alt={userProfile.name} />
                  <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                  <p className="text-xl text-muted-foreground">{userProfile.role}</p>
                </div>
              </div>
              <Button className="mt-4">Change Photo</Button>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={userProfile.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={userProfile.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" defaultValue={userProfile.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={userProfile.location} />
                  </div>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Slack</TableCell>
                    <TableCell>Connected</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Google Workspace</TableCell>
                    <TableCell>Connected</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Asana</TableCell>
                    <TableCell>Not Connected</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Connect</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>My Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{userProfile.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{userProfile.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {userProfile.joinDate}</span>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Employment Status</h3>
                <p>{userProfile.membershipStatus}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}