<!--
应用配置项说明：
1.应用配置项必须设置 frameType 及与其相关的其他配置项
2.框架类型：frameType
  有两种框架类型：SPA和MPA
3.MPA配置：
  MPA应用需要配置应用的schema地址（appSchemaUrl），schema的type应该为app
4.SPA配置：
  a) SPA应用原则上为单页应用，如果有多页需要切换，建议首选MPA框架实现
  b) SPA应用的 schema 的 type为 page
  c) 如果受限于MPA框架自身实现的原因，需要使用多个SPA页面并在其中切换，则需要在配置路由配置信息中添加相关链接项
5.路由配置表：routes
  a) 为array类型，其每个配置项应包括 pathname 、 schemaApi 或者 redirect 等项内容
  b) 默认应该包括登录页配置信息
  c) MPA应用中，主要的路由配置项是在 app schema 的 pages 里定义，这里除了登录信息外，其他均不生效
6.应用配置的内容会同步到schema的data中，在amis的页面中可以访问到这些内容
7.应用配置项除了必填内容外，可以放一些应用相关的全局配置数据
-->
<template>
    <AMisRenderer :schema="schema" :key="time" />
</template>

<script>
import AMisRenderer from "@/components/amis/AMisRenderer.vue";
export default {
    name: "AMisAppLoader",
    components: {
        AMisRenderer
    },
    data() {
        return {
            appId: '',
            userId: '',
            userName: '',
            schema: {},
            time:''
        };
    },
    mounted(){
        this.appId = this.$cookies.get('appId');
        this.userId = this.$cookies.get('userId');
        this.userName = this.$cookies.get('userName');
        if(this.appId && this.userId){
            this.getAppFrame();
        }else{
            this.login();
        }
    },
    methods: {
        getAppFrame(){
            let _this = this;
            let errorMsg = undefined;
            this.$ajax.get('/api/appCfg?appId='+this.appId).then(appCfg => {
                let schemaApi = undefined;
                if(appCfg.data.frameType == undefined || appCfg.data.frameType == null){
                    schemaApi = '/pages/error.json';
                    errorMsg = "没有配置框架类型";
                }else if(appCfg.data.frameType == 'MPA'){
                    schemaApi = appCfg.data.appSchemaUrl;
                }else if(appCfg.data.frameType == 'SPA' && appCfg.data.routes != undefined){
                    appCfg.data.routes.forEach(function (route) {
                        if(route.pathname == document.location.pathname){
                            if(route.redirect){
                                window.location.href = document.location.protocol + '//' + document.location.host + route.redirect;
                            }else{
                                schemaApi = route.schemaApi;
                            }
                        }
                    })
                    if(schemaApi == undefined){
                        schemaApi = '/pages/error.json';
                        errorMsg = "没有找到对应的路由配置：" + document.location.pathname;
                    }
                }else{
                    schemaApi = '/pages/error.json';
                    errorMsg = "错误的框架类型：" + appCfg.data.frameType;
                }
                if(schemaApi != undefined){
                    _this.getSchema(schemaApi, appCfg, errorMsg);
                }
            })
        },
        login(){
            let _this = this;
            let appIdEndPos = document.location.pathname.indexOf('/', 1);
            let appId = ((appIdEndPos > 0)? document.location.pathname.substring(1, appIdEndPos): document.location.pathname.substr(1, document.location.pathname.length - 1));
            let errorMsg = undefined;
            let schemaApi = undefined;
            if(appId){
                this.$ajax.get('/api/appCfg?appId='+appId).then(appCfg => {
                    let loginUrl = '/' + appId + '/login';
                    appCfg.data.routes.forEach(function (route) {
                        if(route.pathname == loginUrl){
                            if(route.redirect){
                                window.location.href = document.location.protocol + '//' + document.location.host + route.redirect;
                            }else{
                                schemaApi = route.schemaApi;
                            }
                        }
                    })
                    if(schemaApi == undefined){
                        schemaApi = '/pages/error.json';
                        errorMsg = "没有找到登录页的路由配置：" + loginUrl;
                    }
                    if(schemaApi != undefined){
                        _this.getSchema(schemaApi, appCfg, errorMsg);
                    }
                })
            }else{
                schemaApi = '/pages/error.json';
                errorMsg = "没有找到该地址：" + document.location.href;
                _this.getSchema(schemaApi, {}, errorMsg);
            }
        },
        getSchema(schemaApi, appCfg, errorMsg){
            let _this = this;
            this.$ajax.get(schemaApi).then(appSchema => {
                _this.schema = appSchema.data;
                if(_this.schema.data == undefined){
                    _this.schema.data = [];
                }
                for(let key in appCfg.data){
                    _this.schema.data[key] = appCfg.data[key];
                }
                if(errorMsg){
                    _this.schema.data.errorMsg = errorMsg;
                }
                _this.schema.data.userId = _this.userId;
                _this.schema.data.userName = _this.userName;
                _this.time = new Date().getTime();
            })
        }
    }
};
</script>
