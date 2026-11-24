/**
 * ─────────────────────────────────────────────────────────────
 *  ALL PERSONAL CONTENT LIVES HERE — edit this file only.
 * ─────────────────────────────────────────────────────────────
 */

export type SocialIcon = 'github' | 'linkedin' | 'leetcode' | 'x' | 'instagram' | 'mail';

export interface Social {
  label: string;
  href: string; // leave '' to hide the icon
  icon: SocialIcon;
}

export interface CareerItem {
  year: string; // shown big in the middle of the timeline (e.g. "2022", "NOW")
  role: string;
  place: string;
  description: string;
}

export interface Tech {
  name: string;
  /** Short label drawn on the ball when no logo image is provided */
  label: string;
  /** Badge colours used for the generated logo texture */
  bg: string;
  fg: string;
  /**
   * OPTIONAL: path to a real logo image (PNG/SVG with transparent background),
   * e.g. `${BASE}logos/react.png`. Put the file in /public/logos/.
   * When set, it replaces the generated badge texture on the 3D ball.
   */
  logo?: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  /** Cover image — replace the SVGs in /public/projects/ with real screenshots (16:10 works best) */
  image: string;
}

/** Prefix for files in /public (works locally and under a sub-path like GitHub Pages) */
const BASE = import.meta.env.BASE_URL;

export const portfolio = {
  name: 'Devraj Goswami',
  firstName: 'Devraj',
  lastName: 'Goswami',
  initials: 'DG',
  email: 'devrajgoswami001@gmail.com',
  phone: '', // optional — leave empty to keep your number off the site
  location: 'Chennai, India',
  resumeUrl: `${BASE}resume.pdf`,

  hero: {
    greeting: "Hello! I'm",
    headingPrefix: 'A Full-Stack',
    /** These words cycle with a text-scramble animation */
    cyclingWords: ['DEVELOPER', 'ENGINEER', 'PROBLEM SOLVER'],
    tagline: 'MERN · Health-tech · AI',
  },

  /**
   * 3D AVATAR
   * By default a stylised developer (glasses + hoodie) is built from code in
   * src/three/Avatar.tsx, so the site works with no downloads.
   *
   * To use your own model:
   *   1. Export a GLB (Ready Player Me, Avaturn, Blender, etc.)
   *   2. Save it as /public/models/avatar.glb
   *   3. Set glbUrl below to `${BASE}models/avatar.glb`
   *   4. Tweak scale/position until it sits nicely in the hero.
   * The head bone (any bone whose name contains "Head") will follow the mouse.
   */
  avatar: {
    glbUrl: '',
    scale: 1,
    position: [0, -1.55, 0] as [number, number, number],
  },

  about:
    "I'm a full-stack software engineer who loves turning ideas into fast, production-ready web experiences — from a healthcare EHR system built on HL7/FHIR standards at Teksoft Labs to AI-powered learning platforms. I care about clean interfaces, solid APIs and code that scales, and I sharpen my problem-solving every day with competitive programming.",

  socials: [
    { label: 'GitHub', href: 'https://github.com/DevrajGoswami001', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/devraj-goswami-20244629b/', icon: 'linkedin' },
    { label: 'LeetCode', href: 'https://leetcode.com/u/devraj_Goswami007/', icon: 'leetcode' },
    { label: 'X', href: '', icon: 'x' }, // add your X/Twitter URL to show it
    { label: 'Instagram', href: '', icon: 'instagram' }, // add your Instagram URL to show it
    { label: 'Email', href: 'mailto:devrajgoswami001@gmail.com', icon: 'mail' },
  ] as Social[],

  career: [
    {
      year: '2022',
      role: 'B.Tech, Computer Science',
      place: 'SRM Institute of Science & Technology',
      description:
        'Started CSE in Chennai. Built strong foundations in DSA, OOP, DBMS and Operating Systems — currently holding an 8.3 / 10 CGPA.',
    },
    {
      year: '2024',
      role: 'Hackathons & Certifications',
      place: 'Builder · Speaker',
      description:
        'Shipped production-ready prototypes across 7+ hackathons, ran workshops for 100+ participants, and earned AWS ML Foundations, Computer Networks and Oracle Cloud (OCI) certifications.',
    },
    {
      year: '2025',
      role: 'Software Engineering Intern',
      place: 'Teksoft Labs · Remote',
      description:
        'Built 10+ reusable React components for the HealthyTrack EHR (~30% faster UI development) and integrated real-time, HL7/FHIR-compliant REST APIs in Agile sprints.',
    },
    {
      year: 'NOW',
      role: 'Open to SDE roles',
      place: 'Graduating May 2026',
      description:
        'Building full-stack & AI products with MERN and LangChain, solving 300+ LeetCode problems (contest rating 1,580 · top 26.84%), and looking for my first full-time role.',
    },
  ] as CareerItem[],

  /** 3D tech balls — 15 is the sweet spot for performance */
  techstack: [
    { name: 'HTML5', label: 'HTML', bg: '#E34F26', fg: '#ffffff' },
    { name: 'CSS3', label: 'CSS', bg: '#1572B6', fg: '#ffffff' },
    { name: 'JavaScript', label: 'JS', bg: '#F7DF1E', fg: '#111111' },
    { name: 'React', label: 'React', bg: '#20232A', fg: '#61DAFB' },
    { name: 'Node.js', label: 'node', bg: '#3C873A', fg: '#ffffff' },
    { name: 'Express', label: 'ex', bg: '#111111', fg: '#ffffff' },
    { name: 'MongoDB', label: 'Mongo', bg: '#13AA52', fg: '#ffffff' },
    { name: 'C++', label: 'C++', bg: '#00599C', fg: '#ffffff' },
    { name: 'Python', label: 'Py', bg: '#3776AB', fg: '#FFD43B' },
    { name: 'SQL', label: 'SQL', bg: '#336791', fg: '#ffffff' },
    { name: 'Git', label: 'git', bg: '#F05032', fg: '#ffffff' },
    { name: 'LangChain', label: 'LC', bg: '#1C3C3C', fg: '#7FFFD4' },
    { name: 'AWS', label: 'aws', bg: '#232F3E', fg: '#FF9900' },
    { name: 'Postman', label: 'PM', bg: '#FF6C37', fg: '#ffffff' },
    { name: 'Bootstrap', label: 'B', bg: '#7952B3', fg: '#ffffff' },
  ] as Tech[],

  projects: [
    {
      title: 'Downhill',
      description:
        'Interactive EdTech coding platform with WebSocket real-time collaboration, a LangChain AI teaching assistant and an adaptive learning algorithm that personalises the curriculum.',
      tags: ['MERN', 'WebSockets', 'LangChain', 'AI'],
      link: 'https://github.com/DevrajGoswami001',
      image: `${BASE}projects/downhill.svg`,
    },
    {
      title: 'FoodWeb',
      description:
        'End-to-end food delivery platform with Razorpay payments, JWT auth + role-based access, and an admin dashboard with real-time order tracking and inventory.',
      tags: ['MERN', 'JWT', 'Razorpay', 'RBAC'],
      link: 'https://github.com/DevrajGoswami001',
      image: `${BASE}projects/foodweb.svg`,
    },
    {
      title: 'AI ChatBot',
      description:
        'Full-stack conversational assistant — React frontend, Node/Express backend and LangChain for context-aware replies with persistent conversation state.',
      tags: ['React', 'Node.js', 'Express', 'LangChain'],
      link: 'https://github.com/DevrajGoswami001',
      image: `${BASE}projects/chatbot.svg`,
    },
  ] as Project[],

  contact: {
    heading: "Let's work together",
    sub: "I'm open to full-time Software Engineering roles. Have an idea or an opening? My inbox is always open.",
  },
};
