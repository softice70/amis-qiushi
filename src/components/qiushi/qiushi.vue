<template>
    <AMisRenderer :schema="schema" :key="time" />
</template>

<script>
import AMisRenderer from "@/components/amis/AMisRenderer.vue";
export default {
    name: "Qiushi",
    components: {
        AMisRenderer
    },
    data() {
        return {
            userId: '',
            userName: '',
            schema: {},
            time:''
        };
    },
    mounted(){
        this.userId = 1;
        this.userName = '田铿君';
        this.getAppFrame();
    },
    methods: {
        getAppFrame(){
            let _this = this;
//            this.$ajax.get('/pages/app-normal.json').then(data => {
            this.$ajax.get('/pages/app.json').then(data => {
                _this.schema = data.data;
                _this.schema.data.userId = _this.userId;
                _this.schema.data.userName = _this.userName;
                _this.getThemes();
            })
        },
        getThemes(){
            let _this = this;
            this.$ajax.get('/api/themes').then(data => {
                _this.schema.data.themes = data.data.themes;
                _this.time = new Date().getTime();
            })
        }
    }
};
</script>
