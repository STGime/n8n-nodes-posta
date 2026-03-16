import type { INodeProperties } from 'n8n-workflow';

export const analyticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		options: [
			{ name: 'Get Overview', value: 'overview', description: 'Get analytics overview', action: 'Get analytics overview' },
			{ name: 'Get Posts', value: 'posts', description: 'Get analytics for all posts', action: 'Get post analytics' },
			{ name: 'Get Post Detail', value: 'postDetail', description: 'Get detailed analytics for a post', action: 'Get post detail analytics' },
			{ name: 'Get Trends', value: 'trends', description: 'Get trend data for charts', action: 'Get analytics trends' },
			{ name: 'Get Best Times', value: 'bestTimes', description: 'Get best posting times heatmap', action: 'Get best posting times' },
			{ name: 'Get Content Types', value: 'contentTypes', description: 'Get content type performance', action: 'Get content type analytics' },
			{ name: 'Get Hashtags', value: 'hashtags', description: 'Get hashtag performance', action: 'Get hashtag analytics' },
			{ name: 'Compare Posts', value: 'compare', description: 'Compare 2-4 posts side by side', action: 'Compare post analytics' },
			{ name: 'Get Benchmarks', value: 'benchmarks', description: 'Get engagement benchmarks', action: 'Get benchmarks' },
			{ name: 'Get Capabilities', value: 'capabilities', description: 'Get analytics capabilities for plan', action: 'Get analytics capabilities' },
			{ name: 'Refresh Post', value: 'refreshPost', description: 'Refresh analytics for a single post', action: 'Refresh post analytics' },
			{ name: 'Refresh All', value: 'refreshAll', description: 'Refresh all analytics', action: 'Refresh all analytics' },
			{ name: 'Export CSV', value: 'exportCsv', description: 'Export analytics as CSV', action: 'Export analytics CSV' },
			{ name: 'Export PDF', value: 'exportPdf', description: 'Export analytics as PDF', action: 'Export analytics PDF' },
		],
		default: 'overview',
	},
];

export const analyticsFields: INodeProperties[] = [
	// Period (shared by overview, trends, exports)
	{
		displayName: 'Period',
		name: 'period',
		type: 'options',
		options: [
			{ name: '7 Days', value: '7d' },
			{ name: '30 Days', value: '30d' },
			{ name: '90 Days', value: '90d' },
			{ name: '12 Months', value: '12m' },
		],
		default: '30d',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['overview', 'trends', 'exportCsv', 'exportPdf'],
			},
		},
	},
	// Social Account IDs filter
	{
		displayName: 'Social Account IDs',
		name: 'socialAccountIds',
		type: 'string',
		default: '',
		placeholder: 'acc_id1,acc_id2',
		description: 'Comma-separated account IDs to filter by (optional)',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['overview', 'posts', 'trends'],
			},
		},
	},
	// Trends metric
	{
		displayName: 'Metric',
		name: 'metric',
		type: 'options',
		options: [
			{ name: 'Impressions', value: 'impressions' },
			{ name: 'Engagements', value: 'engagements' },
			{ name: 'Engagement Rate', value: 'engagement_rate' },
		],
		default: 'engagements',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['trends'],
			},
		},
	},
	// Posts pagination
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['posts'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 20,
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['posts'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'options',
		options: [
			{ name: 'Engagements', value: 'engagements' },
			{ name: 'Impressions', value: 'impressions' },
		],
		default: 'engagements',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['posts'],
			},
		},
	},
	{
		displayName: 'Sort Order',
		name: 'sortOrder',
		type: 'options',
		options: [
			{ name: 'Descending', value: 'desc' },
			{ name: 'Ascending', value: 'asc' },
		],
		default: 'desc',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['posts'],
			},
		},
	},
	// Post Detail / Refresh Post
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['postDetail'],
			},
		},
	},
	{
		displayName: 'Post Result ID',
		name: 'postResultId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['refreshPost'],
			},
		},
	},
	// Compare posts
	{
		displayName: 'Post IDs',
		name: 'postIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'id1,id2,id3',
		description: 'Comma-separated post IDs (2-4)',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['compare'],
			},
		},
	},
];
