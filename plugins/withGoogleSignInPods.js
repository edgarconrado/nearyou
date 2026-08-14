// plugins/withGoogleSignInPods.js
// AppCheckCore (Swift, viene con GoogleSignIn) no puede compilarse como
// librería estática si sus dependencias no generan module maps.
// Este plugin las declara con :modular_headers => true en el Podfile.

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const PODS = ['GoogleUtilities', 'RecaptchaInterop', 'AppCheckCore'];

module.exports = function withGoogleSignInPods(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfile = path.join(
        cfg.modRequest.platformProjectRoot,
        'Podfile'
      );
      let contents = fs.readFileSync(podfile, 'utf8');

      const block = PODS.map(
        (p) => `  pod '${p}', :modular_headers => true`
      ).join('\n');

      if (!contents.includes("pod 'AppCheckCore', :modular_headers => true")) {
        // Insertar dentro del target principal, justo después de su apertura
        contents = contents.replace(
          /(target ['"].+?['"] do\n)/,
          `$1${block}\n`
        );
        fs.writeFileSync(podfile, contents);
      }

      return cfg;
    },
  ]);
};