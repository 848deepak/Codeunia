"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Lightbulb, Send, Code2, Users, GraduationCap, MessageSquare } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";

export function MentorForm() {
    
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
        expertise: "",
        linkedin: "",
        
        // Mentoring Preferences
        expertiseAreas: [] as string[],
        mentoringTypes: [] as string[],
        availability: "",
        commitment: "",
        
        // Motivation
        whyMentor: "",
        previousMentoring: "",
        teachingStyle: "",
        
        // Consent
        termsAccepted: false,
        contactPermission: false,
    });

    const expertiseAreas = [
        { value: "web-development", label: "Web Development", icon: Code2 },
        { value: "mobile-development", label: "Mobile Development", icon: Code2 },
        { value: "ai-ml", label: "AI & Machine Learning", icon: Code2 },
        { value: "data-science", label: "Data Science", icon: Code2 },
        { value: "cybersecurity", label: "Cybersecurity", icon: Code2 },
        { value: "blockchain", label: "Blockchain", icon: Code2 },
        { value: "ui-ux", label: "UI/UX Design", icon: Users },
        { value: "devops", label: "DevOps", icon: Code2 },
        { value: "game-development", label: "Game Development", icon: Code2 },
        { value: "cloud-computing", label: "Cloud Computing", icon: Code2 },
        { value: "system-design", label: "System Design", icon: Code2 },
        { value: "algorithms", label: "Algorithms & Data Structures", icon: Code2 },
    ];

    const mentoringTypes = [
        { value: "one-on-one", label: "One-on-One Mentoring", icon: Users },
        { value: "group-sessions", label: "Group Sessions", icon: Users },
        { value: "code-reviews", label: "Code Reviews", icon: Code2 },
        { value: "project-guidance", label: "Project Guidance", icon: Lightbulb },
        { value: "career-advice", label: "Career Advice", icon: GraduationCap },
        { value: "interview-prep", label: "Interview Preparation", icon: MessageSquare },
    ];

    const availabilityOptions = [
        { value: "weekends", label: "Weekends" },
        { value: "weekdays", label: "Weekdays" },
        { value: "evenings", label: "Evenings" },
        { value: "flexible", label: "Flexible" },
    ];

    const commitmentOptions = [
        { value: "occasional", label: "Occasional (1-2 sessions/month)" },
        { value: "regular", label: "Regular (Weekly sessions)" },
        { value: "intensive", label: "Intensive (Multiple sessions/week)" },
        { value: "flexible", label: "Flexible - As needed" },
    ];

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleExpertiseToggle = (expertise: string) => {
        setFormData((prev) => ({
            ...prev,
            expertiseAreas: prev.expertiseAreas.includes(expertise)
                ? prev.expertiseAreas.filter((e) => e !== expertise)
                : [...prev.expertiseAreas, expertise],
        }));
    };

    const handleMentoringTypeToggle = (type: string) => {
        setFormData((prev) => ({
            ...prev,
            mentoringTypes: prev.mentoringTypes.includes(type)
                ? prev.mentoringTypes.filter((t) => t !== type)
                : [...prev.mentoringTypes, type],
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
                .from('mentor_applications')
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
                        expertise: formData.expertise,
                        linkedin: formData.linkedin,
                        expertise_areas: formData.expertiseAreas,
                        mentoring_types: formData.mentoringTypes,
                        availability: formData.availability,
                        why_mentor: formData.whyMentor,
                        terms_accepted: formData.termsAccepted,
                        contact_permission: formData.contactPermission,
                        status: 'pending',
                        created_at: new Date().toISOString(),
                    }
                ]);
            if (error) throw error;
            toast.success('Application submitted successfully!');
            // reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                location: "",
                occupation: "",
                company: "",
                experience: "",
                expertise: "",
                linkedin: "",
                expertiseAreas: [],
                mentoringTypes: [],
                availability: "",
                commitment: "",
                whyMentor: "",
                previousMentoring: "",
                teachingStyle: "",
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
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Lightbulb className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-2xl">Mentor Registration</CardTitle>
                    </div>
                    <p className="text-muted-foreground">
                        Share your expertise and guide the next generation of developers
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information */}
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
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
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

                        {/* Professional Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Current Role *</Label>
                                    <Input
                                        id="occupation"
                                        value={formData.occupation}
                                        onChange={(e) => handleInputChange("occupation", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company/Organization *</Label>
                                    <Input
                                        id="company"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange("company", e.target.value)}
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Experience *</Label>
                                    <Input
                                        id="experience"
                                        value={formData.experience}
                                        onChange={(e) => handleInputChange("experience", e.target.value)}
                                        placeholder="e.g., 5+ years in software development"
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">LinkedIn Profile *</Label>
                                    <Input
                                        id="linkedin"
                                        type="url"
                                        value={formData.linkedin}
                                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        required
                                        className="h-11 focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expertise">Areas of Expertise *</Label>
                                <Textarea
                                    id="expertise"
                                    value={formData.expertise}
                                    onChange={(e) => handleInputChange("expertise", e.target.value)}
                                    placeholder="Describe your technical expertise, specializations, and key skills..."
                                    rows={3}
                                    required
                                    className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Mentoring Preferences */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Mentoring Preferences</h3>
                            
                            <div className="space-y-4">
                                <Label>Areas of Expertise (Select all that apply) *</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {expertiseAreas.map((area) => (
                                        <div key={area.value} className="flex items-center space-x-3">
                                            <Checkbox
                                                id={area.value}
                                                checked={formData.expertiseAreas.includes(area.value)}
                                                onCheckedChange={() => handleExpertiseToggle(area.value)}
                                                className="border-white/10 focus:ring-primary/20 bg-background/30"
                                            />
                                            <Label htmlFor={area.value} className="flex items-center space-x-2 cursor-pointer">
                                                <area.icon className="h-4 w-4" />
                                                <span>{area.label}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Mentoring Types (Select all that apply) *</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {mentoringTypes.map((type) => (
                                        <div key={type.value} className="flex items-center space-x-3">
                                            <Checkbox
                                                id={type.value}
                                                checked={formData.mentoringTypes.includes(type.value)}
                                                onCheckedChange={() => handleMentoringTypeToggle(type.value)}
                                                className="border-white/10 focus:ring-primary/20 bg-background/30"
                                            />
                                            <Label htmlFor={type.value} className="flex items-center space-x-2 cursor-pointer">
                                                <type.icon className="h-4 w-4" />
                                                <span>{type.label}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="availability">Preferred Availability *</Label>
                                    <select
                                        id="availability"
                                        value={formData.availability}
                                        onChange={(e) => handleInputChange("availability", e.target.value)}
                                        required
                                        className="w-full h-11 px-3 py-2 bg-background/30 backdrop-blur-sm border border-white/10 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-colors"
                                    >
                                        <option value="">Select availability</option>
                                        {availabilityOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="commitment">Commitment Level *</Label>
                                    <select
                                        id="commitment"
                                        value={formData.commitment}
                                        onChange={(e) => handleInputChange("commitment", e.target.value)}
                                        required
                                        className="w-full h-11 px-3 py-2 bg-background/30 backdrop-blur-sm border border-white/10 rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-colors"
                                    >
                                        <option value="">Select commitment</option>
                                        {commitmentOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="motivation">Why do you want to be a mentor? *</Label>
                                    <Textarea
                                        id="motivation"
                                        value={formData.whyMentor}
                                        onChange={(e) => handleInputChange("whyMentor", e.target.value)}
                                        placeholder="Tell us about your motivation and what you hope to achieve as a mentor..."
                                        rows={4}
                                        required
                                        className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="previousMentoring">Previous Mentoring Experience</Label>
                                    <Textarea
                                        id="previousMentoring"
                                        value={formData.previousMentoring}
                                        onChange={(e) => handleInputChange("previousMentoring", e.target.value)}
                                        placeholder="Describe any previous experience as a mentor, teacher, or guide..."
                                        rows={3}
                                        className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="teachingStyle">Teaching/Mentoring Style</Label>
                                    <Textarea
                                        id="teachingStyle"
                                        value={formData.teachingStyle}
                                        onChange={(e) => handleInputChange("teachingStyle", e.target.value)}
                                        placeholder="Describe your approach to teaching and mentoring. How do you prefer to guide learners?"
                                        rows={3}
                                        className="focus:ring-2 focus:ring-primary/20 bg-background/30 backdrop-blur-sm border-white/10 hover:border-primary/20 transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            className="w-full h-12 text-base font-medium hover:opacity-90 transition-opacity bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 relative overflow-hidden group"
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
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-white/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
} 