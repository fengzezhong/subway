/**
 * Created by fungdong on 2017-12-10
 */
var express = require('express');
var router = express.Router();
var service=require('../service/subway_line_service');
var utils = require('gmdp').init_gmdp.core_app_utils;


/**
 * 获取数据路由
 */
router.route('/').get(function (req, res ,cb) {

    var getDataForView =  req.query.viewData;
    var queryData = getDataForView.queryData;
    var subway_id = getDataForView.subway_id;
    var timeType = getDataForView.timeType;

    // console.log(timeType);


    // 参数为day的查询路由
   if(timeType=='hour' || timeType ==undefined || timeType == ''){
       service.getHourLineAll(queryData,subway_id,function (result) {

           utils.respJsonData(res, result);
       });


   }else if(timeType=='day'){
       service.getDayLineAll(queryData,subway_id,function (result) {
            console.log(result);
           utils.respJsonData(res, result);
       });
        // 参数为hour的查询路由


   }


});


/**
 * 画图的用户-流量数据表格
 */
router.route("/lineInfoList").post(function (req,res) {



    var page = req.body.page;                  //用于分页查询提供当前页数
    var length = req.body.rows;
    var time =  req.body.queryData;
    var subway_id = req.body.subway_id;

    var sort=req.body.sort;
    var order=req.body.order;
    var sortItem={};
    if(sort!=undefined&&order!=undefined){
        for(var i in sort.split(',')){
            if(order.split(',')[i]=='asc')
                sortItem[sort.split(',')[i]]=1;
            else
                sortItem[sort.split(',')[i]]=-1;
        }
    }
    service.lineAllData(time, subway_id, page, length,sortItem, function (result) {
        utils.respJsonData(res, result);
   });


});

/**
 * 画图的业务数据表格
 */
router.route("/lineInfoListBuss").post(function (req,res) {


    var page = req.body.page;                  //用于分页查询提供当前页数
    var length = req.body.rows;
    var time =  req.body.queryData;
    var subway_id = req.body.subway_id;


    service.lineAllDataBuss(time, subway_id, page, length, function (result) {
        utils.respJsonData(res, result);
    });


});


/**
 * 获取得分的详细参数数据
 * station  页面点取的站点
 * time  页面当前选取的时间
 */
router.route("/getCodeAll").post(function (req,res) {

    var station =  req.body.station;
    var time = req.body.timeType;

    service.getCodeAllData( station , time, function (result) {

        utils.respJsonData(res, result);
    });

});


/**
 * 获取分数路由   未写
 */
router.route("/getCode").post(function (req,res) {

    /*     var time = req.body.timeType;*/

    service.getCodeData( function (result) {

        utils.respJsonData(res, result);
    });

});



module.exports = router;


