const requireFromString = require('require-from-string');
const path = require('path');
const clientModuleMap = new Map();
const compiler = require('webpack')(require(process.cwd() + '/webpack.server.conf.js'));

export default (app, file) => {
  app.use(require('webpack-dev-middleware')(compiler, { noInfo: true, publicPath: '/static' }));
  let module = clientModuleMap.get(file);
  if (!module) {
    const filename = path.join(compiler.outputPath, file);
    const content = compiler.outputFileSystem.readFileSync(filename, 'utf8');
    module = requireFromString(content, filename);
    clientModuleMap.set(file, module);
    compiler.watch({}, () => clientModuleMap.delete(file));
  }
  if (module.default) module = module.default;
  return module;
};
