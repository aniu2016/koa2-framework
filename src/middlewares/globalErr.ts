import { NextFunction } from 'express';
import { Context } from 'koa';
import RestfulApi, { OTHER_ERR } from '../utils/restfulApi';
export default async function safe (ctx: Context, next: NextFunction): Promise<any> {
  try {
    return await next();
  }
  catch (err) {
    console.log('[error]: ', err.message) ;
    ctx.body = RestfulApi(OTHER_ERR, err.message);
  }
}