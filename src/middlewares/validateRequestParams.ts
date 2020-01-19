import { NextFunction } from 'express';
import { Context } from 'koa';
import RestfulApi, { OTHER_ERR } from '../utils/restfulApi';
export default async function validateRequestParams (ctx: Context, next: NextFunction): Promise<any> {
  if (!ctx.request.query.appId) {
    ctx.body = RestfulApi(OTHER_ERR, {}, '缺少参数Appid');
    // return RestfulApi(OTHER_ERR, {}, '缺少参数Appid');
  }
  else {
    return await next();
  }
}