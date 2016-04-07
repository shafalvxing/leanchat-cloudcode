var mlog = require('cloud/mlog');
var muser = require('cloud/muser');
var util = require('util');
var mutil = require('cloud/mutil');

var msgTypeText = -1;
var msgTypeImage = -2;
var msgTypeAudio = -3;
var msgTypeLocation = -5;

function messageReceived(req, res) {
  res.success();
}

function getPushMessage(params) {
  var contentStr = params.content;
  var json = {
    badge: "Increment",
    sound: "cheering.caf",
	"bizParam":{
	"msgType":1
	}
  };
  var msg = JSON.parse(contentStr);
  var msgDesc = getMsgDesc(msg);
  if (msg._lcattrs && msg._lcattrs.username) {
      json.alert = msg._lcattrs.username + ' : ' + msgDesc;
  } else {
      json.alert = msgDesc;
  }
  if (msg._lcattrs && msg._lcattrs.dev) {
    json._profile = "dev";
  }
  if(msg._lcattrs && msg._lcattrs.orderMsgType){
    json.bizParam.msgType = msg._lcattrs.orderMsgType;
  }
  return JSON.stringify(json);
}

function getMsgDesc(msg) {
  var type = msg._lctype;
  if (type == msgTypeText) {
    return msg._lctext;
  } else if (type == msgTypeImage) {
    return "图片";
  } else if (type == msgTypeAudio) {
    return "声音";
  } else if (type == msgTypeLocation) {
    return msg._lctext;
  } else {
    return msg;
  }
}

function receiversOffline(req, res) {
  if (req.params.convId) {
    // api v2
    try{
      var pushMessage = getPushMessage(req.params);
      console.log('pushMessage :' + pushMessage + ' offlinePeers:' + req.params.offlinePeers);
      //对方离线发送短信
      // sofaSendMsg(req.params.fromPeer,req.params.offlinePeers[0],req.params.content,req.params.convId);
      res.success({pushMessage: pushMessage});
    } catch(err) {
      // json parse error
      console.dir(err);
      res.success();
    }
  } else {
    console.log("receiversOffline , conversation id is null");
    res.success();
  }
}

function conversationStart(req,res){
  console.log('conversationStart');
  res.success();
}

function conversationRemove(req,res){
  console.log('conversationRemove');
  res.success();
}

function conversationAdd(req,res){
  console.log('conversationAdd');
  res.success();
}
    // function sofaSendMsg(fromPeer,offlinePeer,content,convId){
    //     var dataStr = "{" + '\"fromPeer\":' + '\"' + fromPeer + "\","
    //         + '\"offlinePeer\":' + '\"' + offlinePeer + "\","
    //         + '\"content\":' + '\"' + content + "\","
    //         + '\"convId\":' + '\"' + convId + "\"}";
    //     var data = {};
    //     data["bizParams"] = dataStr;
    //     sofaJsonp({
    //         url: "http://www.shafalvxing.com/jsonp/sendInTimeMsgTip.do",              //请求地址
    //         data: data,        //请求参数
    //         callback:"callback",
    //         time:1000
    //     });
    // }

    //  function sofaJsonp(options) {
    //     options = options || {};
    //     if (!options.url || !options.callback) {
    //         throw new Error("参数不合法");
    //     }
    //     //创建 script 标签并加入到页面中
    //     var callbackName = ('jsonp_' + Math.random()).replace(".", "");
    //     var oHead = window.document.getElementsByTagName('head')[0];
    //     options.data[options.callback] = callbackName;
    //     var params = sofaFormatParams(options.data);
    //     var oS = window.document.createElement('script');
    //     oHead.appendChild(oS);

    //     //创建jsonp回调函数
    //     window[callbackName] = function (json) {
    //         oHead.removeChild(oS);
    //         clearTimeout(oS.timer);
    //         window[callbackName] = null;
    //         options.success && options.success(json);
    //     };

    //     //发送请求
    //     oS.src = options.url + '?' + params;

    //     //超时处理
    //     if (options.time) {
    //         oS.timer = setTimeout(function () {
    //             window[callbackName] = null;
    //             oHead.removeChild(oS);
    //             options.fail && options.fail({ message: "超时" });
    //         }, options.time);
    //     }
    // };

    // //格式化参数
    // function sofaFormatParams(data) {
    //     var arr = [];
    //     for (var name in data) {
    //         // arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    //         arr.push(name + "=" + data[name]);
    //     }
    //     arr.push(("v=" + Math.random()).replace(".",""));
    //     return arr.join("&");
    // }

exports.messageReceived = messageReceived;
exports.receiversOffline = receiversOffline; // used by main.js
exports.getPushMessage = getPushMessage;
exports.conversationStart=conversationStart;
exports.conversationRemove=conversationRemove;
exports.conversationAdd=conversationAdd;
