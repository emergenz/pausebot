const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const fs = require('fs')
const child_process = require('child_process');
const patt = /(?:\/)(\d+)/;
function systemSync(cmd) {
  return child_process.execSync(cmd).toString();
}

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

function getScreenshot(inputfile, tiktokId){

    systemSync('tiktok-scraper video ' + link);

    systemSync("ffmpeg -y -i " + inputfile + " -crf 49 -vf scale=iw/2:ih/2,crop=iw:ih*.824:0:ih*.09,hue=s=0 -an '"+ tiktokId+"output.mp4'");

    systemSync(`ffmpeg -i "`+ tiktokId +`output.mp4" -filter:v "select='gt(scene,0.4)',showinfo" -f null - 2> ffout` + tiktokId +".txt");

    systemSync("grep showinfo ffout" + tiktokId + ".txt | grep \'pts_time:[0-9.]*\' -o | grep \'[0-9.]*\' -o > "+ tiktokId +"timestamps.txt");
   systemSync("ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "+ tiktokId +"output.mp4 >> "+ tiktokId +"timestamps.txt");

    var timestampsname = tiktokId + "timestamps.txt";
    var diff = [];
    var timestamps = fs.readFileSync(timestampsname, "UTF-8").split("\n");
    timestamps = timestamps.filter(item => item).map(Number);

    console.log(timestamps)

    for (i=0; i < timestamps.length - 1; i++){
        diff.push(timestamps[timestamps.length -1-i] - timestamps[timestamps.length -2-i]);
    }

    console.log(diff)

    if(timestamps.length > 1){
        old_diff=diff.slice();
        old_diff=old_diff.reverse();
        console.log(old_diff);
        diff.sort();
        console.log(diff);
        var lowest_diff = diff[0];
        console.log(lowest_diff);
        var lowest_diff_position = old_diff.indexOf(lowest_diff);
        console.log(timestamps[lowest_diff_position]);
        var new_timestamp = timestamps[lowest_diff_position]+ (timestamps[lowest_diff_position + 1] - timestamps[lowest_diff_position])/2;
        console.log(new_timestamp);
    } else if(timestamps.length == 1){
        var lowest_diff_position = 0;
        var new_timestamp = timestamps[0];
    } else {
        console.log("Error: No timestamps found")
    }


    systemSync("ffmpeg -y -ss " + new_timestamp.toString() + " -i " + inputfile +" -vframes 1 -q:v 2 " +tiktokId+ ".jpg");

}

function getVideo(inputfile, tiktokId){
    systemSync('tiktok-scraper video ' + link);
}


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    console.log("GET REQUEST");
    res.render('index');
    systemSync("rm -f *.jpg");
    systemSync("rm -f *.mp4");
})

app.get('/contact/', function (req, res) {
    res.render('contact');
})

app.get('/download/', function(req, res){
    res.render('download');
})

app.get('/wp-login', function(req, res){
    res.render('wp-login');
})

app.get('/robots.txt', function(req, res){
    res.type('text/plain');
    res.send('Sitemap: https://pausebot.com/sitemap.xml\nUser-agent: *\nDisallow:');
})

app.get('/sitemap.xml', function(req, res){
    res.sendFile("public/sitemap.xml", {root: __dirname});
})

app.post('/', function (req, res) {

    link = req.body.link;
    
    if(link.includes("/video/")){
        var tiktokId = link.match(patt)[1];
        console.log("JO INCLUDES VIDEO");
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getScreenshot(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling');
        }
        console.log(link);
        //res.render('index');
        res.sendFile(""+ tiktokId +".jpg", {root: __dirname});
        systemSync("rm " + inputfile);
        systemSync("rm "+ tiktokId +"output.mp4");
        systemSync("rm ffout" + tiktokId + ".txt");
        systemSync("rm " + tiktokId + "timestamps.txt");
        
    } else if(/\d{10}/.test(link)===true){
        var tiktokId = link.match(patt)[1];
        console.log("JO INCLUDES NUMBER");
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getScreenshot(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling');
        }
        console.log(link);
        res.sendFile(""+ tiktokId +".jpg", {root: __dirname});
        systemSync("rm " + inputfile);
        systemSync("rm "+ tiktokId +"output.mp4");
        systemSync("rm ffout" + tiktokId + ".txt");
        systemSync("rm " + tiktokId + "timestamps.txt");
        
    } else {
        try {
        finder(link,function(results){
            console.log("JO NO NUMBER");
            var tiktokId = results;
            var inputfile = tiktokId + ".mp4";
            link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
            getScreenshot(inputfile, tiktokId);
            console.log(link);
            res.sendFile(""+ tiktokId +".jpg", {root: __dirname});
            systemSync("rm " + inputfile);
            systemSync("rm "+ tiktokId +"output.mp4");
            systemSync("rm ffout" + tiktokId + ".txt");
            systemSync("rm " + tiktokId + "timestamps.txt");
        });
        } catch (error) {
            res.render('errorhandling');
        }
    }
})

app.post('/download/', function (req, res) {
    link = req.body.downloadlink;
    if(link.includes("/video/")){
        var tiktokId = link.match(patt)[1];
        console.log("JO INCLUDES VIDEO");
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getVideo(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling');
        }
        console.log(link);
        //res.render('index');
        res.download(inputfile);
   
    } else if(/\d{10}/.test(link)===true){
        var tiktokId = link.match(patt)[1];
        console.log("JO INCLUDES NUMBER");
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getVideo(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling');
        }
        console.log(link);
        res.download(inputfile);
        
    } else {
        try {
        finder(link,function(results){
            console.log("JO NO NUMBER");
            var tiktokId = results;
            var inputfile = tiktokId + ".mp4";
            link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
            getVideo(inputfile, tiktokId);
            console.log(link);
            res.download(inputfile);
        });
        } catch (error) {
            res.render('errorhandling');
        }
    }
})
app.use(function(req, res, next){
    res.status(404).render("filenotfound");
})


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})

