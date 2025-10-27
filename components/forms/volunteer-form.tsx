"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { HandHeart, Send, Calendar, MapPin, Users, Code2, Heart } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";

export function VolunteerForm() {
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Personal Information
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        
        // Professional Information
        occupation: "",
        company: "",
        experience: "",
        skills: "",
        
        // Volunteering Preferences
        interests: [] as string[],
        
        // Additional Information
        motivation: "",
        previousVolunteer: "",
        
        // Consent
        termsAccepted: false,
        contactPermission: false,
    });

    const volunteerInterests = [
        { value: "event-planning", label: "Event Planning & Organization", icon: Calendar },
        { value: "technical-support", label: "Technical Support (Coding & Mentoring)", icon: Code2 },
        { value: "community-management", label: "Community Management", icon: Users },
        { value: "marketing", label: "Marketing & Promotion", icon: Heart },
        { value: "content-creation", label: "Content Creation", icon: Send },
        { value: "graphic-designing", label: "Graphic Designing", icon: MapPin },
    ];

    const handleInputChange = (field: string, value: string | boolean | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInterestToggle = (interest: string) => {
        setFormData((prev) => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { error } = await supabase
                .from('volunteer_applications')
                .insert([
                    {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        occupation: formData.occupation,
                        company: formData.company,
                        experience: formData.experience,
                        skills: formData.skills,
                        interests: formData.interests,
                        motivation: formData.motivation,
                        terms_accepted: formData.termsAccepted,
                        contact_permission: formData.contactPermission,
                        status: 'pending',
                        created_at: new Date().toISOString(),
                    }
                ]);
            if (error) throw error;
            toast.success('Application submitted successfully!');
            // reset
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                location: "",
                occupation: "",
                company: "",
                experience: "",
                skills: "",
                interests: [],
                motivation: "",
                previousVolunteer: "",
                termsAccepted: false,
                contactPermission: false,
            });
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error('Failed to submit application. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
        >
            <Card className="border-0 shadow-2xl bg-background/60 backdrop-blur-xl">
                <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                            <HandHeart className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Volunteer Application</CardTitle>
                    </div>
                    <p className="text-muted-foreground">
                        Help us create amazing experiences for the developer community
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location/City *</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Current Occupation *</Label>
                                    <Input
                                        id="occupation"
                                        value={formData.occupation}
                                        onChange={(e) => handleInputChange("occupation", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">College/Organization *</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange("company", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Relevant Experience *</Label>
                                <Textarea
                                    id="experience"
                                    value={formData.experience}
                                    onChange={(e) => handleInputChange("experience", e.target.value)}
                                    placeholder="Describe your relevant experience in event organization, community management, or technical skills..."
                                    rows={3}
                                    required
                                    className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills & Expertise *</Label>
                                <Textarea
                                    id="skills"
                                    value={formData.skills}
                                    onChange={(e) => handleInputChange("skills", e.target.value)}
                                    placeholder="List your technical skills, soft skills, languages, or any other relevant expertise..."
                                    rows={3}
                                    required
                                    className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Volunteering Preferences */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Volunteering Preferences</h3>
                            
                            <div className="space-y-4">
                                <Label>Areas of Interest *</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {volunteerInterests.map((interest) => (
                                        <div key={interest.value} className="flex items-center space-x-3">
                                            <Checkbox
                                                id={interest.value}
                                                checked={formData.interests.includes(interest.value)}
                                                onCheckedChange={() => handleInterestToggle(interest.value)}
                                                className="border-white/10 focus:ring-primary/20 bg-background/30"
                                            />
                                            <Label htmlFor={interest.value} className="flex items-center space-x-2 cursor-pointer">
                                                <interest.icon className="h-4 w-4" />
                                                <span>{interest.label}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="motivation">Why do you want to volunteer with Codeunia? *</Label>
                                    <Textarea
                                        id="motivation"
                                        value={formData.motivation}
                                        onChange={(e) => handleInputChange("motivation", e.target.value)}
                                        placeholder="Tell us about your motivation and what you hope to achieve..."
                                        rows={4}
                                        required
                                        className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="previousVolunteer">Previous Volunteer Experience</Label>
                                    <Textarea
                                        id="previousVolunteer"
                                        value={formData.previousVolunteer}
                                        onChange={(e) => handleInputChange("previousVolunteer", e.target.value)}
                                        placeholder="Describe any previous volunteer experience or community involvement..."
                                        rows={3}
                                        className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            className="w-full h-12 text-base font-medium hover:opacity-90 transition-opacity bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 relative overflow-hidden group"
                            disabled={isSubmitting}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Submitting Application...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit Application
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-white/10 to-pink-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
} 