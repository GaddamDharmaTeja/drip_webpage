import type { Article, ProjectCase } from '../types'

export const articles: Article[] = [
  {
    id: 'a1',
    title: 'Complete Guide to Drip Irrigation',
    excerpt: 'Layout, emitters, and filtration basics for first-time adopters.',
    tag: 'Guides',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    readTime: '8 min',
  },
  {
    id: 'a2',
    title: 'Water Management in Drip Irrigation',
    excerpt: 'How to schedule irrigation by crop stage and soil type.',
    tag: 'Guides',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
    readTime: '6 min',
  },
  {
    id: 'a3',
    title: 'Tomato Bed Spacing & Emitter Choice',
    excerpt: 'Crop-specific spacing that keeps fruit quality high.',
    tag: 'Crop Specific',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min',
  },
  {
    id: 'a4',
    title: 'Installing Mainline on Sloped Fields',
    excerpt: 'Pressure zones and air vents that prevent blowouts.',
    tag: 'Installation',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    readTime: '7 min',
  },
  {
    id: 'a5',
    title: 'Case Study: 4 Acre Vegetable Cluster',
    excerpt: 'How a farmer group cut water use by 40% in one season.',
    tag: 'Case Studies',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    readTime: '9 min',
  },
  {
    id: 'a6',
    title: 'Greenhouse Fogging vs Drip',
    excerpt: 'When to combine both for humidity and root watering.',
    tag: 'Crop Specific',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min',
  },
]

export const projects: ProjectCase[] = [
  {
    id: 'pr1',
    title: 'Vegetable Cluster Upgrade',
    location: 'Nashik, Maharashtra',
    crop: 'Tomato & Capsicum',
    area: '4 acres',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80',
    summary: 'Site survey to maintenance package with fertigation injectors.',
  },
  {
    id: 'pr2',
    title: 'Mango Orchard Rings',
    location: 'Junagadh, Gujarat',
    crop: 'Mango',
    area: '12 acres',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    summary: 'Tree-ring drip loops with automated zone scheduling.',
  },
  {
    id: 'pr3',
    title: 'Polyhouse Precision Lines',
    location: 'Bengaluru Rural',
    crop: 'Exotic greens',
    area: '2,000 sq.m',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=900&q=80',
    summary: 'PC laterals, zone valves, and sensor-ready controllers.',
  },
]

export const solutions = [
  {
    title: 'Vegetable Farming',
    blurb: 'Bed layouts, mulch-ready laterals, and fertigation ports.',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Fruit Orchards',
    blurb: 'Ring drip and micro-sprinklers matched to tree spacing.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Greenhouse',
    blurb: 'Uniform PC lines with humidity-friendly scheduling.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Field Crops',
    blurb: 'Tape systems for cotton, maize, and seasonal rows.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
  },
]

export const processSteps = [
  { title: 'Site Survey', detail: 'Soil, slope, and water source assessment.' },
  { title: 'Design', detail: 'Hydraulic layout sized to your crop and plot.' },
  { title: 'Supply', detail: 'Branded components delivered to farm gate.' },
  { title: 'Installation', detail: 'Trained crew installs and pressure-tests.' },
  { title: 'Maintenance', detail: 'Seasonal flush, filters, and support.' },
]
