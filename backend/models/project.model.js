import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:[true, 'project name must be unique'],
        lowercase:true,
        trim:true,
    },
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ],
    messages:[
        {
            message: { type: String },
            sender: { type: Object }
        }
    ]
})


const project = mongoose.model('project',projectSchema)

export default project