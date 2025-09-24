import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, MapPin, MessageCircle, TrendingUp, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-6 glass animate-scale-in">
            <span className="text-green-600 mr-2">●</span>
            Bridging the gap to quality education
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance tracking-tight animate-fade-up">
            Your pathway to
            <span className="text-primary"> government college</span> success
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty animate-fade-up" style={{animationDelay:"80ms"}}>
            Discover personalized career guidance, explore government colleges, and unlock affordable quality education
            opportunities tailored just for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{animationDelay:"140ms"}}>
            <Link href="/quiz">
              <Button size="lg" className="text-lg px-8 shadow-md hover:shadow-lg">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent hover:bg-primary/10">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-sm text-muted-foreground">Students Guided</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Government Colleges</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">₹2L+</div>
              <div className="text-sm text-muted-foreground">Average Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything you need for career success</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              From aptitude assessment to college enrollment, we guide you every step of the way
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/quiz">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer glass lift tilt animate-fade-up" style={{animationDelay:"60ms"}}>
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Assessment</h3>
                  <p className="text-muted-foreground">
                    AI-powered aptitude tests that understand your strengths and recommend the perfect career path
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/colleges">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer glass lift tilt animate-fade-up" style={{animationDelay:"120ms"}}>
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">College Directory</h3>
                  <p className="text-muted-foreground">
                    Comprehensive database of government colleges with detailed information and interactive maps
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/career-mapping">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer glass lift tilt animate-fade-up" style={{animationDelay:"180ms"}}>
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Career Mapping</h3>
                  <p className="text-muted-foreground">
                    Visual pathways showing how different courses lead to specific careers and salary prospects
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/chatbot">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer glass lift tilt animate-fade-up" style={{animationDelay:"240ms"}}>
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Counselor</h3>
                  <p className="text-muted-foreground">
                    24/7 intelligent chatbot providing instant answers to your education and career questions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/parent-portal">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer glass lift tilt animate-fade-up" style={{animationDelay:"300ms"}}>
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Parent Portal</h3>
                  <p className="text-muted-foreground">
                    Dedicated dashboard for parents to track progress and participate in educational decisions
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="p-6 hover:shadow-xl transition-all cursor-pointer glass lift tilt animate-fade-up" style={{animationDelay:"360ms"}}>
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Success Tracking</h3>
                  <p className="text-muted-foreground">
                    Monitor application deadlines, entrance exams, and admission progress in one place
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Ready to discover your perfect career path?</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their way to quality government college education
          </p>
          <Link href="/quiz">
            <Button size="lg" className="text-lg px-8 shadow-md hover:shadow-lg">
              Start Free Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
