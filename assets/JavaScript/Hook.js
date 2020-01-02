// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Root = require("Root");
// var Goods = require("Goods");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },

        RegainSpeed : 320,

        isRegaining : {
            default : false,
            visible : false
        },

        isMoving : {
            default : false,
            visible : false
        },

        mBoat : {
            default : null,
            type : cc.Node
        },

        mController : {
            default : null,
            type : cc.Node
        },

        mLine : {
            default : null,
            type : cc.Node
        },

        mRoot : {
            default : null,
            type : cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    startLine (){
        this.node.stopAllActions();
        this.node.runAction(cc.repeatForever(cc.moveBy(4, cc.p(0,-100))));
        this.mBoat.runAction(cc.repeatForever(cc.moveBy(4, cc.p(0,100))));
        this.mLine.runAction(cc.repeatForever(cc.moveBy(4, cc.p(0,100))));
        this.isRegaining = false;
        this.isMoving = true;
    },

    regainLine (){//收杆
        if(this.isRegaining) return;
        this.node.stopAllActions();//停止下沉动作
        this.mBoat.stopAllActions();
        var duration = Math.abs(this.mController.y) / this.RegainSpeed;
        if(duration < 5) duration = 5;
        // console.log()
        var moveTo = cc.moveTo(duration, cc.v2(0,this.mBoat.y-139)).easing(cc.easeSineIn());
        this.mController.runAction(cc.sequence(moveTo, cc.callFunc(this.afterRegain, this)));//收杆动作
        //this.mBoat.runAction(cc.moveTo(duration, cc.v2(0,0)).easing(cc.easeSineIn()));//收杆动作
        this.isRegaining = true;
    },

    afterRegain: function(){
        //清除鱼钩上的鱼
        // console.log("child:"+this.mController.getChildren()[0]);
        this.mController.removeAllChildren(true);
        //继续可钓鱼模式
        this.isMoving = false;
        this.mController.group = "Hook";//鱼钩设为可碰撞

        //将池塘物品减1
        var pRoot = this.mRoot.getComponent(Root);
        pRoot.subGoodsNum();

        this.showAlertOnlayEnter("东风不与周郎便");
    },

    showAlertText: function (str) {
        Alert.show(str);
    },

    showAlertCallBack: function (str) {
        Alert.show(str, function(){
            cc.log("确定按钮被点击！");
        });
    },

    showAlertOnlayEnter: function (str) {
        Alert.show(str, null, false);
    },

    showAlertAnimSpeed: function (str) {
        Alert.show(str, null, null, 0.1);
    },

    getIsRegaining: function(){
        return this.isRegaining;
    },

    getIsMoving: function(){
        return this.isMoving;
    }
    // update (dt) {},
});
