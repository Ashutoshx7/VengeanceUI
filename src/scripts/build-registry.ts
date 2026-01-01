
import fs from 'fs';
import path from 'path';

const COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components', 'ui');
const REGISTRY_DIR = path.join(process.cwd(), 'public', 'r');

// Ensure registry directory exists
if (!fs.existsSync(REGISTRY_DIR)) {
    fs.mkdirSync(REGISTRY_DIR, { recursive: true });
}

// Map of common imports to packages
const DEPENDENCY_MAP: Record<string, string> = {
    'framer-motion': 'framer-motion',
    'clsx': 'clsx',
    'tailwind-merge': 'tailwind-merge',
    'lucide-react': 'lucide-react',
    'cva': 'class-variance-authority',
    'cmdk': 'cmdk',
    'date-fns': 'date-fns',
    'react-day-picker': 'react-day-picker',
    'embla-carousel-react': 'embla-carousel-react',
    'input-otp': 'input-otp',
    'next-themes': 'next-themes',
    'sonner': 'sonner',
    'vaul': 'vaul',
    'zod': 'zod',
    'react-hook-form': 'react-hook-form',
    '@hookform/resolvers': '@hookform/resolvers',
    '@radix-ui/react-accordion': '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog': '@radix-ui/react-alert-dialog',
    '@radix-ui/react-aspect-ratio': '@radix-ui/react-aspect-ratio',
    '@radix-ui/react-avatar': '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox': '@radix-ui/react-checkbox',
    '@radix-ui/react-collapsible': '@radix-ui/react-collapsible',
    '@radix-ui/react-context-menu': '@radix-ui/react-context-menu',
    '@radix-ui/react-dialog': '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu': '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-hover-card': '@radix-ui/react-hover-card',
    '@radix-ui/react-label': '@radix-ui/react-label',
    '@radix-ui/react-menubar': '@radix-ui/react-menubar',
    '@radix-ui/react-navigation-menu': '@radix-ui/react-navigation-menu',
    '@radix-ui/react-popover': '@radix-ui/react-popover',
    '@radix-ui/react-progress': '@radix-ui/react-progress',
    '@radix-ui/react-radio-group': '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area': '@radix-ui/react-scroll-area',
    '@radix-ui/react-select': '@radix-ui/react-select',
    '@radix-ui/react-separator': '@radix-ui/react-separator',
    '@radix-ui/react-slider': '@radix-ui/react-slider',
    '@radix-ui/react-slot': '@radix-ui/react-slot',
    '@radix-ui/react-switch': '@radix-ui/react-switch',
    '@radix-ui/react-tabs': '@radix-ui/react-tabs',
    '@radix-ui/react-toast': '@radix-ui/react-toast',
    '@radix-ui/react-toggle': '@radix-ui/react-toggle',
    '@radix-ui/react-toggle-group': '@radix-ui/react-toggle-group',
    '@radix-ui/react-tooltip': '@radix-ui/react-tooltip',
};

function getDependencies(content: string): string[] {
    const dependencies = new Set<string>();

    Object.keys(DEPENDENCY_MAP).forEach((key) => {
        if (content.includes(`from "${key}"`) || content.includes(`from '${key}'`)) {
            dependencies.add(DEPENDENCY_MAP[key]);
        }
    });

    return Array.from(dependencies);
}

function processComponent(filename: string) {
    const filePath = path.join(COMPONENTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const name = path.basename(filename, '.tsx');

    const dependencies = getDependencies(content);

    const registryItem = {
        "$schema": "https://ui.shadcn.com/schema/registry-item.json",
        "name": name,
        "type": "registry:ui",
        "dependencies": dependencies,
        "files": [
            {
                "path": `components/ui/${filename}`,
                "content": content,
                "type": "registry:ui",
                "target": `components/ui/${filename}`
            }
        ]
    };

    const outputPath = path.join(REGISTRY_DIR, `${name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(registryItem, null, 2));
    console.log(`Generated registry for: ${name}`);
}

async function main() {
    try {
        const files = fs.readdirSync(COMPONENTS_DIR).filter(file => file.endsWith('.tsx'));

        console.log(`Found ${files.length} components.`);

        const registryIndex = files.map(file => {
            const name = path.basename(file, '.tsx');
            return {
                name,
                dependencies: getDependencies(fs.readFileSync(path.join(COMPONENTS_DIR, file), 'utf-8')),
                type: "registry:ui",
                files: [`public/r/${name}.json`] // Point to the individual json definition
            };
        });

        fs.writeFileSync(path.join(REGISTRY_DIR, 'registry.json'), JSON.stringify(registryIndex, null, 2));
        fs.writeFileSync(path.join(REGISTRY_DIR, 'index.json'), JSON.stringify(registryIndex, null, 2));
        console.log('Generated registry.json and index.json.');

        files.forEach(file => {
            processComponent(file);
        });

        console.log('Registry generation complete!');
    } catch (error) {
        console.error('Error generating registry:', error);
    }
}

main();
