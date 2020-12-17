var model=require('../model/subway_model');
var exec=require('child_process').exec;
var option={timeout:10000,
    killSignal:'SIGKILL'};


exports.listFileData=function (path,para,cb) {
    var cmd="ls ";
    if(path!=undefined&&path!=null&&path!="")
        cmd=cmd+"path";
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




function test() {
    var ent={
        _id:"5a4f1834b93484045cb32f4c",
        TIME_ID:"20170809",
        AREA_ID:"0852",
        AREA_NAME:"贵阳",
        SCENE_ID:"1",
        SCENE_NAME:"地铁",
        SUBWAY_ID:"1",
        SUBWAY_NAME:"一号线",
        RAT:88,
        LAC:11,
        CI:212,
        CELL_NAME:999,
        TOTAL_USER_CNT:1212,
        TOTAL_FLOW:"sdsd",
        HTTP_RESP_SUCC_RATE:"sec",
        DL_RATE:"sec",
        dadasd:"assfs"
    };
    model.DM_SUBWAY_CELL_QUAL_HTTP_H(ent).save(ent);
}






