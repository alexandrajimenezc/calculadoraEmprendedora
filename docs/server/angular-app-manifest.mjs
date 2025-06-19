
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/calculadoraEmprendedora/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/calculadoraEmprendedora/calcular",
    "route": "/calculadoraEmprendedora"
  },
  {
    "renderMode": 2,
    "route": "/calculadoraEmprendedora/calcular"
  },
  {
    "renderMode": 2,
    "route": "/calculadoraEmprendedora/calculadora"
  },
  {
    "renderMode": 2,
    "route": "/calculadoraEmprendedora/historial"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23517, hash: 'b4240786d712cee9f565795eac3fb7ec14de83765fa52ffbf22f6287a724a880', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17172, hash: 'ffaea139e2d1fc4c39084f51bc1d4c30eb04b8aac68a593b9d720cfc8c3a7f1b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'calcular/index.html': {size: 115524, hash: '399321b38e9c2122e176ec9bd08ff55b8ca83d4f51fa3eea5080d34db21faf70', text: () => import('./assets-chunks/calcular_index_html.mjs').then(m => m.default)},
    'historial/index.html': {size: 24076, hash: '982eed84ad374848f6276a18f532a89d5f2083e7155e555c48c446d72d8f156c', text: () => import('./assets-chunks/historial_index_html.mjs').then(m => m.default)},
    'calculadora/index.html': {size: 87764, hash: 'fd4654ae3dd49e735c47d5273a63acad8cfb0562a6e0bb919cf9d9a2d40e804e', text: () => import('./assets-chunks/calculadora_index_html.mjs').then(m => m.default)},
    'styles-JANUE7XI.css': {size: 6898, hash: 'u+HzxV8kX2Q', text: () => import('./assets-chunks/styles-JANUE7XI_css.mjs').then(m => m.default)}
  },
};
