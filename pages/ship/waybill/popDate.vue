<template>
    <!-- <view class="datePicker" ref="datePicker" catchtouchmove="true"> -->
    <view class="datePicker" ref="datePicker">
        <uni-popup ref="popup" type="bottom" backgroundColor="#fff">
            <view class="popupBox">
               <view class="dtitle">
                    <view class="dClose" @click="cancelFunction()"><text class="dClose-text">取消</text></view>
                    <view class="dConfirm" @click="confirmFunction();"><text class="dConfirm-text">确定</text></view>
                </view>
                <picker-view 
					indicator-style="height:34px;"
                    @change="onChange"
                    class="picker-view"
                    @pickstart="pickStart($event)"
                    @pickend="pickEnd()"
                    :value="dateValue"
                >
                    <picker-view-column v-for="(item,index) in data" :key="index">
                        <view class="item" v-for="(item1,index1) in item.data" :key="index1">{{item1}}{{item.$name}}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import uniPopup from '@/uni_modules/uni-popup/components/uni-popup/uni-popup.vue';
    export default {
        components:{
            uniPopup
        },
        data () {
            return {
                data:[],                    //初始化时间维度    
                changeObj:[],                //初始化选中的数据
                isDataFinish:true,            //初始化数据是否选择完毕
                normalDate:"",                //初始化默认选择的时间
                dateValue:[],                //初始化拨盘选择默认值
                tempChangeObj:[],            //初始化滚动选中
            }
        },
        props:{
            // title名称，类型 String 默认 ""
            "title":{
                type:String,
                default:"请选择时间"
            },
            // 拨盘类型，类型 String 默认 "yy-mm-dd"
            "type":{
                type:String,
                default:"yy-mm-dd"
            },
            // 最小选择时间
            "minDate":{
                type:String,
                default:"2000-01-01 00:00:00"
            },
            // 最大选择时间
            "maxDate":{
                type:String,
                default:"3000-01-01 00:00:00"
            },
            // 初始默认时间
            "initDate":{
                type:String,
                default:""
            },
            // 确认按钮名称 类型 String 默认 "确认"
            'confirmButtonText':{
                type:String,
                default:'确认'
            },
            // 确认方法名-兼容微信小程序无法获取父组件是否传递过来参数的补丁
            'mpWeixinConfirm':{
                type:String
            },
            // 确认方法名-兼容微信小程序无法获取父组件是否传递过来参数的补丁
            'mpWeixinCancel':{
                type:String
            }
        },
		created() {
			// this.init();
		},
        methods: {
			open() {
				this.$refs.popup.open();
			},
            // open 开启弹窗方法
            init(){
                this.data=[];
				this.dateValue = [];
                // 重置默认选择的日期时间
				var maxDate = this.maxDate;
                if(!this.initDate||new Date(this.initDate).getTime()<new Date(this.minDate).getTime()||new Date(this.initDate).getTime()>new Date(this.maxDate).getTime()){
                    this.normalDate = this.minDate;
                }else{
                    this.normalDate = this.initDate;
                }
				console.log(this.initDate, "")
                // 获取类型
                switch(this.type){
                    case "yy":
                        // 追加年数据
                        var year = {};
                        year.name = "year";
                        year.$name = ""
                        year.data = [];
                        var yearInterval = this.maxDate.split("-")[0] - this.minDate.split("-")[0];
                        for(let a=0;a<=yearInterval;a++){
                            year.data.push(parseInt(this.minDate.split("-")[0])+a);
                            if(this.normalDate.split("-")[0]==(parseInt(this.minDate.split("-")[0])+a)){
                                this.dateValue.push(a)
                            }
                        }
                        this.tempChangeObj = this.dateValue;
                        this.data.push(year);
                        break;
                    case "yy-mm":
                        //追加年数据
                        var year = {};
                        year.name = "year";
                        year.$name = ""
                        year.data = [];
                        var yearInterval = this.maxDate.split("-")[0] - this.minDate.split("-")[0];
                        for(let a=0;a<=yearInterval;a++){
                            year.data.push(parseInt(this.minDate.split("-")[0])+a);
                            if(this.normalDate.split("-")[0]==(parseInt(this.minDate.split("-")[0])+a)){
                                this.dateValue.push(a)
                            }
                        }
                        this.data.push(year);
                        // 追加月数据
                        var month = {};
                        month.name = "month";
                        month.$name = "";
                        month.data = [];
                        // 判断年份如果在同一年
                        var monthInterval = 0;
                        if(yearInterval>0){
                            monthInterval = 12;
                            for(let b=1;b<=monthInterval;b++){
                                month.data.push(b<10?("0"+b):b);
                                if(this.normalDate.split(" ")[0].split("-")[1]==(b<10?("0"+b):b)){
                                    this.dateValue.push(b-1)
                                }
                            }
                        }else{
                            monthInterval = this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1];
                            for(let b=0;b<=monthInterval;b++){
                                month.data.push((parseInt(this.minDate.split(" ")[0].split("-")[1])+b)<10?("0"+(parseInt(this.minDate.split(" ")[0].split("-")[1])+b)):(parseInt(this.minDate.split(" ")[0].split("-")[1])+b));
                                if(parseInt(this.normalDate.split(" ")[0].split("-")[1])==parseInt(this.minDate.split(" ")[0].split("-")[1])+b){
                                    this.dateValue.push(b)
                                }
                            }
                        }
                        this.tempChangeObj = this.dateValue;
                        this.data.push(month);
                        break;
                    case "yy-mm-dd":
                        //追加年数据
                        var year = {};
                        year.name = "year";
                        year.$name = ""
                        year.data = [];
                        var yearInterval = this.maxDate.split("-")[0] - this.minDate.split("-")[0];
                        for(let a=0;a<=yearInterval;a++){
                            year.data.push(parseInt(this.minDate.split("-")[0])+a);
                            if(this.normalDate.split("-")[0]==(parseInt(this.minDate.split("-")[0])+a)){
                                this.dateValue.push(a)
                            }
                        }
                        this.data.push(year);
                        // 追加月数据
                        var month = {};
                        month.name = "month";
                        month.$name = "";
                        month.data = [];
                        // 判断年份如果在同一年
                        var monthInterval = 0;
                        if(yearInterval>0){
                            monthInterval = 12;
                            for(let b=1;b<=monthInterval;b++){
                                month.data.push(b<10?("0"+b):b);
                                if(this.normalDate.split(" ")[0].split("-")[1]==(b<10?("0"+b):b)){
                                    this.dateValue.push(b-1)
                                }
                            }
                        }else{
                            monthInterval = this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1];
                            for(let b=0;b<=monthInterval;b++){
                                month.data.push((parseInt(this.minDate.split(" ")[0].split("-")[1])+b)<10?("0"+(parseInt(this.minDate.split(" ")[0].split("-")[1])+b)):(parseInt(this.minDate.split(" ")[0].split("-")[1])+b));
                                if(parseInt(this.normalDate.split(" ")[0].split("-")[1])==parseInt(this.minDate.split(" ")[0].split("-")[1])+b){
                                    this.dateValue.push(b)
                                }
                            }
                        }
                        this.data.push(month);
                        // 追加日数据
                        var day = {};
                        day.name = "day";
                        day.$name = "";
                        day.data = [];
                        // 判断年月是否在同一年同一月
                        var dayInterval = 0;
                        if(yearInterval==0&&(this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1]==0)){
                            dayInterval = this.maxDate.split(" ")[0].split("-")[2] - this.minDate.split(" ")[0].split("-")[2];
                            for(let c=0;c<=dayInterval;c++){
                                day.data.push((parseInt(this.minDate.split(" ")[0].split("-")[2])+c)<10?("0"+(parseInt(this.minDate.split(" ")[0].split("-")[2])+c)):(parseInt(this.minDate.split(" ")[0].split("-")[2])+c));
                                if(parseInt(this.normalDate.split(" ")[0].split("-")[2])==parseInt(this.minDate.split(" ")[0].split("-")[2])+c){
                                    this.dateValue.push(c)
                                }
                            }
                        }else{
                            var tempMonth = this.normalDate.split(" ")[0].split("-")[1];
                            // 判断是否为2月
                            if(tempMonth==2){
                                // 判断当前选择，是否闰年
                                if(this.normalDate.split(" ")[0].split("-")[0] % 4 == 0 && !(this.normalDate.split(" ")[0].split("-")[0] % 100 == 0) || this.normalDate.split(" ")[0].split("-")[0] % 400 == 0) {
                                    dayInterval = 29;
                                }else{
                                    dayInterval = 28;
                                }
                            }else if(tempMonth==1||tempMonth==3||tempMonth==5||tempMonth==7||tempMonth==8||tempMonth==10||tempMonth==12){
                                dayInterval = 31;
                            }else{
                                dayInterval = 30;
                            }
                            for(let c=1;c<=dayInterval;c++){
                                day.data.push(c<10?("0"+c):c);
                                if(this.normalDate.split(" ")[0].split("-")[2]==(c<10?("0"+c):c)){
                                    this.dateValue.push(c-1)
                                }
                            }
                        }
                        this.tempChangeObj = this.dateValue;
                        this.data.push(day);
                        break;
                    case "yy-mm-dd hh":
                        //追加年数据
                        var year = {};
                        year.name = "year";
                        year.$name = ""
                        year.data = [];
                        var yearInterval = this.maxDate.split("-")[0] - this.minDate.split("-")[0];
                        for(let a=0;a<=yearInterval;a++){
                            year.data.push(parseInt(this.minDate.split("-")[0])+a);
                            if(this.normalDate.split("-")[0]==(parseInt(this.minDate.split("-")[0])+a)){
                                this.dateValue.push(a)
                            }
                        }
                        this.data.push(year);
                        // 追加月数据
                        var month = {};
                        month.name = "month";
                        month.$name = "";
                        month.data = [];
                        // 判断年份如果在同一年
                        var monthInterval = 0;
                        if(yearInterval>0){
                            monthInterval = 12;
                            for(let b=1;b<=monthInterval;b++){
                                month.data.push(b<10?("0"+b):b);
                                if(this.normalDate.split(" ")[0].split("-")[1]==(b<10?("0"+b):b)){
                                    this.dateValue.push(b-1)
                                }
                            }
                        }else{
                            monthInterval = this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1];
                            for(let b=0;b<=monthInterval;b++){
                                month.data.push((parseInt(this.minDate.split(" ")[0].split("-")[1])+b)<10?("0"+(parseInt(this.minDate.split(" ")[0].split("-")[1])+b)):(parseInt(this.minDate.split(" ")[0].split("-")[1])+b));
                                if(parseInt(this.normalDate.split(" ")[0].split("-")[1])==parseInt(this.minDate.split(" ")[0].split("-")[1])+b){
                                    this.dateValue.push(b)
                                }
                            }
                        }
                        this.data.push(month);
                        // 追加日数据
                        var day = {};
                        day.name = "day";
                        day.$name = "";
                        day.data = [];
                        // 判断年月是否在同一年同一月
                        var dayInterval = 0;
                        if(yearInterval==0&&(this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1]==0)){
                            dayInterval = this.maxDate.split(" ")[0].split("-")[2] - this.minDate.split(" ")[0].split("-")[2];
                            for(let c=0;c<=dayInterval;c++){
                                day.data.push((parseInt(this.minDate.split(" ")[0].split("-")[2])+c)<10?("0"+(parseInt(this.minDate.split(" ")[0].split("-")[2])+c)):(parseInt(this.minDate.split(" ")[0].split("-")[2])+c));
                                if(parseInt(this.normalDate.split(" ")[0].split("-")[2])==parseInt(this.minDate.split(" ")[0].split("-")[2])+c){
                                    this.dateValue.push(c)
                                }
                            }
                        }else{
                            var tempMonth = this.normalDate.split(" ")[0].split("-")[1];
                            // 判断是否为2月
                            if(tempMonth==2){
                                // 判断当前选择，是否闰年
                                if(this.normalDate.split(" ")[0].split("-")[0] % 4 == 0 && !(this.normalDate.split(" ")[0].split("-")[0] % 100 == 0) || this.normalDate.split(" ")[0].split("-")[0] % 400 == 0) {
                                    dayInterval = 29;
                                }else{
                                    dayInterval = 28;
                                }
                            }else if(tempMonth==1||tempMonth==3||tempMonth==5||tempMonth==7||tempMonth==8||tempMonth==10||tempMonth==12){
                                dayInterval = 31;
                            }else{
                                dayInterval = 30;
                            }
                            for(let c=1;c<=dayInterval;c++){
                                day.data.push(c<10?("0"+c):c);
                                if(this.normalDate.split(" ")[0].split("-")[2]==(c<10?("0"+c):c)){
                                    this.dateValue.push(c-1)
                                }
                            }
                        }
                        this.data.push(day);
                        // 追加时数据
                        var hour = {};
                        hour.name = "hour";
                        hour.$name = "";
                        hour.data = [];
                        // 判断年月日是否一致
                        var hourInterval = 0;
                        if(yearInterval==0&&(this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1]==0)&&(this.maxDate.split(" ")[0].split("-")[2] - this.minDate.split(" ")[0].split("-")[2]==0)){
                            hourInterval = this.maxDate.split(" ")[1].split(":")[0] - this.minDate.split(" ")[1].split(":")[0];
                            for(let d=0;d<=hourInterval;d++){
                                hour.data.push((parseInt(this.minDate.split(" ")[1].split(":")[0])+d)<10?("0"+(parseInt(this.minDate.split(" ")[1].split(":")[0])+d)):(parseInt(this.minDate.split(" ")[1].split(":")[0])+d));
                                if(parseInt(this.normalDate.split(" ")[1].split(":")[0])==parseInt(this.minDate.split(" ")[1].split(":")[0])+d){
                                    this.dateValue.push(d)
                                }
                            }
                        }else{
                            hourInterval = 23
                            for(let d=0;d<=hourInterval;d++){
                                hour.data.push(d<10?("0"+d):d);
                                if(this.normalDate.split(" ")[1].split(":")[0]==(d<10?("0"+d):d)){
                                    this.dateValue.push(d)
                                }
                            }
                        }
                        this.tempChangeObj = this.dateValue;
                        this.data.push(hour);
                        break;
                    case "yy-mm-dd hh:mm":
                        //追加年数据
                        var year = {};
                        year.name = "year";
                        year.$name = ""
                        year.data = [];
                        var yearInterval = this.maxDate.split("-")[0] - this.minDate.split("-")[0];
                        for(let a=0;a<=yearInterval;a++){
                            year.data.push(parseInt(this.minDate.split("-")[0])+a);
                            if(this.normalDate.split("-")[0]==(parseInt(this.minDate.split("-")[0])+a)){
                                this.dateValue.push(a)
                            }
                        }
                        this.data.push(year);
                        // 追加月数据
                        var month = {};
                        month.name = "month";
                        month.$name = "";
                        month.data = [];
                        // 判断年份如果在同一年
                        var monthInterval = 0;
                        if(yearInterval>0){
                            monthInterval = 12;
                            for(let b=1;b<=monthInterval;b++){
                                month.data.push(b<10?("0"+b):b);
                                if(this.normalDate.split(" ")[0].split("-")[1]==(b<10?("0"+b):b)){
                                    this.dateValue.push(b-1)
                                }
                            }
                        }else{
                            monthInterval = this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1];
                            for(let b=0;b<=monthInterval;b++){
                                month.data.push((parseInt(this.minDate.split(" ")[0].split("-")[1])+b)<10?("0"+(parseInt(this.minDate.split(" ")[0].split("-")[1])+b)):(parseInt(this.minDate.split(" ")[0].split("-")[1])+b));
                                if(parseInt(this.normalDate.split(" ")[0].split("-")[1])==parseInt(this.minDate.split(" ")[0].split("-")[1])+b){
                                    this.dateValue.push(b)
                                }
                            }
                        }
                        this.data.push(month);
                        // 追加日数据
                        var day = {};
                        day.name = "day";
                        day.$name = "";
                        day.data = [];
                        // 判断年月是否在同一年同一月
                        var dayInterval = 0;
                        if(yearInterval==0&&(this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1]==0)){
                            dayInterval = this.maxDate.split(" ")[0].split("-")[2] - this.minDate.split(" ")[0].split("-")[2];
                            for(let c=0;c<=dayInterval;c++){
                                day.data.push((parseInt(this.minDate.split(" ")[0].split("-")[2])+c)<10?("0"+(parseInt(this.minDate.split(" ")[0].split("-")[2])+c)):(parseInt(this.minDate.split(" ")[0].split("-")[2])+c));
                                if(parseInt(this.normalDate.split(" ")[0].split("-")[2])==parseInt(this.minDate.split(" ")[0].split("-")[2])+c){
                                    this.dateValue.push(c)
                                }
                            }
                        }else{
                            var tempMonth = this.normalDate.split(" ")[0].split("-")[1];
                            // 判断是否为2月
                            if(tempMonth==2){
                                // 判断当前选择，是否闰年
                                if(this.normalDate.split(" ")[0].split("-")[0] % 4 == 0 && !(this.normalDate.split(" ")[0].split("-")[0] % 100 == 0) || this.normalDate.split(" ")[0].split("-")[0] % 400 == 0) {
                                    dayInterval = 29;
                                }else{
                                    dayInterval = 28;
                                }
                            }else if(tempMonth==1||tempMonth==3||tempMonth==5||tempMonth==7||tempMonth==8||tempMonth==10||tempMonth==12){
                                dayInterval = 31;
                            }else{
                                dayInterval = 30;
                            }
                            for(let c=1;c<=dayInterval;c++){
                                day.data.push(c<10?("0"+c):c);
                                if(this.normalDate.split(" ")[0].split("-")[2]==(c<10?("0"+c):c)){
                                    this.dateValue.push(c-1)
                                }
                            }
                        }
                        this.data.push(day);
                        // 追加时数据
                        var hour = {};
                        hour.name = "hour";
                        hour.$name = "";
                        hour.data = [];
                        // 判断年月日是否一致
                        var hourInterval = 0;
                        if(yearInterval==0&&(this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1]==0)&&(this.maxDate.split(" ")[0].split("-")[2] - this.minDate.split(" ")[0].split("-")[2]==0)){
                            hourInterval = this.maxDate.split(" ")[1].split(":")[0] - this.minDate.split(" ")[1].split(":")[0];
                            for(let d=0;d<=hourInterval;d++){
                                hour.data.push((parseInt(this.minDate.split(" ")[1].split(":")[0])+d)<10?("0"+(parseInt(this.minDate.split(" ")[1].split(":")[0])+d)):(parseInt(this.minDate.split(" ")[1].split(":")[0])+d));
                                if(parseInt(this.normalDate.split(" ")[1].split(":")[0])==parseInt(this.minDate.split(" ")[1].split(":")[0])+d){
                                    this.dateValue.push(d)
                                }
                            }
                        }else{
                            hourInterval = 23
                            for(let d=0;d<=hourInterval;d++){
                                hour.data.push(d<10?("0"+d):d);
                                if(this.normalDate.split(" ")[1].split(":")[0]==(d<10?("0"+d):d)){
                                    this.dateValue.push(d)
                                }
                            }
                        }
                        this.data.push(hour);
                        // 追加分数据
                        var minute = {};
                        minute.name = "minute";
                        minute.$name = "";
                        minute.data = [];
                        // 判断年月日时是否一致
                        var minuteInterval = 0;
                        if(yearInterval==0&&(this.maxDate.split(" ")[0].split("-")[1] - this.minDate.split(" ")[0].split("-")[1]==0)&&(this.maxDate.split(" ")[0].split("-")[2] - this.minDate.split(" ")[0].split("-")[2]==0)&&(this.maxDate.split(" ")[1].split(":")[0] - this.minDate.split(" ")[1].split(":")[0]==0)){
                            minuteInterval = this.maxDate.split(" ")[1].split(":")[1] - this.minDate.split(" ")[1].split(":")[1];
                            for(let e=0;e<=minuteInterval;e++){
                                minute.data.push((parseInt(this.minDate.split(" ")[1].split(":")[1])+e)<10?("0"+(parseInt(this.minDate.split(" ")[1].split(":")[1])+e)):(parseInt(this.minDate.split(" ")[1].split(":")[1])+e));
                                if(parseInt(this.normalDate.split(" ")[1].split(":")[1])==parseInt(this.minDate.split(" ")[1].split(":")[1])+e){
                                    this.dateValue.push(e)
                                }
                            }
                        }else{
                            minuteInterval = 59
                            for(let e=0;e<=minuteInterval;e++){
                                minute.data.push(e<10?("0"+e):e);
                                if(this.normalDate.split(" ")[1].split(":")[1]==(e<10?("0"+e):e)){
                                    this.dateValue.push(e)
                                }
                            }
                        }
                        this.tempChangeObj = this.dateValue;
                        this.data.push(minute);
                        break;
                    case "yy-mm-dd hh:mm:ss":
                        //追加年数据
                        var year = {};
                        year.name = "year";
                        year.$name = ""
                        year.data = [];
                        var yearInterval = this.maxDate.split("-")[0] - this.minDate.split("-")[0];
                        for(let a=0;a<=yearInterval;a++){
                            year.data.push(parseInt(this.minDate.split("-")[0])+a);
                            if(this.normalDate.split("-")[0]==(parseInt(this.minDate.split("-")[0])+a)){
                                this.dateValue.push(a)
                            }
                        }
                        this.data.push(year);
                        // 追加月数据
                        var month = {};
                        month.name = "month";
                        month.$name = "";
                        month.data = [];
                        // 判断年份如果在同一年
                        var monthInterval = 0;
						monthInterval = 12;
						var yearNow = this.normalDate.split(" ")[0].split('-')[0];
						var monthNow = this.normalDate.split(" ")[0].split('-')[1];
						var dayNow = this.normalDate.split(" ")[0].split('-')[2];
						var hourNow = this.normalDate.split(" ")[1].split(':')[0];
						var minuteNow = this.normalDate.split(" ")[1].split(':')[1];
						var secondNow = this.normalDate.split(" ")[1].split(':')[2];
						var yearMax = maxDate.split(" ")[0].split('-')[0];
						var monthMax = maxDate.split(" ")[0].split('-')[1];
						var dayMax = maxDate.split(" ")[0].split('-')[2];
						var hourMax = maxDate.split(" ")[1].split(':')[0];
						var minuteMax = maxDate.split(" ")[1].split(':')[1];
						var secondMax = maxDate.split(" ")[1].split(':')[2];
						for(let b=1;b<=monthInterval;b++){
							// month.data.push(b<10?("0"+b):b);
							if(this.normalDate.split(" ")[0].split("-")[1]==(b<10?("0"+b):b)){
								this.dateValue.push(b-1)
								
							}
							if (this.normalDate.split(" ")[0].split('-')[0] == maxDate.split(' ')[0].split('-')[0]) {
								if (this.normalDate.split(" ")[0].split("-")[1]>=(b<10?("0"+b):b)) {
									 month.data.push(b<10?("0"+b):b);
								}
							} else {
								month.data.push(b<10?("0"+b):b);
							}
							
						}
                        
                        this.data.push(month);
                        // 追加日数据
                        var day = {};
                        day.name = "day";
                        day.$name = "";
                        day.data = [];
						
                        // 判断年月是否在同一年同一月
                        var dayInterval = 0;
                        
						var tempMonth = this.normalDate.split(" ")[0].split("-")[1];
						// 判断是否为2月
						if(tempMonth==2){
							// 判断当前选择，是否闰年
							if(this.normalDate.split(" ")[0].split("-")[0] % 4 == 0 && !(this.normalDate.split(" ")[0].split("-")[0] % 100 == 0) || this.normalDate.split(" ")[0].split("-")[0] % 400 == 0) {
								dayInterval = 29;
							}else{
								dayInterval = 28;
							}
						}else if(tempMonth==1||tempMonth==3||tempMonth==5||tempMonth==7||tempMonth==8||tempMonth==10||tempMonth==12){
							dayInterval = 31;
						}else{
							dayInterval = 30;
						}
						for(let c=1;c<=dayInterval;c++){
							// day.data.push(c<10?("0"+c):c);
							if(this.normalDate.split(" ")[0].split("-")[2]==(c<10?("0"+c):c)){
								this.dateValue.push(c-1)
							}
							if (this.normalDate.split(" ")[0].split('-')[0] == maxDate.split(' ')[0].split('-')[0] && this.normalDate.split(" ")[0].split('-')[1] == maxDate.split(' ')[0].split('-')[1]) {
								if(this.normalDate.split(" ")[0].split("-")[2]>=(c<10?("0"+c):c)){
									day.data.push(c<10?("0"+c):c)
								}
							} else {
								day.data.push(c<10?("0"+c):c);
							}
						}
                        
                        this.data.push(day);
                        // 追加时数据
                        var hour = {};
                        hour.name = "hour";
                        hour.$name = "";
                        hour.data = [];
                        // 判断年月日是否一致
                        var hourInterval = 0;
                       
						hourInterval = 23
						for(let d=0;d<=hourInterval;d++){
							// hour.data.push(d<10?("0"+d):d);
							if(this.normalDate.split(" ")[1].split(":")[0]==(d<10?("0"+d):d)){
								this.dateValue.push(d)
							}
							if (yearNow == yearMax && monthNow == monthMax && dayNow == dayMax) {
								if (this.normalDate.split(" ")[1].split(":")[0]>=(d<10?("0"+d):d)) {
									 hour.data.push(d<10?("0"+d):d);
								}
							} else {
								hour.data.push(d<10?("0"+d):d);
							}
							
						}
						
                        
                        this.data.push(hour);
                        // 追加分数据
                        var minute = {};
                        minute.name = "minute";
                        minute.$name = "";
                        minute.data = [];
                        // 判断年月日时是否一致
                        var minuteInterval = 0;
                      
						minuteInterval = 59
						for(let e=0;e<=minuteInterval;e++){
							// minute.data.push(e<10?("0"+e):e);
							if(this.normalDate.split(" ")[1].split(":")[1]==(e<10?("0"+e):e)){
								this.dateValue.push(e)
							}
							if (yearNow == yearMax && monthNow == monthMax && dayNow == dayMax && hourNow == hourMax) {
								if(this.normalDate.split(" ")[1].split(":")[1]>=(e<10?("0"+e):e)){
									minute.data.push(e<10?("0"+e):e);
								}
							} else {
								minute.data.push(e<10?("0"+e):e);
							}
							
						}
                        
                        this.data.push(minute);
                        // 追加秒数据
                        var seconds = {};
                        seconds.name = "seconds";
                        seconds.$name = "";
                        seconds.data = [];
                        // 判断年月日时分是否一致
                        var secondsInterval = 0;
                     
						secondsInterval = 59
						for(let f=0;f<=secondsInterval;f++){
							// seconds.data.push(f<10?("0"+f):f);
							if(this.normalDate.split(" ")[1].split(":")[2]==(f<10?("0"+f):f)){
								this.dateValue.push(f)
							}
							if (yearNow == yearMax && monthNow == monthMax && dayNow == dayMax && hourNow == hourMax && minuteNow == minuteMax) {
								if(this.normalDate.split(" ")[1].split(":")[2]>=(f<10?("0"+f):f)){
									seconds.data.push(f<10?("0"+f):f);
								}
							} else {
								seconds.data.push(f<10?("0"+f):f);
							}
							
							
						}
                        
                        this.tempChangeObj = this.dateValue;
                        this.data.push(seconds);
						console.log(this.dateValue,"初始化轮盘")
                        break;
                }
      //          setTimeout(() => {
				  //   this.$refs.popup.open();
			   // }, 500)
            },
			
            // close 关闭弹窗方法
            close(){
                this.$refs.popup.close();
            },
			
			// 拨盘选择
            onChange($event){
				console.log($event, "改变");
                // 此处请注意，微信小程序返回默认值，h5端不会返回
				
                var tempArray = $event.detail.value;
				var maxDate = this.maxDate;
				var yearMax = maxDate.split(" ")[0].split('-')[0];
				var monthMax = maxDate.split(" ")[0].split('-')[1];
				var dayMax = maxDate.split(" ")[0].split('-')[2];
				var hourMax = maxDate.split(" ")[1].split(':')[0];
				var minuteMax = maxDate.split(" ")[1].split(':')[1];
				var secondMax = maxDate.split(" ")[1].split(':')[2];
				var yearNow = this.data[0].data[tempArray[0]];
				var monthNow = this.data[1].data[tempArray[1]];
				var dayNow = this.data[2].data[tempArray[2]];
				var hourNow = this.data[3].data[tempArray[3]];
				var minuteNow = this.data[4].data[tempArray[4]];
				var secondNow = this.data[5].data[tempArray[5]];
				
				console.log(yearNow, monthNow, dayNow, hourNow, minuteNow, secondNow, "日期11");
				console.log(this.data, "日期总共信息");
				
				var monthSize, daySize, hourSize, minuteSize, secondSize;
				//判断年是否改变
				console.log(tempArray, this.tempChangeObj,   "改变1212")
				var temMonth = [], temMDay = [], temMHour = [], temMMinute = [], temMSecond = [];
				if(tempArray[0] != this.tempChangeObj[0]) {
					if (yearNow != yearMax) {
						//更新月份
						monthSize = 12;
						if(parseInt(this.data[1].data[tempArray[1]])==2){
						    // 判断当前选择，是否闰年
						    if(parseInt(this.data[0].data[tempArray[0]]) % 4 == 0 && !(parseInt(this.data[0].data[tempArray[0]]) % 100 == 0) || parseInt(this.data[0].data[tempArray[0]]) % 400 == 0) {
						        daySize = 29;
						    }else{
						        daySize = 28;
						    }
						}else if((parseInt(this.data[1].data[tempArray[1]])==1||parseInt(this.data[1].data[tempArray[1]])==3||parseInt(this.data[1].data[tempArray[1]])==5||parseInt(this.data[1].data[tempArray[1]])==7||parseInt(this.data[1].data[tempArray[1]])==8||parseInt(this.data[1].data[tempArray[1]])==10||parseInt(this.data[1].data[tempArray[1]])==12)){
						    daySize = 31;
						}else{
						    daySize = 30;
						}
						hourSize = 23
						minuteSize = 59
						secondSize = 59
						
						
					} else {
						monthSize = maxDate.split(' ')[0].split('-')[1];
						console.log(monthNow, monthMax,Number(monthSize), "日期哇");
						if (monthNow >= monthMax) {
							console.log("比大")
							tempArray[1] = Number(monthSize) - 1;
							daySize = maxDate.split(' ')[0].split('-')[2];
							if (dayMax > dayNow) {
								hourSize = 23
								minuteSize = 59
								secondSize = 59
							} else {
								hourSize = maxDate.split(' ')[1].split(':')[0];
								tempArray[2] = Number(daySize) - 1;
								if (hourNow < hourMax) {
									minuteSize = 59
									secondSize = 59
								} else {
									minuteSize = maxDate.split(' ')[1].split(':')[1];
									tempArray[3] = Number(hourSize);
									if (minuteNow < minuteMax) {
										secondSize = 59
									} else {
										secondSize = maxDate.split(' ')[1].split(':')[2];
										tempArray[4] = Number(minuteSize);
										if (secondNow >= secondMax) {
											tempArray[5] = Number(secondSize);
										} 
									}
								}
						
							}
						
						} else {
							console.log("比小")
							if(parseInt(this.data[1].data[tempArray[1]])==2){
							    // 判断当前选择，是否闰年
							    if(parseInt(this.data[0].data[tempArray[0]]) % 4 == 0 && !(parseInt(this.data[0].data[tempArray[0]]) % 100 == 0) || parseInt(this.data[0].data[tempArray[0]]) % 400 == 0) {
							        daySize = 29;
							    }else{
							        daySize = 28;
							    }
							}else if((parseInt(this.data[1].data[tempArray[1]])==1||parseInt(this.data[1].data[tempArray[1]])==3||parseInt(this.data[1].data[tempArray[1]])==5||parseInt(this.data[1].data[tempArray[1]])==7||parseInt(this.data[1].data[tempArray[1]])==8||parseInt(this.data[1].data[tempArray[1]])==10||parseInt(this.data[1].data[tempArray[1]])==12)){
							    daySize = 31;
							}else{
							    daySize = 30;
							}
							hourSize = 23
							minuteSize = 59
							secondSize = 59
							
						}
						
					}
					
					for(let x=1;x<=monthSize;x++){
					    temMonth.push(x<10?("0"+x):x)
					}
					for(let x=1;x<=daySize;x++){
					    temMDay.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=hourSize;x++){
					    temMHour.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=minuteSize;x++){
					    temMMinute.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=secondSize;x++){
					    temMSecond.push(x<10?("0"+x):x)
					}
					
					this.data[1].data = temMonth;
					this.data[2].data = temMDay;
					this.data[3].data = temMHour;
					this.data[4].data = temMMinute;
					this.data[5].data = temMSecond;
					
	
					
					setTimeout(() => {
						this.tempChangeObj=tempArray;
						this.dateValue = tempArray;
					}, 500)
					return;
				} else if (tempArray[1]!=this.tempChangeObj[1]) {
					
					if (yearMax == yearNow && monthMax == monthNow) {
						daySize = maxDate.split(' ')[0].split('-')[2];
						if (dayMax > dayNow) {
							tempArray[2] = Number(dayMax) - 1
							hourSize = 23
							minuteSize = 59;
							secondSize = 59;
						} else {
							hourSize = maxDate.split(' ')[1].split(':')[0];
							console.log(hourMax, hourNow, "改变月")
							if (hourMax > hourNow) {
								minuteSize = 59
								secondSize = 59;
							} else {
								minuteSize = maxDate.split(' ')[1].split(':')[1];
								tempArray[3] = Number(hourSize)
								if (minuteNow < minuteMax) {
									secondSize = 59
								} else {
									secondSize = maxDate.split(' ')[1].split(':')[2];
									tempArray[4] = Number(minuteSize)
									if (secondNow >= secondMax) {
										tempArray[5] = Number(secondSize)
									}
								}
							}
						}
						
					} else {
					
							if(parseInt(this.data[1].data[tempArray[1]])==2){
								// 判断当前选择，是否闰年
								if(parseInt(this.data[0].data[tempArray[0]]) % 4 == 0 && !(parseInt(this.data[0].data[tempArray[0]]) % 100 == 0) || parseInt(this.data[0].data[tempArray[0]]) % 400 == 0) {
									daySize = 29;
								}else{
									daySize = 28;
								}
							}else if((parseInt(this.data[1].data[tempArray[1]])==1||parseInt(this.data[1].data[tempArray[1]])==3||parseInt(this.data[1].data[tempArray[1]])==5||parseInt(this.data[1].data[tempArray[1]])==7||parseInt(this.data[1].data[tempArray[1]])==8||parseInt(this.data[1].data[tempArray[1]])==10||parseInt(this.data[1].data[tempArray[1]])==12)){
								daySize = 31;
							}else{
								daySize = 30;
							}
							hourSize = 23
							minuteSize = 59
							secondSize = 59
						
					}
					
					
										
					for(let x=1;x<=daySize;x++){
						
						temMDay.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=hourSize;x++){
						temMHour.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=minuteSize;x++){
						temMMinute.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=secondSize;x++){
						temMSecond.push(x<10?("0"+x):x)
					}
					
					
					this.data[2].data = temMDay;
					this.data[3].data = temMHour;
					this.data[4].data = temMMinute;
					this.data[5].data = temMSecond;
					
					
					setTimeout(() => {
						this.tempChangeObj=tempArray;
						this.dateValue = tempArray;
					}, 500)
					return;
				} else if (tempArray[2]!=this.tempChangeObj[2]) {
					
					if (yearMax == yearNow && monthMax==monthNow && dayMax == dayNow) {
						hourSize = maxDate.split(' ')[1].split(':')[0];
						if (hourMax > hourNow) {
							minuteSize = 59
							secondSize = 59
						} else {
							minuteSize = maxDate.split(' ')[1].split(':')[1];
							tempArray[3] = Number(hourMax)
							if (minuteNow < minuteMax) {
								secondSize = 59
							} else {
								secondSize = maxDate.split(' ')[1].split(':')[2];
								tempArray[4] = Number(minuteSize)
								if (secondNow >= secondMax) {
									tempArray[5] = Number(secondSize)
								}
							}
						}
						
					} else {
						hourSize = 23
						minuteSize = 59
						secondSize = 59
					
					}
					for(let x=0;x<=hourSize;x++){
						temMHour.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=minuteSize;x++){
						temMMinute.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=secondSize;x++){
						temMSecond.push(x<10?("0"+x):x)
					}
					this.data[3].data = temMHour;
					this.data[4].data = temMMinute;
					this.data[5].data = temMSecond;
					
					setTimeout(() => {
						this.dateValue = tempArray
						this.tempChangeObj=tempArray;
					}, 500)
					
					
					return;
				} else if (tempArray[3]!=this.tempChangeObj[3]) {
					
					if (yearMax == yearNow && monthMax==monthNow && dayMax == dayNow && hourMax == hourNow) {
						minuteSize = maxDate.split(' ')[1].split(':')[1];
						if (minuteNow < minuteMax) {
							secondSize = 59
						} else {
							secondSize = maxDate.split(' ')[1].split(':')[2];
							tempArray[4] = Number(minuteSize)
							if (secondNow >= secondMax) {
								tempArray[5] = Number(secondSize)
							}
							
						}
					} else {
						minuteSize = 59
						secondSize = 59
					}
					for(let x=0;x<=minuteSize;x++){
						temMMinute.push(x<10?("0"+x):x)
					}
					for(let x=0;x<=secondSize;x++){
						temMSecond.push(x<10?("0"+x):x)
					}
					
					this.data[4].data = temMMinute;
					this.data[5].data = temMSecond;
					
					setTimeout(() => {
						this.tempChangeObj=tempArray;
						this.dateValue = tempArray;
					}, 500)
					return;
				} else if (tempArray[4]!=this.tempChangeObj[4]) {
					
					//判断分是否改变
					if (yearMax == yearNow && monthMax==monthNow && dayMax == dayNow && hourMax == hourNow && minuteMax == minuteNow) { 			
						secondSize = maxDate.split(' ')[1].split(':')[2];
						tempArray[5] = Number(secondSize)
					} else {
						secondSize = 59
					}
					for(let x=0;x<=secondSize;x++){
						temMSecond.push(x<10?("0"+x):x)
					}
					
					
					this.data[5].data = temMSecond;
					
					setTimeout(() => {
						this.tempChangeObj=tempArray;
						this.dateValue = tempArray;
					}, 500)
					return;
				}	
				
            },
            // 拨盘滚动开始
            pickStart($event){
                this.isDataFinish = false;
            },
            // 拨盘滚动结束
            pickEnd(){
                this.isDataFinish = true;
            },
            // 执行组件确认按钮绑定方法
            confirmFunction(){
                this.changeObj = [];
                // 组装输出数据
                for(let x=0;x<this.data.length;x++){
                    this.changeObj.push({
                        name:this.data[x].name,
                        $name:this.data[x].$name,
                        value:this.data[x].data[this.tempChangeObj[x]]
                    })
                }
                console.log(this.changeObj)
                // 判断是否正在滚动选择中
                if(!this.isDataFinish){
                    return false;
                }
                // 执行默认方法
                this.$refs.popup.close();
                // #ifdef MP-WEIXIN
                    // 判断父组件是否传递过来确认方法
                    // 次数区别处理，用以为 this.$listeners在微信小程序内获取为{}对象
                    if(this.$parent[this.mpWeixinConfirm]){
                        // 执行父组件传递过来的方法
                        this.$emit("confirm",this.changeObj);
                    }
                    return false;
                // #endif
                
                // 判断父组件是否传递过来确认方法
                if(this.$listeners['confirm']){
                    // 执行父组件传递过来的方法
                    this.$emit("confirm",this.changeObj);
                }
            },
            // 执行组件取消按钮绑定方法
            cancelFunction(){
                // #ifdef MP-WEIXIN
                    // 判断父组件是否传递过来取消方法
                    // 次数区别处理，用以为 this.$listeners在微信小程序内获取为{}对象
                    if(this.$parent[this.mpWeixinCancel]){
                        // 执行父组件传递过来的方法
                        this.$emit("cancel");
                    }else{
                        // 执行默认方法
                        this.$refs.popup.close();
                    }
                    return false;
                // #endif
                
                // 判断父组件是否传递过来取消方法
                if(this.$listeners['cancel']){
                    // 执行父组件传递过来的方法
                    this.$emit("cancel");
                }else{
                    // 执行默认方法
                    this.$refs.popup.close();
                }
            },
        }
    }
</script>

<style scoped>
	.popupBox {
		background-color: #fff;
	}
    .dtitle{
        display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 750rpx;
		height: 80rpx;
		padding: 0 10rpx;
    }
	.dConfirm-text {
		font-size: 32rpx;
		
		color: #4396F8;
	}
	.dClose-text {
		font-size: 32rpx;
		
	}
    /* 拨盘公共样式 */
    .picker-view {
        width: 750rpx;
        height: 500rpx;
    }
	.item {
		height: 34px;
		line-height: 34px;
        text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
    }
</style>