import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-green-600">🌱 Seed of Gratitude</span>
            <div className="space-x-4">
              <Button variant="ghost">Home</Button>
              <Button variant="ghost">About</Button>
              <Button variant="ghost">Contact</Button>
              <Button>Start Game</Button>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">🌱 Seed of Gratitude — Planting Virtues, Growing Potential</h1>
          <p className="text-xl mb-8">Embark on a journey where each seed represents a virtue and journaling reveals your inner strengths.</p>
          <div className="space-x-4">
            <Button size="lg">Start Game</Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">🌟 From the Heart: The Journey Behind Seed of Gratitude</h2>
          <div className="flex items-center space-x-8">
            <div className="flex-1">
              <p className="text-lg">
                Seed of Gratitude was born from a desire to help people discover and nurture their inner virtues. 
                Our team of passionate developers and psychologists came together to create a unique experience 
                that combines the symbolism of seeds with the power of journaling.
              </p>
            </div>
            <div className="flex-1">
              <img src="/api/placeholder/400/300" alt="Team or founder" className="rounded-lg shadow-md" />
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">Unlock Your Virtues with Seed of Gratitude</h2>
          <p className="text-lg mb-8">
            In Seed of Gratitude, you'll collect seeds representing various virtues. Through journaling and 
            reflection, you'll nurture these seeds, watching them grow into beautiful representations of your 
            personal strengths and potential.
          </p>
          <div className="aspect-w-16 aspect-h-9">
            <img src="/api/placeholder/800/450" alt="Game introduction video placeholder" className="rounded-lg shadow-md" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Virtue Seeds</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Collect seeds that represent various virtues, each symbolizing a unique trait.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Journaling for Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Use journaling to reflect on and cultivate these virtues, unlocking new potentials.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Personalized Evolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Customize your seed cards to reflect your personal journey and growth.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Collaborative Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Engage in group challenges to explore virtues together.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Screenshots and Videos Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">Explore the Game World</h2>
          <p className="text-lg mb-8">
            Dive into the visuals and animations that showcase the seed and virtue concepts, and how journaling 
            plays a role in the game.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img src="/api/placeholder/300/200" alt="Game screenshot 1" className="rounded-lg shadow-md" />
            <img src="/api/placeholder/300/200" alt="Game screenshot 2" className="rounded-lg shadow-md" />
            <img src="/api/placeholder/300/200" alt="Game screenshot 3" className="rounded-lg shadow-md" />
          </div>
        </section>

        {/* User Testimonials Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">What Our Players Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">"Seed of Gratitude has transformed the way I approach personal growth. It's both fun and profound!"</p>
                <div className="flex items-center">
                  <img src="/api/placeholder/50/50" alt="User avatar" className="rounded-full mr-4" />
                  <span className="font-semibold">Jane Doe</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">"I never thought a game could help me discover so much about myself. Highly recommended!"</p>
                <div className="flex items-center">
                  <img src="/api/placeholder/50/50" alt="User avatar" className="rounded-full mr-4" />
                  <span className="font-semibold">John Smith</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Download Links Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Grow? Download Now</h2>
          <div className="space-x-4">
            <Button size="lg">
              <img src="/api/placeholder/20/20" alt="App Store icon" className="mr-2" />
              Download on the App Store
            </Button>
            <Button size="lg">
              <img src="/api/placeholder/20/20" alt="Google Play icon" className="mr-2" />
              Get it on Google Play
            </Button>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">Join the Seed of Gratitude Community</h2>
          <p className="text-lg mb-8">
            Connect with other players, share your experiences, and grow together in our vibrant community.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline">
              <img src="/api/placeholder/20/20" alt="Facebook icon" className="mr-2" />
              Facebook
            </Button>
            <Button variant="outline">
              <img src="/api/placeholder/20/20" alt="Twitter icon" className="mr-2" />
              Twitter
            </Button>
            <Button variant="outline">
              <img src="/api/placeholder/20/20" alt="Discord icon" className="mr-2" />
              Discord
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I start playing Seed of Gratitude?</AccordionTrigger>
              <AccordionContent>
                Simply download the app from your device's app store, create an account, and you're ready to begin your journey of self-discovery!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is my journal private?</AccordionTrigger>
              <AccordionContent>
                Yes, your journal entries are completely private and secure. Only you can access your personal reflections.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I play with friends?</AccordionTrigger>
              <AccordionContent>
                Absolutely! You can invite friends to join you in collaborative challenges and share your growth journey together.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Newsletter Signup Section */}
        <section className="py-16">
          <h2 className="text-3xl font-semibold mb-6">Stay Updated</h2>
          <p className="text-lg mb-8">
            Sign up for our newsletter to receive updates, tips, and exclusive content related to Seed of Gratitude.
          </p>
          <form className="flex space-x-4">
            <Input type="email" placeholder="Enter your email" className="flex-grow" />
            <Button type="submit">Subscribe</Button>
          </form>
        </section>
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Seed of Gratitude</h3>
              <p>Planting virtues, growing potential.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Quick Links</h3>
              <ul>
                <li><a href="#" className="hover:text-green-300">Home</a></li>
                <li><a href="#" className="hover:text-green-300">About</a></li>
                <li><a href="#" className="hover:text-green-300">FAQs</a></li>
                <li><a href="#" className="hover:text-green-300">Contact</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-semibold mb-2">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-300">Facebook</a>
                <a href="#" className="hover:text-green-300">Twitter</a>
                <a href="#" className="hover:text-green-300">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 Seed of Gratitude. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
