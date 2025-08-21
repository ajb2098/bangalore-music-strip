import adapter from '@sveltejs/adapter-auto'
// import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			'$actions/*': 'src/actions/*',
			'$assets/*': 'src/lib/assets/*',
			'$comps/*': 'src/lib/components/*',
			'$dev/*': 'src/dev/*',
			'$enhance/*': 'src/lib/enhancements/*',
			'$routes/*': 'src/routes/*',
			'$server/*': 'src/lib/server/*',
			'$utils/*': 'src/lib/utils/*'
		}
	},

	vitePlugin: {
		inspector: true
	}
}

export default config
