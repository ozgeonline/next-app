import {
  Facebook, Twitter, Instagram, Youtube,
  Home, Utensils, Calendar, Users, BookOpen, Mail,
  MapPin, Phone, Clock,
  Soup, ChefHat, ShieldCheck
} from "lucide-react";

export const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

export const quickLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Menu", href: "/menu", icon: Utensils },
  { label: "Reservation", href: "/reservations", icon: Calendar },
  { label: "Community", href: "/community", icon: Users },
  { label: "Meals", href: "/meals", icon: BookOpen },
  { label: "Contact Us", href: "/contact", icon: Mail },
];

export const contactInfo = [
  { text: "Coding Str., 123, Canggu, Bali", icon: MapPin },
  { text: "info@example.com", icon: Mail },
  { text: "+1 (234) 567-890", icon: Phone },
  { text: "Mon - Fri: 9am - 5pm", icon: Clock },
];

export const uspItems = [
  { title: "Fresh Ingredients", desc: "Sourced with love", icon: Soup },
  { title: "Made with Passion", desc: "By food lovers", icon: ChefHat },
  { title: "Community First", desc: "Share & inspire", icon: Users },
  { title: "Secure & Safe", desc: "Your data is protected", icon: ShieldCheck },
];

export const legalLinksData = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Cookies", href: "#" },
];