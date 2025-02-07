import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Brain,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarCheck,
  X,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  type: 'connection' | 'follow-up' | 'pitch' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled';
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    nextSteps: string[];
    keyPoints: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Initial Connection Call - Tech Startup CEO',
    description: 'Discuss potential collaboration and product demo',
    startTime: new Date('2024-02-15T10:00:00'),
    endTime: new Date('2024-02-15T11:00:00'),
    attendees: ['John Smith', 'Sarah Johnson'],
    type: 'connection',
    status: 'completed',
    aiAnalysis: {
      sentiment: 'positive',
      nextSteps: [
        'Send product documentation',
        'Schedule follow-up meeting',
        'Connect on LinkedIn'
      ],
      keyPoints: [
        'Interested in AI features',
        'Current solution is manual',
        'Budget approved for Q2'
      ],
      riskLevel: 'low'
    }
  },
  {
    id: '2',
    title: 'Follow-up Meeting - Marketing Director',
    startTime: new Date('2024-02-16T14:00:00'),
    endTime: new Date('2024-02-16T15:00:00'),
    attendees: ['Emily Brown'],
    type: 'follow-up',
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Product Demo - Enterprise Client',
    description: 'Showcase automation features',
    startTime: new Date('2024-02-16T16:00:00'),
    endTime: new Date('2024-02-16T17:00:00'),
    attendees: ['Michael Chen', 'Lisa Wong', 'David Park'],
    type: 'pitch',
    status: 'scheduled'
  }
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getTypeColor = (type: Meeting['type']) => {
  switch (type) {
    case 'connection':
      return 'bg-blue-500';
    case 'follow-up':
      return 'bg-green-500';
    case 'pitch':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getSentimentColor = (sentiment: Meeting['aiAnalysis']['sentiment']) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-500';
    case 'neutral':
      return 'text-yellow-500';
    case 'negative':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
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

// New Meeting Modal
const NewMeetingModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Meeting scheduled successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to schedule meeting');
    } finally {
      setIsSubmitting(false);
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
            className="w-full max-w-lg rounded-xl bg-white p-6"
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-dark">Schedule New Meeting</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-50"
              >
                <X className="h-5 w-5 text-gray-dark/50" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="text-sm font-medium text-gray-dark">
                    Meeting Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="text-sm font-medium text-gray-dark">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 h-24 w-full rounded-lg border-gray-200 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="text-sm font-medium text-gray-dark">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="startTime" className="text-sm font-medium text-gray-dark">
                      Start Time
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="text-sm font-medium text-gray-dark">
                      End Time
                    </label>
                    <input
                      id="endTime"
                      type="time"
                      value={form.endTime}
                      onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="attendees" className="text-sm font-medium text-gray-dark">
                    Attendees
                  </label>
                  <input
                    id="attendees"
                    type="text"
                    value={form.attendees}
                    onChange={(e) => setForm(prev => ({ ...prev, attendees: e.target.value }))}
                    className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                    placeholder="Enter email addresses separated by commas"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:border-primary/20 hover:bg-primary/5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);

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
        console.error('Error loading calendar data:', err);
        setError('Failed to load calendar data');
        setIsLoading(false);
        toast.error('Failed to load calendar data');
      }
    };

    loadData();
  }, [selectedDate, view]);

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

      <NewMeetingModal 
        isOpen={showNewMeetingModal}
        onClose={() => setShowNewMeetingModal(false)}
      />

      <motion.div 
        className="flex items-center justify-between"
        variants={fadeIn}
      >
        <div>
          <h1 className="text-2xl font-semibold text-gray-dark">Calendar</h1>
          <p className="mt-2 text-gray-dark">Schedule and manage your meetings with AI-powered insights.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewMeetingModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          New Meeting
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
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
            title: "Today's Meetings",
            value: '3',
            icon: CalendarCheck,
            color: 'text-blue-500'
          },
          {
            title: 'Hours Scheduled',
            value: '4.5',
            icon: Clock,
            color: 'text-purple-500'
          },
          {
            title: 'Total Attendees',
            value: '8',
            icon: Users,
            color: 'text-green-500'
          },
          {
            title: 'AI Insights',
            value: '5',
            icon: Brain,
            color: 'text-orange-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={fadeIn}
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

      <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
        {/* Calendar View */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader
              title="Schedule"
              action={
                <div className="flex items-center gap-2">
                  {['month', 'week', 'day'].map((viewType) => (
                    <motion.button
                      key={viewType}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setView(viewType as any)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                        view === viewType 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-gray-200 hover:border-primary/20 hover:bg-primary/5'
                      }`}
                    >
                      {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                    </motion.button>
                  ))}
                </div>
              }
            />

            {/* Calendar Navigation */}
            <motion.div 
              className="mt-6 flex items-center justify-between"
              variants={fadeIn}
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-lg p-2 hover:bg-gray-100"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <h3 className="text-lg font-medium">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-lg p-2 hover:bg-gray-100"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </motion.div>

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
                className="mt-6"
                variants={fadeIn}
              >
                {/* Week days header */}
                <div className="mb-4 grid grid-cols-7 gap-2">
                  {daysOfWeek.map(day => (
                    <motion.div 
                      key={day}
                      className="text-center text-sm font-medium text-gray-dark"
                      whileHover={{ scale: 1.05 }}
                    >
                      {day}
                    </motion.div>
                  ))}
                </div>

                {/* Time slots */}
                <div className="relative grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, dayIndex) => (
                    <motion.div
                      key={dayIndex}
                      className="relative h-96 rounded-lg border border-gray-100 bg-gray-50/50"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {/* Time markers */}
                      {Array.from({ length: 24 }).map((_, hour) => (
                        <motion.div
                          key={hour}
                          className="absolute left-0 right-0 border-t border-gray-100"
                          style={{ top: `${(hour / 24) * 100}%` }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: hour * 0.02 }}
                        >
                          <span className="absolute -top-3 -left-2 text-xs text-gray-400">
                            {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                          </span>
                        </motion.div>
                      ))}

                      {/* Meeting blocks */}
                      <AnimatePresence>
                        {mockMeetings.map(meeting => (
                          <motion.button
                            key={meeting.id}
                            onClick={() => setSelectedMeeting(meeting)}
                            className={`absolute left-1 right-1 rounded px-2 py-1 text-left text-xs text-white ${getTypeColor(meeting.type)}`}
                            style={{
                              top: `${(meeting.startTime.getHours() + meeting.startTime.getMinutes() / 60) * (100 / 24)}%`,
                              height: `${((meeting.endTime.getTime() - meeting.startTime.getTime()) / (60 * 60 * 1000)) * (100 / 24)}%`
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="truncate font-medium">{meeting.title}</div>
                            <div className="truncate opacity-90">{meeting.attendees.length} attendees</div>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Meeting Details & AI Analysis */}
        <div className="space-y-6">
          {/* Selected Meeting Details */}
          <AnimatePresence mode="wait">
            {selectedMeeting && (
              <motion.div
                key={selectedMeeting.id}
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Card>
                  <CardHeader 
                    title={selectedMeeting.title}
                    action={
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                      >
                        Edit
                      </motion.button>
                    }
                  />
                  <motion.div 
                    className="mt-4 space-y-4"
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
                    <motion.div variants={fadeIn} className="flex items-start gap-3">
                      <Clock className="mt-1 h-4 w-4 text-gray-dark/70" />
                      <div>
                        <p className="text-sm text-gray-dark">
                          {selectedMeeting.startTime.toLocaleTimeString([], { 
                            hour: '2-digit',
                            minute: '2-digit'
                          })} - {selectedMeeting.endTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-gray-dark/70">
                          {selectedMeeting.startTime.toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeIn} className="flex items-start gap-3">
                      <Users className="mt-1 h-4 w-4 text-gray-dark/70" />
                      <div>
                        <p className="text-sm font-medium text-gray-dark">Attendees</p>
                        <div className="mt-1 space-y-1">
                          {selectedMeeting.attendees.map(attendee => (
                            <motion.p 
                              key={attendee}
                              variants={fadeIn}
                              className="text-sm text-gray-dark/70"
                            >
                              {attendee}
                            </motion.p>
                          ))}
                        </div>
                      </div>
                    </motion.div>

                    {selectedMeeting.description && (
                      <motion.div variants={fadeIn} className="flex items-start gap-3">
                        <AlertCircle className="mt-1 h-4 w-4 text-gray-dark/70" />
                        <p className="text-sm text-gray-dark">
                          {selectedMeeting.description}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Analysis */}
          <AnimatePresence mode="wait">
            {selectedMeeting?.aiAnalysis && (
              <motion.div
                key={`${selectedMeeting.id}-analysis`}
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Card>
                  <CardHeader 
                    title="AI Meeting Analysis"
                    action={
                      <motion.div 
                        className={`flex items-center gap-2 ${getSentimentColor(selectedMeeting.aiAnalysis.sentiment)}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        <span className="text-sm font-medium">
                          {selectedMeeting.aiAnalysis.sentiment.charAt(0).toUpperCase() + 
                           selectedMeeting.aiAnalysis.sentiment.slice(1)}
                        </span>
                      </motion.div>
                    }
                  />
                  
                  <motion.div 
                    className="mt-4 space-y-4"
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
                    <motion.div variants={fadeIn}>
                      <h4 className="text-sm font-medium text-gray-dark">Key Points</h4>
                      <ul className="mt-2 space-y-2">
                        {selectedMeeting.aiAnalysis.keyPoints.map((point, index) => (
                          <motion.li 
                            key={index}
                            variants={fadeIn}
                            className="flex items-start gap-2 text-sm text-gray-dark/70"
                          >
                            <CheckCircle2 className="mt-1 h-4 w-4 text-green-500" />
                            {point}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div variants={fadeIn}>
                      <h4 className="text-sm font-medium text-gray-dark">Next Steps</h4>
                      <ul className="mt-2 space-y-2">
                        {selectedMeeting.aiAnalysis.nextSteps.map((step, index) => (
                          <motion.li 
                            key={index}
                            variants={fadeIn}
                            className="flex items-start gap-2 text-sm text-gray-dark/70"
                          >
                            <Plus className="mt-1 h-4 w-4 text-primary" />
                            {step}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div 
                      variants={fadeIn}
                      className="rounded-lg bg-primary/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-dark">Risk Level</span>
                        <motion.span 
                          className={`text-sm font-medium ${
                            selectedMeeting.aiAnalysis.riskLevel === 'low' 
                              ? 'text-green-500' 
                              : selectedMeeting.aiAnalysis.riskLevel === 'medium'
                              ? 'text-yellow-500'
                              : 'text-red-500'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {selectedMeeting.aiAnalysis.riskLevel.toUpperCase()}
                        </motion.span>
                      </div>
                    </motion.div>
                  </motion.div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar; 