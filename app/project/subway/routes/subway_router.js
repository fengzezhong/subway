/**
 * Created by dengqian on 2017-12-10
 */
var express = require('express');
var service=require('../service/subway_site_service');
var router = express.Router();
var utils = require('gmdp').init_gmdp.core_app_utils;

/**
 * 查询遍历首页数据
 */
router.route('/').get(function (req, res) {
    var param = {
        station_name: req.query.station_name,
        queryData: req.query.queryData,
        timeType: req.query.timeType
    };
    service.listSiteData(param,
        function (data1) {
            service.listLineDate(param,
                function (data2) {
                    utils.respJsonData(res, {site: data1, line: data2});
            });
    });

});

router.route('/getCellLine').get(function (req,res) {
    var param=req.query;
    var flag=true;
    // for (var i in param) {
    //         console.log(i,param[i]);
    // }
    if(flag)
    service.listCellLineData(req.query,function (result) {
        utils.respJsonData(res,result);
    });
    else
        utils.respJsonData(res,null);
});



router.route('/getCell').get(function (req,res) {
    var site=req.query.site;
console.log(site,'---------');
    if(site==undefined||site==null||site=='')
        site='下麦西站';
    service.getCell({site:site},function (result) {
        utils.respJsonData(res,result);
    });
});


router.route('/siteInfoList').post(function (req, res) {
    var page = req.body.page;                  //用于分页查询提供当前页数
    var length = req.body.rows;
    //var sort = req.query.sort;                   //用于点击列头获取需要以哪一列数据作为排序依据
    //var order = req.query.order;                  //用于表示升序排列或者降序排列，只有两个值 'asc' 或者 'desc
    //var sortItem = {sort: sort, order: order};
    var dateType = req.body.dataType;
    var station_name=req.body.station_name;
    var queryData= req.body.queryData;

    var param={
        page:page,
        length:length,
        dateType:dateType,
        station_name:station_name,
        queryData:queryData
    };
    service.cellInfoListTable(param,function (result) {
        utils.respJsonData(res, result);
    });

});



// service.siteInfoListTable({
//     page:1,
//     length:100,
//     sortItem:{},
//     dateType:'hour',
//     station_name:'下麦西站',
//     queryData:'2018012214'},function (result) {
//     console.log(result);
// });
router.route('/siteInfoList').get(function (req, res) {

    var page = req.query.page;                  //用于分页查询提供当前页数
    var length = req.query.rows;

    //var sort = req.query.sort;                   //用于点击列头获取需要以哪一列数据作为排序依据
    //var order = req.query.order;                  //用于表示升序排列或者降序排列，只有两个值 'asc' 或者 'desc
    //var sortItem = {sort: sort, order: order};
    var dateType = req.query.dataType;
    var station_name=req.query.station_name;
    var queryData= req.query.queryData;

    var param={
        page:page,
        length:length,
        dateType:dateType,
        station_name:station_name,
        queryData:queryData
    };

    service.siteInfoListTable(param,function (result) {
        utils.respJsonData(res, result);
    });

});

router.route('/dataFileList').get(function (req,res) {
    var path=req.query.path;
    var para=req.query.para;
    service.listFileData(path,para,function (result) {
        res.send(result);
    })
});

module.exports = router;


