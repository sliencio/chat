const mongoDb = require('mongodb');
const mongoClient = mongoDb.MongoClient;
const ObjectID = mongoDb.ObjectID;
const config = require('../config/config');

class MongoDM {
    //单例
    static getInstance() {
        if (!MongoDM.m_instance) {
            MongoDM.m_instance = new MongoDM();
        }
        return MongoDM.m_instance;
    }

    //构造函数
    constructor() {
        this.mClient = null;
        this.connectDB();
    }

    //连接数据库
    connectDB() {
        //连接数据库
        return new Promise((resolve, reject) => {
            if (this.mClient) {
                resolve(this.mClient);
            } else {
                mongoClient.connect(config.dbUrl, (err, client) => {
                    if (err) {
                        reject(err);
                        console.trace("连接数据库失败");
                        return;
                    }
                    this.mClient = client.db(config.dbName);
                    resolve(this.mClient);
                });
            }
        })
    }
    /**
     * 添加,insert方法过时，最好用insertOne 或者insertMany
     * @param collectionName 表名
     * @param json  插入的数据
     * @returns {Promise<any>}
     */
    insert(collectionName,json){
        return new Promise((resolve, reject) => {
            this.connectDB().then((dbClient) => {
                //插入多个
                if(Array.isArray(json)){
                    dbClient.collection(collectionName).insertMany(json,(err,result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
                }
                //插入一个
                else{
                    dbClient.collection(collectionName).insertOne(json,(err,result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
                }
            });
        });
    }

    /**
     * 删除
     * @param collectionName 表名
     * @param json  删除的元素
     * @param isMany    是否符合要求的都删除
     * @returns {Promise<any>}
     */
    delete(collectionName,json,isMany){
        return new Promise((resolve, reject) => {
            this.connectDB().then((dbClient) => {
                //删除多个
                if(isMany){
                    dbClient.collection(collectionName).deleteMany(json,(err,result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
                }
                //删除一个
                else{
                    dbClient.collection(collectionName).deleteOne(json,(err,result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
                }
            });
        });
    }
    /**
     * 修改更新
     * @param collection 表名
     * @param oldData   老数据
     * @param newData   新数据
     * @param isMany    是否符合要求的都更新
     * @returns {Promise<any>}
     */
    update(collectionName,oldData,newData,isMany){
        return new Promise((resolve, reject) => {
            this.connectDB().then((dbClient) => {
                var updateData = {$set:newData}
                //更新
                if(isMany){
                    dbClient.collection(collectionName).updateMany(oldData,updateData,(err,result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
                }
                //插入一个
                else{
                    dbClient.collection(collectionName).updateOne(oldData,updateData,(err,result)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(result);
                    });
                }
            });
        });
    }

    /***
     * 查询数据库
     * @param collectionName 表名
     * @param json  查询条件
     * @returns {Promise<any>}
     */
    query(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connectDB().then((dbClient) => {
                var result = dbClient.collection(collectionName).find(json);
                result.toArray((err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(data);
                });
            })
        })
    }

    /**
     * 返回objectid
     * @param id
     * @returns {mongoDb.ObjectID}
     */
    getObjectID(id){
        return new ObjectID(id);
    }
}

module.exports = MongoDM.getInstance();

