"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Users, Sparkles, Code, Globe } from "lucide-react"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Link from "next/link"

const World = dynamic(() => import("@/components/ui/globe").then(mod => mod.World), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full relative flex items-center justify-center">
      <div className="animate-pulse text-primary">Loading...</div>
    </div>
  )
})

const Particles = dynamic(() => import("@/components/ui/particles").then(mod => mod.Particles), { 
  ssr: false,
  loading: () => null
})

export function HeroSection2() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 2,
      startLat: -15.785493,
      startLng: -47.909029,
      endLat: 36.162809,
      endLng: -115.119411,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 3,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 3,
      startLat: 21.3099,
      startLng: -157.8581,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 3,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 4,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 4,
      startLat: -34.6037,
      startLng: -58.3816,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 4,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 5,
      startLat: 14.5995,
      startLng: 120.9842,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 5,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 5,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 48.8566,
      endLng: -2.3522,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 6,
      startLat: -15.432563,
      startLng: 28.315853,
      endLat: 1.094136,
      endLng: -63.34546,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 6,
      startLat: 37.5665,
      startLng: 126.978,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 6,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 7,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -15.595412,
      endLng: -56.05918,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 7,
      startLat: 48.8566,
      startLng: -2.3522,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 7,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 8,
      startLat: -8.833221,
      startLng: 13.264837,
      endLat: -33.936138,
      endLng: 18.436529,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 8,
      startLat: 49.2827,
      startLng: -123.1207,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 8,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 9,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 9,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 9,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 10,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 10,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 10,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 52.3676,
      endLng: 4.9041,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 11,
      startLat: 41.9028,
      startLng: 12.4964,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 11,
      startLat: -6.2088,
      startLng: 106.8456,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 11,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 12,
      startLat: 34.0522,
      startLng: -118.2437,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 12,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 12,
      startLat: 22.3193,
      startLng: 114.1694,
      endLat: 34.0522,
      endLng: -118.2437,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 13,
      startLat: 52.52,
      startLng: 13.405,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 13,
      startLat: 11.986597,
      startLng: 8.571831,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 13,
      startLat: -22.9068,
      startLng: -43.1729,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
    {
      order: 14,
      startLat: -33.936138,
      startLng: 18.436529,
      endLat: 21.395643,
      endLng: 39.883798,
      arcAlt: 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 pt-20">
     
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/10"></div>
      
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-500/15 to-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-500/10 to-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

     
      <Suspense fallback={null}>
        <Particles />
      </Suspense>

     
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-8 sm:py-12 lg:py-16">
          
         
          <div className="space-y-6 sm:space-y-8 lg:pr-8 w-full lg:order-1">
           
            <div className="animate-fade-in text-center flex justify-right">
              <Badge 
                variant="secondary" 
                className="mb-4 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium shadow-xl bg-background/95 backdrop-blur-md border border-primary/20 relative overflow-hidden group hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="mr-2 text-base sm:text-lg">🚀</span>
                <span className="relative z-10 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-semibold">
                Fueling Devs. Driving Ideas.
                </span>
              </Badge>
            </div>

           
            <div className="animate-fade-in text-center lg:text-left" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight relative group">
                <span className="bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent block sm:inline">
                  Empowering the Next Generation of{" "}
                </span>
                <span className="relative inline-block bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-pulse mt-2 sm:mt-0">
                  Coders
                  <Sparkles className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 text-primary/60 animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                </span>
              </h1>
            </div>

           
            <div className="animate-fade-in text-center lg:text-left" style={{ animationDelay: '0.4s' }}>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 relative px-2 sm:px-0">
                <span className="bg-gradient-to-r from-muted-foreground to-muted-foreground/80 bg-clip-text text-transparent">
                  Real-world projects, curated challenges, a vibrant dev community. Join thousands of developers building
                  the future together across the globe.
                </span>
              </p>
            </div>

           
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4 animate-fade-in relative z-20" style={{ animationDelay: '0.6s' }}>
              <Button
                size="lg"
                className="px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-3xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-purple-600/90 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
                asChild
              >
                <Link href="/events">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Rocket className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10">Explore Events</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold hover:bg-primary/10 bg-background/95 backdrop-blur-md border border-primary/30 hover:border-primary/50 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 w-full sm:w-auto"
                asChild
              >
                <Link href="/auth/signup">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Users className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 relative z-10 group-hover:animate-pulse" />
                <span className="relative z-10 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent group-hover:from-primary group-hover:to-purple-600">
                  Join Community
                </span>
                </Link>
              </Button>
            </div>

            {/* Desktop Stats (hidden on mobile) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8 animate-fade-in relative z-10 hidden lg:grid" style={{ animationDelay: '0.8s' }}>
              {[
                { value: "600+", label: "Active Developers", icon: Users, gradient: "from-blue-500 to-purple-600" },
                { value: "20+", label: "Projects Built", icon: Code, gradient: "from-green-500 to-blue-500" },
                { value: "10+", label: "Events Hosted", icon: Sparkles, gradient: "from-purple-500 to-pink-500" },
                { value: "95%", label: "Success Rate", icon: Globe, gradient: "from-orange-500 to-red-500" }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center space-y-2 sm:space-y-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-background/80 backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2 rounded-full bg-gradient-to-r ${stat.gradient} p-2 sm:p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <stat.icon className="w-full h-full text-white" />
                    </div>
                  </div>
                  
                  <div className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  
                  <div className="text-sm text-muted-foreground relative z-10 group-hover:text-foreground/80 transition-colors duration-300">
                    {stat.label}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
                </div>
              ))}
            </div>
          </div>

         
          <div className="relative animate-fade-in w-full lg:order-2" style={{ animationDelay: '0.6s' }}>
            <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl opacity-30 animate-pulse" />
              <div className="relative z-10 h-full">
                <Suspense fallback={
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="animate-pulse text-primary">Loading...</div>
                  </div>
                }>
                  <World globeConfig={globeConfig} data={sampleArcs} />
                </Suspense>
              </div>
            </div>
            
           {/* Commented out floating icons for now */}
            {/* <div className="absolute top-5 sm:top-10 -right-2 sm:-right-4 bg-gradient-to-r from-primary to-purple-600 p-2 sm:p-3 rounded-full shadow-2xl animate-bounce">
              <Code className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="absolute bottom-10 sm:bottom-20 -left-2 sm:-left-4 bg-gradient-to-r from-green-500 to-blue-500 p-2 sm:p-3 rounded-full shadow-2xl animate-bounce" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="absolute top-1/2 -right-3 sm:-right-6 bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-3 rounded-full shadow-2xl animate-bounce" style={{ animationDelay: '2s' }}>
              <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div> */}
          </div>

          {/* Mobile Stats (hidden on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8 animate-fade-in relative z-10 lg:hidden order-3" style={{ animationDelay: '0.8s' }}>
            {[
              { value: "50K+", label: "Active Developers", icon: Users, gradient: "from-blue-500 to-purple-600" },
              { value: "1.2K+", label: "Projects Built", icon: Code, gradient: "from-green-500 to-blue-500" },
              { value: "200+", label: "Events Hosted", icon: Sparkles, gradient: "from-purple-500 to-pink-500" },
              { value: "95%", label: "Success Rate", icon: Globe, gradient: "from-orange-500 to-red-500" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center space-y-2 sm:space-y-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-background/80 backdrop-blur-md border border-primary/20 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1 sm:mb-2 rounded-full bg-gradient-to-r ${stat.gradient} p-2 sm:p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <stat.icon className="w-full h-full text-white" />
                  </div>
                </div>
                
                <div className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                
                <div className="text-sm text-muted-foreground relative z-10 group-hover:text-foreground/80 transition-colors duration-300">
                  {stat.label}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}