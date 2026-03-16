import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { postaApiRequest, postaApiRequestAllItems } from '../../GenericFunctions';

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'upload') {
		// 3-step programmatic upload
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
		const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
		const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

		const fileName = binaryData.fileName || 'upload';
		const mimeType = binaryData.mimeType || 'application/octet-stream';
		const sizeBytes = buffer.length;

		// Step 1: Create upload URL
		const createResponse = (await postaApiRequest.call(this, 'POST', '/media/create-upload-url', {
			name: fileName,
			mime_type: mimeType,
			size_bytes: sizeBytes,
		})) as IDataObject;

		const mediaId = createResponse.media_id as string;
		const uploadUrl = createResponse.upload_url as string;

		if (!mediaId || !uploadUrl) {
			throw new NodeOperationError(this.getNode(), 'Failed to create upload URL');
		}

		// Step 2: PUT binary to signed URL (no Posta auth header)
		try {
			await this.helpers.httpRequest({
				method: 'PUT',
				url: uploadUrl,
				body: buffer,
				headers: {
					'Content-Type': mimeType,
				},
				json: false,
				encoding: 'arraybuffer',
			});
		} catch (uploadError) {
			// Cleanup: try to delete the media record
			try {
				await postaApiRequest.call(this, 'DELETE', `/media/${mediaId}`);
			} catch {
				// ignore cleanup errors
			}
			throw new NodeOperationError(
				this.getNode(),
				`Upload to storage failed: ${(uploadError as Error).message}`,
			);
		}

		// Step 3: Confirm upload
		try {
			responseData = (await postaApiRequest.call(
				this,
				'POST',
				`/media/${mediaId}/confirm-upload`,
			)) as IDataObject;
		} catch (confirmError) {
			try {
				await postaApiRequest.call(this, 'DELETE', `/media/${mediaId}`);
			} catch {
				// ignore cleanup errors
			}
			throw new NodeOperationError(
				this.getNode(),
				`Upload confirmation failed: ${(confirmError as Error).message}`,
			);
		}
	} else if (operation === 'get') {
		const mediaId = this.getNodeParameter('mediaId', i) as string;
		responseData = await postaApiRequest.call(this, 'GET', `/media/${mediaId}`);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const qs: IDataObject = {};

		if (filters.type) qs.type = filters.type;
		if (filters.status) qs.status = filters.status;

		if (returnAll) {
			responseData = await postaApiRequestAllItems.call(this, 'GET', '/media', {}, qs);
		} else {
			qs.limit = this.getNodeParameter('limit', i) as number;
			const response = (await postaApiRequest.call(this, 'GET', '/media', {}, qs)) as IDataObject;
			responseData = (response.items as IDataObject[]) || [];
		}
	} else if (operation === 'delete') {
		const mediaId = this.getNodeParameter('mediaId', i) as string;
		await postaApiRequest.call(this, 'DELETE', `/media/${mediaId}`);
		responseData = { success: true };
	} else if (operation === 'generateCarouselPdf') {
		const mediaIdsStr = this.getNodeParameter('mediaIds', i) as string;
		const title = this.getNodeParameter('title', i, '') as string;
		const mediaIds = mediaIdsStr
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		const body: IDataObject = { media_ids: mediaIds };
		if (title) body.title = title;

		responseData = await postaApiRequest.call(this, 'POST', '/media/generate-carousel-pdf', body);
	} else {
		throw new Error(`Unknown operation: ${operation}`);
	}

	const items = Array.isArray(responseData) ? responseData : [responseData];
	return items.map((item) => ({ json: item }));
}
