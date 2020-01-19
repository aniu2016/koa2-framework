import {
  Controller,
  RequestMapping,
  RequestParam
} from '../decorator/RouterDecrator';
import BlogModel from '../models/blog';
import RestfulApi, { SUCCESS } from '../utils/restfulApi';

@Controller('/blog')
class BlogController {
  @RequestMapping({ path: '/get/list', method: 'get' })
  public async getBlogList(
    @RequestParam('appId') appid: String,
    @RequestParam('pageSize') pageSize: Number,
    @RequestParam('pageIndex') pageIndex: Number
  ) {
    const pagination = {
      limit: Number(pageSize) || 10,
      page: Number(pageIndex) || 1,
      sort: '-createtime'
    };
    const result = await BlogModel.paginate({ appid }, pagination);
    return RestfulApi(SUCCESS, {
      list: result.docs,
      total: result.totalDocs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage
    });
  }
}

module.exports = BlogController;
