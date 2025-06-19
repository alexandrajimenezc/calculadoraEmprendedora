
export default {
  basePath: '/calculadoraEmprendedora',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
