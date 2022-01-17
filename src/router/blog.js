const { 
    getList, 
    getDetail, 
    newBlog,
    updateBlog,
    deleteBlog
} = require("../controller/blog")
const { SuccessModel, ErrorModel } = require("../model/resModel")

//统一的登录验证函数
const loginCheck = (req) => {
    if(!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
    
}

const handleBlogRouter = (req, res) => {
    //博客的路由处理 查询 详情 新建 更新 删除
    let logionStatus = loginCheck(req)
    if(req.method === "GET" && req.path === "/api/blog/list") {
        const { author, keyword } = req.query || {}
        const sqlData = getList(author || "", keyword === 'null'?null:keyword || "")
        return sqlData.then(responseData => {
            return new SuccessModel(responseData)
        })
        // new ErrorModel(null,responseData)
    }

    if(req.method === "GET" && req.path === "/api/blog/detail") {
        if(logionStatus) {
            //未登录
            return logionStatus
        }
        const { id } = req.query || {}
        const sqlData = getDetail(id || null)
        return sqlData.then(responseData => {
            if(responseData[0]) {
                return new SuccessModel(idresponseData[0])//select返回的数据都是数组类型
            }else {
                return new ErrorModel(null)
            }
        })
    }

    if(req.method === "POST" && req.path === "/api/blog/new") {
        if(logionStatus) {
            //未登录
            return logionStatus
        }
        req.body.author = req.session.username
        const sqlData = newBlog(req.body)
        return sqlData.then(responseData => {
            if(responseData) {
                return new SuccessModel({id: responseData.insertId})//返回新建的数据id
            }else {
                return new ErrorModel(null)
            }
        })
    }

    if(req.method === "POST" && req.path === "/api/blog/update") {
        if(logionStatus) {
            //未登录
            return logionStatus
        }
        req.body.author = res.session.username
        const sqlData = updateBlog(req.body)
        return sqlData.then(updateData => {
            if(updateData.affectedRows > 0) {//mysql返回的上次操作受影响数
                return new SuccessModel()
            }else {
                return new ErrorModel(null)
            }
        })
    }

    if(req.method === "POST" && req.path === "/api/blog/delete") {
        if(logionStatus) {
            //未登录
            return logionStatus
        }
        req.body.author = req.session.username
        const sqlData = deleteBlog(req.body)
        return sqlData.then(updateData => {
            if(updateData.affectedRows > 0) {//mysql返回的上次操作受影响数
                return new SuccessModel()
            }else {
                return new ErrorModel(null)
            }
        })
    }
}

module.exports = handleBlogRouter