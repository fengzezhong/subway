/**
 * Created by dengqian on 2017-10-17
 * 这里包含了地铁场景中小时粒度的数据，其中分为站点、小区、应用分析、业务概览四个大类
 * 其中站点与小区被数据提供方拆分成了四个表，分别是http、2G、4G、general的数据两类合计8个表。
 * 采用四个model对应一个表的方式进行数据持久化。在查询使用过程中通过参数进行过滤与合并。
 */

var mongoUtils = require('gmdp').init_gmdp.core_mongoose_utils;
var mongoose = mongoUtils.init();
var Schema = mongoose.Schema;




/*-------------------------------站点指标粒度模型（小时）-----------------------------------------*/


var DM_SUBWAY_ST_QUAL_HTTP_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // 站点ID
    STATION_ID:String,
    // 站点名称
    STATION_NAME:String,


    // 用户数
    HTTP_TOTAL_USER_CNT:String,
    // 流量
    HTTP_TOTAL_FLOW:String,
    // 页面响应成功率
    HTTP_RESP_SUCC_RATE:String,
    // 下载速率
    HTTP_DL_RATE:String,
    // 覆盖区域
    HTTP_COVER_ID:String
},
    {
        collection: "DM_SUBWAY_ST_QUAL_H"
    });


var DM_SUBWAY_ST_QUAL_2G_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // 站点ID
    STATION_ID:String,
    // 站点名称
    STATION_NAME:String,
    // 2G无线接通率
    GSM_WL_2G__CONN_RATE:String,
    // 2G无线掉线率
    GSM_WL_2G_DROP_RATE:String
    },
    {
        collection: "DM_SUBWAY_ST_QUAL_H"
    });

var DM_SUBWAY_ST_QUAL_4G_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // 站点ID
    STATION_ID:String,
    // 站点名称
    STATION_NAME:String,


    // 4G无线接通率
    LTE_WL_4G_CONN_RATE:String,
    // 4G无线掉线率
    LTE_WL_4G_DROP_RATE:String
},
    {
        collection: "DM_SUBWAY_ST_QUAL_H"
    });

var DM_SUBWAY_ST_QUAL_GENERAL_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // 站点ID
    STATION_ID:String,
    // 站点名称
    STATION_NAME:String,
    // 用户数
    GENERAL_TOTAL_USER_CNT:String,
    // 流量
    GENERAL_TOTAL_FLOW:String,
    // 下载速率
    GENERAL_DL_RATE:String,
    // 覆盖区域
    GENERAL_COVER_ID:String
},
    {
    collection: "DM_SUBWAY_ST_QUAL_H"
    });

exports.DM_SUBWAY_ST_QUAL_GENERAL_H=mongoose.model('DM_SUBWAY_ST_QUAL_GENERAL_H',DM_SUBWAY_ST_QUAL_GENERAL_H);
exports.DM_SUBWAY_ST_QUAL_4G_H=mongoose.model('DM_SUBWAY_ST_QUAL_4G_H',DM_SUBWAY_ST_QUAL_4G_H);
exports.DM_SUBWAY_ST_QUAL_2G_H=mongoose.model('DM_SUBWAY_ST_QUAL_2G_H',DM_SUBWAY_ST_QUAL_2G_H);
exports.DM_SUBWAY_ST_QUAL_HTTP_H=mongoose.model('DM_SUBWAY_ST_QUAL_H',DM_SUBWAY_ST_QUAL_HTTP_H);



/*---------------------------------------地铁小区指标模型（小时）----------------------------------------------*/

var DM_SUBWAY_CELL_QUAL_HTTP_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    HTTP_SUBWAY_NAME:String,
    // 网络类型
    HTTP_RAT:String,
    // LAC
    HTTP_LAC:String,
    // CI
    HTTP_CI:String,
    // 小区名称
    HTTP_CELL_NAME:String,
    // 用户数
    HTTP_TOTAL_USER_CNT:String,
    // 流量
    HTTP_TOTAL_FLOW:String,
    // 页面响应成功率
    HTTP_RESP_SUCC_RATE:String,
    // 下载速率
    HTTP_DL_RATE:String
},{
    collection: "DM_SUBWAY_CELL_QUAL_H"
});


var DM_SUBWAY_CELL_QUAL_2G_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // LAC
    LAC_2G:String,
    // CI
    CI_2G:String,
    // 小区名称
    CELL_NAME_2G:String,
    // 2G无线接通率
    GSM_WL_2G_CONN_RATE:String,
    // 2G无线掉线率
    GSM_WL_2G_DROP_RATE:String
},{
    collection: "DM_SUBWAY_CELL_QUAL_H"
});

var DM_SUBWAY_CELL_QUAL_4G_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // 网络类型
    RAT_4G:String,
    // LAC
    LAC_4G:String,
    // CI
    CI_4G:String,
    // 小区名称
    CELL_NAME_4G:String,
    // 4G无线接通率
    LTE_WL_4G_CONN_RATE:String,
    // 4G无线掉线率
    LTE_WL_4G_DROP_RATE:String
},{
    collection: "DM_SUBWAY_CELL_QUAL_H"
});



var DM_SUBWAY_CELL_QUAL_GENERAL_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,

    // 网络类型
    GENERAL_RAT:String,
    // LAC
    GENERAL_LAC:String,
    // CI
    GENERAL_CI:String,
    // 小区名称
    GENERAL_CELL_NAME:String,
    // 用户数
    GENERAL_TOTAL_USER_CNT:String,
    // 流量
    GENERAL_TOTAL_FLOW:String,
    // 页面响应成功率
    GENERAL_HTTP_RESP_SUCC_RATE:String,
    // 下载速率
    GENERAL_DL_RATE:String
},{
    collection: "DM_SUBWAY_CELL_QUAL_H"
});

exports.DM_SUBWAY_CELL_QUAL_HTTP_H=mongoose.model('DM_SUBWAY_CELL_QUAL_HTTP_H',DM_SUBWAY_CELL_QUAL_HTTP_H);
exports.DM_SUBWAY_CELL_QUAL_2G_H=mongoose.model('DM_SUBWAY_CELL_QUAL_2G_H',DM_SUBWAY_CELL_QUAL_2G_H);
exports.DM_SUBWAY_CELL_QUAL_4G_H=mongoose.model('DM_SUBWAY_CELL_QUAL_4G_H',DM_SUBWAY_CELL_QUAL_4G_H);
exports.DM_SUBWAY_CELL_QUAL_GENERAL_H=mongoose.model('DM_SUBWAY_CELL_QUAL_GENERAL_H',DM_SUBWAY_CELL_QUAL_GENERAL_H);


/*-----------------------------应用与业务相关指标统计（小时）----------------------------------*/

var DM_SUBWAY_APP_ANAL_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // 业务小类ID
    APP_SUBTYPE_ID:String,
    // 业务小类名称
    APP_SUBTYPE_NAME:String,
    // 用户数
    TOTAL_USER_CNT:String,
    // 流量
    TOTAL_FLOW:String
},{
    collection: "DM_SUBWAY_APP_ANAL_H"
});

var DM_SUBWAY_BUSI_ANAL_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    SUBWAY_NAME:String,
    // 用户数
    USER_CNT:String,
    // 总流量
    TOTAL_FLOW:String
},{collection:"DM_SUBWAY_BUSI_ANAL_H"});

exports.DM_SUBWAY_APP_ANAL_H=mongoose.model('DM_SUBWAY_APP_ANAL_H',DM_SUBWAY_APP_ANAL_H);
exports.DM_SUBWAY_BUSI_ANAL_H=mongoose.model('DM_SUBWAY_BUSI_ANAL_H',DM_SUBWAY_BUSI_ANAL_H);


/*----------------------------------------地铁站点指标模型（日）--------------------------------------------------*/

var DM_SUBWAY_ST_QUAL_HTTP_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    STATION_ID:String,
    STATION_NAME:String,
    HTTP_TOTAL_USER_CNT:String,
    HTTP_TOTAL_FLOW:String,
    HTTP_HTTP_RESP_SUCC_RATE:String,
    HTTP_DL_RATE:String,
    HTTP_COVER_ID:String
},{
    collection:"DM_SUBWAY_ST_QUAL_D"
});



var DM_SUBWAY_ST_QUAL_2G_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    STATION_ID:String,
    STATION_NAME:String,
    GSM_WL_2G_CONN_RATE:String,
    GSM_WL_2G_DROP_RATE:String,
    LTE_WL_4G_CONN_RATE:String,
    LTE_WL_4G_DROP_RATE:String
},{
    collection:"DM_SUBWAY_ST_QUAL_D"
});

var DM_SUBWAY_ST_QUAL_4G_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    STATION_ID:String,
    STATION_NAME:String,
    LTE_WL_4G_CONN_RATE:String,
    LTE_WL_4G_DROP_RATE:String
},{
    collection:"DM_SUBWAY_ST_QUAL_D"
});

var DM_SUBWAY_ST_QUAL_GENERAL_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    STATION_ID:String,
    STATION_NAME:String,
    GENERAL_TOTAL_USER_CNT:String,
    GENERAL_TOTAL_FLOW:String,
    GENERAL_DL_RATE:String,
    GENERAL_COVER_ID:String
},{
    collection:"DM_SUBWAY_ST_QUAL_D"
});

exports.DM_SUBWAY_ST_QUAL_HTTP_D=mongoose.model('DM_SUBWAY_ST_QUAL_HTTP_D',DM_SUBWAY_ST_QUAL_HTTP_D);
exports.DM_SUBWAY_ST_QUAL_2G_D=mongoose.model('DM_SUBWAY_ST_QUAL_2G_D',DM_SUBWAY_ST_QUAL_2G_D);
exports.DM_SUBWAY_ST_QUAL_4G_D=mongoose.model('DM_SUBWAY_ST_QUAL_4G_D',DM_SUBWAY_ST_QUAL_4G_D);
exports.DM_SUBWAY_ST_QUAL_GENERAL_D=mongoose.model('DM_SUBWAY_ST_QUAL_GENERAL_D',DM_SUBWAY_ST_QUAL_GENERAL_D);


/*-------------------------------地铁小区指标模型(日)------------------------------------------------*/

var DM_SUBWAY_CELL_QUAL_HTTP_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    HTTP_RAT:String,
    HTTP_LAC:String,
    HTTP_CI:String,
    HTTP_CELL_NAME:String,
    HTTP_TOTAL_USER_CNT:String,
    HTTP_TOTAL_FLOW:String,
    HTTP_HTTP_RESP_SUCC_RATE:String,
    HTTP_DL_RATE:String
    },{
    collection:"DM_SUBWAY_CELL_QUAL_D"
});

var DM_SUBWAY_CELL_QUAL_2G_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    RAT:String,
    LAC:String,
    CI:String,
    CELL_NAME:String,
    GSM_WL_2G_CONN_RATE:String,
    GSM_WL_2G_DROP_RATE:String
},{
    collection:"DM_SUBWAY_CELL_QUAL_D"
});

var DM_SUBWAY_CELL_QUAL_4G_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    RAT:String,
    LAC:String,
    CI:String,
    CELL_NAME:String,
    LTE_WL_4G_CONN_RATE:String,
    LTE_WL_4G_DROP_RATE:String
},{
    collection:"DM_SUBWAY_CELL_QUAL_D"
});

var DM_SUBWAY_CELL_QUAL_GENERAL_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    GENERAL_RAT:String,
    GENERAL_LAC:String,
    GENERAL_CI:String,
    GENERAL_CELL_NAME:String,
    GENERAL_TOTAL_USER_CNT:String,
    GENERAL_TOTAL_FLOW:String,
    GENERAL_HTTP_RESP_SUCC_RATE:String,
    GENERAL_DL_RATE:String
},{
    collection:"DM_SUBWAY_CELL_QUAL_D"
});
exports.DM_SUBWAY_CELL_QUAL_HTTP_D=mongoose.model('DM_SUBWAY_CELL_QUAL_HTTP_D',DM_SUBWAY_CELL_QUAL_HTTP_D);
exports.DM_SUBWAY_CELL_QUAL_2G_D=mongoose.model('DM_SUBWAY_CELL_QUAL_2G_D',DM_SUBWAY_CELL_QUAL_2G_D);
exports.DM_SUBWAY_CELL_QUAL_4G_D=mongoose.model('DM_SUBWAY_CELL_QUAL_4G_D',DM_SUBWAY_CELL_QUAL_4G_D);
exports.DM_SUBWAY_CELL_QUAL_GENERAL_D=mongoose.model('DM_SUBWAY_CELL_QUAL_GENERAL_D',DM_SUBWAY_CELL_QUAL_GENERAL_D);

/*--------------------------------------热门应用分析表(天)-------------------------------------------------*/

var DM_SUBWAY_APP_ANAL_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    APP_SUBTYPE_ID:String,
    APP_SUBTYPE_NAME:String,
    TOTAL_USER_CNT:String,
    TOTAL_FLOW:String
},{
    collection:"DM_SUBWAY_APP_ANAL_D"
});

/*--------------------------------------地铁业务量概览(天)--------------------------------------------*/
var DM_SUBWAY_BUSI_ANAL_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    USER_CNT:String,
    TOTAL_FLOW:String
},{
    collection:"DM_SUBWAY_BUSI_ANAL_D"
});

exports.DM_SUBWAY_APP_ANAL_D=mongoose.model('DM_SUBWAY_APP_ANAL_D',DM_SUBWAY_APP_ANAL_D);
exports.DM_SUBWAY_BUSI_ANAL_D=mongoose.model('DM_SUBWAY_BUSI_ANAL_D',DM_SUBWAY_BUSI_ANAL_D);


/*-------------------------query model---------------------------------*/
var QU_SUBWAY_ST_H=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    STATION_ID:String,
    STATION_NAME:String,
    HTTP_TOTAL_USER_CNT:String,
    HTTP_TOTAL_FLOW:String,
    HTTP_RESP_SUCC_RATE:String,
    HTTP_DL_RATE:String,
    HTTP_COVER_ID:String,
    GSM_WL_2G__CONN_RATE:String,
    GSM_WL_2G_DROP_RATE:String,
    LTE_WL_4G_CONN_RATE:String,
    LTE_WL_4G_DROP_RATE:String,
    GENERAL_TOTAL_USER_CNT:String,
    GENERAL_TOTAL_FLOW:String,
    GENERAL_DL_RATE:String,
    GENERAL_COVER_ID:String
},{
    collection: "DM_SUBWAY_ST_QUAL_H"
});
exports.QU_SUBWAY_ST_H=mongoose.model('QU_SUBWAY_ST_H',QU_SUBWAY_ST_H);







var QU_SUBWAY_CELL_H=new Schema({
    // 时间
    TIME_ID:String,
    // 地市ID
    AREA_ID:String,
    // 地市名称
    AREA_NAME:String,
    // 场景ID
    SCENE_ID:String,
    // 场景名称
    SCENE_NAME:String,
    // 地铁线路ID
    SUBWAY_ID:String,
    // 地铁线路名称
    HTTP_SUBWAY_NAME:String,
    // 网络类型
    HTTP_RAT:String,
    // LAC
    HTTP_LAC:String,
    // CI
    HTTP_CI:String,
    // 小区名称
    HTTP_CELL_NAME:String,
    // 用户数
    HTTP_TOTAL_USER_CNT:String,
    // 流量
    HTTP_TOTAL_FLOW:String,
    // 页面响应成功率
    HTTP_RESP_SUCC_RATE:String,
    // 下载速率
    HTTP_DL_RATE:String,
    // LAC
    LAC_2G:String,
    // CI
    CI_2G:String,
    // 小区名称
    CELL_NAME_2G:String,
    // 2G无线接通率
    GSM_WL_2G_CONN_RATE:String,
    // 2G无线掉线率
    GSM_WL_2G_DROP_RATE:String,
    RAT_4G:String,
    // LAC
    LAC_4G:String,
    // CI
    CI_4G:String,
    // 小区名称
    CELL_NAME_4G:String,
    // 4G无线接通率
    LTE_WL_4G_CONN_RATE:String,
    // 4G无线掉线率
    LTE_WL_4G_DROP_RATE:String,
    GENERAL_RAT:String,
    // LAC
    GENERAL_LAC:String,
    // CI
    GENERAL_CI:String,
    // 小区名称
    GENERAL_CELL_NAME:String,
    // 用户数
    GENERAL_TOTAL_USER_CNT:String,
    // 流量
    GENERAL_TOTAL_FLOW:String,
    // 页面响应成功率
    GENERAL_HTTP_RESP_SUCC_RATE:String,
    // 下载速率
    GENERAL_DL_RATE:String
},{
    collection: "DM_SUBWAY_CELL_QUAL_H"
});
exports.QU_SUBWAY_CELL_H=mongoose.model('QU_SUBWAY_CELL_H',QU_SUBWAY_CELL_H);


var QU_SUBWAY_ST_D = new Schema({
        TIME_ID: String,
        AREA_ID: String,
        AREA_NAME: String,
        SCENE_ID: String,
        SCENE_NAME: String,
        SUBWAY_ID: String,
        SUBWAY_NAME: String,
        STATION_ID: String,
        STATION_NAME: String,
        HTTP_TOTAL_USER_CNT: String,
        HTTP_TOTAL_FLOW: String,
        HTTP_HTTP_RESP_SUCC_RATE: String,
        HTTP_DL_RATE: String,
        HTTP_COVER_ID: String,
        GSM_WL_2G_CONN_RATE: String,
        GSM_WL_2G_DROP_RATE: String,
        GENERAL_TOTAL_USER_CNT: String,
        GENERAL_TOTAL_FLOW: String,
        GENERAL_DL_RATE: String,
        GENERAL_COVER_ID: String
    },
    {
        collection: "DM_SUBWAY_ST_QUAL_D"
    });

var QU_SUBWAY_CELL_D=new Schema({
    TIME_ID:String,
    AREA_ID:String,
    AREA_NAME:String,
    SCENE_ID:String,
    SCENE_NAME:String,
    SUBWAY_ID:String,
    SUBWAY_NAME:String,
    HTTP_RAT:String,
    HTTP_LAC:String,
    HTTP_CI:String,
    HTTP_CELL_NAME:String,
    HTTP_TOTAL_USER_CNT:String,
    HTTP_TOTAL_FLOW:String,
    HTTP_HTTP_RESP_SUCC_RATE:String,
    HTTP_DL_RATE:String,
    RAT:String,
    LAC:String,
    CI:String,
    CELL_NAME:String,
    GSM_WL_2G_CONN_RATE:String,
    GSM_WL_2G_DROP_RATE:String,
    LTE_WL_4G_CONN_RATE:String,
    LTE_WL_4G_DROP_RATE:String,
    GENERAL_RAT:String,
    GENERAL_LAC:String,
    GENERAL_CI:String,
    GENERAL_CELL_NAME:String,
    GENERAL_TOTAL_USER_CNT:String,
    GENERAL_TOTAL_FLOW:String,
    GENERAL_HTTP_RESP_SUCC_RATE:String,
    GENERAL_DL_RATE:String
},{
    collection:"DM_SUBWAY_CELL_QUAL_D"
});



var siteAndcell=new Schema({
        AREA_ID:String,   // 地市ID
        AREA_NAME:String, // 地市名称
        SCENE_ID:String, // 场景ID
        SCENE_NAME:String, // 场景名称
        SUBWAY_ID:String, //地铁线路ID
        SUBWAY_NAME:String,// 地铁线路名称
        STATION_ID :String,// 站点ID
        STATION_NAME:String, // 站点名称
        COVER_ID:String,// 覆盖区域对应值
        COVER_NAME:String,// 覆盖区域
        TAC:String,// TAC
        ECI:String,// ECI
        CELL_NAME:String,// 小区名称
    },
    {
        collection: "SiteCellCorrespondenceTable"
    });

exports.siteAndcell=mongoose.model('siteAndcell',siteAndcell);