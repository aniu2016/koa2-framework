import { Document, model, Model, Schema } from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

interface BlogDocument extends Document {
  appid: String;
  filepath: String;
  images: [String];
  title: String;
  desc: String;
  createtime: Date;
}
// 简写..
interface BlogModel extends Model<BlogDocument> {
  paginate: (
    query: Object,
    pagination: {
      limit: Number;
      page: Number;
      sort?: String;
    }
  ) => Promise<any>;
}

const BlogScheme: Schema = new Schema({
  appid: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
    ref: 'User'
  },
  filepath: { type: String, required: true },
  images: { type: Array },
  title: { type: String, default: 0 },
  desc: { required: true, type: String },
  createtime: { type: Date, index: true, default: Date.now }
});

BlogScheme.plugin(mongoosePaginate);

const Blog: BlogModel = model<BlogDocument, BlogModel>('Blog', BlogScheme);

export default Blog;
