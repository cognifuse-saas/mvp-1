import { useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { 
  ArrowLeft,
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Target,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignForm {
  name: string;
  type: 'connection' | 'message' | 'content';
  target: number;
  startDate: string;
  endDate: string;
  description: string;
}

const NewCampaign = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CampaignForm>({
    name: '',
    type: 'connection',
    target: 100,
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('New Campaign Data:', form);
    // Navigate back to campaigns list
    navigate('/campaigns');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/campaigns')}
          className="rounded-lg p-2 hover:bg-gray-50"
          aria-label="Go back to campaigns"
        >
          <ArrowLeft className="h-5 w-5 text-gray-dark" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-dark">Create New Campaign</h1>
          <p className="mt-2 text-gray-dark">Set up your campaign details and targeting options.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader title="Campaign Details" />
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-dark">
                Campaign Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                placeholder="e.g., Q1 Tech Leaders Outreach"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="text-sm font-medium text-gray-dark">
                Campaign Type
              </label>
              <select
                id="type"
                value={form.type}
                onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as CampaignForm['type'] }))}
                className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                required
              >
                <option value="connection">Connection Campaign</option>
                <option value="message">Message Campaign</option>
                <option value="content">Content Campaign</option>
              </select>
            </div>

            <div>
              <label htmlFor="target" className="text-sm font-medium text-gray-dark">
                Target Connections/Responses
              </label>
              <input
                id="target"
                type="number"
                value={form.target}
                onChange={(e) => setForm(prev => ({ ...prev, target: parseInt(e.target.value) }))}
                className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                min="1"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="startDate" className="text-sm font-medium text-gray-dark">
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="text-sm font-medium text-gray-dark">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 w-full rounded-lg border-gray-200 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium text-gray-dark">
                Campaign Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 h-32 w-full rounded-lg border-gray-200 text-sm"
                placeholder="Describe your campaign goals and strategy..."
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium hover:border-primary/20 hover:bg-primary/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCampaign; 