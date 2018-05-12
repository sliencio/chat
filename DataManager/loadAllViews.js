const fs = require('fs')
var path = require('path')

//存放数据的集合
var viewObjs = {}
//解析需要遍历的文件夹
var filePath = path.resolve(__dirname,'../views');
//调用文件遍历方法
loadViews(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function loadViews(filePath) {
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, function (err, files) {
        if (err) {
            console.warn(err)
        } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir, function (eror, stats) {
                    if (eror) {
                        console.warn('获取文件stats失败');
                    } else {
                        var isFile = stats.isFile(); //是文件
                        var isDir = stats.isDirectory(); //是文件夹
                        if (isFile) {
                            if(filename.split(".")[1] == 'html'){
                                fs.readFile(filedir, function (err, data) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    viewObjs[filename] = data.toString();
                                    console.log(filename + ' load suc!');
                                 });
                            }
                        }
                        //递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        if (isDir) {
                            loadViews(filedir); 
                        }
                    }
                })
            });
        }
    });
}


class Views {
    static getInstance() {
        if (!Views.m_instance) {
            Views.m_instance = new Views();
        }
        return Views.m_instance;
    }
    //获取
    get(viewName) {
        console.log(viewName)
        var retData = viewObjs[viewName];
        if (retData) {
            return retData;
        }
    }
}

module.exports = Views.getInstance();