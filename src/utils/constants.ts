import { PostCategory } from "@/types/post";

export const FEED_LIMIT = 10

export const categoryColors: Record<PostCategory, string> = {
  Tech: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Life: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Health: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Other: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
}

export const mockPost = {
  $id: "68b4c062001ef079b1f1",
  title: "The Future of Collaborative Knowledge Sharing",
  content: `
    <div class="prose prose-lg max-w-none">
      <p class="text-xl text-muted-foreground mb-6">Welcome to the future of collaborative writing and knowledge sharing. This comprehensive guide will walk you through the revolutionary approaches that are transforming how we create, share, and build upon collective knowledge.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Introduction to Modern Collaboration</h2>
      <p>In today's interconnected world, the ability to collaborate effectively on knowledge creation has become more crucial than ever. Traditional methods of documentation and knowledge sharing are being revolutionized by new technologies and methodologies.</p>
      
      <blockquote class="border-l-4 border-primary pl-6 py-2 my-6 bg-muted/50 rounded-r-lg">
        <p class="italic text-lg">"The best way to share knowledge is to make it accessible, collaborative, and continuously evolving."</p>
        <footer class="text-sm text-muted-foreground mt-2">— Knowledge Management Expert</footer>
      </blockquote>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Key Benefits of Collaborative Writing</h3>
      <ul class="space-y-2">
        <li class="flex items-center gap-2">
          <span class="w-2 h-2 bg-primary rounded-full"></span>
          Enhanced creativity through diverse perspectives
        </li>
        <li class="flex items-center gap-2">
          <span class="w-2 h-2 bg-primary rounded-full"></span>
          Real-time feedback and continuous improvement
        </li>
        <li class="flex items-center gap-2">
          <span class="w-2 h-2 bg-primary rounded-full"></span>
          Distributed expertise and knowledge validation
        </li>
        <li class="flex items-center gap-2">
          <span class="w-2 h-2 bg-primary rounded-full"></span>
          Faster iteration and content refinement
        </li>
      </ul>
      
      <h3 class="text-xl font-semibold mt-8 mb-3">Implementation Strategies</h3>
      <p>To successfully implement collaborative knowledge sharing in your organization or community, consider these proven strategies:</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="p-4 bg-card border rounded-lg">
          <h4 class="font-semibold text-primary mb-2">Clear Guidelines</h4>
          <p class="text-sm text-muted-foreground">Establish clear collaboration guidelines and editorial standards.</p>
        </div>
        <div class="p-4 bg-card border rounded-lg">
          <h4 class="font-semibold text-primary mb-2">Version Control</h4>
          <p class="text-sm text-muted-foreground">Implement robust version control for tracking changes and contributions.</p>
        </div>
        <div class="p-4 bg-card border rounded-lg">
          <h4 class="font-semibold text-primary mb-2">Review Process</h4>
          <p class="text-sm text-muted-foreground">Create structured review processes for quality assurance.</p>
        </div>
        <div class="p-4 bg-card border rounded-lg">
          <h4 class="font-semibold text-primary mb-2">Recognition System</h4>
          <p class="text-sm text-muted-foreground">Acknowledge and reward valuable contributions to maintain engagement.</p>
        </div>
      </div>
      
      <h2 class="text-2xl font-bold mt-10 mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Technical Implementation</h2>
      <p>The technical backbone of modern collaborative platforms relies on several key technologies:</p>
      
      <pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto">
        <code class="text-sm">
// Example collaboration event handling
const handleCollaborativeEdit = (change) => {
  // Real-time synchronization
  syncWithCollaborators(change);
  
  // Update local state
  updateDocument(change);
  
  // Persist changes
  saveToDatabase(change);
};
        </code>
      </pre>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Future Outlook</h3>
      <p class="text-muted-foreground">As we look toward the future, collaborative knowledge sharing will continue to evolve with emerging technologies like AI-assisted writing, advanced conflict resolution, and immersive collaboration environments.</p>
      
      <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mt-8">
        <h4 class="font-semibold mb-2">💡 Pro Tip</h4>
        <p class="text-sm">Start small with your collaborative initiatives and gradually expand as your team becomes more comfortable with the tools and processes.</p>
      </div>
    </div>
  `,
  summary: "A comprehensive exploration of modern collaborative knowledge sharing techniques and their transformative impact on content creation and community building.",
  category: "Technology",
  $createdAt: "2025-01-15T10:30:00.000Z",
  $updatedAt: "2025-01-15T14:22:30.000Z",
  postCollaborators: {
    owner: "ShivamTaneja",
    collaborators: ["AliceCooper", "BobSmith", "CarolDavis"]
  }
};