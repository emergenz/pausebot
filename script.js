const https = require('https');
const http = require('http');
//var link="https://vm.tiktok.com/ng8w96/";
//var link = "https://www.tiktok.com/@kinsswinnss/video/6814690143539154181";
//var link = "https://m.tiktok.com/v/6808878154556509446.html"
//var link = "https://vm.tiktok.com/ncgD75/";
var link = "https://vm.tiktok.com/n35gmF/";
var patt = /(?:\/)(\d+)/;

function finder(link,callback){
    https.get(link,(resp)=>{
        let data = "";
        if(resp.statusCode===301){
            //WENN DIE URL GEHT
            resp.on('data',(chunk)=>{
                data+=chunk;
            });
            resp.on('end',()=>{
                var newUrl=data.match(patt)[1];
                callback(newUrl)
                //console.log(newUrl);

            });
        }else{
            //WENN DIE URL NICHT GEHT
            var newUrl= "Nope";
            callback(newUrl)
            //console.log(resp.statusCode);
        }
    });
}

if(link.includes("/video/")){
    tiktokId = link.match(patt)[1];
    console.log("JO INCLUDES VIDEO");
    link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
    console.log(link);

} else if(/\d{10}/.test(link)===true){
    tiktokId = link.match(patt)[1];
    console.log("JO INCLUDES NUMBER");
    link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
    console.log(link);

} else {
finder(link,function(results){
    console.log("JO NO NUMBER");
    tiktokId = results;
    link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
    console.log(link);

    });
}

