var model=require('../model/subway_model');
var utils = require('gmdp').init_gmdp.core_app_utils;


/**
 * 获取站点所有显示数值型数据
 * @param param
 * @param cb
 */
exports.listSiteData=function(param,cb){
    if(param.timeType=="hour"&&!isNull(param.queryData)&&!isNull(param.station_name)){

        model.QU_SUBWAY_ST_H.find({TIME_ID:param.queryData,STATION_NAME:param.station_name},function (err,res){

            if(err)
                cb();
            else{

                var data={};
                for(var i in res){
                    for(var j in res[i]["_doc"]){
                        data[j]=res[i]["_doc"][j];
                    }
                }



                data=checkData(data);
                cb(utils.returnMsg(true,'0000','查询成功。', data, null));
            }
        });
    }else if(param.timeType=="day"){

    }else{

    }

};

exports.siteInfoListTable=function (para,cb) {

    /**参数检查**/
    for (var i in para) {
        if (isNull(para[i])) {
            cb(utils.returnMsg4EasyuiPaging(false, '0001', '查询失败。', null, 0));
            return 0;
        }
    }


    model.QU_SUBWAY_ST_H.find({TIME_ID: {$in: getTimeList(para.queryData)}, STATION_NAME: para.station_name}
        , null
        , {skip: (parseInt(para.page) - 1) * para.length, limit: parseInt(para.length),sort:{HTTP_TOTAL_USER_CNT:-1,GENERAL_TOTAL_USER_CNT:-1,GSM_WL_2G__CONN_RATE:-1,LTE_WL_4G_CONN_RATE:-1}},
        function (err, res) {
            if (err) {
                cb(utils.returnMsg4EasyuiPaging(false, '0001', '查询失败。', null, 0));
            } else {
                model.QU_SUBWAY_ST_H.find({
                        TIME_ID: {$in: getTimeList(para.queryData)},
                        STATION_NAME: para.station_name
                    },
                    function (err, len) {
                        if (err) {
                            cb(utils.returnMsg4EasyuiPaging(false, '0001', '查询失败。', null, 0));
                        } else {
                            cb(utils.returnMsg4EasyuiPaging(true, '0001', '查询成功。', res,len.length));
                        }
                    })

            }
        });
};

exports.cellInfoListTable=function (param,cb) {


    /**参数检查**/
    for (var i in param) {
        if (isNull(param[i])) {
            cb(utils.returnMsg4EasyuiPaging(false, '0001', '查询失败。', null, 0));
            return 0;
        }
    }

    model.siteAndcell.find({STATION_NAME:param.station_name},{STATION_NAME:1,ECI:1,CELL_NAME:1},function (err,res) {
        if(err)
            cb(utils.returnMsg4EasyuiPaging(false,'0000','获取小区列表失败', err, null));
        else{
            var list=[];
            var cellList=[];
            for(var i in res){
                list.push({ECI:res[i].ECI,CELL_NAME:res[i].CELL_NAME});
                cellList.push(new String(res[i].CELL_NAME));
            }

            model.QU_SUBWAY_CELL_H.find({
                    TIME_ID: {$in:getTimeList(param.queryData)},
                    $or: [
                        { HTTP_CELL_NAME:{$in: cellList}},
                        { CELL_NAME_2G:{$in: cellList}},
                        { CELL_NAME_4G:{$in: cellList}},
                        { GENERAL_CELL_NAME:{$in: cellList}}]
                }, null,
                {
                    skip: (parseInt(param.page) - 1) * param.length,
                    limit: parseInt(param.length),
                    sort:{
                        TIME_ID:1,
                        HTTP_CELL_NAME:-1,
                        GENERAL_CELL_NAME:-1,
                        CELL_NAME_2G:-1,
                        CELL_NAME_4G:-1}
                },
                function (err, resu) {
                    if (err)
                        cb(utils.returnMsg4EasyuiPaging(false, '0000', '获取小区表格数据失败', err, null));
                    else {


                        model.QU_SUBWAY_CELL_H.find({
                                TIME_ID: {$in: getTimeList(param.queryData)},
                          $or: [ { HTTP_CELL_NAME:{$in: cellList}},
                              { CELL_NAME_2G:{$in: cellList}},
                              { CELL_NAME_4G:{$in: cellList}},
                              { GENERAL_CELL_NAME:{$in: cellList}}]
                            },function (err,num) {
                            if(err)
                                cb(utils.returnMsg4EasyuiPaging(false, '0000', '获取数据长度失败', err, null));
                            else {
                                cb(utils.returnMsg4EasyuiPaging(true, '0000', '查询成功', resu, num.length));
                            }
                        });
                    }


                });


        }

    });


};







/**
 * 获取左边站点http网络数据，当日所有时间点下的值形成折线图
 * @param param
 * @param cb
 */
exports.listLineDate=function (param,cb) {
    if(param.timeType=="hour"&&!isNull(param.queryData)&&!isNull(param.station_name)){
        model.QU_SUBWAY_ST_H.find({TIME_ID:{$in:getTimeList(param.queryData)},STATION_NAME:param.station_name,HTTP_DL_RATE:{$ne:null}},
            {TIME_ID:1,HTTP_TOTAL_USER_CNT :1,HTTP_TOTAL_FLOW:1,HTTP_RESP_SUCC_RATE:1,HTTP_DL_RATE:1},
            function (err,res) {
            var dd={};
            for(var i in res){
                dd[res[i].TIME_ID]=res[i];
            }
            res=[];
           for(var i in dd){
               res.push(dd[i])
           }
                var TimeList=[];
                var HTTP_TOTAL_USER_CNT_List=[];
                var HTTP_TOTAL_FLOW_List=[];
                var HTTP_RESP_SUCC_RATE_List=[];
                var HTTP_DL_RATE_List=[];
                for(var i in res){
                    TimeList.push(res[i].TIME_ID.substring(8,10));
                    HTTP_TOTAL_USER_CNT_List.push(Number(res[i].HTTP_TOTAL_USER_CNT));
                    HTTP_TOTAL_FLOW_List.push(Number((Number(res[i].HTTP_TOTAL_FLOW)/(1024*1024)).toFixed(2)));
                    HTTP_RESP_SUCC_RATE_List.push(Number(100*Number(res[i].HTTP_RESP_SUCC_RATE).toFixed(2)));
                    HTTP_DL_RATE_List.push(8*(Number(res[i].HTTP_DL_RATE)/(1024)).toFixed(2));
                }
                var data={
                    TimeList:TimeList,
                    HTTP_TOTAL_USER_CNT_List:HTTP_TOTAL_USER_CNT_List,
                    HTTP_TOTAL_FLOW_List:HTTP_TOTAL_FLOW_List,
                    HTTP_RESP_SUCC_RATE_List:HTTP_RESP_SUCC_RATE_List,
                    HTTP_DL_RATE_List:HTTP_DL_RATE_List

                };

                cb(utils.returnMsg(true,'0000','查询成功。', data, null));
            });
        }
    };


/**
 * 根据一个时间计算出当前所有时间节点
 * 入：2018010207
 * 出：2018010200-2018010207
 * @param time
 * @returns {Array}
 */
function getTimeList(time) {
    var timeList=[];
    var stamp=Number(time.substring(8,10));
    for(var i=0;i<=stamp;i++){
        if(i<10)
            timeList.push(time.substring(0,8)+"0"+i);
        else
            timeList.push(time.substring(0,8)+""+i);
    }

    return timeList;
}

/**
 * 用于对显示型数据的展示。对于非正常数据用固定值替代。
 * @param data
 * @returns {*}
 */
function checkData(data) {

    if(isNull(data.GSM_WL_2G_DROP_RATE)){
        data.GSM_WL_2G_DROP_RATE='0.0';
    }
    if(isNull(data.GSM_WL_2G__CONN_RATE)){
        data.GSM_WL_2G__CONN_RATE='0.99';
    }
    if(isNull(data.LTE_WL_4G_DROP_RATE)){
        data.LTE_WL_4G_DROP_RATE='0.0';
    }
    if(isNull(data.LTE_WL_4G_CONN_RATE)){
        data.LTE_WL_4G_CONN_RATE='0.99';
    }
    if(isNull(data.GENERAL_COVER_ID)){
        data.GENERAL_COVER_ID='1';
    }
    if(isNull(data.GENERAL_DL_RATE)){
        data.GENERAL_DL_RATE='500';
    }
    if(isNull(data.GENERAL_TOTAL_FLOW)){
        data.GENERAL_TOTAL_FLOW='150000000';
    }
    if(isNull(data.GENERAL_TOTAL_USER_CNT)){
        data.GENERAL_TOTAL_USER_CNT='250';
    }
    if(isNull(data.HTTP_COVER_ID)){
        data.HTTP_COVER_ID='1';
    }
    if(isNull(data.HTTP_DL_RATE)){
        data.HTTP_DL_RATE='97029.6389879081';
    }
    if(isNull(data.HTTP_RESP_SUCC_RATE)){
        data.HTTP_RESP_SUCC_RATE='0.99';
    }
    if(isNull(data.HTTP_TOTAL_FLOW)){
        data.HTTP_TOTAL_FLOW='200000000';
    }
    if(isNull(data.HTTP_TOTAL_USER_CNT)){
        data.HTTP_TOTAL_USER_CNT='200';
    }


    return data;
    
}

/**
 * 判断空
 * @param str
 * @returns {boolean}
 */
function isNull(str) {
    if(str!=undefined&&str!=null&&str!=''&&str!='null'&&str!='undefined')
        return false;
    else
        return true;
};


    var cc=["Y-1GS-轻轨1号线下麦西站及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线下麦西站及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线下麦西站及隧道LFHB-JQ-12",
        "Y-1GS-轻轨1号线下麦西站及隧道LFHB-JQ-13",
        "Y_1JY_轻轨1号线下麦西站及隧道D_S-0",
        "Y_1JY_轻轨1号线下麦西站及隧道G_S-0",
        "Y-1GS-轻轨1号线将军山站及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线将军山站及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线将军山站及隧道LFHB-JQ-12",
        "Y-1GS-轻轨1号线将军山站及隧道LFHB-JQ-13",
        "Y-1GS-老湾塘站台拉远LFHY-JQ-1",
        "Y_1JY_轻轨1号线将军山站及隧道D_S-0",
        "Y_1JY_轻轨1号线将军山站及隧道G_S-0",
        "Y-1GS-轻轨1号线云潭路站及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线云潭路站及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线云潭路站及隧道LFHB-JQ-12",
        "Y_1JY_轻轨1号线云潭路站及隧道D_S-0",
        "Y_1JY_轻轨1号线云潭路站及隧道G_S-0",
        "Y-1GS-轻轨1号线诚信路站站台及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线诚信路站站台及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线诚信路站站台及隧道LFHB-JQ-12",
        "Y-1GS-轻轨1号线诚信路站站厅LFHB-JQ-10",
        "Y-1GS-轻轨1号线诚信路站站厅LFHB-JQ-11",
        "Y-1GS-轻轨1号线诚信路站站厅LFHB-JQ-12",
        "Y-1GS-轻轨1号线诚信路站站厅LFHB-JQ-13",
        "Y_1JY_轻轨1号线诚信路站站台及隧道D_S-0",
        "Y_1JY_轻轨1号线诚信路站站台及隧道G_S-0",
        "Y_1JY_轻轨1号线诚信路站站厅D_S-0",
        "Y_1JY_轻轨1号线诚信路站站厅G_S-1",
        "1GS-轻轨1号线诚信路站台LEHB-JQ-10",
        "1GS-轻轨1号线诚信路站厅LEHB-JQ-11",
        "Y-1GS-轻轨1号线行政中心站及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线行政中心站及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线行政中心站及隧道LFHB-JQ-12",
        "Y-1GS-轻轨1号线行政中心站隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线行政中心站隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线行政中心站隧道LFHB-JQ-12",
        "Y-1GS-轻轨1号线行政中心站隧道LFHB-JQ-13",
        "Y_1JY_轻轨1号线行政中心站及隧道D_S-0",
        "Y_1JY_轻轨1号线行政中心站及隧道G_S-0",
        "Y_1JY_轻轨1号线行政中心站隧道D_S-0",
        "Y-1GS-轻轨1号线会展中心站及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线会展中心站及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线会展中心站及隧道LFHB-JQ-12",
        "1GS-轻轨1号线会展中心站台站厅LEHB-JQ-10",
        "Y_1JY_轻轨1号线会展中心站及隧道D_S-0",
        "Y_1JY_轻轨1号线会展中心站及隧道G_S-0",
        "Y-1GS-轻轨1号线朱家湾站站厅LFHB-JQ-10",
        "Y-1GS-轻轨1号线朱家湾站站厅LFHB-JQ-11",
        "Y-1GS-轻轨1号线朱家湾站站厅LFHB-JQ-12",
        "Y-1GS-轻轨1号线朱家湾站站厅LFHB-JQ-13",
        "Y-1GS-轻轨1号线朱家湾站站台及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线朱家湾站站台及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线朱家湾站站台及隧道LFHB-JQ-12",
        "1JY_轻轨1号线大关站站台及隧道D_S-0",
        "1JY_轻轨1号线大关站站台及隧道G_S-0",
        "1JY_轻轨1号线大关站站厅D_S-0",
        "1JY_轻轨1号线大关站站厅G_S-1",
        "Y_1JY_轻轨1号线朱家湾站站台及隧道D_S-0",
        "Y_1JY_轻轨1号线朱家湾站站台及隧道G_S-0",
        "Y_1JY_轻轨1号线朱家湾站站厅D_S-0",
        "Y_1JY_轻轨1号线朱家湾站站厅G_S-1",
        "Y-1GS-轻轨1号线大寨站站厅LFHB-JQ-10",
        "Y-1GS-轻轨1号线大寨站站厅LFHB-JQ-11",
        "Y-1GS-轻轨1号线大寨站站厅LFHB-JQ-12",
        "Y-1GS-轻轨1号线大寨站站厅LFHB-JQ-13",
        "Y-1GS-轻轨1号线大寨站站台及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线大寨站站台及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线大寨站站台及隧道LFHB-JQ-12",
        "Y_1JY_轻轨1号线大寨站站台及隧道D_S-0",
        "Y_1JY_轻轨1号线大寨站站台及隧道G_S-0",
        "Y_1JY_轻轨1号线大寨站站厅D_S-0",
        "Y_1JY_轻轨1号线大寨站站厅G_S-1",
        "Y-1GS-轻轨1号线大关站站台及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线大关站站台及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线大关站站台及隧道LFHB-JQ-12",
        "Y-1GS-轻轨1号线大关站站厅LFHB-JQ-10",
        "Y-1GS-轻轨1号线大关站站厅LFHB-JQ-11",
        "Y-1GS-轻轨1号线大关站站厅LFHB-JQ-12",
        "Y-1GS-轻轨1号线大关站站厅LFHB-JQ-13",
        "Y-1GS-轻轨1号线贵阳北站站台及隧道LFHB-JQ-10",
        "Y-1GS-轻轨1号线贵阳北站站台及隧道LFHB-JQ-11",
        "Y-1GS-轻轨1号线贵阳北站站台及隧道LFHB-JQ-12",
        "Y-1GS-轻轨1号线贵阳北站站台及隧道LFHB-JQ-13",
        "Y-1GS-轻轨1号线贵阳北站站厅LFHB-JQ-10",
        "Y-1GS-轻轨1号线贵阳北站站厅LFHB-JQ-11",
        "Y-1GS-轻轨1号线贵阳北站站厅LFHB-JQ-12",
        "Y-1GS-轻轨1号线贵阳北站站厅LFHB-JQ-13",
        "1GS-轻轨1号线贵阳北站台LEHB-JQ-10",
        "1GS-轻轨1号线贵阳北站厅LEHB-JQ-11",
        "1JY_轻轨1号线贵阳北站站台及隧道D_S-0",
        "1JY_轻轨1号线贵阳北站站台及隧道G_S-0",
        "1JY_轻轨1号线贵阳北站站厅D_S-0",
        "1JY_轻轨1号线贵阳北站站厅G_S-1"];



var exec=require('child_process').exec;
var option={timeout:10000,
    killSignal:'SIGKILL'}

/**
 * 用于显示文件读取情况
 * @param path
 * @param para
 * @param cb
 */
exports.listFileData=function (path,para,cb) {
    var cmd="ls ";
    if(path!=undefined&&path!=null&&path!="")
        cmd=cmd+path;
    else
        cmd=cmd+"/Users/dengqian/Downloads/ftpData";
    if(para!=undefined&&para!=null&&para!="")
        cmd=cmd+"|grep "+para;
    else
        cmd=cmd;
    exec(cmd,option,function (err,stdout,stderr) {
        if(err){
            cb({err:err,stdout:stdout,stderr:stderr,category:null});
        }else{
            console.log(stdout);
            var category={};
            var time={};
            var result=[];
            var cc=stdout.split('\n');
            for(var i in cc) {
                if(i!=''&&cc[i]!=''){
                    var res = cc[i].match(/^[a-zA-Z_2G4G]*/g); //使用g选项，全局匹配
                    res=res.toString().substr(0, res.toString().length - 1);
                    category[res]=res;
                }
            }
            for(var i in cc){
                if(i!=''&&cc[i]!='') {
                    var res = cc[i].match(/\d{8}/g);
                    time[res] = res;
                }
            }
            for(var i in time){
                result.push({name:i,data:[]});
            }
            var jj=0;
            for(var j in time){
                for(var i in category){
                    var num=0;
                    for(var y in cc){
                        var res=cc[y].match(i+time[j]);
                        if(res!=null)
                            num++
                    }
                    result[jj].data.push(num);
                }
                jj++;
            }
            var x=[];
            for(var i in category)
                x.push(i.toString().substr(0, i.toString().length - 1));
            cb({err:err,stdout:stdout,stderr:stderr,result:result,category:x});
        }
    });
};

/**
 * 获取小区列表中的小区
 * @param param
 * @param cb
 */
exports.getCell=function (param,cb) {
    model.siteAndcell.find({STATION_NAME:param.site},{STATION_NAME:1,ECI:1,CELL_NAME:1},function (err,res) {
            if(err)
                cb(utils.returnMsg(true,'0000','获取小区列表失败', err, null));
            else{
                    var list=[];
                    for(var i in res){
                        list.push({ECI:res[i].ECI,CELL_NAME:res[i].CELL_NAME});
                    }
                    cb(list);
            }

    });
};

/**
 * 获取当日小区数据不同小区不同指标不同时间点。
 * @param param
 * @param cb
 */
exports.listCellLineData=function (param,cb) {
    model.siteAndcell.find({STATION_NAME:param.station_name},{STATION_NAME:1,ECI:1,CELL_NAME:1},function (err,res) {
        if(err)
            console.log(utils.returnMsg(true,'0000','获取小区列表失败', err, null));
        else{
            var list=[];
            var cellList=[];
            for(var i in res){
                list.push({ECI:res[i].ECI,CELL_NAME:res[i].CELL_NAME});
                cellList.push(new String(res[i].CELL_NAME));
            }
            var cellData={};
            model.QU_SUBWAY_CELL_H.find({TIME_ID:{$in:getTimeList(param.queryData)},HTTP_CELL_NAME:{$in:cellList}
            },function (err,res) {
                if (err)
                    console.log(err);
                else {
                    for(var i in res){
                        cellData[res[i].HTTP_CELL_NAME]={HTTP_TOTAL_USER_CNT:[],
                            HTTP_TOTAL_FLOW:[],
                            HTTP_RESP_SUCC_RATE:[],
                            HTTP_DL_RATE:[]
                        };
                    };

                    for(var i in res){
                        cellData[res[i].HTTP_CELL_NAME]['HTTP_TOTAL_USER_CNT'].push(
                            res[i].HTTP_TOTAL_USER_CNT);


                        cellData[res[i].HTTP_CELL_NAME]['HTTP_TOTAL_FLOW'].push(
                            (Number(res[i].HTTP_TOTAL_FLOW)/(1024*1024)).toFixed(2));


                        cellData[res[i].HTTP_CELL_NAME]['HTTP_RESP_SUCC_RATE'].push(
                            (100*Number(res[i].HTTP_RESP_SUCC_RATE)).toFixed(2)
                        );
                        cellData[res[i].HTTP_CELL_NAME]['HTTP_DL_RATE'].push(
                            ((Number(res[i].HTTP_DL_RATE)*8)/(1024)).toFixed(2)
                        );
                    }

                    var suitLineData={HTTP_RESP_SUCC_RATE:[],HTTP_DL_RATE:[],HTTP_TOTAL_FLOW:[],HTTP_TOTAL_USER_CNT:[]};


                    var color=['#df111a',
                        '#df8012',
                        '#d7df1e',
                        '#0edf1b',
                        '#03dfde',
                        '#060cdf',
                        '#df09de',
                        '#df5b5b',
                        '#dfa688',
                        '#dddf88',
                        '#9bdf9c',
                        '#9fd5df',
                        '#6a6cdf',
                        '#100202',
                        '#100202',
                        '#878388',
                        '#3395f3',

                    ];
                    var num=0;
                    for(var i in cellData){
                        suitLineData.HTTP_RESP_SUCC_RATE.push({
                            name:i,
                            value: cellData[i].HTTP_RESP_SUCC_RATE,
                            color: color[num],
                            line_width: 2
                        });
                        suitLineData.HTTP_DL_RATE.push({
                            name:i,
                            value: cellData[i].HTTP_DL_RATE,
                            color: color[num],
                            line_width: 2
                        });
                        suitLineData.HTTP_TOTAL_FLOW.push({
                            name:i,
                            value: cellData[i].HTTP_TOTAL_FLOW,
                            color: color[num],
                            line_width: 2
                        });
                        suitLineData.HTTP_TOTAL_USER_CNT.push({
                            name:i,
                            value: cellData[i].HTTP_TOTAL_USER_CNT,
                            color: color[num],
                            line_width: 2
                        });
                        num++;
                    }

                    var label=[];
                    var time=getTimeList(param.queryData);
                    for(var i in time){
                        label.push(time[i].substring(8,10));
                    }
                    cb({label:label,suitLineData:suitLineData});

                }
            });


        }

    });

};






