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
  if(msg._lcattrs && msg._lcattrs.businessId){
    json.bizParam.businessId = msg._lcattrs.businessId;
  }
  if(msg._lcattrs && msg._lcattrs.orderId){
    json.bizParam.orderId = msg._lcattrs.orderId;
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
      var content = req.params.content;
      if(content && content.indexOf('orderstatus')  >= 0 ){
        res.success({skip: true});
        return;
      }
      var pushMessage = getPushMessage(req.params);
      console.log('pushMessage :' + pushMessage + ' offlinePeers:' + req.params.offlinePeers);
      //对方离线发送短信
      sofaSendMsg(req.params.fromPeer,req.params.offlinePeers[0],req.params.content,req.params.convId);
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

function sofaSendMsg(fromPeer,offlinePeer,content,convId){
  var json = {
    "fromPeer" : fromPeer,
    "offlinePeer" : offlinePeer,
    "content" : content,
    "convId" : convId
  };
  AV.Cloud.httpRequest({
    url: 'http://www.shafalvxing.com/jsonp/sendInTimeMsgTip.do',
    params: {
      "bizParams" : JSON.stringify(json)
    },
    success: function(httpResponse) {
      console.log(httpResponse.text);
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
    }
  });
}

exports.messageReceived = messageReceived;
exports.receiversOffline = receiversOffline; // used by main.js
exports.getPushMessage = getPushMessage;
exports.conversationStart=conversationStart;
exports.conversationRemove=conversationRemove;
exports.conversationAdd=conversationAdd;
