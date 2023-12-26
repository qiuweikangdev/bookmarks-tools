import pkg from '../package.json';

const manifest: Partial<chrome.runtime.ManifestV3> = {
  action: {
    default_icon: {
      16: 'icons/16.png',
      19: 'icons/19.png',
      32: 'icons/32.png',
      38: 'icons/38.png',
    },
    default_popup: 'src/entries/popup/index.html',
  },
  host_permissions: ['*://*/*'],
  icons: {
    16: 'icons/16.png',
    19: 'icons/19.png',
    32: 'icons/32.png',
    38: 'icons/38.png',
    48: 'icons/48.png',
    64: 'icons/64.png',
    96: 'icons/96.png',
    128: 'icons/128.png',
    256: 'icons/256.png',
    512: 'icons/512.png',
  },
};

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
    manifest_version: 3,
    ...manifest,
  };
}
