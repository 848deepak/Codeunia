"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Send, Code, BookOpen, Trophy, Heart, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { createBrowserClient } from "@supabase/ssr"
import { toast } from "sonner"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            category: formData.category,
            message: formData.message,
            status: 'new',
            created_at: new Date().toISOString(),
          }
        ])

      if (error) throw error

      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to send message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const supportCategories = [
    { value: "technical", label: "Technical Support", icon: Code },
    { value: "learning", label: "Learning Resources", icon: BookOpen },
    { value: "events", label: "Events & Hackathons", icon: Trophy },
    { value: "collaboration", label: "Collaboration", icon: Heart },
    { value: "other", label: "Other", icon: MessageSquare },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <Card className="border-0 shadow-lg card-hover">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-xl">Send us a Message</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                required
              >
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {supportCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <category.icon className="h-4 w-4" />
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your inquiry"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="shadow-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                rows={4}
                className="shadow-sm resize-none"
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full glow-effect hover:scale-105 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
} 