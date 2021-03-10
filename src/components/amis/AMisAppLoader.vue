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
            schema: {},
            time:''
        };
    },
    mounted(){
        this.appId = this.$cookies.get('appId');
        this.userId = this.$cookies.get('userId');
        this.getAppFrame();
    },
    methods: {
        getAppFrame(){
            let _this = this;
            this.$ajax.get('/api/appData?appId='+this.appId+'&userId='+this.userId).then(appData => {
                this.$ajax.get(appData.data.appUrl).then(appSchema => {
                    _this.schema = appSchema.data;
                    for(let key in appData.data){
                        _this.schema.data[key] = appData.data[key];
                    }
                    _this.time = new Date().getTime();
                })
            })
        },
    }
};
</script>
