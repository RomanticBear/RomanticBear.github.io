import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import license from 'rollup-plugin-license';
import path from 'path';

const SRC_DEFAULT = '_javascript';
const DIST_DEFAULT = 'assets/js/dist';
const isProd = process.env.NODE_ENV === 'production';

function build(filename, opts) {
  let src = SRC_DEFAULT;
  let dist = DIST_DEFAULT;

  if (typeof opts !== 'undefined') {
    src = opts.src || src;
    dist = opts.dist || dist;
  }

  return {
    input: [`${src}/${filename}.js`],
    output: {
      file: `${dist}/${filename}.min.js`,
      format: 'iife',
      name: 'Chirpy',
      sourcemap: !isProd
    },
    watch: {
      include: `${src}/**`
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/env'],
        plugins: ['@babel/plugin-proposal-class-properties']
      }),
      license({
        banner: {
          commentStyle: 'ignored',
          content: { file: path.join(__dirname, SRC_DEFAULT, '_copyright') }
        }
      }),
      isProd && terser()
    ]
  };
}

export default [
  build('commons'),
  build('home'),
  build('categories'),
  build('page'),
  build('post'),
  build('misc'),
  build('app', { src: `${SRC_DEFAULT}/pwa` }),
  build('sw', { src: `${SRC_DEFAULT}/pwa`, dist: '.' })
];
