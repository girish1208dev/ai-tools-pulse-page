
import { useState, useEffect } from 'react';
import { ArrowUp, Twitter, Linkedin, Github, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [aiToolsText, setAiToolsText] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const loadAiToolsContent = async () => {
    try {
      console.log('Loading AI tools content from local file...');
      const response = await fetch('/src/data/ai-tools.md');
      
      if (response.ok) {
        const text = await response.text();
        console.log('Successfully loaded content:', text);
        setAiToolsText(text);
        setLastUpdated(new Date());
        return true;
      } else {
        throw new Error('Failed to load local file');
      }
    } catch (error) {
      console.error('Failed to fetch AI tools list:', error);
      const fallbackContent = `1. **ChatGPT** - Advanced conversational AI for writing, coding, and problem-solving
2. **Claude** - Anthropic's AI assistant for analysis, writing, and creative tasks  
3. **Midjourney** - AI-powered image generation and artistic creation
4. **GitHub Copilot** - AI pair programmer for code suggestions and completion
5. **Notion AI** - Intelligent writing assistant integrated into Notion workspace
6. **Jasper** - AI copywriting tool for marketing and content creation
7. **Runway ML** - AI video editing and generation platform
8. **DeepL** - Neural machine translation with superior accuracy
9. **Grammarly** - AI-powered writing enhancement and grammar checking
10. **Canva AI** - Intelligent design assistant for graphics and presentations`;
      setAiToolsText(fallbackContent);
      setLastUpdated(new Date());
      return false;
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    const success = await loadAiToolsContent();
    setIsRefreshing(false);
    
    if (success) {
      toast({
        title: "Content Updated",
        description: "AI tools list has been refreshed successfully.",
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Using fallback content. Check console for details.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadAiToolsContent();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    const timer = setTimeout(() => setIsVisible(true), 100);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatAiToolsContent = (text: string) => {
    return text.split('\n').filter(line => line.trim()).map((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^\d+\./)) {
        const parts = trimmedLine.split(' - ');
        const titlePart = parts[0];
        const description = parts[1] || '';
        
        const numberMatch = titlePart.match(/^(\d+)\.\s*\*\*(.*?)\*\*/);
        if (numberMatch) {
          const number = numberMatch[1];
          const title = numberMatch[2];
          
          return (
            <div key={index} className="mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50 hover:shadow-md transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {number}
                </span>
                <div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
                  {description && (
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        }
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Tools Hub
            </h1>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Top 10 AI Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the most powerful AI tools that are transforming how we work, create, and innovate in 2024.
          </p>
        </div>
      </section>

      {/* AI Tools Content Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Essential AI Tools for 2024
              </h3>
              <div className="space-y-4">
                {formatAiToolsContent(aiToolsText)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Stay Updated
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Click the refresh button in the header to manually update the content. 
            The list contains the latest AI news and trending topics.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Content Available Locally
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold mb-4">AI Tools Hub</h4>
            <p className="text-gray-400 mb-6">
              Your go-to resource for discovering the best AI tools and technologies.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center gap-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                <Linkedin size={24} />
              </a>
              <a href="https://github.com/girish1208dev/ai-tools-pulse-page" className="text-gray-400 hover:text-white transition-colors duration-300 hover:scale-110 transform">
                <Github size={24} />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 AI Tools Hub. All rights reserved. | Content synced from GitHub repository
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Index;
