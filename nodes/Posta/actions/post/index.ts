import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { postaApiRequest, postaApiRequestAllItems } from '../../GenericFunctions';

function splitComma(value: string): string[] {
	return value
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

function buildPlatformConfigs(context: IExecuteFunctions, i: number): IDataObject | undefined {
	const raw = context.getNodeParameter('platformConfigurations', i, {}) as IDataObject;
	if (!raw || Object.keys(raw).length === 0) return undefined;

	const configs: IDataObject = {};

	if (raw.tiktok) {
		const tk = (raw.tiktok as IDataObject[])[0] || (raw.tiktok as IDataObject);
		configs.tiktok = tk;
	}
	if (raw.pinterest) {
		const p = (raw.pinterest as IDataObject[])[0] || (raw.pinterest as IDataObject);
		const out: IDataObject = {};
		if (p.boardId) out.board_id = p.boardId;
		if (p.link) out.link = p.link;
		if (p.altText) out.alt_text = p.altText;
		configs.pinterest = out;
	}
	if (raw.youtube) {
		const yt = (raw.youtube as IDataObject[])[0] || (raw.youtube as IDataObject);
		if (typeof yt.tags === 'string' && yt.tags) {
			yt.tags = splitComma(yt.tags as string);
		}
		configs.youtube = yt;
	}
	if (raw.instagram) {
		const ig = (raw.instagram as IDataObject[])[0] || (raw.instagram as IDataObject);
		configs.instagram = ig;
	}
	if (raw.facebook) {
		const fb = (raw.facebook as IDataObject[])[0] || (raw.facebook as IDataObject);
		configs.facebook = fb;
	}
	if (raw.twitter) {
		const tw = (raw.twitter as IDataObject[])[0] || (raw.twitter as IDataObject);
		if (typeof tw.altText === 'string' && tw.altText) {
			tw.altText = splitComma(tw.altText as string);
		}
		configs.twitter = tw;
	}
	if (raw.linkedin) {
		const li = (raw.linkedin as IDataObject[])[0] || (raw.linkedin as IDataObject);
		configs.linkedin = li;
	}
	if (raw.bluesky) {
		const bs = (raw.bluesky as IDataObject[])[0] || (raw.bluesky as IDataObject);
		if (typeof bs.altText === 'string' && bs.altText) {
			bs.altText = splitComma(bs.altText as string);
		}
		if (typeof bs.languages === 'string' && bs.languages) {
			bs.languages = splitComma(bs.languages as string);
		}
		if (typeof bs.labels === 'string' && bs.labels) {
			bs.labels = splitComma(bs.labels as string);
		}
		configs.bluesky = bs;
	}
	if (raw.threads) {
		const th = (raw.threads as IDataObject[])[0] || (raw.threads as IDataObject);
		configs.threads = th;
	}

	return Object.keys(configs).length > 0 ? configs : undefined;
}

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const socialAccountIds = splitComma(
			this.getNodeParameter('socialAccountIds', i) as string,
		);
		const caption = this.getNodeParameter('caption', i, '') as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

		const body: IDataObject = {
			socialAccountIds,
		};

		if (caption) body.caption = caption;
		if (additionalFields.hashtags) {
			body.hashtags = splitComma(additionalFields.hashtags as string);
		}
		if (additionalFields.mediaIds) {
			body.mediaIds = splitComma(additionalFields.mediaIds as string);
		}
		if (additionalFields.scheduledAt) body.scheduledAt = additionalFields.scheduledAt;
		if (additionalFields.isDraft !== undefined) body.isDraft = additionalFields.isDraft;
		if (additionalFields.processingEnabled !== undefined)
			body.processingEnabled = additionalFields.processingEnabled;

		const platformConfigurations = buildPlatformConfigs(this, i);
		if (platformConfigurations) body.platformConfigurations = platformConfigurations;

		responseData = await postaApiRequest.call(this, 'POST', '/posts', body);
	} else if (operation === 'update') {
		const postId = this.getNodeParameter('postId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.caption !== undefined) body.caption = updateFields.caption;
		if (updateFields.hashtags) body.hashtags = splitComma(updateFields.hashtags as string);
		if (updateFields.mediaIds) body.mediaIds = splitComma(updateFields.mediaIds as string);
		if (updateFields.socialAccountIds) {
			body.socialAccountIds = splitComma(updateFields.socialAccountIds as string);
		}
		if (updateFields.scheduledAt !== undefined) body.scheduledAt = updateFields.scheduledAt;
		if (updateFields.isDraft !== undefined) body.isDraft = updateFields.isDraft;
		if (updateFields.processingEnabled !== undefined)
			body.processingEnabled = updateFields.processingEnabled;

		const platformConfigurations = buildPlatformConfigs(this, i);
		if (platformConfigurations) body.platformConfigurations = platformConfigurations;

		responseData = await postaApiRequest.call(this, 'PATCH', `/posts/${postId}`, body);
	} else if (operation === 'delete') {
		const postId = this.getNodeParameter('postId', i) as string;
		await postaApiRequest.call(this, 'DELETE', `/posts/${postId}`);
		responseData = { success: true };
	} else if (operation === 'get') {
		const postId = this.getNodeParameter('postId', i) as string;
		responseData = await postaApiRequest.call(this, 'GET', `/posts/${postId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const qs: IDataObject = {};

		if (filters.status) qs.status = filters.status;
		if (filters.isDraft !== undefined) qs.isDraft = filters.isDraft;

		if (returnAll) {
			responseData = await postaApiRequestAllItems.call(this, 'GET', '/posts', {}, qs);
		} else {
			qs.limit = this.getNodeParameter('limit', i) as number;
			const response = (await postaApiRequest.call(this, 'GET', '/posts', {}, qs)) as IDataObject;
			responseData = (response.items as IDataObject[]) || [];
		}
	} else if (operation === 'schedule') {
		const postId = this.getNodeParameter('postId', i) as string;
		const scheduledAt = this.getNodeParameter('scheduledAt', i) as string;
		responseData = await postaApiRequest.call(this, 'POST', `/posts/${postId}/schedule`, {
			scheduledAt,
		});
	} else if (operation === 'publish') {
		const postId = this.getNodeParameter('postId', i) as string;
		responseData = await postaApiRequest.call(this, 'POST', `/posts/${postId}/publish`);
	} else if (operation === 'cancel') {
		const postId = this.getNodeParameter('postId', i) as string;
		responseData = await postaApiRequest.call(this, 'POST', `/posts/${postId}/cancel`);
	} else if (operation === 'getCalendar') {
		const startDate = this.getNodeParameter('startDate', i) as string;
		const endDate = this.getNodeParameter('endDate', i) as string;
		const start = startDate.substring(0, 10);
		const end = endDate.substring(0, 10);
		responseData = await postaApiRequest.call(this, 'GET', '/posts/calendar', {}, { start, end });
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const items = Array.isArray(responseData) ? responseData : [responseData];
	return items.map((item) => ({ json: item }));
}
