import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  connections: number;
  messages: number;
  responses: number;
  lastActive: string;
}

interface SortableCampaignRowProps {
  campaign: Campaign;
}

export const SortableCampaignRow: React.FC<SortableCampaignRowProps> = ({ campaign }) => {
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

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-500 bg-green-50';
      case 'paused':
        return 'text-yellow-500 bg-yellow-50';
      case 'completed':
        return 'text-blue-500 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab rounded p-1 hover:bg-gray-50"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </button>

      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{campaign.name}</h3>
        <p className="text-sm text-gray-500">Last active: {campaign.lastActive}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{campaign.connections} connections</span>
          <span className="text-sm text-gray-500">{campaign.messages} messages</span>
          <span className="text-sm text-gray-500">{campaign.responses} responses</span>
        </div>
      </div>
    </div>
  );
};

export default SortableCampaignRow; 