import mongoose from "mongoose";
import { Password } from "../utils/password";

// Interface that describes the properties that are needed to create a new User.
interface UserAttrs {
    email: string;
    password: string;
}

// Represents on single record from the database
interface UserDoc extends mongoose.Document {
    email: string,
    password: string
}

// Represents the entire collection of data
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
            },
            versionKey: false
        }
});

userSchema.pre('save', async function(done) {
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));

        this.set('password', hashed);
    }

    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User }