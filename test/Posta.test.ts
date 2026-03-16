import { Posta } from '../nodes/Posta/Posta.node';

describe('Posta Node', () => {
	it('should have correct description', () => {
		const node = new Posta();
		expect(node.description.displayName).toBe('Posta');
		expect(node.description.name).toBe('posta');
	});

	it('should define all 7 resources', () => {
		const node = new Posta();
		const resourceProp = node.description.properties.find((p) => p.name === 'resource');
		expect(resourceProp).toBeDefined();
		const options = (resourceProp as any).options;
		expect(options).toHaveLength(7);
		const values = options.map((o: any) => o.value);
		expect(values).toContain('post');
		expect(values).toContain('media');
		expect(values).toContain('socialAccount');
		expect(values).toContain('analytics');
		expect(values).toContain('platform');
		expect(values).toContain('user');
		expect(values).toContain('webhook');
	});

	it('should require postaApi credentials for auth resources', () => {
		const node = new Posta();
		expect(node.description.credentials).toBeDefined();
		expect(node.description.credentials![0].name).toBe('postaApi');
	});

	it('should have loadOptions methods', () => {
		const node = new Posta();
		expect(node.methods?.loadOptions?.getSocialAccounts).toBeDefined();
		expect(node.methods?.loadOptions?.getPinterestBoards).toBeDefined();
		expect(node.methods?.loadOptions?.getTikTokCreatorInfo).toBeDefined();
	});

	describe('Post operations', () => {
		it('should define 9 post operations', () => {
			const node = new Posta();
			const opProp = node.description.properties.find(
				(p) => p.name === 'operation' && (p.displayOptions as any)?.show?.resource?.[0] === 'post',
			);
			expect(opProp).toBeDefined();
			expect((opProp as any).options).toHaveLength(9);
		});
	});

	describe('Media operations', () => {
		it('should define 5 media operations', () => {
			const node = new Posta();
			const opProp = node.description.properties.find(
				(p) => p.name === 'operation' && (p.displayOptions as any)?.show?.resource?.[0] === 'media',
			);
			expect(opProp).toBeDefined();
			expect((opProp as any).options).toHaveLength(5);
		});
	});

	describe('Analytics operations', () => {
		it('should define 14 analytics operations', () => {
			const node = new Posta();
			const opProp = node.description.properties.find(
				(p) =>
					p.name === 'operation' &&
					(p.displayOptions as any)?.show?.resource?.[0] === 'analytics',
			);
			expect(opProp).toBeDefined();
			expect((opProp as any).options).toHaveLength(14);
		});
	});
});
