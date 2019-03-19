// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Hook = require("Hook");

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
        mSpeed : 250,

        mMoveToPos : {
            default : cc.v2(0,0),
            visible : false
        },

        mIsMoving : {
            default : false,
            visible : false
        },

        mEnableTouch : {
            default : false,
            visible : false
        },

        mCanvas : {
            default : null,
            type : cc.Node
        },

        mHook : {
            default : null,
            type : cc.Node
        },

        mBoat : {
            default : null,
            type : cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.EnableTouch();
    },
        
    EnableTouch () {
        if (this.mEnableTouch) return;
        this.mCanvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.mEnableTouch = true;
        console.log("EnableTouch");
    },
    
    DisableTouch () {
        if (!this.mEnableTouch) return;
        this.mCanvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mCanvas.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.mEnableTouch = false;
        console.log("DisableTouch");
    },    

    onTouchStart (event){
        //console.log("Bound:"+this.mBoat.getBoundingBoxToWorld()+" event:"+event.getLocation)
        if(!cc.rect(this.mBoat.getBoundingBoxToWorld()).contains(event.getLocation()))
        {
            var pHook = this.mHook.getComponent(Hook);
            console.log("ifMoving: "+pHook.getIsMoving());
            if(!pHook.getIsMoving())
            {
                pHook.startLine();//收杆
            }
        }
        // var touches = event.getTouches();
        // var touchLoc = touches[0].getLocation();//触摸点坐标
        // this.mIsMoving = true;//进入移动状态
        // this.mMoveToPos = this.node.parent.convertToNodeSpaceAR(touchLoc);//将绝对坐标转换为父节点的相对坐标
    },

    onTouchMove (event){
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();//触摸点坐标
        this.mIsMoving = true;//进入移动状态
        this.mMoveToPos = this.mHook.parent.convertToNodeSpaceAR(touchLoc);//将绝对坐标转换为父节点的相对坐标
        //this.mBoatMoveToPos = this.mBoat.parent.convertToNodeSpaceAR(touchLoc);
    },

    onTouchEnd (event){
        this.mIsMoving = false;//退出移动状态
    },

    update (dt) {
        if(!this.mIsMoving) return;
        var oldPos = this.mHook.position;
        var direction = this.mMoveToPos.sub(oldPos).normalize();//获得移动方向
        direction.y = 0;

        var newPos = oldPos.add(direction.mul(this.mSpeed * dt));
        this.mHook.setPosition(newPos);
        
        // oldPos = this.mBoat.position;
        // direction = this.mBoatMoveToPos.sub(oldPos).normalize();
        // direction.y = 0;
        // newPos = oldPos.add(direction.mul(this.mSpeed * dt));
        // this.mBoat.setPosition(newPos);
    },

    onCollisionEnter: function (other, self){

        var pHook = this.mHook.getComponent(Hook);
        pHook.regainLine();//收杆
        var children = pHook.node.getChildren();
        children[1].group = "default";//鱼钩设为不可碰撞

        other.node.stopAllActions();
        other.node.group = "default";
        other.node.parent = this.node;//钓到的物品挂在钩子上
        other.node.setPosition(cc.v2(0,-40));
        other.node.runAction(cc.rotateTo(0.5, -60*other.node.scaleX));
    }
});
