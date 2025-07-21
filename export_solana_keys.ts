import * as fs from 'fs';
import * as path from 'path';

// Base58 regex for 87 or 88 characters (Solana private keys)
const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{87,88}$/;

// If __dirname is not defined (ES modules), define it:
declare const __dirname: string;
const WALLETS_DIR = typeof __dirname !== 'undefined' ? path.join(__dirname, 'Wallets') : path.join(process.cwd(), 'Wallets');
const OUTPUT_DIR = typeof __dirname !== 'undefined' ? path.join(__dirname, 'Output') : path.join(process.cwd(), 'Output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'solana_private_keys.txt');

function getTxtFiles(dir: string): string[] {
  return fs.readdirSync(dir)
    .filter(file => file.endsWith('.txt'))
    .map(file => path.join(dir, file));
}

function extractPrivateKeysFromFile(filePath: string): string[] {
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  return lines.filter(line => BASE58_REGEX.test(line.trim()));
}

function main() {
  const files = getTxtFiles(WALLETS_DIR);
  const keySet = new Set<string>();

  for (const file of files) {
    const keys = extractPrivateKeysFromFile(file);
    keys.forEach(key => keySet.add(key));
  }

  const uniqueKeys = Array.from(keySet);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(OUTPUT_FILE, uniqueKeys.join('\n'), 'utf-8');
  console.log(`Exported ${uniqueKeys.length} unique Solana private keys to ${OUTPUT_FILE}`);
}

main(); 