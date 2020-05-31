const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  links: [{ type: Types.ObjectId, ref: 'Link' }]
})

module.exports = model('User', schema)


// https://know-thy-code.com/mongoose-schemas-models-typescript/

// import { Schema, model, Document, Model } from 'mongoose';

// declare interface IContact extends Document{
//     name: string;
//     email: string;
//     phone?: string;
//     message?: string;
//     course_enquiry?: string;
//     creation_date: Date;
// }

// export interface ContactModel extends Model<IContact> {};

// export class Contact {

//     private _model: Model<IContact>;

//     constructor() {
//         const schema =  new Schema({
//             name: { type: String, required: true },
//             email: { type: String, required: true },
//             phone: { type: String },
//             message: { type: String },
//             course_enquiry: { type: String },
//             creation_date: { type: Date, default: Date.now }
//         });

//         this._model = model<IContact>('User', schema);
//     }

//     public get model(): Model<IContact> {
//         return this._model
//     }
// }
