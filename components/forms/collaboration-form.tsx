"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, FileText, Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";

export function CollaborationForm() {
    
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // organization information
        organizationName: "",
        website: "",
        contactPerson: "",
        email: "",
        
        // collaboration information
        collaborationReason: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // basic validation
        if (!formData.organizationName || !formData.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.website && !formData.website.startsWith("http")) {
            toast.error("Please enter a valid website URL starting with http:// or https://");
            return;
        }

        setIsSubmitting(true);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { error } = await supabase
                .from('collaboration_applications')
                .insert([
                    {
                        organization_name: formData.organizationName,
                        website: formData.website,
                        contact_person: formData.contactPerson,
                        email: formData.email,
                        collaboration_reason: formData.collaborationReason,
                        status: 'new',
                        created_at: new Date().toISOString(),
                    }
                ]);

            if (error) throw error;

            toast.success("Application submitted successfully!");
            setFormData({
                organizationName: "",
                website: "",
                contactPerson: "",
                email: "",
                collaborationReason: "",
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit application. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Organization Information */}
                <Card className="border-0 shadow-2xl bg-background/60 backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <CardTitle>Organization Information</CardTitle>
                                <CardDescription>
                                    Tell us about your organization and how we can reach you.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="organizationName">Organization Name *</Label>
                                <Input
                                    id="organizationName"
                                    value={formData.organizationName}
                                    onChange={(e) => handleInputChange("organizationName", e.target.value)}
                                    placeholder="Enter your organization name"
                                    required
                                    className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={(e) => handleInputChange("website", e.target.value)}
                                    placeholder="https://yourorganization.com"
                                    className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contactPerson">Contact Person *</Label>
                                <Input
                                    id="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                                    placeholder="Full name of primary contact"
                                    required
                                    className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="contact@organization.com"
                                    required
                                    className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Collaboration Information */}
                <Card className="border-0 shadow-2xl bg-background/60 backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <CardTitle>Collaboration Information</CardTitle>
                                <CardDescription>
                                    Tell us why you want to collaborate with us.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="collaborationReason">Why do you want to collaborate? *</Label>
                            <Textarea
                                id="collaborationReason"
                                value={formData.collaborationReason}
                                onChange={(e) => handleInputChange("collaborationReason", e.target.value)}
                                placeholder="Describe why you want to collaborate with our coding community and what you hope to achieve..."
                                rows={6}
                                required
                                className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="px-8 py-3 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Collaboration Application"
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
} 