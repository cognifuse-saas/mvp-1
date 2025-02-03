import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Users,
  ChevronRight,
  Search,
  Filter,
  Plus,
  X,
  ArrowLeft,
  Loader2,
  Check,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { Switch } from '@headlessui/react';

interface CampaignStats {
  id: string;
  name: string;
  type: 'connection' | 'message' | 'content';
  status: 'scheduled' | 'running' | 'completed' | 'paused';
  target: number;
  progress: number;
  startDate: string;
  endDate: string;
  engagement: number;
  leads: number;
}

const mockCampaigns: CampaignStats[] = [
  {
    id: '1',
    name: 'Q1 Tech Leaders Outreach',
    type: 'connection',
    status: 'running',
    target: 1000,
    progress: 654,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    engagement: 42,
    leads: 28
  },
  {
    id: '2',
    name: 'Content Engagement Series',
    type: 'content',
    status: 'scheduled',
    target: 500,
    progress: 0,
    startDate: '2024-02-15',
    endDate: '2024-04-15',
    engagement: 0,
    leads: 0
  },
  {
    id: '3',
    name: 'Follow-up Messages',
    type: 'message',
    status: 'running',
    target: 750,
    progress: 325,
    startDate: '2024-01-15',
    endDate: '2024-02-28',
    engagement: 65,
    leads: 42
  },
  {
    id: '4',
    name: 'Industry Leaders Connect',
    type: 'connection',
    status: 'completed',
    target: 300,
    progress: 300,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    engagement: 78,
    leads: 54
  }
];

const CampaignTypeIcon = ({ type }: { type: CampaignStats['type'] }) => {
  switch (type) {
    case 'connection':
      return <Users className="h-5 w-5" />;
    case 'message':
      return <MessageSquare className="h-5 w-5" />;
    case 'content':
      return <BarChart3 className="h-5 w-5" />;
    default:
      return null;
  }
};

const getStatusColor = (status: CampaignStats['status']) => {
  switch (status) {
    case 'running':
      return 'text-green-500';
    case 'scheduled':
      return 'text-blue-500';
    case 'completed':
      return 'text-gray-500';
    case 'paused':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

interface CampaignForm {
  // Basic Info
  name: string;
  type: 'connection' | 'message' | 'content';
  target: number;
  description: string;

  // Targeting
  targetAudience: {
    industries: string[];
    locations: string[];
    jobTitles: string[];
    companySize: string[];
  };

  // Templates
  templates: {
    connectionRequest: string;
    followUp1: string;
    followUp2: string;
    followUp3: string;
  };

  // A/B Testing
  abTesting: {
    enabled: boolean;
    variants: {
      variantA: string;
      variantB: string;
    };
    testDuration: number;
    sampleSize: number;
    autoApplyWinner: boolean;
  };

  // Schedule
  schedule: {
    timezone: string;
    startDate: string;
    endDate: string;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
    connectionLimit: number;
    messageLimit: number;
  };
}

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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="h-[400px] rounded-lg bg-gray-200" />
    </div>
  </div>
);

const Campaigns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | CampaignStats['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | CampaignStats['status']>('all');
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CampaignForm>({
    name: '',
    type: 'connection',
    target: 100,
    description: '',
    targetAudience: {
      industries: [],
      locations: [],
      jobTitles: [],
      companySize: []
    },
    templates: {
      connectionRequest: '',
      followUp1: '',
      followUp2: '',
      followUp3: ''
    },
    abTesting: {
      enabled: false,
      variants: {
        variantA: '',
        variantB: ''
      },
      testDuration: 7,
      sampleSize: 100,
      autoApplyWinner: true
    },
    schedule: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      startDate: '',
      endDate: '',
      workingHours: {
        start: '09:00',
        end: '17:00'
      },
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      connectionLimit: 100,
      messageLimit: 200
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check URL parameters when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('showForm') === 'true') {
      setShowForm(true);
      // Remove the query parameter without navigating
      window.history.replaceState({}, '', '/campaigns');
    }
  }, [location]);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        toast.error('Failed to load campaigns');
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Campaign created successfully');
      setShowForm(false);
      setForm({
        name: '',
        type: 'connection',
        target: 100,
        description: '',
        targetAudience: {
          industries: [],
          locations: [],
          jobTitles: [],
          companySize: []
        },
        templates: {
          connectionRequest: '',
          followUp1: '',
          followUp2: '',
          followUp3: ''
        },
        abTesting: {
          enabled: false,
          variants: {
            variantA: '',
            variantB: ''
          },
          testDuration: 7,
          sampleSize: 100,
          autoApplyWinner: true
        },
        schedule: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          startDate: '',
          endDate: '',
          workingHours: {
            start: '09:00',
            end: '17:00'
          },
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          connectionLimit: 100,
          messageLimit: 200
        }
      });
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Step titles for the stepper
  const steps = [
    'Campaign Info',
    'Target Audience',
    'Message Templates',
    'A/B Testing',
    'Schedule'
  ];

  // Replace timezone selection with a simpler implementation
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Asia/Tokyo'
  ];

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <motion.div 
      className="space-y-8"
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

      {/* Campaign Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl rounded-xl bg-white"
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowForm(false)}
                      className="rounded-lg p-2 hover:bg-gray-50"
                      aria-label="Close form"
                    >
                      <X className="h-5 w-5 text-gray-dark" />
                    </button>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-dark">Create New Campaign</h2>
                      <p className="mt-1 text-sm text-gray-dark/70">Step {currentStep} of {steps.length}</p>
                    </div>
                  </div>
                </div>

                {/* Stepper */}
                <div className="mt-6 flex items-center gap-2">
                  {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div 
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          currentStep > index + 1 
                            ? 'bg-primary text-white' 
                            : currentStep === index + 1
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {currentStep > index + 1 ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div 
                          className={`h-0.5 w-12 ${
                            currentStep > index + 1 ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700">Campaign Name</label>
                      <input
                        id="campaignName"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                        placeholder="Enter campaign name"
                        title="Enter campaign name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="campaignDescription" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="campaignDescription"
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                        placeholder="Enter campaign description"
                        title="Enter campaign description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label htmlFor="targetConnections" className="block text-sm font-medium text-gray-700">Target Connections</label>
                      <input
                        id="targetConnections"
                        type="number"
                        value={form.target}
                        onChange={(e) => setForm(prev => ({ ...prev, target: parseInt(e.target.value) }))}
                        className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                        placeholder="Enter target number"
                        title="Enter target number of connections"
                        min={1}
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-dark">Target Industries</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing'].map(industry => (
                          <button
                            key={industry}
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                targetAudience: {
                                  ...prev.targetAudience,
                                  industries: prev.targetAudience.industries.includes(industry)
                                    ? prev.targetAudience.industries.filter(i => i !== industry)
                                    : [...prev.targetAudience.industries, industry]
                                }
                              }))
                            }}
                            className={`rounded-full px-3 py-1 text-sm ${
                              form.targetAudience.industries.includes(industry)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-dark">Target Locations</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['United States', 'Europe', 'Asia', 'Australia', 'Canada'].map(location => (
                          <button
                            key={location}
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                targetAudience: {
                                  ...prev.targetAudience,
                                  locations: prev.targetAudience.locations.includes(location)
                                    ? prev.targetAudience.locations.filter(l => l !== location)
                                    : [...prev.targetAudience.locations, location]
                                }
                              }))
                            }}
                            className={`rounded-full px-3 py-1 text-sm ${
                              form.targetAudience.locations.includes(location)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {location}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-dark">Job Titles</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['CEO', 'CTO', 'Manager', 'Director', 'VP'].map(title => (
                          <button
                            key={title}
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                targetAudience: {
                                  ...prev.targetAudience,
                                  jobTitles: prev.targetAudience.jobTitles.includes(title)
                                    ? prev.targetAudience.jobTitles.filter(t => t !== title)
                                    : [...prev.targetAudience.jobTitles, title]
                                }
                              }))
                            }}
                            className={`rounded-full px-3 py-1 text-sm ${
                              form.targetAudience.jobTitles.includes(title)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {title}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-dark">Company Size</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['1-10', '11-50', '51-200', '201-500', '500+'].map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                targetAudience: {
                                  ...prev.targetAudience,
                                  companySize: prev.targetAudience.companySize.includes(size)
                                    ? prev.targetAudience.companySize.filter(s => s !== size)
                                    : [...prev.targetAudience.companySize, size]
                                }
                              }))
                            }}
                            className={`rounded-full px-3 py-1 text-sm ${
                              form.targetAudience.companySize.includes(size)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-dark">Connection Request Template</label>
                      <div className="mt-2 rounded-lg border border-gray-200 p-4">
                        <textarea
                          value={form.templates.connectionRequest}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            templates: {
                              ...prev.templates,
                              connectionRequest: e.target.value
                            }
                          }))}
                          className="h-32 w-full resize-none rounded-lg border-gray-200 text-sm"
                          placeholder="Hi {{firstName}}, I noticed you're in the {{industry}} industry..."
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          {['{{firstName}}', '{{company}}', '{{industry}}'].map(variable => (
                            <button
                              key={variable}
                              type="button"
                              onClick={() => {
                                const textarea = document.querySelector('textarea');
                                const start = textarea?.selectionStart || 0;
                                const end = textarea?.selectionEnd || 0;
                                setForm(prev => ({
                                  ...prev,
                                  templates: {
                                    ...prev.templates,
                                    connectionRequest: 
                                      prev.templates.connectionRequest.substring(0, start) +
                                      variable +
                                      prev.templates.connectionRequest.substring(end)
                                  }
                                }))
                              }}
                              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                            >
                              {variable}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-dark">Follow-up Messages</label>
                      <div className="mt-2 space-y-4">
                        {['followUp1', 'followUp2', 'followUp3'].map((key, index) => (
                          <div key={key} className="rounded-lg border border-gray-200 p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-dark">
                                Follow-up #{index + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <select
                                  id="followUpDelay"
                                  className="rounded-lg border-gray-200 text-sm"
                                  defaultValue="3"
                                  title="Select follow-up delay"
                                  aria-label="Follow-up delay"
                                >
                                  <option value="1">After 1 day</option>
                                  <option value="2">After 2 days</option>
                                  <option value="3">After 3 days</option>
                                  <option value="5">After 5 days</option>
                                  <option value="7">After 1 week</option>
                                </select>
                              </div>
                            </div>
                            <textarea
                              value={form.templates[key as keyof typeof form.templates]}
                              onChange={(e) => setForm(prev => ({
                                ...prev,
                                templates: {
                                  ...prev.templates,
                                  [key]: e.target.value
                                }
                              }))}
                              className="h-32 w-full resize-none rounded-lg border-gray-200 text-sm"
                              placeholder={`Follow-up message #${index + 1}...`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-dark">Enable A/B Testing</h3>
                        <p className="mt-1 text-sm text-gray-dark/70">
                          Test different message variations to optimize your campaign
                        </p>
                      </div>
                      <Switch
                        checked={form.abTesting.enabled}
                        onChange={(checked: boolean) => setForm(prev => ({
                          ...prev,
                          abTesting: {
                            ...prev.abTesting,
                            enabled: checked
                          }
                        }))}
                        className={`${
                          form.abTesting.enabled ? 'bg-primary' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span className="sr-only">Enable A/B testing</span>
                        <span
                          className={`${
                            form.abTesting.enabled ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </div>

                    {form.abTesting.enabled && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="testDuration" className="text-sm font-medium text-gray-dark">Test Duration (Days)</label>
                            <input
                              id="testDuration"
                              type="number"
                              value={form.abTesting.testDuration}
                              onChange={(e) => setForm(prev => ({
                                ...prev,
                                abTesting: {
                                  ...prev.abTesting,
                                  testDuration: parseInt(e.target.value)
                                }
                              }))}
                              className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                              min="1"
                              title="Enter test duration in days"
                              placeholder="Enter number of days"
                              aria-label="Test duration in days"
                            />
                          </div>

                          <div>
                            <label htmlFor="sampleSize" className="text-sm font-medium text-gray-dark">Sample Size</label>
                            <input
                              id="sampleSize"
                              type="number"
                              value={form.abTesting.sampleSize}
                              onChange={(e) => setForm(prev => ({
                                ...prev,
                                abTesting: {
                                  ...prev.abTesting,
                                  sampleSize: parseInt(e.target.value)
                                }
                              }))}
                              className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                              min="10"
                              title="Enter sample size"
                              placeholder="Enter sample size"
                              aria-label="Sample size for A/B testing"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="autoApplyWinner"
                            checked={form.abTesting.autoApplyWinner}
                            onChange={(e) => setForm(prev => ({
                              ...prev,
                              abTesting: {
                                ...prev.abTesting,
                                autoApplyWinner: e.target.checked
                              }
                            }))}
                            className="rounded border-gray-200"
                          />
                          <label htmlFor="autoApplyWinner" className="text-sm text-gray-dark">
                            Automatically apply winning variant
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="timezoneSelect" className="text-sm font-medium text-gray-dark">Timezone</label>
                      <select
                        id="timezoneSelect"
                        value={form.schedule.timezone}
                        onChange={(e) => setForm(prev => ({
                          ...prev,
                          schedule: {
                            ...prev.schedule,
                            timezone: e.target.value
                          }
                        }))}
                        className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                        title="Select your timezone"
                        aria-label="Select timezone"
                      >
                        <option value="">Select timezone</option>
                        {timezones.map((timezone: string) => (
                          <option key={timezone} value={timezone}>
                            {timezone}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="workingHoursStart" className="text-sm font-medium text-gray-dark">Working Hours Start</label>
                        <input
                          id="workingHoursStart"
                          type="time"
                          value={form.schedule.workingHours.start}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              workingHours: {
                                ...prev.schedule.workingHours,
                                start: e.target.value
                              }
                            }
                          }))}
                          className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                          title="Select working hours start time"
                          placeholder="09:00"
                          aria-label="Working hours start time"
                        />
                      </div>
                      <div>
                        <label htmlFor="workingHoursEnd" className="text-sm font-medium text-gray-dark">Working Hours End</label>
                        <input
                          id="workingHoursEnd"
                          type="time"
                          value={form.schedule.workingHours.end}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              workingHours: {
                                ...prev.schedule.workingHours,
                                end: e.target.value
                              }
                            }
                          }))}
                          className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                          title="Select working hours end time"
                          placeholder="17:00"
                          aria-label="Working hours end time"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-dark">Working Days</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              setForm(prev => ({
                                ...prev,
                                schedule: {
                                  ...prev.schedule,
                                  workingDays: prev.schedule.workingDays.includes(day)
                                    ? prev.schedule.workingDays.filter(d => d !== day)
                                    : [...prev.schedule.workingDays, day]
                                }
                              }))
                            }}
                            className={`rounded-full px-3 py-1 text-sm ${
                              form.schedule.workingDays.includes(day)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-dark">Daily Connection Limit</label>
                        <input
                          type="number"
                          value={form.schedule.connectionLimit}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              connectionLimit: parseInt(e.target.value)
                            }
                          }))}
                          className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                          min="1"
                          aria-label="Set daily connection limit"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-dark">Daily Message Limit</label>
                        <input
                          type="number"
                          value={form.schedule.messageLimit}
                          onChange={(e) => setForm(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              messageLimit: parseInt(e.target.value)
                            }
                          }))}
                          className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                          min="1"
                          aria-label="Set daily message limit"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) {
                        setCurrentStep(prev => prev - 1);
                      } else {
                        setShowForm(false);
                      }
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium hover:border-primary/20 hover:bg-primary/5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {currentStep === 1 ? 'Cancel' : 'Previous'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep < steps.length) {
                        setCurrentStep(prev => prev + 1);
                      } else {
                        handleSubmit();
                      }
                    }}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                  >
                    {currentStep === steps.length ? (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Campaign
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-dark">Campaigns</h1>
            <p className="mt-2 text-gray-dark">Create and manage your LinkedIn campaigns.</p>
          </div>
          <motion.button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </motion.button>
        </div>
      </motion.div>

      {/* Campaign Overview */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            title: 'Active Campaigns',
            value: '12',
            icon: Users,
            color: 'text-blue-500'
          },
          {
            title: 'Total Leads',
            value: '124',
            icon: MessageSquare,
            color: 'text-purple-500'
          },
          {
            title: 'Avg. Engagement',
            value: '61.5',
            icon: BarChart3,
            color: 'text-green-500'
          },
          {
            title: 'Scheduled',
            value: '5',
            icon: Calendar,
            color: 'text-orange-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.02 }}
            className="rounded-xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className={`rounded-lg bg-${stat.color}/10 p-3`}
                whileHover={{ rotate: 15 }}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </motion.div>
              <div>
                <p className="text-sm font-medium text-gray-dark">{stat.title}</p>
                <p className="text-2xl font-semibold">
                  <CountUpAnimation value={stat.value} />
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Campaign List */}
      <motion.div 
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredCampaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="group relative rounded-lg border border-gray-200 p-4 hover:border-primary/20 hover:shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CampaignTypeIcon type={campaign.type} />
                </div>
                <span className={`inline-flex items-center gap-1.5 text-sm ${getStatusColor(campaign.status)}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>

              <h3 className="text-base font-medium text-gray-dark">{campaign.name}</h3>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-dark/70">Progress</span>
                  <span className="font-medium">{Math.round((campaign.progress / campaign.target) * 100)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(campaign.progress / campaign.target) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-dark/70">
                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                </span>
                <button 
                  className="rounded-lg p-2 text-primary hover:bg-primary/5"
                  aria-label={`View details for ${campaign.name}`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Campaigns; 