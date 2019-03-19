// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        maxNum : 0,

        mPrefab : {
            default : null,
            type : cc.Prefab
        },

        mGoodsPool : {
            default : null,
            type : cc.Node
        },

        mHook : {
            default : null,
            type : cc.Node
        },

        mGoodsNum : {
            default : 0,
            type : cc.Integer
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var manager = cc.director.getCollisionManager();//获取碰撞检测系统
        manager.enabled = true;

        this.spanNewGoods();
        this.mGoodsNum++;
        this.maxNum = this.getRandomNum(3,6);
    },

    start () {

    },

    update (dt) {
        this.schedule(function(){
            this.maxNum = this.getRandomNum(3,6);
        },50);

        if(this.mGoodsNum < this.maxNum)//若物品的数量小于最大数量
        {
            var tmp = this.mGoodsNum;
            this.mGoodsNum = this.maxNum;
            this.schedule(function(){
                this.spanNewGoods();
            },3,this.maxNum-tmp-1);  //(function(){},间隔时间，次数，多久后开始)
        }
    },

    spanNewGoods: function(){
        var newGoods = cc.instantiate(this.mPrefab);
        this.mGoodsPool.addChild(newGoods);
        newGoods.setPosition(this.getNewGoodsPosition());
    },

    getNewGoodsPosition: function(){
        // var randX = this.getRandomNum(-320,320);
        var randX =0;
        var randY = this.getRandomNum(-460,-200);
        return cc.v2(randX, randY);
    },

    getRandomNum: function(n, m){
        return Math.round(Math.random()*(m-n))+n;
    },

    //将池塘中物品数量减一
    subGoodsNum: function(){
        if(this.mGoodsNum > 0)
        {
            this.mGoodsNum--;
        }
    }
});
