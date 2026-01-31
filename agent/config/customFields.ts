import { CustomField } from '@/types/event';
import { MiceSubType } from '@/types/event';

export const CUSTOM_FIELDS_CONFIG: Record<MiceSubType, CustomField[]> = {
  Meetings: [
    {
      id: '1',
      label: 'Number of Breakout Sessions',
      type: 'number',
      options: [],
      value: '',
      required: false,
      forType: ['Meetings'],
    },
    {
      id: '2',
      label: 'Meeting Duration (days)',
      type: 'number',
      options: [],
      value: '',
      required: false,
      forType: ['Meetings'],
    },
  ],

  Incentives: [
    {
      id: '3',
      label: 'Incentive Budget Per Person',
      type: 'number',
      options: [],
      value: '',
      required: false,
      forType: ['Incentives'],
    },
    {
      id: '4',
      label: 'Activity Level',
      type: 'select',
      options: ['Low', 'Medium', 'High'],
      value: '',
      required: false,
      forType: ['Incentives'],
    },
  ],

  Conferences: [
    {
      id: '5',
      label: 'Number of Tracks',
      type: 'number',
      options: [],
      value: '',
      required: false,
      forType: ['Conferences'],
    },
    {
      id: '6',
      label: 'Speaker Count',
      type: 'number',
      options: [],
      value: '',
      required: false,
      forType: ['Conferences'],
    },
  ],

  Exhibitions: [
    {
      id: '7',
      label: 'Exhibition Area (sq ft)',
      type: 'number',
      options: [],
      value: '',
      required: false,
      forType: ['Exhibitions'],
    },
    {
      id: '8',
      label: 'Booth Count',
      type: 'number',
      options: [],
      value: '',
      required: false,
      forType: ['Exhibitions'],
    },
  ],
};
