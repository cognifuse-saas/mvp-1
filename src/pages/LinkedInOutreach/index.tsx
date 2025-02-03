import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Card, CardHeader } from '../../components/ui/Card';
import { 
  Users, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus,
  Search,
  Filter,
  X,
  BarChart,
  TrendingUp,
  MessageSquare,
  Target,
  Settings,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Trash2,
  Copy,
  Edit,
  Calendar as CalendarIcon,
  Download,
  Upload,
  Link2,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileText,
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { toast, Toaster } from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ConnectionQuality {
  score: number;
  industry_match: number;
  profile_completeness: number;
  engagement_rate: number;
  network_strength: number;
}

interface ABTest {
  id: string;
  name: string;
  variant_a: string;
  variant_b: string;
  total_sent: number;
  variant_a_responses: number;
  variant_b_responses: number;
  status: 'running' | 'completed';
  winner?: 'A' | 'B';
}

interface CampaignAnalytics {
  daily_stats: Array<{
    date: string;
    connections: number;
    messages: number;
    responses: number;
    response_rate: number;
  }>;
  connection_quality: ConnectionQuality;
  ab_tests: ABTest[];
  top_performing_templates: {
    template_id: string;
    response_rate: number;
    total_sent: number;
  }[];
}

interface ScheduleSettings {
  timezone: string;
  daily_limit: number;
  working_hours: {
    start: string;
    end: string;
  };
  working_days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  smart_timing: boolean;
}

interface ABTestSettings {
  duration: number;
  sample_size: number;
  confidence_level: number;
  auto_apply_winner: boolean;
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  connections: number;
  messages: number;
  responses: number;
  lastActive: string;
  analytics?: CampaignAnalytics;
  connection_quality?: ConnectionQuality;
  schedule?: ScheduleSettings;
  ab_test_settings?: ABTestSettings;
}

interface CampaignForm {
  name: string;
  type: 'connection' | 'message' | 'content';
  target: number;
  startDate: string;
  endDate: string;
  description: string;
}

interface CampaignTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'connection' | 'message' | 'follow-up';
}

interface PredictionData {
  value: number;
  timestamp: string;
}

interface AIInsight {
  type: 'success' | 'warning' | 'info';
  message: string;
  metric: string;
  change: number;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Tech Startup CEOs',
    status: 'active',
    connections: 450,
    messages: 380,
    responses: 142,
    lastActive: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Marketing Directors',
    status: 'active',
    connections: 280,
    messages: 245,
    responses: 89,
    lastActive: '15 minutes ago'
  },
  {
    id: '3',
    name: 'Sales Leaders Q4',
    status: 'paused',
    connections: 150,
    messages: 120,
    responses: 45,
    lastActive: '2 days ago'
  },
  {
    id: '4',
    name: 'VC Partners',
    status: 'completed',
    connections: 200,
    messages: 180,
    responses: 75,
    lastActive: '1 week ago'
  }
];

const mockTemplates: CampaignTemplate[] = [
  {
    id: '1',
    name: 'Initial Connection',
    subject: "Let's connect!",
    content: 'Hi {{firstName}}, I noticed your work in {{industry}} and would love to connect...',
    type: 'connection'
  },
  {
    id: '2',
    name: 'Follow-up Message',
    subject: 'Thanks for connecting',
    content: 'Hi {{firstName}}, thank you for accepting my connection request...',
    type: 'follow-up'
  }
];

const analyticsData = [
  { day: 'Mon', connections: 45, messages: 32, responses: 12, rate: 37.5 },
  { day: 'Tue', connections: 52, messages: 45, responses: 18, rate: 40.0 },
  { day: 'Wed', connections: 38, messages: 30, responses: 15, rate: 50.0 },
  { day: 'Thu', connections: 65, messages: 58, responses: 25, rate: 43.1 },
  { day: 'Fri', connections: 42, messages: 36, responses: 20, rate: 55.5 },
  { day: 'Sat', connections: 58, messages: 52, responses: 28, rate: 53.8 },
  { day: 'Sun', connections: 71, messages: 65, responses: 35, rate: 53.8 }
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleFormat = (format: 'bold' | 'italic') => {
    if (format === 'bold') setIsBold(!isBold);
    if (format === 'italic') setIsItalic(!isItalic);
  };

  const handleAlignment = (align: 'left' | 'center' | 'right') => {
    setAlignment(align);
  };

  const handleLink = () => {
    if (!showLinkInput) {
      setShowLinkInput(true);
      return;
    }
    if (linkUrl) {
      onChange(value + `[Link](${linkUrl})`);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 p-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFormat('bold')}
              className={`rounded p-1.5 hover:bg-gray-100 ${isBold ? 'bg-gray-200' : ''}`}
              title="Bold"
              type="button"
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={() => handleFormat('italic')}
              className={`rounded p-1.5 hover:bg-gray-100 ${isItalic ? 'bg-gray-200' : ''}`}
              title="Italic"
              type="button"
            >
              <span className="italic">I</span>
            </button>
            <div className="h-4 w-px bg-gray-300" />
            <button
              onClick={() => handleAlignment('left')}
              className={`rounded p-1.5 hover:bg-gray-100 ${alignment === 'left' ? 'bg-gray-200' : ''}`}
              title="Align left"
              type="button"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAlignment('center')}
              className={`rounded p-1.5 hover:bg-gray-100 ${alignment === 'center' ? 'bg-gray-200' : ''}`}
              title="Align center"
              type="button"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAlignment('right')}
              className={`rounded p-1.5 hover:bg-gray-100 ${alignment === 'right' ? 'bg-gray-200' : ''}`}
              title="Align right"
              type="button"
            >
              <AlignRight className="h-4 w-4" />
            </button>
            <div className="h-4 w-px bg-gray-300" />
            <button
              onClick={() => onChange(value + '\n• ')}
              className="rounded p-1.5 hover:bg-gray-100"
              title="Add bullet list"
              type="button"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={handleLink}
              className={`rounded p-1.5 hover:bg-gray-100 ${showLinkInput ? 'bg-gray-200' : ''}`}
              title="Add link"
              type="button"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange(value + '{{firstName}}')}
              className="rounded px-2 py-1 text-xs hover:bg-gray-100"
              title="Insert first name"
              type="button"
            >
              @First Name
            </button>
            <button
              onClick={() => onChange(value + '{{company}}')}
              className="rounded px-2 py-1 text-xs hover:bg-gray-100"
              title="Insert company"
              type="button"
            >
              @Company
            </button>
            <button
              onClick={() => onChange(value + '{{industry}}')}
              className="rounded px-2 py-1 text-xs hover:bg-gray-100"
              title="Insert industry"
              type="button"
            >
              @Industry
            </button>
          </div>
          {showLinkInput && (
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL..."
                className="rounded-lg border-gray-200 text-sm"
                aria-label="Link URL"
              />
              <button
                onClick={handleLink}
                className="rounded-lg bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary-hover"
                type="button"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-3 text-sm text-${alignment}`}
        rows={6}
        aria-label="Template content"
      />
      <div className="border-t border-gray-200 bg-gray-50 p-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {/* Handle AI suggestions */}}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/5"
            type="button"
          >
            <Sparkles className="h-3 w-3" />
            AI Suggestions
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {/* Handle import */}}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs hover:bg-gray-100"
              title="Import template"
              type="button"
            >
              <Upload className="h-3 w-3" />
              Import
            </button>
            <button
              onClick={() => {/* Handle export */}}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs hover:bg-gray-100"
              title="Export template"
              type="button"
            >
              <Download className="h-3 w-3" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mockPredictionData: Record<string, PredictionData[]> = {
  connections: [
    { value: 120, timestamp: '2024-01-01' },
    { value: 135, timestamp: '2024-01-02' },
    { value: 142, timestamp: '2024-01-03' },
    { value: 158, timestamp: '2024-01-04' },
    { value: 177, timestamp: '2024-01-05' }
  ],
  responses: [
    { value: 45, timestamp: '2024-01-01' },
    { value: 52, timestamp: '2024-01-02' },
    { value: 48, timestamp: '2024-01-03' },
    { value: 58, timestamp: '2024-01-04' },
    { value: 63, timestamp: '2024-01-05' }
  ],
  responseRate: [
    { value: 35, timestamp: '2024-01-01' },
    { value: 38, timestamp: '2024-01-02' },
    { value: 37, timestamp: '2024-01-03' },
    { value: 42, timestamp: '2024-01-04' },
    { value: 44, timestamp: '2024-01-05' }
  ]
};

const mockInsights: AIInsight[] = [
  {
    type: 'success',
    message: 'Connection acceptance rate is trending upward',
    metric: 'Acceptance Rate',
    change: 12
  },
  {
    type: 'warning',
    message: 'Response time has increased slightly',
    metric: 'Response Time',
    change: -5
  },
  {
    type: 'info',
    message: 'Best performing message template identified',
    metric: 'Template Performance',
    change: 8
  }
];

const mockHotLeads = [
  {
    id: '1',
    name: 'John Smith',
    title: 'CEO at TechCorp',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith',
    matchScore: 95,
    isActive: true,
    lastActive: 'now'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    title: 'CTO at InnovateLabs',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson',
    matchScore: 88,
    isActive: false,
    lastActive: '2h ago'
  },
  {
    id: '3',
    name: 'Michael Chen',
    title: 'VP Engineering at ScaleUp',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen',
    matchScore: 92,
    isActive: true,
    lastActive: 'now'
  }
];

const mockSequences = [
  {
    id: '1',
    name: 'Welcome Sequence',
    status: 'active',
    steps: 4,
    completion: 82,
    prospects: 247,
    responseRate: 12
  },
  {
    id: '2',
    name: 'Follow-up Sequence',
    status: 'paused',
    steps: 3,
    completion: 45,
    prospects: 183,
    responseRate: 8
  }
];

// Add this before the interfaces
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[300px] items-center justify-center text-gray-dark/50">
          Something went wrong with the chart. Please try refreshing the page.
        </div>
      );
    }

    return this.props.children;
  }
}

// Update the SafeChart component to use ErrorBoundary
const SafeChart = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
);

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

const templateVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const templateItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Template content component
const TemplateContent = ({ templates }) => (
  <motion.div
    className="space-y-4"
    initial="hidden"
    animate="show"
    variants={templateVariants}
  >
    {templates.map(template => (
      <motion.div
        key={template.id}
        variants={templateItemVariants}
        className="rounded-lg border border-gray-200 p-4"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-dark">{template.name}</h3>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {template.type}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-dark/70">{template.subject}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg p-1.5 text-gray-dark/50 hover:bg-gray-50"
              title="Edit template"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg p-1.5 text-gray-dark/50 hover:bg-gray-50"
              title="Duplicate template"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              className="rounded-lg p-1.5 text-gray-dark/50 hover:bg-gray-50"
              title="Delete template"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <RichTextEditor
            value={template.content}
            onChange={(value) => console.log('Template updated:', value)}
            placeholder="Enter your message template..."
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-dark/50">
          <span>Variables:</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5">firstName</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5">industry</span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5">company</span>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Add this before the LinkedInOutreach component
const CountUpAnimation = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(value * percentage));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
};

// Update the Quick Stats section
const QuickStats = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div variants={fadeIn}>
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-dark">Total Connections</p>
              <p className="text-2xl font-semibold">
                <CountUpAnimation value={1080} />
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-dark">Messages Sent</p>
              <p className="text-2xl font-semibold">
                <CountUpAnimation value={925} />
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-dark">Response Rate</p>
              <p className="text-2xl font-semibold">
                <CountUpAnimation value={38} />%
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-dark">Avg. Response Time</p>
              <p className="text-2xl font-semibold">8h</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Add local storage persistence
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Add this before the LinkedInOutreach component
const Skeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg bg-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-6 w-16 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="rounded-lg bg-gray-100 p-6">
      <div className="h-[300px] rounded-lg bg-gray-200" />
    </div>
  </div>
);

// Update the SortableCampaignRow component
const SortableCampaignRow = ({ campaign, selected, onSelect, renderActions }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: campaign.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      {...attributes}
      {...listeners}
    >
      {/* Existing row content */}
    </motion.tr>
  );
};

// Move ChartLoader and PerformanceChart components here
const ChartLoader = () => (
  <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-100" />
);

const PerformanceChart = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <ChartLoader />;

  return (
    <motion.div
      className="h-[300px] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Existing chart content */}
    </motion.div>
  );
};

// Add interactive chart component
const InteractiveChart = () => {
  const [activeDataKey, setActiveDataKey] = useState('connections');
  const [hoveredData, setHoveredData] = useState(null);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={() => setActiveDataKey('connections')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeDataKey === 'connections' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => setActiveDataKey('messages')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeDataKey === 'messages' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveDataKey('responses')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeDataKey === 'responses' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Responses
        </button>
      </div>

      <div className="relative h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={analyticsData} onMouseMove={(data) => setHoveredData(data)}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="font-medium text-gray-900">{payload[0].payload.day}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {activeDataKey}: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={activeDataKey}
              stroke="#6366F1"
              strokeWidth={2}
              fill="url(#colorGradient)"
            />
            <Line
              type="monotone"
              dataKey={activeDataKey}
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 4, fill: "#6366F1" }}
              activeDot={{ r: 6, fill: "#6366F1" }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {hoveredData && (
          <motion.div
            className="absolute left-0 top-0 h-full w-[1px] bg-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ left: hoveredData.chartX }}
          />
        )}
      </div>
    </div>
  );
};

// Add interactive hot leads component
const HotLeadCard = ({ lead }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    });
  }, [lead.lastActive]);

  return (
    <motion.div
      animate={controls}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            <img src={lead.avatar} alt="" className="h-full w-full object-cover" />
          </div>
          <motion.div
            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white"
            style={{ backgroundColor: lead.isActive ? '#10B981' : '#FCD34D' }}
            animate={{ scale: lead.isActive ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: lead.isActive ? Infinity : 0, duration: 2 }}
          />
        </div>
        <div>
          <p className="font-medium">{lead.name}</p>
          <p className="text-sm text-gray-500">{lead.title}</p>
        </div>
      </div>
      <div className="text-right">
        <motion.span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            lead.matchScore >= 90
              ? 'bg-green-50 text-green-500'
              : 'bg-yellow-50 text-yellow-500'
          }`}
          whileHover={{ scale: 1.05 }}
        >
          {lead.matchScore}% Match
        </motion.span>
        <motion.p
          className="mt-1 text-xs text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: lead.isActive ? Infinity : 0, duration: 2 }}
        >
          {lead.isActive ? 'Active now' : lead.lastActive}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Add interactive sequence card
const SequenceCard = ({ sequence, onToggle, onSettings }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="rounded-lg border border-gray-200 p-4"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{sequence.name}</p>
            <motion.button
              onClick={() => onToggle(sequence.id)}
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                sequence.status === 'active'
                  ? 'bg-green-50 text-green-500'
                  : 'bg-yellow-50 text-yellow-500'
              }`}
              whileHover={{ scale: 1.05 }}
              title={`${sequence.status === 'active' ? 'Pause' : 'Activate'} sequence`}
            >
              {sequence.status}
            </motion.button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {sequence.steps} steps • {sequence.completion}% completion
          </p>
        </div>
        <motion.button
          onClick={() => onSettings(sequence.id)}
          className="rounded-lg p-2 hover:bg-gray-50"
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 200 }}
          aria-label="Sequence settings"
        >
          <Settings className="h-4 w-4 text-gray-500" />
        </motion.button>
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{sequence.prospects} prospects</span>
          <span className="text-gray-300">•</span>
          <motion.span
            className={sequence.responseRate > 10 ? 'text-green-500' : 'text-yellow-500'}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          >
            {sequence.responseRate > 0 ? '+' : ''}{sequence.responseRate}% response rate
          </motion.span>
        </div>
      </div>
      <motion.div
        className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="h-2 rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${sequence.completion}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

// Update the SequenceForm interface
interface SequenceStep {
  id: string;
  type: 'connection' | 'message' | 'visit_profile' | 'endorse_skills' | 'follow' | 'wait';
  content?: string;
  delay?: number;
  condition?: {
    type: 'response' | 'accepted' | 'profile_view' | 'time';
    value: string;
  };
  analytics?: {
    sent: number;
    responses: number;
    success_rate: number;
  };
}

interface SequenceFormProps {
  sequence?: {
    id?: string;
    name: string;
    description: string;
    steps: SequenceStep[];
    status: 'active' | 'paused';
    analytics?: {
      total_prospects: number;
      response_rate: number;
      completion_rate: number;
      average_time: number;
    };
  };
  onSave: (sequence: any) => void;
  onClose: () => void;
}

const SequenceForm: React.FC<SequenceFormProps> = ({ sequence, onSave, onClose }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [formData, setFormData] = useState({
    name: sequence?.name || '',
    description: sequence?.description || '',
    steps: sequence?.steps || [],
    status: sequence?.status || 'active',
    analytics: sequence?.analytics || {
      total_prospects: 0,
      response_rate: 0,
      completion_rate: 0,
      average_time: 0
    }
  });

  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const handleAddStep = (type: SequenceStep['type']) => {
    const newStep: SequenceStep = {
      id: Date.now().toString(),
      type,
      content: type === 'message' ? '' : undefined,
      delay: 0,
      analytics: {
        sent: 0,
        responses: 0,
        success_rate: 0
      }
    };

    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const handleUpdateStep = (index: number, updates: Partial<SequenceStep>) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, ...updates } : step
      )
    }));
  };

  const handleMoveStep = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      const [movedStep] = newSteps.splice(fromIndex, 1);
      newSteps.splice(toIndex, 0, movedStep);
      return { ...prev, steps: newSteps };
    });
  };

  const handleDeleteStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
    setSelectedStep(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: sequence?.id || Date.now().toString(),
      ...formData,
      completion: 0,
      prospects: 0,
      responseRate: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="sequence-name" className="text-sm font-medium text-gray-900">
            Sequence Name
          </label>
          <input
            id="sequence-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border-gray-200 text-sm"
            placeholder="Enter sequence name"
            required
          />
        </div>

        <div>
          <label htmlFor="sequence-status" className="text-sm font-medium text-gray-900">
            Status
          </label>
          <select
            id="sequence-status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'paused' }))}
            className="mt-1 w-full rounded-lg border-gray-200 text-sm"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="sequence-description" className="text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          id="sequence-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 w-full rounded-lg border-gray-200 text-sm"
          rows={3}
          placeholder="Describe your sequence"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Sequence Steps</h3>
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => handleAddStep('connection')}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="h-4 w-4" />
              Add Connection
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleAddStep('message')}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquare className="h-4 w-4" />
              Add Message
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleAddStep('wait')}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Clock className="h-4 w-4" />
              Add Delay
            </motion.button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (active.id !== over?.id) {
              const oldIndex = formData.steps.findIndex(step => step.id === active.id);
              const newIndex = formData.steps.findIndex(step => step.id === over?.id);
              handleMoveStep(oldIndex, newIndex);
            }
          }}
        >
          <div className="mt-4 space-y-4">
            <SortableContext items={formData.steps} strategy={verticalListSortingStrategy}>
              {formData.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`rounded-lg border ${selectedStep === index ? 'border-primary' : 'border-gray-200'} p-4`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                        {step.type === 'connection' && <Users className="h-4 w-4" />}
                        {step.type === 'message' && <MessageSquare className="h-4 w-4" />}
                        {step.type === 'wait' && <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{step.type}</p>
                        {step.analytics && (
                          <p className="mt-1 text-sm text-gray-500">
                            {step.analytics.sent} sent • {step.analytics.success_rate}% success rate
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStep(selectedStep === index ? null : index)}
                        className="rounded-lg p-2 hover:bg-gray-50"
                        aria-label="Toggle step settings"
                        title="Toggle step settings"
                      >
                        <Settings className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(index)}
                        className="rounded-lg p-2 hover:bg-gray-50"
                        aria-label="Delete step"
                        title="Delete step"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {selectedStep === index && (
                    <motion.div
                      className="mt-4 space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {step.type === 'message' && (
                        <div>
                          <label className="text-sm font-medium text-gray-900">Message Content</label>
                          <RichTextEditor
                            value={step.content || ''}
                            onChange={(value) => handleUpdateStep(index, { content: value })}
                            placeholder="Enter your message..."
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-gray-900">Delay Before Action</label>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="number"
                            value={step.delay || 0}
                            onChange={(e) => handleUpdateStep(index, { delay: parseInt(e.target.value) })}
                            className="w-24 rounded-lg border-gray-200 text-sm"
                            min="0"
                            aria-label="Delay duration in hours"
                            title="Delay duration in hours"
                          />
                          <span className="text-sm text-gray-500">hours</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-900">Condition (Optional)</label>
                        <div className="mt-1 grid gap-2 sm:grid-cols-2">
                          <select
                            value={step.condition?.type || ''}
                            onChange={(e) => handleUpdateStep(index, {
                              condition: { type: e.target.value as any, value: '' }
                            })}
                            className="rounded-lg border-gray-200 text-sm"
                            aria-label="Step condition type"
                            title="Step condition type"
                          >
                            <option value="">No condition</option>
                            <option value="response">Wait for response</option>
                            <option value="accepted">Connection accepted</option>
                            <option value="profile_view">Profile viewed</option>
                            <option value="time">Specific time</option>
                          </select>
                          {step.condition && (
                            <input
                              type={step.condition.type === 'time' ? 'time' : 'text'}
                              value={step.condition.value}
                              onChange={(e) => handleUpdateStep(index, {
                                condition: { ...step.condition!, value: e.target.value }
                              })}
                              className="rounded-lg border-gray-200 text-sm"
                              placeholder={step.condition.type === 'time' ? 'Select time' : 'Enter value'}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          {sequence ? 'Save Changes' : 'Create Sequence'}
        </button>
      </div>
    </form>
  );
};

// Update the sequence settings modal content
const SequenceSettingsContent = ({ sequence, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: sequence.name,
    status: sequence.status
  });

  return (
    <div className="mt-6 space-y-6">
      <div>
        <label htmlFor="settings-name" className="text-sm font-medium text-gray-900">
          Sequence Name
        </label>
        <input
          id="settings-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 w-full rounded-lg border-gray-200 text-sm"
          placeholder="Enter sequence name"
        />
      </div>
      <div>
        <label htmlFor="settings-status" className="text-sm font-medium text-gray-900">
          Status
        </label>
        <select
          id="settings-status"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          className="mt-1 w-full rounded-lg border-gray-200 text-sm"
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(formData)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Update the LinkedInOutreach component
const LinkedInOutreach: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useLocalStorage('campaigns', mockCampaigns);
  const [templates, setTemplates] = useLocalStorage('templates', mockTemplates);
  const [showForm, setShowForm] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showABTestModal, setShowABTestModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');
  const [form, setForm] = useState<CampaignForm>({
    name: '',
    type: 'connection',
    target: 100,
    startDate: '',
    endDate: '',
    description: ''
  });
  const [hotLeads, setHotLeads] = useState(mockHotLeads);
  const [sequences, setSequences] = useState(mockSequences);
  const [activeTimeframe, setActiveTimeframe] = useState('7d');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAllLeadsModal, setShowAllLeadsModal] = useState(false);
  const [showSequenceSettingsModal, setShowSequenceSettingsModal] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<any>(null);
  const [showNewSequenceModal, setShowNewSequenceModal] = useState(false);
  const [isRefreshingScores, setIsRefreshingScores] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'campaign' | 'template' | 'sequence', id: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    timezone: 'UTC',
    daily_limit: 100,
    working_hours: { start: '09:00', end: '17:00' },
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    smart_timing: true
  });
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCampaigns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, [setCampaigns]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: form.name,
        status: 'active',
        connections: 0,
        messages: 0,
        responses: 0,
        lastActive: 'Just now'
      };
      
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Campaign created successfully!');
      setShowForm(false);
      setForm({
        name: '',
        type: 'connection',
        target: 100,
        startDate: '',
        endDate: '',
        description: ''
      });
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  // Consolidated delete handler
  const handleDelete = async (id: string, type: 'campaign' | 'template' | 'sequence') => {
    setItemToDelete({ type, id });
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    const { type, id } = itemToDelete;
    switch (type) {
      case 'campaign':
        setCampaigns(prev => prev.filter(c => c.id !== id));
        break;
      case 'template':
        setTemplates(prev => prev.filter(t => t.id !== id));
        break;
      case 'sequence':
        setSequences(prev => prev.filter(s => s.id !== id));
        break;
    }

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  // Add interactive animations
  const pageControls = useAnimation();
  
  useEffect(() => {
    pageControls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    });
  }, []);

  // Handlers for campaign actions
  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' } 
        : campaign
    ));
    toast.success('Campaign status updated successfully!');
  };

  const handleDuplicateCampaign = (campaignId: string) => {
    const campaignToDuplicate = campaigns.find(c => c.id === campaignId);
    if (campaignToDuplicate) {
      const newCampaign = {
        ...campaignToDuplicate,
        id: Date.now().toString(),
        name: `${campaignToDuplicate.name} (Copy)`,
        status: 'paused'
      };
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Campaign duplicated successfully!');
    }
  };

  // Handlers for template actions
  const handleEditTemplate = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleDuplicateTemplate = (templateId: string) => {
    const templateToDuplicate = templates.find(t => t.id === templateId);
    if (templateToDuplicate) {
      const newTemplate = {
        ...templateToDuplicate,
        id: Date.now().toString(),
        name: `${templateToDuplicate.name} (Copy)`
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template duplicated successfully!');
    }
  };

  // Handlers for sequence actions
  const handleToggleSequence = (sequenceId: string) => {
    setSequences(prev => prev.map(sequence =>
      sequence.id === sequenceId
        ? { ...sequence, status: sequence.status === 'active' ? 'paused' : 'active' }
        : sequence
    ));
    toast.success(`Sequence ${sequences.find(s => s.id === sequenceId)?.status === 'active' ? 'paused' : 'activated'} successfully!`);
  };

  const handleSequenceSettings = (sequenceId: string) => {
    const sequence = sequences.find(s => s.id === sequenceId);
    if (sequence) {
      setSelectedSequence(sequence);
      setShowSequenceSettingsModal(true);
    }
  };

  // Handler for refreshing lead scores
  const handleRefreshScores = async () => {
    setIsRefreshingScores(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success('Lead scores refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh lead scores');
    } finally {
      setIsRefreshingScores(false);
    }
  };

  // Handler for exporting data
  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Data exported as ${format.toUpperCase()} successfully!`);
      setShowExportModal(false);
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  // Handler for AI suggestions
  const handleAISuggestions = async () => {
    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const suggestions = [
        'Optimize sending times based on prospect activity',
        'Personalize message templates for higher engagement',
        'Focus on tech industry prospects with >90% match score'
      ];
      setAiSuggestions(suggestions);
      toast.success('AI suggestions generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI suggestions');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Campaign Management Handlers
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: form.name,
        status: 'active',
        connections: 0,
        messages: 0,
        responses: 0,
        lastActive: 'Just now'
      };
      setCampaigns(prev => [...prev, newCampaign]);
      toast.success('Campaign created successfully!');
      setShowForm(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      type: 'connection',
      target: 100,
      startDate: '',
      endDate: '',
      description: ''
    });
  };

  // Template Management Handlers
  const handleCreateTemplate = async (templateData: Partial<CampaignTemplate>) => {
    try {
      const newTemplate: CampaignTemplate = {
        id: Date.now().toString(),
        name: templateData.name || 'New Template',
        subject: templateData.subject || '',
        content: templateData.content || '',
        type: templateData.type || 'connection'
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created successfully!');
      setShowTemplateModal(false);
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  const handleUpdateTemplate = async (templateId: string, updates: Partial<CampaignTemplate>) => {
    try {
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, ...updates } : t
      ));
      toast.success('Template updated successfully!');
    } catch (error) {
      toast.error('Failed to update template');
    }
  };

  // Sequence Management Handlers
  const handleCreateSequence = async (sequenceData: any) => {
    try {
      const newSequence = {
        id: Date.now().toString(),
        name: sequenceData.name,
        status: 'active',
        steps: 0,
        completion: 0,
        prospects: 0,
        responseRate: 0
      };
      setSequences(prev => [...prev, newSequence]);
      toast.success('Sequence created successfully!');
      setShowNewSequenceModal(false);
    } catch (error) {
      toast.error('Failed to create sequence');
    }
  };

  // A/B Test Handlers
  const handleCreateABTest = async (testData: any) => {
    try {
      const newTest: ABTest = {
        id: Date.now().toString(),
        name: testData.name,
        variant_a: testData.variantA,
        variant_b: testData.variantB,
        total_sent: 0,
        variant_a_responses: 0,
        variant_b_responses: 0,
        status: 'running'
      };
      setAbTests(prev => [...prev, newTest]);
      toast.success('A/B Test created successfully!');
      setShowABTestModal(false);
    } catch (error) {
      toast.error('Failed to create A/B Test');
    }
  };

  // Schedule Handlers
  const handleUpdateSchedule = async (scheduleData: ScheduleSettings) => {
    try {
      setScheduleSettings(scheduleData);
      toast.success('Schedule updated successfully!');
      setShowScheduleModal(false);
    } catch (error) {
      toast.error('Failed to update schedule');
    }
  };

  // Hot Leads Handlers
  const handleViewAllLeads = () => {
    setShowAllLeadsModal(true);
  };

  const handleLeadAction = async (leadId: string, action: 'connect' | 'message' | 'ignore') => {
    try {
      // Update lead status based on action
      setHotLeads(prev => prev.map(lead =>
        lead.id === leadId
          ? { ...lead, status: action }
          : lead
      ));
      toast.success(`Lead ${action} action successful!`);
    } catch (error) {
      toast.error(`Failed to ${action} lead`);
    }
  };

  // Sequence handlers
  const handleCreateNewSequence = () => {
    setShowNewSequenceModal(true);
  };

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={pageControls}
    >
      <Toaster position="top-right" />
      
      {/* Enhanced Header with AI Insights */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">LinkedIn Outreach</h1>
            <p className="mt-2 text-gray-600">Manage your LinkedIn outreach campaigns and connections</p>
          </div>
        </div>

        {/* AI Assistant Insights */}
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">AI Assistant Insights</h3>
                {isGeneratingAI ? (
                  <div className="mt-2 animate-pulse">
                    <div className="h-4 w-64 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-48 rounded bg-gray-200" />
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <p key={index} className="text-sm text-gray-600">{suggestion}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleAISuggestions}
              disabled={isGeneratingAI}
              className="flex items-center gap-2 rounded-lg border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats with Trends */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Prospects</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-gray-900">
                  <CountUpAnimation value={2547} />
                </p>
                <span className="text-xs font-medium text-green-500">+12%</span>
              </div>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-red-50 p-3">
              <Target className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Hot Leads</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-gray-900">
                  <CountUpAnimation value={184} />
                </p>
                <span className="text-xs font-medium text-green-500">+8%</span>
              </div>
              <p className="text-xs text-gray-500">vs last month</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-gray-900">
                  <CountUpAnimation value={42} />%
                </p>
                <span className="text-xs font-medium text-green-500">+5%</span>
              </div>
              <p className="text-xs text-gray-500">vs industry avg</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-50 p-3">
              <Send className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sequences</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-gray-900">
                  <CountUpAnimation value={12} />
                </p>
                <span className="text-xs font-medium text-green-500">+2</span>
              </div>
              <p className="text-xs text-gray-500">new this week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <motion.div
        className="mt-8 grid gap-6 lg:grid-cols-12"
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {/* Left Column - Main Content */}
        <motion.div className="lg:col-span-8 space-y-6" variants={fadeIn}>
          {/* Enhanced Performance Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Campaign Performance</h2>
                  <p className="mt-1 text-sm text-gray-500">Track your campaign metrics and ROI</p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    className="rounded-lg border-gray-200 text-sm" 
                    defaultValue="7d"
                    aria-label="Select time period"
                  >
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                  <button
                    className="rounded-lg p-2 hover:bg-gray-50"
                    aria-label="Download report"
                  >
                    <Download className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <div className="mt-4">
              <InteractiveChart />
            </div>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Conversion Funnel</h2>
              <p className="mt-1 text-sm text-gray-500">Track your prospect journey</p>
            </CardHeader>
            <div className="mt-6 space-y-4">
              <div className="relative pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Prospects (2,547)</span>
                  <span>100%</span>
                </div>
                <div className="mt-2 h-4 w-full rounded-full bg-blue-100">
                  <div className="h-4 rounded-full bg-blue-500" style={{ width: '100%' }} />
                </div>
              </div>
              
              <div className="relative pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Connected (1,273)</span>
                  <span>50%</span>
                </div>
                <div className="mt-2 h-4 w-full rounded-full bg-green-100">
                  <div className="h-4 rounded-full bg-green-500" style={{ width: '50%' }} />
                </div>
              </div>
              
              <div className="relative pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Engaged (637)</span>
                  <span>25%</span>
                </div>
                <div className="mt-2 h-4 w-full rounded-full bg-yellow-100">
                  <div className="h-4 rounded-full bg-yellow-500" style={{ width: '25%' }} />
                </div>
              </div>
              
              <div className="relative pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Converted (184)</span>
                  <span>7%</span>
                </div>
                <div className="mt-2 h-4 w-full rounded-full bg-purple-100">
                  <div className="h-4 rounded-full bg-purple-500" style={{ width: '7%' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Active Campaigns with Enhanced Features */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Active Campaigns</h2>
                  <p className="mt-1 text-sm text-gray-500">Manage and optimize your outreach campaigns</p>
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => setShowTemplateModal(true)}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message Templates
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/campaigns?showForm=true')}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="h-4 w-4" />
                    New Campaign
                  </motion.button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="w-full rounded-lg border-gray-200 pl-10 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search campaigns"
                  />
                </div>
                <select 
                  className="rounded-lg border-gray-200 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  aria-label="Filter by status"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardHeader>
            
            <div className="mt-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredCampaigns}
                  strategy={verticalListSortingStrategy}
                >
                  <motion.div
                    className="space-y-4"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredCampaigns.map((campaign) => (
                      <SortableCampaignRow
                        key={campaign.id}
                        campaign={campaign}
                      />
                    ))}
                  </motion.div>
                </SortableContext>
              </DndContext>
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Analytics & Insights */}
        <motion.div className="lg:col-span-4 space-y-6" variants={fadeIn}>
          {/* Hot Leads with interactive cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Hot Leads</h2>
                <motion.button
                  onClick={handleViewAllLeads}
                  className="text-sm text-primary hover:text-primary-hover"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View all
                </motion.button>
              </div>
            </CardHeader>
            <motion.div
              className="mt-4 space-y-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {hotLeads.map((lead) => (
                <HotLeadCard key={lead.id} lead={lead} />
              ))}
            </motion.div>
          </Card>

          {/* Enhanced Lead Scoring */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lead Scoring</h2>
                <button
                  onClick={() => handleRefreshScores()}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  disabled={isRefreshingScores}
                  aria-label="Refresh lead scores"
                >
                  <RefreshCcw className={`h-4 w-4 text-gray-500 ${isRefreshingScores ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </CardHeader>
            <motion.div
              className="mt-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {/* ... existing scoring metrics with animated progress bars ... */}
            </motion.div>
          </Card>

          {/* Active Sequences with interactive cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Active Sequences</h2>
                <motion.button
                  onClick={handleCreateNewSequence}
                  className="text-sm text-primary hover:text-primary-hover"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create new
                </motion.button>
              </div>
            </CardHeader>
            <motion.div
              className="mt-4 space-y-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {sequences.map((sequence) => (
                <SequenceCard
                  key={sequence.id}
                  sequence={sequence}
                  onToggle={handleToggleSequence}
                  onSettings={handleSequenceSettings}
                />
              ))}
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create New Campaign</h2>
                  <p className="mt-1 text-sm text-gray-500">Set up your campaign details and targeting</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close form"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleCreateCampaign} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Campaign Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      placeholder="e.g., Q1 Tech Leaders Outreach"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Campaign Type
                    </label>
                    <select
                      id="type"
                      value={form.type}
                      onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as CampaignForm['type'] }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      required
                    >
                      <option value="connection">Connection Campaign</option>
                      <option value="message">Message Campaign</option>
                      <option value="content">Content Campaign</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="target" className="block text-sm font-medium text-gray-700">
                      Target Connections
                    </label>
                    <input
                      id="target"
                      type="number"
                      value={form.target}
                      onChange={(e) => setForm(prev => ({ ...prev, target: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Campaign Description
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 block h-24 w-full rounded-lg border-gray-200 text-sm shadow-sm"
                    placeholder="Describe your campaign goals and strategy..."
                    required
                  />
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowScheduleModal(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      Schedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowABTestModal(true)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <FileText className="h-4 w-4" />
                      A/B Test
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Create Campaign
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showTemplateModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Message Templates</h2>
                  <p className="mt-1 text-sm text-gray-500">Manage and customize your outreach templates</p>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close templates"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-4">
                <TemplateContent templates={templates} />
              </div>
            </motion.div>
          </motion.div>
        )}

        {showABTestModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">A/B Test Settings</h2>
                  <p className="mt-1 text-sm text-gray-500">Configure your campaign's A/B test parameters</p>
                </div>
                <button
                  onClick={() => setShowABTestModal(false)}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close A/B test settings"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Test Duration
                    </label>
                    <select
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      defaultValue="7"
                      aria-label="Test duration"
                      title="Select test duration"
                    >
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sample Size
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      placeholder="Enter number of prospects"
                      min="50"
                      defaultValue="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Variant A (Control)
                  </label>
                  <div className="mt-1">
                    <RichTextEditor
                      value=""
                      onChange={() => {}}
                      placeholder="Enter your control message..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Variant B (Test)
                  </label>
                  <div className="mt-1">
                    <RichTextEditor
                      value=""
                      onChange={() => {}}
                      placeholder="Enter your test message..."
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="auto-apply"
                        className="rounded border-gray-300"
                        defaultChecked
                      />
                      <label htmlFor="auto-apply" className="text-sm font-medium text-gray-700">
                        Automatically apply winning variant
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-20 rounded-lg border-gray-200 text-sm"
                        defaultValue="95"
                        min="1"
                        max="100"
                        aria-label="Confidence percentage"
                        title="Set confidence percentage"
                      />
                      <span className="text-sm text-gray-500">% confidence</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    When enabled, the winning variant will automatically be applied to the remaining prospects once statistical significance is reached.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
                  <button
                    onClick={() => setShowABTestModal(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowABTestModal(false);
                      toast.success('A/B test settings saved successfully!');
                    }}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showScheduleModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Campaign Schedule</h2>
                  <p className="mt-1 text-sm text-gray-500">Configure your campaign's sending schedule</p>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close schedule settings"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      value={scheduleSettings.timezone}
                      onChange={(e) => setScheduleSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      aria-label="Select timezone"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Singapore">Singapore</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Daily Connection Limit
                    </label>
                    <input
                      type="number"
                      value={scheduleSettings.daily_limit}
                      onChange={(e) => setScheduleSettings(prev => ({ ...prev, daily_limit: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                      min="1"
                      max="500"
                      aria-label="Set daily connection limit"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Working Hours
                  </label>
                  <div className="mt-2 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm text-gray-600">Start Time</label>
                      <input
                        type="time"
                        value={scheduleSettings.working_hours.start}
                        onChange={(e) => setScheduleSettings(prev => ({
                          ...prev,
                          working_hours: { ...prev.working_hours, start: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                        aria-label="Set start time"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">End Time</label>
                      <input
                        type="time"
                        value={scheduleSettings.working_hours.end}
                        onChange={(e) => setScheduleSettings(prev => ({
                          ...prev,
                          working_hours: { ...prev.working_hours, end: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-lg border-gray-200 text-sm shadow-sm"
                        aria-label="Set end time"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Working Days
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setScheduleSettings(prev => ({
                            ...prev,
                            working_days: prev.working_days.includes(day)
                              ? prev.working_days.filter(d => d !== day)
                              : [...prev.working_days, day]
                          }));
                        }}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                          scheduleSettings.working_days.includes(day)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-pressed={scheduleSettings.working_days.includes(day).toString()}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="smart-timing"
                        checked={scheduleSettings.smart_timing}
                        onChange={(e) => setScheduleSettings(prev => ({ ...prev, smart_timing: e.target.checked }))}
                        className="rounded border-gray-300"
                        aria-label="Enable smart timing"
                      />
                      <label htmlFor="smart-timing" className="text-sm font-medium text-gray-700">
                        Enable Smart Timing
                      </label>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Smart timing automatically adjusts sending times based on prospect activity patterns and time zones to maximize engagement.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowScheduleModal(false);
                      toast.success('Schedule settings saved successfully!');
                    }}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteConfirmation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-xl bg-white p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold">Confirm Delete</h2>
              <p className="mt-2 text-gray-600">
                Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showExportModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-xl bg-white p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold">Export Data</h2>
              <div className="mt-4 space-y-4">
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span>{isExporting ? 'Exporting...' : 'Export as CSV'}</span>
                  {isExporting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"
                    />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span>{isExporting ? 'Exporting...' : 'Export as PDF'}</span>
                  {isExporting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"
                    />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add New Sequence Modal */}
        {showNewSequenceModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-3xl rounded-xl bg-white p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Create New Sequence</h2>
                <button
                  onClick={() => setShowNewSequenceModal(false)}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <SequenceForm
                onSave={(sequence) => {
                  setSequences(prev => [...prev, sequence]);
                  setShowNewSequenceModal(false);
                  toast.success('Sequence created successfully!');
                }}
                onClose={() => setShowNewSequenceModal(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Add View All Leads Modal */}
        {showAllLeadsModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl rounded-xl bg-white p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Hot Leads</h2>
                <button
                  onClick={() => setShowAllLeadsModal(false)}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close all leads modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {hotLeads.map((lead) => (
                  <HotLeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Add Sequence Settings Modal */}
        {showSequenceSettingsModal && selectedSequence && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-xl bg-white p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Sequence Settings</h2>
                <button
                  onClick={() => setShowSequenceSettingsModal(false)}
                  className="rounded-lg p-2 hover:bg-gray-50"
                  aria-label="Close sequence settings modal"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <SequenceSettingsContent
                sequence={selectedSequence}
                onClose={() => setShowSequenceSettingsModal(false)}
                onSave={(updatedData) => {
                  setSequences(prev => prev.map(seq => 
                    seq.id === selectedSequence.id ? { ...seq, ...updatedData } : seq
                  ));
                  setShowSequenceSettingsModal(false);
                  toast.success('Sequence updated successfully!');
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LinkedInOutreach; 