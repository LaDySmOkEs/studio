// src/app/court-directory/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CourtClerk {
  id: string;
  name: string;
  courtName: string;
  county: string;
  state: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
}

const MOCK_COURT_CLERKS: CourtClerk[] = [
  { id: "1", name: "Jane Doe", courtName: "Superior Court", county: "Liberty", state: "CA", phone: "555-0101", email: "jane.doe@libertycourt.ca.gov", address: "123 Main St, Libertyville, CA 90210", website: "http://libertycourt.ca.gov" },
  { id: "2", name: "John Smith", courtName: "District Court", county: "Freedom", state: "TX", phone: "555-0202", email: "j.smith@freedomcourt.tx.us", address: "456 Constitution Ave, Freedom City, TX 75001" },
  { id: "3", name: "Alice Brown", courtName: "County Court", county: "Justice", state: "NY", phone: "555-0303", email: "abrown@justicecounty.ny.gov", address: "789 Bill of Rights Blvd, Justiceton, NY 10001", website: "http://justicecounty.ny.gov" },
  { id: "4", name: "Robert Green", courtName: "Municipal Court", county: "Liberty", state: "CA", phone: "555-0105", email: "r.green@libertycitycourt.ca.gov", address: "10 Civic Center Plaza, Libertyville, CA 90210" },
  { id: "5", name: "Emily White", courtName: "Supreme Court Clerk's Office", county: "Capital", state: "DC", phone: "202-555-0404", email: "ewhite@supremecourt.gov", address: "1 First Street NE, Washington, DC 20543", website: "http://supremecourt.gov" },
];


export default function CourtDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClerks = useMemo(() => {
    const lowerTrimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (!lowerTrimmedSearchTerm) return MOCK_COURT_CLERKS;
    
    return MOCK_COURT_CLERKS.filter(clerk =>
      clerk.name.toLowerCase().includes(lowerTrimmedSearchTerm) ||
      clerk.courtName.toLowerCase().includes(lowerTrimmedSearchTerm) ||
      clerk.county.toLowerCase().includes(lowerTrimmedSearchTerm) ||
      clerk.state.toLowerCase().includes(lowerTrimmedSearchTerm)
    );
  }, [searchTerm]);

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Court Directory</CardTitle>
        <CardDescription>
          Find contact information for court clerks. You can search by name, court, county, or state.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="search"
          placeholder="Search directory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          aria-label="Search court directory"
        />
        <ScrollArea className="border rounded-md">
          <div className="max-h-[600px]"> {/* Max height for scroll area content */}
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Court / Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClerks.length > 0 ? (
                  filteredClerks.map((clerk) => (
                    <TableRow key={clerk.id}>
                      <TableCell className="font-medium">{clerk.name}</TableCell>
                      <TableCell>
                        <div className="font-semibold">{clerk.courtName}</div>
                        <div className="text-xs text-muted-foreground">{clerk.county} County, {clerk.state}</div>
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" /> {clerk.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> {clerk.phone}
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                          <a href={`mailto:${clerk.email}`} className="hover:underline text-primary">{clerk.email}</a>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {clerk.website && (
                          <a href={clerk.website} target="_blank" rel="noopener noreferrer">
                            <Badge variant="outline" className="hover:bg-accent cursor-pointer">Website</Badge>
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
        {filteredClerks.length === 0 && MOCK_COURT_CLERKS.length > 0 && (
          <p className="text-center text-muted-foreground mt-4">
            Your search for "{searchTerm}" did not match any records. Try a different search term.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
