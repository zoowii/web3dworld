![3dhouse](static/img/favicon.ico)
# Web 3D House Design And Display
## Using WebGL
# 基于WebGL的景观房屋等3D场景的编辑与展示
---
### Author
* [zoowii](https://github.com/zoowii)
* 黄栋

### 指导老师
* 刘海涛(nju)

---
## 开发技术
* Python(后台开发)
* Flask(Web后台框架)
* SQLite, MySQL, MongoDB(数据、文件存储)
* JavaScript
* require.js/jquery/underscore.js/backbone.js/ExtJS 等等js框架

## 部署方式
* 下载代码后可上传并部署到AppFog上(af update <project-name>)
* 开发环境时使用sqlite数据库，数据库文件直接放在项目根目录中；
* 开发环境的MongoDB使用名为web3dhouse的数据库并有用户名/密码为admin/admin的账户
* 开发环境MongoDB配置方式
```JavaScript
下载MongoDB程序后，解压，进入MongoDB的bin目录，运行
mongod --dbpath=E:/data --rest (E:/data是存放数据的目录，可自定)
启动MongoDB
在运行mongo命令，进入MongoDB交互环境，运行：
use web3dhouse
db.addUser('admin', 'admin')
Ctrl+C(关闭)
然后Ctrl+C关闭之前的mongod进程。
以后每次启动时执行
mongod --dbpath=E:/data --rest -auth
即可启动mongod了
```

* 开发环境中，以上配置好后，运行python web/start.py或gunicorn -w 4 web.app.application.app即可运行了。
