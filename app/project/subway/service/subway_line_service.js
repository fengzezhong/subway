/**
 *Created by fungdong on 2018/1/15
 *
 */


var express = require('express');
var model = require('../model/subway_model');
var utils = require('gmdp').init_gmdp.core_app_utils;


/**
 *
 * @param queryData 查询时间
 * @param subway_id 线路
 * @param cb 回调函数，返回值
 *
 * 天的数据查询
 * 根据查询条件获取值，并处理为成品数据，返回到前台
 */

exports.getDayLineAll = function (queryData, subway_id, cb) {

    if (subway_id == '线路选择' || subway_id == null || subway_id == undefined) {
        subway_id = '一号线';
    }
    if( queryData == '' || queryData ==undefined || queryData == null) {
        queryData = new Date();
    } else {

        queryData = new Date(queryData +':00:00');
    }


    var queryTime = queryData;


    var query = [];

    for (var i = 0; i < 10; i++) {

        var newQueryTime1 = queryTime - i * 86400000;
        var newQueryTime = new Date(newQueryTime1);
        var queryMonth = newQueryTime.getMonth() + 1;
        var queryDay = newQueryTime.getDate();

        query.push((newQueryTime.getFullYear()) + '' + ((queryMonth < 10) ? '0' + queryMonth : queryMonth) + '' + ((queryDay < 10) ? '0' + queryDay : queryDay));


    }

    //流量人数图表数据
    model.DM_SUBWAY_BUSI_ANAL_D.find({TIME_ID: {$in: query}, SUBWAY_NAME: subway_id}, function (err, result) {

        if (err) cb(utils.returnMsg(false,'0000','查询错误', err, null));

        else {

            var userCnt = [];
            var flowCnt = [];

            for (var i in result) {

                //线路概览数据
                var USER_CNT = Number(result[result.length - 1].USER_CNT);
                var all_USER_CNT = 1440 * 10;

                var overView = {

                    data: [
                        {data: 10000 - USER_CNT, color: "#d6d6e1"},
                        {data: USER_CNT, color: "#0c29f0"}
                    ], data2: [
                        {
                            data: 100 - Number(result[result.length - 1].TOTAL_FLOW / (1024 * 1024 * 1024)).toFixed(2),
                            color: "#d6d6e1"
                        },
                        {
                            data: Number(result[result.length - 1].TOTAL_FLOW / (1024 * 1024 * 1024)).toFixed(2),
                            color: "#bc10a3"
                        }
                    ], data3: [
                        {data: USER_CNT, color: "#ff1103"},
                        {data: all_USER_CNT, color: "#8f6bbd"},
                        {show: checkLevel(USER_CNT, all_USER_CNT)}
                    ]
                };


                //折线柱形组合图数据
                userCnt.push({
                    name: result[i].TIME_ID.substr(4, 2) + '月' + result[i].TIME_ID.substr(6, 2)+'日',
                    value: Number(result[i].USER_CNT),
                    color: '#c52120'
                });


                flowCnt.push(Number(result[i].TOTAL_FLOW / (1024 * 1024 * 1024)).toFixed(2));
                var line = {

                    //总人数数组
                    user: userCnt,

                    //流量值数组
                    flow: [
                        {
                            name: '',
                            value: flowCnt,
                            color: '#34a1d9',
                            line_width: 5
                        }
                    ]
                };




            }


        }


        //热门业务排行榜数据
        var queryMonth1 = queryTime.getMonth() + 1;
        var queryDay1 = queryTime.getDate();
        var newDay = (newQueryTime.getFullYear()) + '' + ((queryMonth1 < 10) ? '0' + queryMonth1 : queryMonth1) + '' + ((queryDay1 < 10) ? '0' + queryDay1 : queryDay1);

        model.DM_SUBWAY_APP_ANAL_D.find({TIME_ID: {$regex:newDay}, SUBWAY_NAME: subway_id},function (err, result) {

            var rankingData=[];
            if (err) cb(utils.returnMsg(false,'0000','查询错误', err, null));
            else {

                if(result.length !=0  ){
                    var rankingData_=[];
                    var newArray=[];


                    for (var i in result) {
                        rankingData_.push({
                            APP_SUBTYPE_NAME:result[i].APP_SUBTYPE_NAME, TOTAL_FLOW:parseInt(result[i].TOTAL_FLOW)
                        });
                    }

                    rankingData_=utils.sortObj(rankingData_,'TOTAL_FLOW','hello');

                    for(var i in rankingData_){
                        if(rankingData_[i].APP_SUBTYPE_NAME !=='')  newArray.push(rankingData_[i]);
                    }



                    //排行榜数据
                    for(var i=0;i<=4;i++){
                        rankingData.push({name: newArray[i].APP_SUBTYPE_NAME, value: (Number(newArray[i].TOTAL_FLOW)/(1024*1024*1024)).toFixed(2)});
                    }

                }
            }

            // 站点流量表
            model.QU_SUBWAY_ST_H.find({TIME_ID : {$regex:newDay}, SUBWAY_NAME: subway_id},function (err,result) {
                if(err) cb(utils.returnMsg(false,'0000','查询错误', err, null));
                else {

                    var stationFlow =[];
                    for(var i in result){

                        if( result[i].GENERAL_TOTAL_FLOW !==undefined){

                            stationFlow.push({name: result[i].STATION_NAME, value:  result[i].GENERAL_TOTAL_FLOW});

                        }

                        if(result[i].HTTP_TOTAL_FLOW !==undefined){

                            stationFlow.push({name: result[i].STATION_NAME,  value: result[i].HTTP_TOTAL_FLOW});
                        }

                    }

                    var aa =  getStationData(stationFlow);


                    var stationName = [];
                    var stationFlowData = [];
                    for(var z in aa){

                        stationName.push(aa[z].name);
                    }
                    for(var z in aa){

                        stationFlowData.push({name: aa[z].name,value:Number(aa[z].value).toFixed(2)});
                    }

                    var  nightData = {

                        legend: stationName,
                        data: stationFlowData
                    };




                    cb(utils.returnMsg(true, '1000', '查询数据成功。', {
                        nightData: nightData,
                        overView: overView,
                        line: line,
                        rankingData: rankingData
                    }, null));

                }
            });


        });


    });

};


/**
 *
 * @param queryData 查询时间
 * @param subway_id 线路
 * @param cb 回调函数，返回值
 *
 * 月的数据查询
 * 根据查询条件获取值，并处理为成品数据，返回到前台
 */
exports.getHourLineAll = function (queryData, subway_id, cb) {


    if (subway_id == '线路选择' || subway_id == null || subway_id == undefined) {
        subway_id = '一号线';
    }
    if( queryData == '' || queryData ==undefined || queryData == null) {
        queryData = new Date();
    }else {

        var queryTime = new Date(queryData +':00:00');

    }


    var query = [];

    for (var i = 0; i < 10; i++) {

        var newQueryTime1 = queryTime - i * 3600000;
        var newQueryTime = new Date(newQueryTime1);
        var queryMonth = newQueryTime.getMonth() + 1;
        var queryDay = newQueryTime.getDate();
        var queryHour = newQueryTime.getHours();

        query.push((newQueryTime.getFullYear()) + '' + ((queryMonth < 10) ? '0' + queryMonth : queryMonth) + '' + ((queryDay < 10) ? '0' + queryDay : queryDay)+ '' + ((queryHour < 10) ? '0' + queryHour : queryHour));


    }


    //流量人数图表数据
    model.DM_SUBWAY_BUSI_ANAL_H.find({TIME_ID: {$in: query}, SUBWAY_NAME: subway_id}, function (err, result) {


        if (err) cb(utils.returnMsg(false,'0000','查询错误', err, null));

        else {

            var userCnt = [];
            var flowCnt = [];

            for (var i in result) {

                //线路概览数据
                var USER_CNT = Number(result[result.length - 1].USER_CNT);
                var all_USER_CNT = 1440 * 10;

                var overView = {

                    data: [
                        {data: 10000 - USER_CNT, color: "#d6d6e1"},
                        {data: USER_CNT, color: "#0c29f0"}
                    ], data2: [
                        {
                            data: 100 - Number(result[result.length - 1].TOTAL_FLOW / (1024 * 1024 * 1024)).toFixed(2),
                            color: "#d6d6e1"
                        },
                        {
                            data: Number(result[result.length - 1].TOTAL_FLOW / (1024 * 1024 * 1024)).toFixed(2),
                            color: "#bc10a3"
                        }
                    ], data3: [
                        {data: USER_CNT, color: "#ff1103"},
                        {data: all_USER_CNT, color: "#8f6bbd"},
                        {show: checkLevel(USER_CNT, all_USER_CNT)}
                    ]
                };


                //折线柱形组合图数据
                userCnt.push({
                    name: result[i].TIME_ID.substr(6, 2) + '日' + result[i].TIME_ID.substr(8, 2)+'时',
                    value: Number(result[i].USER_CNT),
                    color: '#c52120'
                });
                flowCnt.push(Number(result[i].TOTAL_FLOW / (1024 * 1024 * 1024)).toFixed(2));
                var line = {

                    //总人数数组
                    user: userCnt,

                    //流量值数组
                    flow: [
                        {
                            name: '',
                            value: flowCnt,
                            color: '#34a1d9',
                            line_width: 5
                        }
                    ]
                };


            }


        }


        //DM_SUBWAY_APP_ANAL_H

        var queryMonth1 = queryTime.getMonth() + 1;
        var queryDay1 = queryTime.getDate();
        var queryHour1 = queryTime.getHours();
        var newDay = (newQueryTime.getFullYear()) + '' + ((queryMonth1 < 10) ? '0' + queryMonth1 : queryMonth1) + '' + ((queryDay1 < 10) ? '0' + queryDay1 : queryDay1)+ '' + ((queryHour1 < 10) ? '0' + queryHour1 : queryHour1);


        //热门业务排行榜数据
        model.DM_SUBWAY_APP_ANAL_H.find({TIME_ID: newDay, SUBWAY_NAME: subway_id}, function (err, result) {


            if (err) cb(utils.returnMsg(false,'0000','查询错误', err, null));
            else {

                if(result.length !=0  ){
                    var rankingData_=[];
                    var newArray=[];
                    var rankingData=[];

                    for (var i in result) {
                        rankingData_.push({
                            APP_SUBTYPE_NAME:result[i].APP_SUBTYPE_NAME, TOTAL_FLOW:parseInt(result[i].TOTAL_FLOW)
                        });
                    }

                    rankingData_=utils.sortObj(rankingData_,'TOTAL_FLOW','hello');

                    for(var i in rankingData_){
                        if(rankingData_[i].APP_SUBTYPE_NAME !=='')  newArray.push(rankingData_[i]);
                    }



                    //排行榜数据
                    for(var i=0;i<=4;i++){
                        rankingData.push({name: newArray[i].APP_SUBTYPE_NAME, value: (Number(newArray[i].TOTAL_FLOW)/(1024*1024*1024)).toFixed(2)});
                    }




                }



            }
            // 站点流量表
            model.QU_SUBWAY_ST_H.find({TIME_ID : {$regex: newDay}, SUBWAY_NAME: subway_id},function (err,result) {
                if(err) cb(utils.returnMsg(false,'0000','查询错误', err, null));
                else {

                    var stationFlow =[];
                    for(var i in result){
                        if( result[i].GENERAL_TOTAL_FLOW !==undefined){

                            stationFlow.push({name: result[i].STATION_NAME, value:  result[i].GENERAL_TOTAL_FLOW});

                        }
                        if(result[i].HTTP_TOTAL_FLOW !==undefined){

                            stationFlow.push({name: result[i].STATION_NAME,  value: result[i].HTTP_TOTAL_FLOW});
                        }

                    }

                    var aa =  getStationData(stationFlow);


                    var stationName = [];
                    var stationFlowData = [];
                    for(var z in aa){

                        stationName.push(aa[z].name);
                    }
                    for(var z in aa){

                        stationFlowData.push({name: aa[z].name,value:Number(aa[z].value).toFixed(2)});
                    }

                    var  nightData = {

                        legend: stationName,
                        data: stationFlowData
                    };



                    cb(utils.returnMsg(true, '1000', '查询数据成功。', {
                        nightData: nightData,
                        overView: overView,
                        line: line,
                        rankingData: rankingData
                    }, null));

                }
            });


        });


    });

};






/**
 *
 * @param time 查询时间，以天为单位
 * @param subway_id 线路id
 * @param page 页数
 * @param length 每页个数
 * @param cb 返回数据
 *
 * 数据表格数据
 */

exports.lineAllData = function (time , subway_id, page,length ,sortItem, cb) {


    if (subway_id == '线路选择' || subway_id == null || subway_id == undefined) {
        subway_id = '一号线';
    }

    if( time == '' || time ==undefined || time == null) {
        time = new Date('2018-01-22');
    } else {

        time = new Date(time +':00:00');
    }

   var queryDay =  (time.getFullYear()) + '' + (((time.getMonth()+1) < 10) ? '0' + (time.getMonth()+1) : (time.getMonth()+1)) + '' + ((time.getDate() < 10) ? '0' + time.getDate() : time.getDate())


    //查询并排序应用数据
    var query = model.DM_SUBWAY_APP_ANAL_H.find( {  SUBWAY_NAME: subway_id,TIME_ID: {$regex:queryDay}});
    query.skip((parseInt(page) - 1) * length);
    query.limit(parseInt(length));
    if(sortItem!=null&&sortItem!=undefined&&sortItem!='')
    query.sort(sortItem);

    query.exec({  SUBWAY_NAME: '一号线',TIME_ID: {$regex:queryDay}},function (err ,result) {
        if(err)
            cb(utils.returnMsg(false, '0000', '查询失败。', null, err));
        else{






             model.DM_SUBWAY_APP_ANAL_H.find( {  SUBWAY_NAME: subway_id,TIME_ID: {$regex:queryDay}},function (err,rs) {
                 cb(utils.returnMsg4EasyuiPaging(true, '1000', '查询数据成功。', result, rs.length));

             });


        }


    });



};


/**
 *
 * @param time 查询时间，以天为单位
 * @param subway_id 线路id
 * @param page 页数
 * @param length 每页个数
 * @param cb 返回数据
 *
 * 数据表格数据
 */
exports.lineAllDataBuss = function (time , subway_id, page,length , cb) {


    if (subway_id == '线路选择' || subway_id == null || subway_id == undefined) {
        subway_id = '一号线';
    }

    if( time == '' || time ==undefined || time == null) {
        time = new Date('2018-01-22');
    } else {

        time = new Date(time +':00:00');
    }

    var queryDay =  (time.getFullYear()) + '' + (((time.getMonth()+1) < 10) ? '0' + (time.getMonth()+1) : (time.getMonth()+1)) + '' + ((time.getDate() < 10) ? '0' + time.getDate() : time.getDate())

    //查询并排序业务数据
    var query = model.DM_SUBWAY_BUSI_ANAL_H.find( {  SUBWAY_NAME: subway_id,TIME_ID: {$regex:queryDay}});
    query.skip((parseInt(page) - 1) * length);
    query.limit(parseInt(length));
     /*if(sortItem!=null&&sortItem!=undefined&&sortItem!='')
         query.sort(sortItem);*/
    query.exec({  SUBWAY_NAME: '一号线',TIME_ID: {$regex:queryDay}},function (err ,result) {
        if(err)
            cb(utils.returnMsg(false, '0000', '查询失败。', null, err));
        else{
            model.DM_SUBWAY_BUSI_ANAL_H.find( {  SUBWAY_NAME: subway_id,TIME_ID: {$regex:queryDay}},function (err,rs) {
                console.log(result);
                cb(utils.returnMsg4EasyuiPaging(true, '1000', '查询数据成功。', result, rs.length));
            });
        }
    });
};


/**
 * 获取得分后，详细指标数据
 * @param station 点击的站点名
 * @param time 查询时间
 * @param cb
 */
exports.getCodeAllData = function (station , time ,cb) {

    //获取当前时间，是否与传入的时间一致，一致可能没数据，所以要赋值
    var  currentDate=new Date();
    currentDate=new Date(currentDate-86400000);
    var lastDay=currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+(currentDate.getDate());
    var currHours=new Date().getHours()<10?"0"+new Date().getHours():new Date().getHours();
    var newDayHour = lastDay +' '+currHours +':00';

    // console.log((newDayHour == time));

    if(newDayHour = time){
        time = new Date('2018-02-02 12:00');
    }
    else {
        time = new Date(time);
    }

    //生成查询时间
    var newTimeAll = [];
    for (var i = 0; i < 10; i++) {

        var newQueryTime1 = time - i * 3600000;
        var newQueryTime = new Date(newQueryTime1);
        var queryMonth = newQueryTime.getMonth() + 1;
        var queryDay = newQueryTime.getDate();
        var queryHour = newQueryTime.getHours();

        newTimeAll.push((newQueryTime.getFullYear()) + '' + ((queryMonth < 10) ? '0' + queryMonth : queryMonth) + '' + ((queryDay < 10) ? '0' + queryDay : queryDay)+ '' + ((queryHour < 10) ? '0' + queryHour : queryHour));
    }


    //站点详细数据查询
    model.QU_SUBWAY_ST_H.find({ TIME_ID :{$in :newTimeAll},STATION_NAME:station,
        '$or':[{HTTP_TOTAL_USER_CNT:{$ne:null}},{GENERAL_TOTAL_USER_CNT:{$ne:null}}]},function (err,result) {

        if(err)
            cb(utils.returnMsg(false, '0000', '查询失败。', null, err));
        else{


            var day = []; //前台展示的时间
            var allUser = []; //前台展示的总用户数
            var allFlow = [];  //前台展示的总流量
            var allRate = [];  //前台展示的下载速率
            var httpResp = [];  //前台展示的HTTP响应成功率


            //加工数据，生成各个需要的字表集合
            var obj = {};
            for(var i in result){
                 obj[result[i].TIME_ID] = {GENERAL_TOTAL_USER_CNT:[],GENERAL_TOTAL_FLOW:[],GENERAL_DL_RATE:[],
                        HTTP_TOTAL_USER_CNT:[],HTTP_TOTAL_FLOW:[],HTTP_RESP_SUCC_RATE:[],HTTP_DL_RATE:[]};
            }
            for( var i in result){


              if(result[i].GENERAL_TOTAL_USER_CNT !='' && result[i].GENERAL_TOTAL_USER_CNT !=undefined  && result[i].GENERAL_TOTAL_USER_CNT !=null){
                    obj[result[i].TIME_ID].GENERAL_TOTAL_USER_CNT.push(Number(result[i].GENERAL_TOTAL_USER_CNT));
                }
              if(result[i].GENERAL_TOTAL_FLOW !='' && result[i].GENERAL_TOTAL_FLOW !=undefined  && result[i].GENERAL_TOTAL_FLOW !=null){
                  obj[result[i].TIME_ID].GENERAL_TOTAL_FLOW.push((Number(result[i].GENERAL_TOTAL_FLOW))/(1024*1024));
              }
              if(result[i].GENERAL_DL_RATE !='' && result[i].GENERAL_DL_RATE !=undefined  && result[i].GENERAL_DL_RATE !=null){
                  obj[result[i].TIME_ID].GENERAL_DL_RATE.push((Number(result[i].GENERAL_DL_RATE))/(1024));
              }
              if(result[i].HTTP_TOTAL_USER_CNT !='' && result[i].HTTP_TOTAL_USER_CNT !=undefined  && result[i].HTTP_TOTAL_USER_CNT !=null){
                  obj[result[i].TIME_ID].HTTP_TOTAL_USER_CNT.push(Number(result[i].HTTP_TOTAL_USER_CNT));
              }
              if(result[i].HTTP_TOTAL_FLOW !='' && result[i].HTTP_TOTAL_FLOW  !=undefined && result[i].HTTP_TOTAL_FLOW  !=null){
                  obj[result[i].TIME_ID].HTTP_TOTAL_FLOW.push((Number(result[i].HTTP_TOTAL_FLOW))/(1024*1024));
              }
              if(result[i].HTTP_RESP_SUCC_RATE !='' && result[i].HTTP_RESP_SUCC_RATE  !=undefined && result[i].HTTP_RESP_SUCC_RATE  !=null){
                  obj[result[i].TIME_ID].HTTP_RESP_SUCC_RATE.push(Number(result[i].HTTP_RESP_SUCC_RATE));
              }
              if(result[i].HTTP_DL_RATE !='' && result[i].HTTP_DL_RATE !=undefined && result[i].HTTP_DL_RATE !=null){
                  obj[result[i].TIME_ID].HTTP_DL_RATE.push((Number(result[i].HTTP_DL_RATE))/(1024));
              }

            }

           //加工数据，生成准目标数据
            for( var i in obj){

                 day .push(i.substr(6,2) +'日'+ i.substr(8,2)+'时');
                 allUser .push(Math.round(((getAverage(obj[i].GENERAL_TOTAL_USER_CNT) + getAverage(obj[i].HTTP_TOTAL_USER_CNT)))) /200   );
                 allFlow .push(Math.round((getAverage(obj[i].GENERAL_TOTAL_FLOW) + getAverage(obj[i].HTTP_TOTAL_FLOW)))/200);
                 allRate .push(Math.round((getAverage(obj[i].GENERAL_DL_RATE) + getAverage(obj[i].HTTP_DL_RATE)))/200);
                 httpResp .push(Number((((getAverage(obj[i].HTTP_RESP_SUCC_RATE)))*5).toFixed(2)));

            }

            //生成目标数据
            var levelDataAll = {
                day:day
            };

            //生成目标数据
            var codeAll = [
                allUser,//总用户
                allFlow,//总流量
                allRate,//下载速率
                httpResp//HTTP响应成功率
            ];


            cb(utils.returnMsg(true, '1000', '查询数据成功。', {
                levelDataAll :levelDataAll,
                codeAll:codeAll
            }, null));

        }
    });




};



/**
 * 获取得分数据，没算
 * @param cb
 */
exports.getCodeData = function (cb) {

    //得分目标数据
    var levelData = {
        level:[78, 88, 93, 83, 98, 91, 68, 93, 87, 95, 67],
        station:['窦关站', '下麦西站', '老湾塘站', '阅山湖公园站', '林城西路站', '观山湖公园站', '国际生态会议中心站', '阳关站', '新寨站', '白鹭湖站', '贵阳北站']

    };

    cb(utils.returnMsg(true, '1000', '查询数据成功。', {
        levelData :levelData
    }, null));

};

/**
 *
 * 获取得到的数组平均值
 * @param arr
 * @returns {number}
 */
function getAverage(arr) {
    var sum = 0;
    if(arr.length == 0 ){
        return sum;
    }else{
        for(var i=0;i<arr.length;i++){

            sum = Number(arr[i]) +sum;
        }
        return sum/arr.length;
    }


}


//分别获取每个站点的流量数据
function getStationData(array) {

    var aa  = {};
    for(var i in array){

        aa[array[i].name] = 0;

    }
    for(var i in array){

        aa[array[i].name] = aa[array[i].name]+Number(array[i].value)/(1024*1024*1024);
    }

    var bb = [];
    for( var i in aa){
        bb.push({name:i,value:aa[i]});
    }

    return bb;
}





//判断车厢环境是否拥挤
function checkLevel(a, b) {

    var c;
    if (a / b > 0.8) c = '拥挤';
    else if (a / b <= 0.8 && a / b > 0.4) c = '一般';
    else if (a / b < 0.4) c = '舒适';

    return c;

}



