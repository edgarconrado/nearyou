// Agrega la clave common.continue a los doce archivos de traducción.
// Ejecutar desde la raíz del proyecto:  node agregar-continue.mjs

import fs from 'node:fs';
import path from 'node:path';

const TRADUCCIONES = {
  es: 'Continuar', en: 'Continue', pt: 'Continuar', fr: 'Continuer',
  it: 'Continua',  de: 'Weiter',   ru: 'Продолжить', ja: '続ける',
  ko: '계속',      zh: '继续',      ar: 'متابعة',     hi: 'जारी रखें',
};

const BASE = path.join('src', 'translations');

if (!fs.existsSync(BASE)) {
  console.error(`No encontré ${BASE}. Ejecuta el script desde la raíz del proyecto.`);
  process.exit(1);
}

for (const archivo of fs.readdirSync(BASE).filter((f) => f.endsWith('.json')).sort()) {
  const lang = path.basename(archivo, '.json');
  const texto = TRADUCCIONES[lang];

  if (!texto) {
    console.log(`  ${lang}: saltado (idioma desconocido)`);
    continue;
  }

  const ruta = path.join(BASE, archivo);
  const data = JSON.parse(fs.readFileSync(ruta, 'utf8'));

  data.common = data.common ?? {};

  if (data.common.continue) {
    console.log(`  ${lang}: ya existe`);
    continue;
  }

  // Reconstruir 'common' insertando la clave después de 'confirm',
  // para que quede junto a las demás acciones.
  const nuevo = {};
  for (const [k, v] of Object.entries(data.common)) {
    nuevo[k] = v;
    if (k === 'confirm') nuevo.continue = texto;
  }
  if (!nuevo.continue) nuevo.continue = texto;

  data.common = nuevo;

  fs.writeFileSync(ruta, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`  ${lang}: agregado "${texto}"`);
}

console.log('Listo.');
