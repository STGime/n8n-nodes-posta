import type { INodeProperties } from 'n8n-workflow';

export const postOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['post'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new post',
				action: 'Create a post',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing post',
				action: 'Update a post',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a post',
				action: 'Delete a post',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a post by ID',
				action: 'Get a post',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many posts',
				action: 'Get many posts',
			},
			{
				name: 'Schedule',
				value: 'schedule',
				description: 'Schedule a post for future publishing',
				action: 'Schedule a post',
			},
			{
				name: 'Publish Now',
				value: 'publish',
				description: 'Publish a post immediately',
				action: 'Publish a post',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a scheduled post',
				action: 'Cancel a scheduled post',
			},
			{
				name: 'Get Calendar',
				value: 'getCalendar',
				description: 'Get calendar view of posts',
				action: 'Get post calendar',
			},
		],
		default: 'create',
	},
];

const platformConfigFields: INodeProperties = {
	displayName: 'Platform Configurations',
	name: 'platformConfigurations',
	type: 'fixedCollection',
	typeOptions: {
		multipleValues: false,
	},
	default: {},
	displayOptions: {
		show: {
			resource: ['post'],
			operation: ['create', 'update'],
		},
	},
	options: [
		{
			displayName: 'TikTok',
			name: 'tiktok',
			values: [
				{
					displayName: 'Privacy Level',
					name: 'privacyLevel',
					type: 'options',
					options: [
						{ name: 'Public', value: 'PUBLIC_TO_EVERYONE' },
						{ name: 'Friends', value: 'MUTUAL_FOLLOW_FRIENDS' },
						{ name: 'Followers', value: 'FOLLOWER_OF_CREATOR' },
						{ name: 'Only Me', value: 'SELF_ONLY' },
					],
					default: 'PUBLIC_TO_EVERYONE',
					description: 'Required for TikTok posts',
				},
				{
					displayName: 'Allow Comments',
					name: 'allowComment',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Allow Duet',
					name: 'allowDuet',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Allow Stitch',
					name: 'allowStitch',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Video Title',
					name: 'videoTitle',
					type: 'string',
					default: '',
				},
				{
					displayName: 'AI-Generated Content',
					name: 'isAigc',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Branded Content',
					name: 'brandContentToggle',
					type: 'boolean',
					default: false,
				},
			],
		},
		{
			displayName: 'Pinterest',
			name: 'pinterest',
			values: [
				{
					displayName: 'Board',
					name: 'boardId',
					type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getPinterestBoards',
						loadOptionsDependsOn: ['additionalFields.socialAccountIds'],
					},
					default: '',
					description: 'Pinterest board to pin to',
				},
				{
					displayName: 'Link URL',
					name: 'link',
					type: 'string',
					default: '',
					placeholder: 'https://example.com',
				},
				{
					displayName: 'Alt Text',
					name: 'altText',
					type: 'string',
					default: '',
				},
			],
		},
		{
			displayName: 'YouTube',
			name: 'youtube',
			values: [
				{
					displayName: 'Title',
					name: 'title',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Description',
					name: 'description',
					type: 'string',
					typeOptions: { rows: 4 },
					default: '',
				},
				{
					displayName: 'Tags',
					name: 'tags',
					type: 'string',
					default: '',
					description: 'Comma-separated tags',
				},
				{
					displayName: 'Privacy Status',
					name: 'privacyStatus',
					type: 'options',
					options: [
						{ name: 'Public', value: 'public' },
						{ name: 'Unlisted', value: 'unlisted' },
						{ name: 'Private', value: 'private' },
					],
					default: 'public',
				},
				{
					displayName: 'Is Short',
					name: 'isShort',
					type: 'boolean',
					default: false,
				},
				{
					displayName: 'Made for Kids',
					name: 'madeForKids',
					type: 'boolean',
					default: false,
				},
			],
		},
		{
			displayName: 'Instagram',
			name: 'instagram',
			values: [
				{
					displayName: 'Placement',
					name: 'placement',
					type: 'options',
					options: [
						{ name: 'Feed', value: 'feed' },
						{ name: 'Reels', value: 'reels' },
						{ name: 'Story', value: 'story' },
					],
					default: 'feed',
				},
			],
		},
		{
			displayName: 'Facebook',
			name: 'facebook',
			values: [
				{
					displayName: 'Placement',
					name: 'placement',
					type: 'options',
					options: [
						{ name: 'Feed', value: 'feed' },
						{ name: 'Reels', value: 'reels' },
						{ name: 'Story', value: 'story' },
					],
					default: 'feed',
				},
			],
		},
		{
			displayName: 'X (Twitter)',
			name: 'twitter',
			values: [
				{
					displayName: 'Reply Settings',
					name: 'replySettings',
					type: 'options',
					options: [
						{ name: 'Everyone', value: 'everyone' },
						{ name: 'Following', value: 'following' },
						{ name: 'Mentioned Users', value: 'mentionedUsers' },
					],
					default: 'everyone',
				},
				{
					displayName: 'Quote Tweet ID',
					name: 'quoteTweetId',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Alt Text (Comma-Separated)',
					name: 'altText',
					type: 'string',
					default: '',
				},
			],
		},
		{
			displayName: 'LinkedIn',
			name: 'linkedin',
			values: [
				{
					displayName: 'Visibility',
					name: 'visibility',
					type: 'options',
					options: [
						{ name: 'Public', value: 'PUBLIC' },
						{ name: 'Connections Only', value: 'CONNECTIONS' },
					],
					default: 'PUBLIC',
				},
				{
					displayName: 'Post Type',
					name: 'postType',
					type: 'options',
					options: [
						{ name: 'Post', value: 'post' },
						{ name: 'Document', value: 'document' },
						{ name: 'Article', value: 'article' },
					],
					default: 'post',
				},
				{
					displayName: 'Document Title',
					name: 'documentTitle',
					type: 'string',
					default: '',
				},
			],
		},
		{
			displayName: 'Bluesky',
			name: 'bluesky',
			values: [
				{
					displayName: 'Alt Text (Comma-Separated)',
					name: 'altText',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Embed URL',
					name: 'embedUrl',
					type: 'string',
					default: '',
				},
				{
					displayName: 'Languages (Comma-Separated)',
					name: 'languages',
					type: 'string',
					default: '',
					placeholder: 'en,de',
				},
				{
					displayName: 'Content Labels (Comma-Separated)',
					name: 'labels',
					type: 'string',
					default: '',
					placeholder: 'nsfw,spoiler',
				},
			],
		},
		{
			displayName: 'Threads',
			name: 'threads',
			values: [
				{
					displayName: 'Location',
					name: 'location',
					type: 'options',
					options: [
						{ name: 'Timeline', value: 'timeline' },
						{ name: 'Reels', value: 'reels' },
					],
					default: 'timeline',
				},
			],
		},
	],
};

export const postFields: INodeProperties[] = [
	// ------ Create ------
	{
		displayName: 'Social Account IDs',
		name: 'socialAccountIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'acc_id1,acc_id2',
		description:
			'Comma-separated social account IDs to post to. Use "Social Account → Get Many" to find IDs.',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		description: 'Post caption (max 2200 chars). Either caption or media IDs required.',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Hashtags',
				name: 'hashtags',
				type: 'string',
				default: '',
				placeholder: 'tag1,tag2',
				description: 'Comma-separated hashtags (without #)',
			},
			{
				displayName: 'Media IDs',
				name: 'mediaIds',
				type: 'string',
				default: '',
				placeholder: 'media_id1,media_id2',
				description: 'Comma-separated media IDs from "Media → Upload"',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduledAt',
				type: 'dateTime',
				default: '',
				description: 'ISO 8601 datetime to schedule the post',
			},
			{
				displayName: 'Is Draft',
				name: 'isDraft',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Processing Enabled',
				name: 'processingEnabled',
				type: 'boolean',
				default: true,
				description: 'Enable server-side media processing',
			},
		],
	},
	platformConfigFields,

	// ------ Update ------
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['update', 'delete', 'get', 'schedule', 'publish', 'cancel'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
			},
			{
				displayName: 'Hashtags',
				name: 'hashtags',
				type: 'string',
				default: '',
				placeholder: 'tag1,tag2',
			},
			{
				displayName: 'Media IDs',
				name: 'mediaIds',
				type: 'string',
				default: '',
				placeholder: 'media_id1,media_id2',
			},
			{
				displayName: 'Social Account IDs',
				name: 'socialAccountIds',
				type: 'string',
				default: '',
				placeholder: 'acc_id1,acc_id2',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduledAt',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Is Draft',
				name: 'isDraft',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Processing Enabled',
				name: 'processingEnabled',
				type: 'boolean',
				default: true,
			},
		],
	},

	// ------ Schedule ------
	{
		displayName: 'Scheduled At',
		name: 'scheduledAt',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'ISO 8601 datetime to schedule the post',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['schedule'],
			},
		},
	},

	// ------ Get Many ------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['getAll'],
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
				resource: ['post'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Scheduled', value: 'scheduled' },
					{ name: 'Processing', value: 'processing' },
					{ name: 'Posted', value: 'posted' },
					{ name: 'Partially Posted', value: 'partially_posted' },
					{ name: 'Failed', value: 'failed' },
				],
				default: '',
			},
			{
				displayName: 'Is Draft',
				name: 'isDraft',
				type: 'boolean',
				default: false,
			},
		],
	},

	// ------ Calendar ------
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Start date (YYYY-MM-DD)',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['getCalendar'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'End date (YYYY-MM-DD)',
		displayOptions: {
			show: {
				resource: ['post'],
				operation: ['getCalendar'],
			},
		},
	},
];
