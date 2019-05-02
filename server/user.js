const express = require('express')
const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')
const utils = require('utility')
// 过滤没有密码的
const _filter = {'pwd':0,'__v':0}

// 获取所有用户信息 ： http://localhost:5238/user/list
Router.get('/list', function (req, res) {
    // 清楚所有的用户数据
    //User.remove({},function(e,d){})
    const { type } = req.query
    User.find({type}, function (err, doc) {
        return res.json({code: 0,data:doc})
    })
})

Router.get('/clear', function (req, res) {
    // 清楚所有的用户数据
    User.remove({},function(e,d){})
})


Router.post('/readmsg', function (req, res) {
     const userid = req.cookies.userid
     const {from} = req.body
     console.log(from)
     Chat.update(
        {from, to:userid},  // 查询条件
        {'$set':{read:true}}, // 找到满足条件的数据设置read: true
        {"multi": true}, // 查询多条设置, 否则会默认只找到第一条
        function(err,doc){
            // 修改的结果
            console.log(doc)
            if (!err) {
                return res.json({code: 0, num: doc.nModified})
            }
            return res.json({code: 1, msg:"修改失败"})
        })
})
Router.get('/getmsglist', function(req, res) { 
    const user = req.cookies.userid
    User.find({}, function (e, userdoc) {
        let users = {}
        userdoc.forEach(v=>{
            users[v._id] = {
                name: v.user,
                avatar: v.avatar
            }
        })
         // $or: mongodb查询条件， 数组构成
        Chat.find({'$or': [{from:user}, {to:user}]} ,function(err, doc) {
            if (!err) {
                return res.json({code:0, msgs: doc, users: users})
            }
        })
    })
})

Router.post('/register', function (req, res) {
    const {user, pwd, type} = req.body
    User.findOne({user:user}, function (err, doc) {
        if (doc) {
            return res.json({code:1, msg: '用户名重复'})
        }
        const userModel = new User({user,type,pwd:md5Pwd(pwd)})
		userModel.save(function(e,d){
			if (e) {
				return res.json({code:1,msg:'后端出错了'})
			}
			const {user, type, _id} = d
			res.cookie('userid', _id)
			return res.json({code:0,data:{user, type, _id}})
		})
    })
})

Router.get('/info', function (req, res) {
    // 读取cookies
    const {userid} = req.cookies
    // 没有cookies则放回code 1
    if (!userid) {
        return res.json({code:1})
    }
    User.findOne({_id:userid}, _filter, function (err, doc) {
        if (err) {
            return res.json({code: 1, msg: '后端出错了'})
        }
        if (doc) {
            return res.json({code:0, data:doc})
        }
    })
})

Router.post('/update', function(req, res){
    const userid = req.cookies.userid
    if (!userid) {
        return json.dumps({code:1})
    }
    const body = req.body
    User.findByIdAndUpdate(userid,body,function (err,doc) {
        const data = Object.assign({}, {
            user: doc.user,
            type: doc.type,
        }, body)
        return res.json({code:0,data})
    })
})

Router.post('/login', function(req, res) {
    const {user, pwd} = req.body
    User.findOne({user, pwd: md5Pwd(pwd)}, function (err,doc){
        if (!doc) {
            return res.json({code:1, msg: '用户名或者密码错误'})
        }
        // 保存cookies
        res.cookie('userid', doc._id)
        return res.json({code:0,data:doc})
    })
})

function md5Pwd(pwd) {
    const salt = 'jason_is_boss_595724205@qq'
    return utils.md5(utils.md5(salt + pwd))
}

module.exports = Router