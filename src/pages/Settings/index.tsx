import { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { 
  User, 
  Shield, 
  Bell, 
  Link, 
  Settings as SettingsIcon,
  Users,
  MessageSquare,
  Clock,
  Save,
  ChevronRight,
  Lock,
  Mail,
  Globe,
  Zap,
  Moon,
  Sun,
  Palette,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  X,
  LogOut,
  Key,
  Database,
  Download,
  Upload,
  Webhook,
  BellRing,
  ShieldAlert,
  LinkedinIcon,
  History,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { IntegrationsSection } from '../../components/settings/IntegrationsSection';

interface LinkedInSettings {
  accountConnected: boolean;
  dailyLimit: number;
  connectionDelay: number;
  messageDelay: number;
  weekendPause: boolean;
}

interface NotificationSettings {
  email: boolean;
  desktop: boolean;
  connectionAccepted: boolean;
  messageReceived: boolean;
  campaignComplete: boolean;
  weeklyReport: boolean;
}

interface SafetySettings {
  maxConnectionsPerDay: number;
  maxMessagesPerDay: number;
  restrictedKeywords: string[];
  cooldownPeriod: number;
}

interface AuthSettings {
  sessions: {
    id: string;
    device: string;
    lastActive: string;
    location: string;
  }[];
  loginHistory: {
    date: string;
    ip: string;
    device: string;
    status: 'success' | 'failed';
  }[];
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  jobTitle: string;
  company: string;
  timezone: string;
  language: string;
  phoneNumber: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digest: 'daily' | 'weekly' | 'never';
    campaignNotifications: {
      start: boolean;
      end: boolean;
      milestone: boolean;
      error: boolean;
    };
    dndSchedule: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    activityStatus: boolean;
    readReceipts: boolean;
    dataRetention: number;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
    ipWhitelist: string[];
    apiKeys: {
      key: string;
      name: string;
      created: string;
      lastUsed: string;
    }[];
  };
  linkedin: {
    accountConnected: boolean;
    dailyLimit: number;
    connectionDelay: number;
    messageDelay: number;
    weekendPause: boolean;
    ipRotation: boolean;
    restrictedKeywords: string[];
  };
  integrations: {
    webhooks: {
      url: string;
      events: string[];
      active: boolean;
    }[];
    oauth: {
      app: string;
      connected: boolean;
      permissions: string[];
    }[];
  };
  sessions: {
    id: string;
    device: string;
    lastActive: string;
    location: string;
  }[];
  loginHistory: {
    date: string;
    ip: string;
    device: string;
    status: 'success' | 'failed';
  }[];
}

const mockSettings = {
  linkedin: {
    accountConnected: true,
    dailyLimit: 100,
    connectionDelay: 30,
    messageDelay: 45,
    weekendPause: true
  },
  notifications: {
    email: true,
    desktop: true,
    connectionAccepted: true,
    messageReceived: true,
    campaignComplete: true,
    weeklyReport: true
  },
  safety: {
    maxConnectionsPerDay: 100,
    maxMessagesPerDay: 200,
    restrictedKeywords: ['spam', 'buy now', 'limited time'],
    cooldownPeriod: 24
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

// Loading skeleton component
const Skeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="h-8 w-48 rounded-lg bg-gray-100" />
    <div className="space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl bg-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-64 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface SettingsForm {
  profile: {
    name: string;
    email: string;
    avatar: string;
    jobTitle: string;
    company: string;
    timezone: string;
    language: string;
    phoneNumber: string;
    bio: string;
    socialLinks: {
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    digest: 'daily' | 'weekly' | 'never';
    campaignNotifications: {
      start: boolean;
      end: boolean;
      milestone: boolean;
      error: boolean;
    };
    dndSchedule: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    activityStatus: boolean;
    readReceipts: boolean;
    dataRetention: number;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
    ipWhitelist: string[];
    apiKeys: {
      key: string;
      name: string;
      created: string;
      lastUsed: string;
    }[];
  };
  linkedin: {
    accountConnected: boolean;
    dailyLimit: number;
    connectionDelay: number;
    messageDelay: number;
    weekendPause: boolean;
    ipRotation: boolean;
    restrictedKeywords: string[];
    cooldownPeriod: number;
  };
  integrations: {
    webhooks: {
      url: string;
      events: string[];
      active: boolean;
    }[];
    oauth: {
      app: string;
      connected: boolean;
      permissions: string[];
    }[];
  };
}

const defaultUserProfile: UserProfile = {
  name: '',
  email: '',
  avatar: '',
  jobTitle: '',
  company: '',
  timezone: 'UTC',
  language: 'en',
  phoneNumber: '',
  bio: '',
  socialLinks: {
    twitter: '',
    linkedin: '',
    website: ''
  },
  notifications: {
    email: true,
    push: true,
    inApp: true,
    digest: 'daily',
    campaignNotifications: {
      start: true,
      end: true,
      milestone: true,
      error: true
    },
    dndSchedule: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    }
  },
  appearance: {
    theme: 'system',
    accentColor: '#6366F1',
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium'
  },
  privacy: {
    profileVisibility: 'public',
    activityStatus: true,
    readReceipts: true,
    dataRetention: 90
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
    loginAlerts: true,
    ipWhitelist: [],
    apiKeys: []
  },
  linkedin: {
    accountConnected: false,
    dailyLimit: 100,
    connectionDelay: 30,
    messageDelay: 45,
    weekendPause: true,
    ipRotation: false,
    restrictedKeywords: []
  },
  integrations: {
    webhooks: [],
    oauth: []
  },
  sessions: [],
  loginHistory: []
};

const Settings = () => {
  const { user, updateUserProfile, isLoading } = useUser();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [sessions, setSessions] = useState<AuthSettings['sessions']>([]);
  const [loginHistory, setLoginHistory] = useState<AuthSettings['loginHistory']>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(defaultUserProfile);

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({ ...defaultUserProfile, ...user });
    }
  }, [user]);

  const handleFormChange = (updates: Partial<UserProfile>) => {
    setFormData(prevData => ({
      ...prevData,
      ...updates
    }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile(formData);
      setHasUnsavedChanges(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton />
      </div>
    );
  }

  // Show error state if user is not available
  if (!user) {
    return (
      <motion.div 
        className="flex h-[50vh] items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-lg font-medium text-gray-dark">Unable to load user data</p>
          <p className="mt-2 text-gray-600">Please try refreshing the page</p>
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

  // Only render the main content when we have user data
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

      <motion.div variants={fadeIn}>
        <h1 className="text-2xl font-semibold text-gray-dark">Settings</h1>
        <p className="mt-2 text-gray-dark">Manage your account preferences and configuration.</p>
      </motion.div>

      {/* Warning for unsaved changes */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-yellow-50 p-4 text-yellow-800"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>You have unsaved changes</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Profile */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="Profile Information" 
              description="Manage your personal information and preferences."
              icon={User}
            />
            <div className="mt-6 space-y-8">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg hover:bg-primary-hover"
                    aria-label="Upload new photo"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-dark">Profile Photo</h3>
                  <p className="text-sm text-gray-dark/70">Upload a professional photo for your profile.</p>
                  <button
                    type="button"
                    className="mt-2 text-sm text-primary hover:text-primary-hover"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange({ name: e.target.value })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-dark">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange({ email: e.target.value })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-dark">Job Title</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleFormChange({ jobTitle: e.target.value })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    placeholder="Enter your job title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-dark">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleFormChange({ company: e.target.value })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleFormChange({ bio: e.target.value })}
                  rows={4}
                  className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                  placeholder="Write a short bio about yourself..."
                />
              </div>

              {/* Contact & Social */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleFormChange({ phoneNumber: e.target.value })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-dark">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleFormChange({ socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    placeholder="Enter your LinkedIn URL"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleFormChange({ timezone: e.target.value })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    aria-label="Select your timezone"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    {/* Add more timezone options */}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-dark">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => handleFormChange({ language: e.target.value })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    aria-label="Select your preferred language"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    {/* Add more language options */}
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="Notifications" 
              description="Configure how you want to receive notifications."
              icon={Bell}
            />
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Email Notifications</label>
                  <p className="text-sm text-gray-dark/70">Receive notifications via email</p>
                </div>
                <motion.label 
                  className="relative inline-flex cursor-pointer items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={(e) => handleFormChange({ notifications: { ...formData.notifications, email: e.target.checked } })}
                    className="peer sr-only"
                    aria-label="Toggle email notifications"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20" />
                </motion.label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Push Notifications</label>
                  <p className="text-sm text-gray-dark/70">Receive push notifications in your browser</p>
                </div>
                <motion.label 
                  className="relative inline-flex cursor-pointer items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={(e) => handleFormChange({ notifications: { ...formData.notifications, push: e.target.checked } })}
                    className="peer sr-only"
                    aria-label="Toggle push notifications"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20" />
                </motion.label>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-dark">Digest Frequency</label>
                <p className="mt-1 text-sm text-gray-dark/70">How often you want to receive activity digests</p>
                <select
                  id="digestFrequency"
                  value={formData.notifications.digest}
                  onChange={(e) => handleFormChange({ notifications: { ...formData.notifications, digest: e.target.value as SettingsForm['notifications']['digest'] } })}
                  className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                  aria-label="Select digest frequency"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="Appearance" 
              description="Customize how the application looks and feels."
              icon={Palette}
            />
            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-dark">Theme</label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Zap }
                  ].map(theme => (
                    <motion.button
                      key={theme.value}
                      type="button"
                      onClick={() => handleFormChange({ appearance: { ...formData.appearance, theme: theme.value as SettingsForm['appearance']['theme'] } })}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm ${
                        formData.appearance.theme === theme.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-primary/20 hover:bg-primary/5'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <theme.icon className="h-4 w-4" />
                      {theme.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-dark">Accent Color</label>
                <div className="mt-2 grid grid-cols-6 gap-2">
                  {[
                    '#6366F1', // Indigo
                    '#8B5CF6', // Purple
                    '#EC4899', // Pink
                    '#F43F5E', // Rose
                    '#F59E0B', // Amber
                    '#10B981'  // Emerald
                  ].map(color => (
                    <motion.button
                      key={color}
                      type="button"
                      onClick={() => handleFormChange({ appearance: { ...formData.appearance, accentColor: color } })}
                      className={`h-8 w-8 rounded-full ${
                        formData.appearance.accentColor === color
                          ? 'ring-2 ring-offset-2'
                          : ''
                      }`}
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Reduced Motion</label>
                  <p className="text-sm text-gray-dark/70">Minimize animations and transitions</p>
                </div>
                <motion.label 
                  className="relative inline-flex cursor-pointer items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.appearance.reducedMotion}
                    onChange={(e) => handleFormChange({ appearance: { ...formData.appearance, reducedMotion: e.target.checked } })}
                    className="peer sr-only"
                    aria-label="Toggle reduced motion"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20" />
                </motion.label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="Privacy" 
              description="Manage your privacy settings and profile visibility."
              icon={Shield}
            />
            <div className="mt-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-dark">Profile Visibility</label>
                <select
                  id="profileVisibility"
                  value={formData.privacy.profileVisibility}
                  onChange={(e) => handleFormChange({ privacy: { ...formData.privacy, profileVisibility: e.target.value as SettingsForm['privacy']['profileVisibility'] } })}
                  className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                  aria-label="Select profile visibility"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="connections">Connections Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Activity Status</label>
                  <p className="text-sm text-gray-dark/70">Show when you're active on the platform</p>
                </div>
                <motion.label 
                  className="relative inline-flex cursor-pointer items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.privacy.activityStatus}
                    onChange={(e) => handleFormChange({ privacy: { ...formData.privacy, activityStatus: e.target.checked } })}
                    className="peer sr-only"
                    aria-label="Toggle activity status"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20" />
                </motion.label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Read Receipts</label>
                  <p className="text-sm text-gray-dark/70">Show when you've read messages</p>
                </div>
                <motion.label 
                  className="relative inline-flex cursor-pointer items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.privacy.readReceipts}
                    onChange={(e) => handleFormChange({ privacy: { ...formData.privacy, readReceipts: e.target.checked } })}
                    className="peer sr-only"
                    aria-label="Toggle read receipts"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20" />
                </motion.label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="Security" 
              description="Manage your account security and authentication settings."
              icon={Lock}
            />
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Two-Factor Authentication</label>
                  <p className="text-sm text-gray-dark/70">Add an extra layer of security to your account</p>
                </div>
                <motion.label 
                  className="relative inline-flex cursor-pointer items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.security.twoFactor}
                    onChange={(e) => handleFormChange({ security: { ...formData.security, twoFactor: e.target.checked } })}
                    className="peer sr-only"
                    aria-label="Toggle two-factor authentication"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20" />
                </motion.label>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-dark">Session Timeout</label>
                <p className="mt-1 text-sm text-gray-dark/70">Automatically log out after inactivity</p>
                <select
                  id="sessionTimeout"
                  value={formData.security.sessionTimeout}
                  onChange={(e) => handleFormChange({ security: { ...formData.security, sessionTimeout: parseInt(e.target.value) } })}
                  className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                  aria-label="Select session timeout duration"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Login Alerts</label>
                  <p className="text-sm text-gray-dark/70">Get notified of new login attempts</p>
                </div>
                <motion.label 
                  className="relative inline-flex cursor-pointer items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    checked={formData.security.loginAlerts}
                    onChange={(e) => handleFormChange({ security: { ...formData.security, loginAlerts: e.target.checked } })}
                    className="peer sr-only"
                    aria-label="Toggle login alerts"
                  />
                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20" />
                </motion.label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* LinkedIn Integration */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="LinkedIn Integration" 
              description="Configure your LinkedIn automation settings."
              icon={LinkedinIcon}
            />
            <div className="mt-6 space-y-6">
              {/* LinkedIn connection status */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-dark">LinkedIn Account</label>
                  <p className="text-sm text-gray-dark/70">
                    {formData.linkedin.accountConnected 
                      ? 'Your LinkedIn account is connected' 
                      : 'Connect your LinkedIn account'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {/* Handle LinkedIn connection */}}
                  className="rounded-lg bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white hover:bg-[#004182]"
                >
                  {formData.linkedin.accountConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>

              {/* Daily limits */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Daily Connection Limit</label>
                <input
                  type="number"
                  value={formData.linkedin.dailyLimit}
                  onChange={(e) => handleFormChange({ linkedin: { ...formData.linkedin, dailyLimit: parseInt(e.target.value) } })}
                  className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                  min="0"
                  max="100"
                  aria-label="Daily connection limit"
                />
              </div>

              {/* Delays */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-dark">Connection Delay (seconds)</label>
                  <input
                    type="number"
                    value={formData.linkedin.connectionDelay}
                    onChange={(e) => handleFormChange({ linkedin: { ...formData.linkedin, connectionDelay: parseInt(e.target.value) } })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    min="0"
                    aria-label="Connection delay in seconds"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-dark">Message Delay (seconds)</label>
                  <input
                    type="number"
                    value={formData.linkedin.messageDelay}
                    onChange={(e) => handleFormChange({ linkedin: { ...formData.linkedin, messageDelay: parseInt(e.target.value) } })}
                    className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                    min="0"
                    aria-label="Message delay in seconds"
                  />
                </div>
              </div>

              {/* Safety features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-dark">Weekend Pause</label>
                    <p className="text-sm text-gray-dark/70">Pause automation during weekends</p>
                  </div>
                  <motion.label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formData.linkedin.weekendPause}
                      onChange={(e) => handleFormChange({ linkedin: { ...formData.linkedin, weekendPause: e.target.checked } })}
                      className="peer sr-only"
                      aria-label="Toggle weekend pause"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </motion.label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-dark">IP Rotation</label>
                    <p className="text-sm text-gray-dark/70">Rotate IP addresses for safety</p>
                  </div>
                  <motion.label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formData.linkedin.ipRotation}
                      onChange={(e) => handleFormChange({ linkedin: { ...formData.linkedin, ipRotation: e.target.checked } })}
                      className="peer sr-only"
                      aria-label="Toggle IP rotation"
                    />
                    <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </motion.label>
                </div>
              </div>

              {/* Restricted keywords */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Restricted Keywords</label>
                <p className="text-sm text-gray-dark/70">Messages containing these words will not be sent</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.linkedin.restrictedKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newKeywords = [...formData.linkedin.restrictedKeywords];
                          newKeywords.splice(index, 1);
                          handleFormChange({ linkedin: { ...formData.linkedin, restrictedKeywords: newKeywords } });
                        }}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label={`Remove keyword ${keyword}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add keyword..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        e.preventDefault();
                        handleFormChange({
                          linkedin: {
                            ...formData.linkedin,
                            restrictedKeywords: [...formData.linkedin.restrictedKeywords, e.currentTarget.value]
                          }
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                    className="rounded-lg border-gray-200 text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Add the new IntegrationsSection */}
        <IntegrationsSection />

        {/* API Keys & Integrations */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="API & Integrations" 
              description="Manage your API keys and third-party integrations."
              icon={Key}
            />
            <div className="mt-6 space-y-6">
              {/* API Keys */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-dark">API Keys</label>
                  <button
                    type="button"
                    onClick={() => {/* Handle new API key generation */}}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    Generate New Key
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {formData.security.apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.key}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div>
                        <p className="font-medium">{apiKey.name}</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm">
                            {showApiKey === apiKey.key ? apiKey.key : '••••••••••••••••'}
                          </code>
                          <button
                            type="button"
                            onClick={() => setShowApiKey(
                              showApiKey === apiKey.key ? null : apiKey.key
                            )}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label={showApiKey === apiKey.key ? "Hide API key" : "Show API key"}
                          >
                            {showApiKey === apiKey.key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(apiKey.created).toLocaleDateString()}
                          {apiKey.lastUsed && ` • Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {/* Handle API key revocation */}}
                        className="text-red-500 hover:text-red-700"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webhooks */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-dark">Webhooks</label>
                  <button
                    type="button"
                    onClick={() => {/* Handle new webhook */}}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    Add Webhook
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  {formData.integrations.webhooks.map((webhook, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">Webhook URL</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                webhook.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {webhook.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <code className="text-sm">{webhook.url}</code>
                        </div>
                        <button
                          type="button"
                          onClick={() => {/* Handle webhook deletion */}}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Delete webhook"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-dark">Events</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {webhook.events.map((event) => (
                            <span
                              key={event}
                              className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
                            >
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="Data Management" 
              description="Manage your data, exports, and account settings."
              icon={Database}
            />
            <div className="mt-6 space-y-6">
              {/* Data Export */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Export Data</label>
                <p className="text-sm text-gray-dark/70">Download all your data in JSON format</p>
                <button
                  type="button"
                  onClick={() => {/* Handle data export */}}
                  className="mt-2 flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
              </div>

              {/* Data Retention */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Data Retention</label>
                <p className="text-sm text-gray-dark/70">Choose how long to keep your data</p>
                <select
                  value={formData.privacy.dataRetention}
                  onChange={(e) => handleFormChange({ privacy: { ...formData.privacy, dataRetention: parseInt(e.target.value) } })}
                  className="mt-2 w-full rounded-lg border-gray-200 text-sm"
                  aria-label="Data retention period"
                >
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>6 months</option>
                  <option value={365}>1 year</option>
                  <option value={0}>Forever</option>
                </select>
              </div>

              {/* Account Deletion */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Delete Account</label>
                <p className="text-sm text-gray-dark/70">Permanently delete your account and all data</p>
                <button
                  type="button"
                  onClick={() => {/* Handle account deletion */}}
                  className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Session Management */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader 
              title="Active Sessions" 
              description="Manage your active sessions and login history."
              icon={History}
            />
            <div className="mt-6 space-y-6">
              {/* Active Sessions */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Current Sessions</label>
                <div className="mt-2 space-y-4">
                  {formData.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-gray-500">
                          Last active: {new Date(session.lastActive).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Location: {session.location}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {/* Handle session termination */}}
                        className="text-red-500 hover:text-red-700"
                      >
                        Terminate
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Login History */}
              <div>
                <label className="text-sm font-medium text-gray-dark">Login History</label>
                <div className="mt-2 space-y-2">
                  {formData.loginHistory.map((login, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              login.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {login.status}
                          </span>
                          <p className="text-sm">{login.device}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(login.date).toLocaleString()} • IP: {login.ip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          variants={fadeIn}
          className="sticky bottom-0 flex items-center justify-between bg-white py-4"
        >
          <button
            type="button"
            onClick={() => {/* Handle logout */}}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                handleFormChange({ /* initial form state */ });
                setHasUnsavedChanges(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset Changes
            </button>
            <motion.button
              type="submit"
              disabled={isSaving || !hasUnsavedChanges}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Settings; 