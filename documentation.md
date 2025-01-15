## New Learnings
- Installing the "vite" package is required to run the "vite" command in bin/dev
- bin/dev relies on the Procfile.dev to invoke "vite dev", which needs Vite installed
- "vite-plugin-ruby" is required when using RubyPlugin() in vite.config.mts
- Yarn should install both "vite" and "vite-plugin-ruby" in devDependencies
