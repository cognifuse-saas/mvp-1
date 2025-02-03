import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Calendar,
  Target,
  Filter,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface AnalyticsData {
  connections: {
    total: number;
    trend: number;
    data: number[];
  };
  messages: {
    total: number;
    trend: number;
    data: number[];
  };
  responses: {
    total: number;
    trend: number;
    data: number[];
  };
  meetings: {
    total: number;
    trend: number;
    data: number[];
  };
  campaigns: {
    active: number;
    completed: number;
    data: Array<{
      name: string;
      success: number;
      responses: number;
      connections: number;
    }>;
  };
  topPerforming: Array<{
    name: string;
    type: string;
    engagement: number;
    responses: number;
  }>;
}

const mockData: AnalyticsData = {
  connections: {
    total: 2547,
    trend: 12.5,
    data: [45, 52, 38, 65, 42, 58, 71]
  },
  messages: {
    total: 15243,
    trend: 8.2,
    data: [320, 420, 380, 450, 380, 420, 500]
  },
  responses: {
    total: 4251,
    trend: -2.4,
    data: [120, 150, 130, 140, 120, 110, 115]
  },
  meetings: {
    total: 182,
    trend: 15.7,
    data: [8, 12, 10, 15, 12, 14, 18]
  },
  campaigns: {
    active: 12,
    completed: 24,
    data: [
      {
        name: 'Tech CEOs Outreach',
        success: 78,
        responses: 245,
        connections: 450
      },
      {
        name: 'Marketing Directors',
        success: 65,
        responses: 180,
        connections: 280
      },
      {
        name: 'Sales Leaders Q4',
        success: 82,
        responses: 320,
        connections: 520
      }
    ]
  },
  topPerforming: [
    {
      name: 'AI Technology Introduction',
      type: 'Connection Request',
      engagement: 85,
      responses: 142
    },
    {
      name: 'Product Demo Follow-up',
      type: 'Message Sequence',
      engagement: 78,
      responses: 98
    },
    {
      name: 'Industry Insights Share',
      type: 'Content',
      engagement: 92,
      responses: 215
    }
  ]
};

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

// Animated counter component
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

// Loading skeleton component
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

// Chart loading component
const ChartLoader = () => (
  <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-100" />
);

// Error component
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <motion.div 
    className="flex h-[300px] items-center justify-center rounded-lg border border-red-100 bg-red-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
      <p className="mt-2 text-sm font-medium text-red-600">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="mt-4 flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
      >
        <RefreshCcw className="h-4 w-4" />
        Retry
      </motion.button>
    </div>
  </motion.div>
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [campaignType, setCampaignType] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [isExporting, setIsExporting] = useState(false);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data');
        setIsLoading(false);
        toast.error('Failed to load analytics data');
      }
    };

    loadData();
  }, [timeRange, campaignType]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Analytics data exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics data');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
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

      <motion.div 
        className="flex items-center justify-between"
        variants={fadeIn}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-dark">Analytics</h1>
          <p className="mt-2 text-gray-dark">Track and analyze your campaign performance.</p>
        </div>

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:border-primary/20 hover:bg-primary/5"
          >
            <Filter className="h-4 w-4" />
            Filters
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:border-primary/20 hover:bg-primary/5 disabled:opacity-50"
          >
            {isExporting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-gray-300 border-t-primary rounded-full"
              />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? 'Exporting...' : 'Export'}
          </motion.button>
          <motion.select
            variants={fadeIn}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="rounded-lg border-gray-200 text-sm"
            aria-label="Select time range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </motion.select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={{
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {[
          {
            title: 'Connections',
            value: mockData.connections.total,
            trend: mockData.connections.trend,
            icon: Users,
            color: 'text-blue-500'
          },
          {
            title: 'Messages',
            value: mockData.messages.total,
            trend: mockData.messages.trend,
            icon: MessageSquare,
            color: 'text-purple-500'
          },
          {
            title: 'Response Rate',
            value: ((mockData.responses.total / mockData.messages.total) * 100).toFixed(1) + '%',
            trend: mockData.responses.trend,
            icon: TrendingUp,
            color: 'text-green-500'
          },
          {
            title: 'Meetings',
            value: mockData.meetings.total,
            trend: mockData.meetings.trend,
            icon: Calendar,
            color: 'text-orange-500'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            variants={fadeIn}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-dark">{metric.title}</p>
                <p className="mt-2 text-3xl font-semibold">
                  <CountUpAnimation value={metric.value} />
                </p>
              </div>
              <motion.div 
                className={`rounded-lg bg-${metric.color}/10 p-3`}
                whileHover={{ rotate: 5 }}
              >
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </motion.div>
            </div>
            <motion.div 
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {metric.trend >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(metric.trend)}%
              </span>
              <span className="text-gray-dark">vs last period</span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Campaign Performance */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader
              title="Campaign Performance"
              action={
                <div className="flex items-center gap-2">
                  <motion.select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value as any)}
                    className="rounded-lg border-gray-200 text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <option value="all">All Campaigns</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </motion.select>
                  <div className="flex items-center gap-2">
                    {['line', 'area', 'bar'].map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setChartType(type as any)}
                        className={`rounded-lg p-2 ${
                          chartType === type ? 'bg-primary/10 text-primary' : 'text-gray-dark/50 hover:bg-gray-50'
                        }`}
                      >
                        {type === 'line' && <TrendingUp className="h-4 w-4" />}
                        {type === 'area' && <BarChart3 className="h-4 w-4" />}
                        {type === 'bar' && <BarChart3 className="h-4 w-4" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
              }
            />

            <div className="mt-6 space-y-6">
              <AnimatePresence mode="wait">
                {error ? (
                  <ErrorDisplay 
                    message={error} 
                    onRetry={() => {
                      setError(null);
                      setIsLoading(true);
                    }} 
                  />
                ) : (
                  <motion.div
                    key={chartType}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      {chartType === 'line' ? (
                        <RechartsLineChart data={mockData.campaigns.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} />
                          <Line type="monotone" dataKey="responses" stroke="#6366F1" strokeWidth={2} />
                          <Line type="monotone" dataKey="connections" stroke="#F59E0B" strokeWidth={2} />
                        </RechartsLineChart>
                      ) : chartType === 'area' ? (
                        <ComposedChart data={mockData.campaigns.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="success" fill="#10B981" stroke="#10B981" />
                          <Area type="monotone" dataKey="responses" fill="#6366F1" stroke="#6366F1" />
                          <Area type="monotone" dataKey="connections" fill="#F59E0B" stroke="#F59E0B" />
                        </ComposedChart>
                      ) : (
                        <ComposedChart data={mockData.campaigns.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="success" fill="#10B981" />
                          <Bar dataKey="responses" fill="#6366F1" />
                          <Bar dataKey="connections" fill="#F59E0B" />
                        </ComposedChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Top Performing Content */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader
              title="Top Performing Content"
              description="Best performing messages and content by engagement"
            />

            <motion.div 
              className="mt-6 space-y-6"
              variants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {mockData.topPerforming.map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start justify-between rounded-lg border border-gray-100 p-4 hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="rounded-lg bg-primary/10 p-2"
                      whileHover={{ rotate: 15 }}
                    >
                      <Target className="h-5 w-5 text-primary" />
                    </motion.div>
                    <div>
                      <p className="font-medium text-gray-dark">{item.name}</p>
                      <p className="text-sm text-gray-dark/70">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-dark">
                      <CountUpAnimation value={item.engagement} />% engagement
                    </p>
                    <p className="text-sm text-gray-dark/70">
                      <CountUpAnimation value={item.responses} /> responses
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics; 