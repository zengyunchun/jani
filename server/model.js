
// 启动mongodb： 进入安装mongodb的data的目录, 比如本机的
// c:/data/db mongod
// D:
// cd D:\MongoDB\data\db
// mongod
const mongoose = require('mongoose')

const DB_URL = 'mongodb://localhost:27017/imooc-chat'

//
mongoose.connect(DB_URL,{ useMongoClient: true })


const models = {
    user: {
        'user':{type:String, require},
        'pwd':{type:String, require},
        'type':{type:String, require},
        // 头像
        'avatar':{type:String},
        // 个人简介或者职位简介
        'desc':{type:String},
        //  职位名
        'title': {type: String},
        'company': {type: String},
        'salary': {type: String},
    },
    chat: {
        'chatid': {type:String, require:true},
        'read': {type:Boolean, default:false },
        'from':{type:String, require:true},
        'to':{type:String, require:true},
        'content': {type:String, require:true, default: ''},
        'create_time': {type:Number, default: new Date().getTime()}
    }
}


for(let m in models) {
    mongoose.model(m, new mongoose.Schema(models[m]))
}


module.exports = {
    getModel: function (name) {
     return mongoose.model(name)
    }
}

