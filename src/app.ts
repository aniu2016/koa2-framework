import * as Koa from 'koa';
import * as Router from 'koa-router';
import { MiddleWare } from './decorator/RouterDecrator';
import * as path from 'path';
import * as glob from 'glob';
import * as bodyParser from 'koa-bodyparser';
import * as mongoose from 'mongoose';
import dbConfig from './config/mongo';
import globalErr from './middlewares/globalErr';

export default class Application {
  private app: any;
  private globalRouter: any;

  constructor() {
    this.app = new Koa();
    this.globalRouter = new Router();

    this.app.use(bodyParser());
    this.app.use(globalErr);
    // 优化 这里加一个全局的错误处理
    this.loadControllers(path.join(__dirname, './controllers'));
    this.app.use(this.globalRouter.routes());
    this.connectMongoDB();
  }
  // 递归加载controller目录下的ts文件
  private loadControllers(filePath: string): void {
    const files: string[] = glob.sync(`${filePath}/**/*.js`);
    files.forEach(file => {
      const controller = require(file);
      this.registerRouters(controller);
    });
  }

  // 注册路由
  private registerRouters(controller: any): void {
    if (!controller) {
      return;
    }

    const proto = controller.prototype;
    // 全局加一个/api的前缀
    const prefix = '/api' + proto.path;
    const middleWares: MiddleWare[] = proto.middleWares;

    const properties = Object.getOwnPropertyNames(proto);

    properties.forEach(property => {
      if (proto[property] && proto[property].subPath) {
        const fullPath = (prefix + proto[property].subPath).replace(
          /\/{2,}/g,
          '/'
        );
        const method: string = proto[property].requestMethod;

        // 累加中间件
        let fullMiddleWares: MiddleWare[] = [];
        if (middleWares) {
          fullMiddleWares = fullMiddleWares.concat(middleWares);
        }
        if (proto[property].middleWares) {
          fullMiddleWares = fullMiddleWares.concat(proto[property].middleWares);
        }

        const router = new Router();
        const asyncMethod = async (context: any) => {
          const paramList = proto[property].paramList;
          const args: any = [];
          if (paramList) {
            // 参数绑定
            const paramKeys = Object.getOwnPropertyNames(paramList);
            paramKeys.forEach(paramName => {
              const index = paramList[paramName];
              args[index] = paramName in context.request.body ? context.request.body[paramName] :  context.params[paramName] || context.query[paramName];
            });
          }
          args.push(context);
          context.body = await proto[property].apply(proto, args);
        };

        // 添加中间件
        router[method](fullPath, ...fullMiddleWares, asyncMethod);
        this.globalRouter.use(router.routes());
        this.globalRouter.use(router.allowedMethods());
      }
    });
  }

  // 连接mongodb
  private connectMongoDB () {
    const  {url, ...config} = dbConfig;
    if (!url) {
      return false;
    }
    mongoose.set('debug', true);
    mongoose.connect(url, config);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, '连接错误:'));
    db.once('open', () => {
      console.log('mongodb connect suucess');
    });
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log('linster http://localhost:3000');
    });
  }
}
