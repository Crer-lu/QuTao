#QuTao----我的淘宝   
###项目简介   
1. 项目任务
设计一个具有实用性和适用场景的原创性B/S应用。项目要求区块链层必须采用Fabric，所提交B/S应用应该开发完毕、功能完整、界面美观、有一定的实用价值，能够在浏览器上正常预览。
2. 项目设计
本小组通过区块链不可篡改、去中心化的特点，设计了QuTao项目，其中“Qu”代指区块链，“Tao”代指淘宝。该项目可以在没有平台管理的情况下，让每个人都可以自由上架货物、购买物品。
###技术开发方案
1. 区块链层
    1. 数据类型
       - 定义`user`结构体，包含用户基本信息
       - 定义`product`结构体，包含商品基本信息
       - 定义`UpdateUserRequest`结构体
       - 定义`QueryUserResult`结构体
       - 定义`QueryProductResult`结构体
    2. API
       - `CreateUser`，添加一个新用户
       - `QueryUser`，查询一个用户的信息
       - `QueryAllUsers`，查询所有用户
       - `CreateProduct`，添加一个新商品
       - `QueryProduct`，查询一个商品的信息
       - `QueryAllProducts`，查询所有商品
       - `BuyProduct`，购买一件商品若干次(不允许购买自己的商品，区块链层已设置)
       - `UpdateUser`，更新用户信息
       - `UpdateProduct`，更新商品信息
2. 后端
3. 前端
###团队组成与分工   
许若一：后端
卢峰杰：区块链层
邓铭辉：前端
陶天骋
###最终成果   
###后期改进思路   