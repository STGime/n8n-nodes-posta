import type { INodeProperties } from 'n8n-workflow';

export const mediaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['media'],
			},
		},
		options: [
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload a media file (3-step signed URL flow)',
				action: 'Upload media',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a media item by ID',
				action: 'Get media',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many media items',
				action: 'Get many media items',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a media item',
				action: 'Delete media',
			},
			{
				name: 'Generate Carousel PDF',
				value: 'generateCarouselPdf',
				description: 'Generate a PDF carousel from multiple images',
				action: 'Generate carousel PDF',
			},
		],
		default: 'upload',
	},
];

export const mediaFields: INodeProperties[] = [
	// ------ Upload ------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'Name of the binary property containing the file to upload',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['upload'],
			},
		},
	},

	// ------ Get / Delete ------
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['get', 'delete'],
			},
		},
	},

	// ------ Get Many ------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['media'],
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
				resource: ['media'],
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
				resource: ['media'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Image', value: 'image' },
					{ name: 'Video', value: 'video' },
				],
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'pending' },
					{ name: 'Processing', value: 'processing' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Failed', value: 'failed' },
				],
				default: '',
			},
		],
	},

	// ------ Generate Carousel PDF ------
	{
		displayName: 'Media IDs',
		name: 'mediaIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'media_id1,media_id2',
		description: 'Comma-separated media IDs of images to include in the carousel',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['generateCarouselPdf'],
			},
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['generateCarouselPdf'],
			},
		},
	},
];
