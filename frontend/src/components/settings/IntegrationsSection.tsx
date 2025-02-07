import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Twitter as X,
  Linkedin,
  Mail,
  Check,
  XCircle,
  RefreshCw,
  ChevronRight,
  AlertCircle,
  Settings,
  Globe,
  Lock,
  Shield,
  CalendarDays,
  Clock,
  CheckCircle2,
  Info,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { useUser } from '../../contexts/UserContext';

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

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'calendar' | 'social';
  provider: string;
  onConnect: () => Promise<void>;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  type,
  provider,
  onConnect
}) => {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [permissions, setPermissions] = useState({
    readProfile: true,
    readCalendar: type === 'calendar',
    writeCalendar: type === 'calendar',
    readContacts: type === 'social',
    sendMessages: type === 'social'
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
      setStep(3);
    } catch (error) {
      console.error('Connection failed:', error);
      // Handle error
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <XCircle className="h-6 w-6" />
        </button>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full ${
                s <= step ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {type === 'calendar' ? (
                <Calendar className="h-8 w-8 text-primary" />
              ) : provider === 'twitter' ? (
                <X className="h-8 w-8 text-primary" />
              ) : (
                <Linkedin className="h-8 w-8 text-primary" />
              )}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Connect your {provider.charAt(0).toUpperCase() + provider.slice(1)} {type}
            </h3>
            <p className="mb-6 text-gray-600">
              {type === 'calendar'
                ? 'Sync your calendar to manage your schedule and availability'
                : 'Connect your account to automate your social media presence'}
            </p>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-medium text-gray-900">You'll be able to:</h4>
                {type === 'calendar' ? (
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      View and manage your calendar events
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Set your availability automatically
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Schedule meetings with prospects
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Send connection requests and messages
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Track engagement and responses
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Manage your network growth
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Review permissions</h3>
            <p className="mb-6 text-gray-600">
              Select the permissions you want to grant to the application
            </p>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={permissions.readProfile}
                    onChange={(e) =>
                      setPermissions({ ...permissions, readProfile: e.target.checked })
                    }
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Read profile information</p>
                    <p className="text-sm text-gray-500">
                      Access your basic profile details
                    </p>
                  </div>
                </label>
              </div>
              {type === 'calendar' && (
                <>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={permissions.readCalendar}
                        onChange={(e) =>
                          setPermissions({ ...permissions, readCalendar: e.target.checked })
                        }
                        className="mt-1 rounded border-gray-300"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Read calendar events</p>
                        <p className="text-sm text-gray-500">
                          View your calendar events and availability
                        </p>
                      </div>
                    </label>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={permissions.writeCalendar}
                        onChange={(e) =>
                          setPermissions({ ...permissions, writeCalendar: e.target.checked })
                        }
                        className="mt-1 rounded border-gray-300"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Create calendar events</p>
                        <p className="text-sm text-gray-500">
                          Add and manage calendar events on your behalf
                        </p>
                      </div>
                    </label>
                  </div>
                </>
              )}
              {type === 'social' && (
                <>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={permissions.readContacts}
                        onChange={(e) =>
                          setPermissions({ ...permissions, readContacts: e.target.checked })
                        }
                        className="mt-1 rounded border-gray-300"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Access contacts</p>
                        <p className="text-sm text-gray-500">
                          View and manage your network connections
                        </p>
                      </div>
                    </label>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={permissions.sendMessages}
                        onChange={(e) =>
                          setPermissions({ ...permissions, sendMessages: e.target.checked })
                        }
                        className="mt-1 rounded border-gray-300"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Send messages</p>
                        <p className="text-sm text-gray-500">
                          Send connection requests and messages on your behalf
                        </p>
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Successfully connected!
            </h3>
            <p className="mb-6 text-gray-600">
              Your {provider} {type} has been connected successfully
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const IntegrationCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  onConnect: () => void;
  onDisconnect: () => void;
  onSync?: () => void;
  details?: React.ReactNode;
}> = ({
  title,
  description,
  icon,
  connected,
  lastSync,
  onConnect,
  onDisconnect,
  onSync,
  details
}) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-gray-500">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          {connected && lastSync && (
            <p className="mt-1 text-xs text-gray-400">
              Last synced: {new Date(lastSync).toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {connected && onSync && (
          <button
            type="button"
            onClick={onSync}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-50"
            aria-label="Sync"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={connected ? onDisconnect : onConnect}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${
            connected
              ? 'text-red-600 hover:bg-red-50'
              : 'bg-primary text-white hover:bg-primary-hover'
          }`}
        >
          {connected ? (
            <>
              <XCircle className="h-4 w-4" />
              Disconnect
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Connect
            </>
          )}
        </button>
      </div>
    </div>
    {connected && details && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        className="mt-4 border-t pt-4"
      >
        {details}
      </motion.div>
    )}
  </div>
);

const CalendarDetails: React.FC<{
  calendars?: {
    id: string;
    name: string;
    color: string;
    selected: boolean;
  }[];
}> = ({ calendars }) => {
  if (!calendars?.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900">Connected Calendars</h4>
      <div className="space-y-1">
        {calendars.map(calendar => (
          <div
            key={calendar.id}
            className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: calendar.color }}
              />
              <span className="text-sm text-gray-700">{calendar.name}</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={calendar.selected}
                className="peer sr-only"
                onChange={() => {/* Handle calendar selection */}}
                aria-label={`Enable ${calendar.name} calendar`}
              />
              <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export const IntegrationsSection = () => {
  const { user, connectIntegration, disconnectIntegration, syncCalendars } = useUser();
  const [activeModal, setActiveModal] = useState<{
    type: 'calendar' | 'social';
    provider: string;
  } | null>(null);

  if (!user) return null;

  const { social, calendar } = user.integrations;

  const handleConnect = async () => {
    if (!activeModal) return;
    await connectIntegration(activeModal.type, activeModal.provider);
    setActiveModal(null);
  };

  return (
    <motion.div variants={fadeIn}>
      <Card>
        <CardHeader
          title="Integrations"
          description="Connect and manage your calendar and social media accounts."
          icon={Calendar}
        />
        <div className="mt-6 space-y-4">
          {/* Calendar Integrations */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Calendar</h3>
            {calendar.map(integration => (
              <IntegrationCard
                key={integration.provider}
                title={`${integration.provider.charAt(0).toUpperCase() + integration.provider.slice(1)} Calendar`}
                description={`Sync your ${integration.provider} calendar events`}
                icon={<Calendar className="h-5 w-5" />}
                connected={integration.connected}
                lastSync={integration.lastSync}
                onConnect={() => setActiveModal({ type: 'calendar', provider: integration.provider })}
                onDisconnect={() => disconnectIntegration('calendar', integration.provider)}
                onSync={() => syncCalendars(integration.provider)}
                details={<CalendarDetails calendars={integration.calendars} />}
              />
            ))}
          </div>

          {/* Social Media Integrations */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Social Media</h3>
            {social.map(integration => (
              <IntegrationCard
                key={integration.provider}
                title={`${integration.provider === 'twitter' ? 'X' : integration.provider.charAt(0).toUpperCase() + integration.provider.slice(1)}`}
                description={`Connect your ${integration.provider === 'twitter' ? 'X' : integration.provider} account`}
                icon={
                  integration.provider === 'twitter' ? (
                    <X className="h-5 w-5" />
                  ) : integration.provider === 'linkedin' ? (
                    <Linkedin className="h-5 w-5" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )
                }
                connected={integration.connected}
                lastSync={integration.lastSync}
                onConnect={() => setActiveModal({ type: 'social', provider: integration.provider })}
                onDisconnect={() => disconnectIntegration('social', integration.provider)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Connection Modal */}
      <AnimatePresence>
        {activeModal && (
          <ConnectionModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            type={activeModal.type}
            provider={activeModal.provider}
            onConnect={handleConnect}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 