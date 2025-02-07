import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  MessageSquare, 
  BarChart, 
  Target,
  Calendar,
  Zap,
  Bell,
  Plus,
  Search,
  Settings,
  Brain,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  PieChart,
  LineChart,
  Activity,
  BarChart as BarChartIcon,
  TrendingUp
} from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

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

const CountUpAnimation = ({ value, duration = 2000 }: { value: string | number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(numericValue * percentage));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  return <>{count.toLocaleString()}</>;
};

const Skeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl bg-gray-100 p-6">
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
    <div className="rounded-xl bg-gray-100 p-6">
      <div className="h-[300px] rounded-lg bg-gray-200" />
    </div>
  </div>
);

const ChartLoader = () => (
  <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-100" />
);

const MetricCard = ({ title, value, change, icon: Icon }: MetricCardProps) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-xl bg-white p-6 shadow-sm"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-dark">{title}</p>
          <p className="mt-2 text-3xl font-semibold">
            <CountUpAnimation value={value} />
          </p>
        </div>
        <motion.div 
          className="rounded-lg bg-primary/10 p-3"
          whileHover={{ rotate: 5 }}
        >
          <Icon className="h-6 w-6 text-primary" />
        </motion.div>
      </div>
      <motion.div 
        className="mt-4 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
          {Math.abs(change)}%
        </span>
        <span className="text-gray-dark">vs last month</span>
      </motion.div>
    </motion.div>
  );
};

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  connections: number;
  responses: number;
}

interface Activity {
  id: string;
  type: 'connection' | 'message' | 'response' | 'meeting' | 'campaign';
  title: string;
  description: string;
  time: string;
}

interface Task {
  id: string;
  title: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Tech CEOs Outreach',
    status: 'active',
    progress: 65,
    connections: 450,
    responses: 120
  },
  {
    id: '2',
    name: 'Marketing Directors Q1',
    status: 'active',
    progress: 42,
    connections: 280,
    responses: 85
  },
  {
    id: '3',
    name: 'Sales Leaders Network',
    status: 'active',
    progress: 28,
    connections: 150,
    responses: 45
  }
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'connection',
    title: 'New Connection',
    description: 'Sarah Johnson (CTO at Tech Corp) accepted your connection request',
    time: '5 minutes ago'
  },
  {
    id: '2',
    type: 'message',
    title: 'Message Received',
    description: 'Michael Chen responded to your follow-up message',
    time: '15 minutes ago'
  },
  {
    id: '3',
    type: 'campaign',
    title: 'Campaign Milestone',
    description: 'Tech CEOs Outreach campaign reached 65% completion',
    time: '1 hour ago'
  },
  {
    id: '4',
    type: 'meeting',
    title: 'Meeting Scheduled',
    description: 'Demo call scheduled with David Park for tomorrow at 2 PM',
    time: '2 hours ago'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review campaign performance',
    due: 'Today at 3 PM',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Follow up with interested leads',
    due: 'Tomorrow at 11 AM',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Update outreach templates',
    due: 'Friday at 2 PM',
    priority: 'low'
  }
];

interface Widget {
  id: string;
  type: 'metrics' | 'chart' | 'campaigns' | 'activity' | 'tasks' | 'ai-insights';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
}

const defaultWidgets: Widget[] = [
  { id: '1', type: 'metrics', title: 'Key Metrics', size: 'large', position: 0 },
  { id: '2', type: 'chart', title: 'Performance Trends', size: 'medium', position: 1 },
  { id: '3', type: 'campaigns', title: 'Active Campaigns', size: 'medium', position: 2 },
  { id: '4', type: 'activity', title: 'Recent Activity', size: 'small', position: 3 },
  { id: '5', type: 'tasks', title: 'Upcoming Tasks', size: 'small', position: 4 },
  { id: '6', type: 'ai-insights', title: 'AI Insights', size: 'medium', position: 5 }
];

const chartData = [
  { name: 'Mon', connections: 45, messages: 320, responses: 120 },
  { name: 'Tue', connections: 52, messages: 420, responses: 150 },
  { name: 'Wed', connections: 38, messages: 380, responses: 130 },
  { name: 'Thu', connections: 65, messages: 450, responses: 140 },
  { name: 'Fri', connections: 42, messages: 380, responses: 120 },
  { name: 'Sat', connections: 58, messages: 420, responses: 110 },
  { name: 'Sun', connections: 71, messages: 500, responses: 115 }
];

const pieData = [
  { name: 'Accepted', value: 65, color: '#10B981' },
  { name: 'Pending', value: 25, color: '#F59E0B' },
  { name: 'Declined', value: 10, color: '#EF4444' }
];

const ProgressBar = ({ progress }: { progress: number }) => (
  <motion.div 
    className="h-2 overflow-hidden rounded-full bg-gray-100"
    initial={{ opacity: 0, scaleX: 0 }}
    animate={{ opacity: 1, scaleX: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div 
      className="h-full bg-primary"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, delay: 0.2 }}
    />
  </motion.div>
);

const AIAssistantModal = ({ isOpen, onClose, onSubmit }) => {
  const [aiInput, setAiInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await onSubmit(aiInput);
      toast.success('AI response generated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to generate AI response. Please try again.');
    } finally {
      setIsProcessing(false);
      setAiInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg"
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="rounded-lg bg-primary/10 p-2"
                  whileHover={{ rotate: 15 }}
                >
                  <Brain className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-xl font-semibold text-gray-dark">AI Assistant</h2>
              </div>
              <motion.button 
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close AI Assistant"
              >
                <X className="h-5 w-5 text-gray-dark/50" />
              </motion.button>
            </div>

            <motion.div 
              className="mt-6 space-y-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              <motion.div 
                className="rounded-lg bg-gray-50 p-4"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
              >
                <p className="text-sm text-gray-dark">
                  Hi! I'm your AI assistant. I can help you with:
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-dark">
                  {[
                    'Creating personalized outreach messages',
                    'Analyzing campaign performance',
                    'Optimizing connection strategies',
                    'Suggesting improvements for engagement'
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-2"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 }
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <div className="space-y-2">
                <motion.textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="h-32 w-full rounded-lg border-gray-200 text-sm"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  disabled={isProcessing}
                />
                <div className="flex justify-end">
                  <motion.button 
                    onClick={handleSubmit}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!aiInput.trim() || isProcessing}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    {isProcessing ? 'Processing...' : 'Get AI Response'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);
  const [activeChart, setActiveChart] = useState<'line' | 'pie' | 'bar' | 'area'>('line');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try refreshing the page.');
      toast.error('Failed to load dashboard data');
    }
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <motion.div 
        className="flex h-[50vh] items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <p className="text-lg font-medium text-gray-dark">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Refresh Page
          </button>
        </div>
      </motion.div>
    );
  }

  const metrics = [
    {
      title: 'Connection Requests',
      value: '2,543',
      change: 12.5,
      icon: Users,
    },
    {
      title: 'Messages Sent',
      value: '15,243',
      change: 8.2,
      icon: MessageSquare,
    },
    {
      title: 'Response Rate',
      value: '42%',
      change: -2.4,
      icon: BarChart,
    },
    {
      title: 'Match Quality Score',
      value: '89',
      change: 5.7,
      icon: Target,
    },
  ];

  const PerformanceChart = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <ChartLoader />;

    return (
      <div className="h-[300px] w-full">
        {activeChart === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="connections" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="messages" stroke="#6366F1" strokeWidth={2} />
              <Line type="monotone" dataKey="responses" stroke="#F59E0B" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
        
        {activeChart === 'area' && (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <defs>
                <linearGradient id="connections" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="messages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="responses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="connections" stroke="#10B981" fillOpacity={1} fill="url(#connections)" />
              <Area type="monotone" dataKey="messages" stroke="#6366F1" fillOpacity={1} fill="url(#messages)" />
              <Area type="monotone" dataKey="responses" stroke="#F59E0B" fillOpacity={1} fill="url(#responses)" />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="connections" fill="#10B981" />
              <Bar dataKey="messages" fill="#6366F1" />
              <Bar dataKey="responses" fill="#F59E0B" />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'metrics':
        return (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>
        );
      case 'chart':
        return (
          <Card>
            <CardHeader 
              title="Performance Overview"
              action={
                <div className="flex items-center gap-4">
                  <select
                    value={activeChart}
                    onChange={(e) => setActiveChart(e.target.value as 'line' | 'pie' | 'bar' | 'area')}
                    className="rounded-lg border-gray-200 bg-white text-sm"
                    aria-label="Select chart type"
                  >
                    <option value="line">Line Chart</option>
                    <option value="area">Area Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveChart('line')}
                      className={`rounded-lg p-2 ${
                        activeChart === 'line' ? 'bg-primary/10 text-primary' : 'text-gray-dark/50 hover:bg-gray-50'
                      }`}
                      aria-label="Show line chart"
                    >
                      <LineChart className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActiveChart('area')}
                      className={`rounded-lg p-2 ${
                        activeChart === 'area' ? 'bg-primary/10 text-primary' : 'text-gray-dark/50 hover:bg-gray-50'
                      }`}
                      aria-label="Show area chart"
                    >
                      <TrendingUp className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActiveChart('bar')}
                      className={`rounded-lg p-2 ${
                        activeChart === 'bar' ? 'bg-primary/10 text-primary' : 'text-gray-dark/50 hover:bg-gray-50'
                      }`}
                      aria-label="Show bar chart"
                    >
                      <BarChartIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setActiveChart('pie')}
                      className={`rounded-lg p-2 ${
                        activeChart === 'pie' ? 'bg-primary/10 text-primary' : 'text-gray-dark/50 hover:bg-gray-50'
                      }`}
                      aria-label="Show pie chart"
                    >
                      <PieChart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              }
            />
            <div className="mt-6">
              <PerformanceChart />
            </div>
          </Card>
        );
      case 'campaigns':
        return (
          <Card>
            <CardHeader 
              title="Active Campaigns"
              action={
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-primary hover:text-primary-hover"
                  onClick={() => navigate('/campaigns')}
                >
                  View All
                </motion.button>
              }
            />
            <motion.div 
              className="mt-6 space-y-6"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {mockCampaigns.map(campaign => (
                <motion.div
                  key={campaign.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-dark">{campaign.name}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-dark/70">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <CountUpAnimation value={campaign.connections} /> connections
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <CountUpAnimation value={campaign.responses} /> responses
                        </motion.span>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="rounded-lg p-2 hover:bg-gray-50"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      aria-label={`View details for ${campaign.name}`}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-dark/50" />
                    </motion.button>
                  </div>
                  <ProgressBar progress={campaign.progress} />
                </motion.div>
              ))}
            </motion.div>
          </Card>
        );
      case 'activity':
        return (
          <Card>
            <CardHeader 
              title="Recent Activity"
              action={
                <motion.div 
                  whileHover={{ rotate: 15 }}
                  className="rounded-lg bg-primary/10 p-2"
                >
                  <Bell className="h-5 w-5 text-primary" />
                </motion.div>
              }
            />
            <motion.div 
              className="mt-6 space-y-4"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {mockActivities.map(activity => (
                <motion.div
                  key={activity.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  className="flex items-start gap-3"
                >
                  <motion.div 
                    className="rounded-lg bg-primary/10 p-2"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {activity.type === 'connection' && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-primary" />}
                    {activity.type === 'campaign' && <Target className="h-4 w-4 text-primary" />}
                    {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-primary" />}
                  </motion.div>
                  <div>
                    <motion.p 
                      className="font-medium text-gray-dark"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {activity.title}
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-dark/70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {activity.description}
                    </motion.p>
                    <motion.p 
                      className="mt-1 text-xs text-gray-dark/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {activity.time}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Card>
        );
      case 'tasks':
        return (
          <Card>
            <CardHeader 
              title="Upcoming Tasks"
              action={
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-lg bg-primary/10 p-2"
                >
                  <Clock className="h-5 w-5 text-primary" />
                </motion.div>
              }
            />
            <motion.div 
              className="mt-6 space-y-4"
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {mockTasks.map(task => (
                <motion.div
                  key={task.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-dark">{task.title}</p>
                    <p className="text-sm text-gray-dark/70">{task.due}</p>
                  </div>
                  <motion.div 
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </Card>
        );
      case 'ai-insights':
        return (
          <Card>
            <CardHeader 
              title="AI-Powered Insights"
              action={
                <div className="rounded-lg bg-primary/10 p-2">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
              }
            />
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-dark">Optimal Sending Times</p>
                    <p className="mt-1 text-sm text-gray-dark/70">
                      Your connection requests have 35% higher acceptance rate when sent between 9-11 AM.
                      Consider adjusting your campaign schedules.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-dark">Response Rate Alert</p>
                    <p className="mt-1 text-sm text-gray-dark/70">
                      Response rates have dropped by 2.4%. AI analysis suggests personalizing your
                      message templates for better engagement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  const WidgetWrapper = ({ widget, children }: { widget: Widget; children: React.ReactNode }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [currentSize, setCurrentSize] = useState(widget.size);

    const toggleMaximize = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMaximized(!isMaximized);
    };

    const cycleSize = (e: React.MouseEvent) => {
      e.stopPropagation();
      const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
      const currentIndex = sizes.indexOf(currentSize);
      const nextSize = sizes[(currentIndex + 1) % sizes.length];
      setCurrentSize(nextSize);
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`
          ${isMaximized ? 'fixed inset-4 z-50 !col-span-full' : 
            currentSize === 'small' ? 'lg:col-span-1' : 
            currentSize === 'medium' ? 'lg:col-span-2' : 
            'lg:col-span-4'}
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          group relative rounded-xl
        `}
        whileHover={{ scale: isMaximized ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="absolute right-2 top-2 z-10 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={cycleSize}
            className="rounded-lg bg-white p-1.5 text-gray-600 shadow-lg hover:bg-gray-50"
            aria-label="Change widget size"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <button
            onClick={toggleMaximize}
            className="rounded-lg bg-white p-1.5 text-gray-600 shadow-lg hover:bg-gray-50"
            aria-label={isMaximized ? "Minimize widget" : "Maximize widget"}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className={`h-full rounded-xl bg-white ${isMaximized ? 'p-6' : ''}`}>
          {children}
        </div>
        {isMaximized && (
          <div className="fixed inset-0 -z-10 bg-black/50" onClick={toggleMaximize} />
        )}
      </motion.div>
    );
  };

  const handleAISubmit = async (input: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('AI Query:', input);
  };

  return (
    <div className="space-y-8">
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
      
      <AIAssistantModal 
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onSubmit={handleAISubmit}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-dark">Dashboard</h1>
          <p className="mt-2 text-gray-dark">Welcome back! Here's your overview.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/campaigns?showForm=true')}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:border-primary/20 hover:bg-primary/5"
            aria-label="Create new campaign"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
          <button 
            onClick={() => navigate('/linkedin-outreach')}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:border-primary/20 hover:bg-primary/5"
            aria-label="Search leads"
          >
            <Search className="h-4 w-4" />
            Search Leads
          </button>
          <button 
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            aria-label="Open AI Assistant"
          >
            <Zap className="h-4 w-4" />
            AI Assistant
          </button>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={widgets}
        onReorder={setWidgets}
        className="grid gap-6"
        layoutScroll
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {widgets.map(widget => (
          <Reorder.Item key={widget.id} value={widget}>
            <WidgetWrapper widget={widget}>
              {renderWidget(widget)}
            </WidgetWrapper>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default Dashboard; 