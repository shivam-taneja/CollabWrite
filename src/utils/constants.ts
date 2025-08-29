import { KnowledgePost } from "@/types/post";

export const mockPosts: KnowledgePost[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications with Modern Patterns',
    content: `<h2>Introduction</h2><p>Modern React development has evolved significantly with the introduction of hooks, context, and advanced patterns. In this comprehensive guide, we'll explore the best practices for building scalable React applications.</p><h3>Key Principles</h3><ul><li>Component composition over inheritance</li><li>Custom hooks for reusable logic</li><li>Proper state management strategies</li><li>Performance optimization techniques</li></ul><p>Let's dive deep into each of these principles and see how they can transform your React development workflow.</p>`,
    summary: 'A comprehensive guide to modern React patterns and best practices for scalable applications.',
    category: 'Tech',
    authorId: '1',
    authorName: 'Alex Chen',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    collaborators: ['2']
  },
  {
    id: '2',
    title: 'The Art of Mindful Living in a Digital Age',
    content: `<h2>Finding Balance</h2><p>In our hyperconnected world, finding moments of peace and mindfulness has become more important than ever. This post explores practical strategies for maintaining mental well-being while navigating the digital landscape.</p><blockquote><p>"The present moment is the only time over which we have dominion." - Thich Nhat Hanh</p></blockquote><h3>Daily Practices</h3><ol><li>Morning meditation routine</li><li>Digital detox periods</li><li>Mindful breathing exercises</li><li>Gratitude journaling</li></ol><p>These simple yet powerful practices can help you reclaim your time and attention.</p>`,
    summary: 'Practical strategies for maintaining mindfulness and mental well-being in our digital world.',
    category: 'Life',
    authorId: '2',
    authorName: 'Sarah Johnson',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    title: 'Sustainable Cooking: Farm-to-Table Made Simple',
    content: `<h2>Embracing Local Ingredients</h2><p>Farm-to-table cooking isn't just a trend—it's a sustainable approach to nutrition that benefits both your health and the environment. Learn how to source local ingredients and create delicious, seasonal meals.</p><h3>Benefits of Local Sourcing</h3><ul><li>Fresher, more nutritious ingredients</li><li>Support for local farmers</li><li>Reduced environmental impact</li><li>Stronger community connections</li></ul><p>Start your sustainable cooking journey with these simple tips and seasonal recipe ideas.</p>`,
    summary: 'A guide to sustainable cooking with local, seasonal ingredients and simple techniques.',
    category: 'Food',
    authorId: '3',
    authorName: 'Michael Rodriguez',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '4',
    title: 'Understanding Sleep Science: Optimize Your Rest for Better Health',
    content: `<h2>The Science of Sleep</h2><p>Quality sleep is fundamental to our physical and mental health, yet many of us struggle with sleep-related issues. Understanding the science behind sleep can help you optimize your rest and improve your overall well-being.</p><h3>Sleep Stages</h3><ol><li>Light sleep (NREM Stage 1)</li><li>Deep sleep (NREM Stage 2)</li><li>Deepest sleep (NREM Stage 3)</li><li>REM sleep</li></ol><p>Each stage plays a crucial role in memory consolidation, physical recovery, and mental health. Let's explore how to optimize each phase.</p>`,
    summary: 'An exploration of sleep science and practical tips for improving sleep quality and health.',
    category: 'Health',
    authorId: '4',
    authorName: 'Emily Davis',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  }
]