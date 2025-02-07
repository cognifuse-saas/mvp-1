import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Image as ImageIcon,
  Paperclip,
  Mic,
  MoreVertical,
  RefreshCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  CheckCheck,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  isTyping?: boolean;
}

const mockSuggestions = [
  "Help me create a LinkedIn outreach campaign",
  "Analyze my campaign performance",
  "Write a follow-up message template",
  "Generate connection request ideas",
  "Optimize my profile for better reach"
];

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const messageAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm Zoe, your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand you're interested in that. Let me help you with a detailed response...",
        sender: 'ai',
        timestamp: new Date(),
        status: 'sent' as const
      };

      setMessages(prev => [
        ...prev.map(m => m.id === userMessage.id ? { ...m, status: 'sent' as const } : m),
        aiMessage
      ]);
    } catch (error) {
      setMessages(prev => 
        prev.map(m => m.id === userMessage.id ? { ...m, status: 'error' as const } : m)
      );
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      className="flex h-[calc(100vh-6rem)] flex-col space-y-8"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-dark">Chat with Zoe</h1>
            <p className="text-sm text-gray-dark/70">Your AI assistant for LinkedIn outreach</p>
          </div>
        </div>
        <button 
          className="rounded-lg p-2 hover:bg-gray-50"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5 text-gray-dark/50" />
        </button>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  variants={messageAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`flex items-start gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-primary/10'
                  }`}>
                    {message.sender === 'user' 
                      ? <User className="h-4 w-4" />
                      : <Bot className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <div className={`group relative max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-50'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="absolute bottom-0 right-0 translate-y-full pt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-dark/50">
                        {message.status === 'sending' && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        {message.status === 'sent' && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                        {message.status === 'error' && (
                          <RefreshCcw 
                            className="h-3 w-3 cursor-pointer hover:text-primary"
                            onClick={() => {
                              // Implement retry logic
                            }}
                          />
                        )}
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    {message.sender === 'ai' && (
                      <div className="absolute right-0 top-0 hidden -translate-x-2 translate-y-2 gap-1 group-hover:flex">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded-full bg-white p-1 text-gray-dark/50 hover:text-primary"
                          onClick={() => handleCopy(message.content, message.id)}
                        >
                          {isCopied === message.id ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded-full bg-white p-1 text-gray-dark/50 hover:text-green-500"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="rounded-full bg-white p-1 text-gray-dark/50 hover:text-red-500"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                variants={messageAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-start gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex max-w-[75%] items-center gap-1 rounded-2xl bg-gray-50 px-4 py-2">
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2 }}
                      className="h-2 w-2 rounded-full bg-gray-400"
                    />
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
                      className="h-2 w-2 rounded-full bg-gray-400"
                    />
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.2, delay: 0.4 }}
                      className="h-2 w-2 rounded-full bg-gray-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <AnimatePresence>
            {messages.length === 1 && (
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="border-t border-gray-100 p-4"
              >
                <p className="mb-3 text-sm font-medium text-gray-dark">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {mockSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:border-primary/20 hover:bg-primary/5"
                      onClick={() => {
                        setInput(suggestion);
                      }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-end gap-4">
              <div className="flex flex-1 items-end gap-2 rounded-lg border border-gray-200 bg-white p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 resize-none border-0 bg-transparent p-2 text-sm focus:outline-none"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '2.5rem',
                    maxHeight: '10rem'
                  }}
                />
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-lg p-2 text-gray-dark/50 hover:bg-gray-50 hover:text-primary"
                    onClick={handleFileUpload}
                  >
                    <Paperclip className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-lg p-2 text-gray-dark/50 hover:bg-gray-50 hover:text-primary"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-lg p-2 text-gray-dark/50 hover:bg-gray-50 hover:text-primary"
                  >
                    <Mic className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </Card>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        aria-label="Upload file"
        title="Upload file"
        onChange={(e) => {
          // Handle file upload
          console.log(e.target.files);
        }}
      />
    </motion.div>
  );
};

export default Chat; 