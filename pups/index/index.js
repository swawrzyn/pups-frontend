//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    region: ["浦东新区", "徐汇区", "长宁区", "普陀区", "闸北区", "虹口区", "杨浦区", "黄浦区", "卢湾区", "静安区", "宝山区", "闵行区", "嘉定区", "金山区", "松江区", "青浦区", "南汇区", "奉贤区", "崇明区"],
    price: ["0 - 500", " > 500 "],
    objectArray: [
      {
        id: 0,
        price: '100-500'
      },
      {
        id: 1,
        name: '501-1000'
      },
    ],
    index: 0,
    array: ['★', '★★', '★★★', '★★★★', '★★★★★'],
    currentRating: 0,
    currentPriceRangeIndex: 0

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    console.log(e)
    const page = this
    let pups = []
    var inputVal = e.detail.value
    if (inputVal === "") {
      console.log(page.data)
      page.fetchPups();
    } 
    else {
      wx.request({
        url: `http://pups-wx.herokuapp.com/api/v1/pups?query=${inputVal}`,
        method: 'GET',
        success(res) {
          page.setData({
            pups: res.data.pups
          });
        },
      })
    }
    
  },
  bindReviewChange: function (e) {
    // this.data.pups = this.data.pups_original

    this.setData({
      currentRating: parseInt(e.detail.value) + 1
    })

    // var i = parseInt(e.detail.value) + 1;
    // console.log("current rating:" + i)
    // var pups = this.data.pups_original.filter(function(pup){
    //   console.log(pup.avg_rating)
    //   return pup.avg_rating == i
    // })
    // console.log(pups);
    // this.setData ({
    //   pups: pups
    // })


    // console.log(e.detail);
    // return;
    // wx.request({
    //   url: `http://pups-wx.herokuapp.com/api/v1/pups?query=${e.detail.value}`,
    //   method: 'GET',
    //   success(res) {
    //     this.setData({
    //       pups: res.data.pups
    //     });
    //   },
    // })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.fetchPups();
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  },
  onShow: function () {
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // From the forward button within the page
      console.log(res.target)
    }
    return {
      path: `/pups/index/index`,
      imageUrl: 'http://lc-s6kmsNUF.cn-n1.lcfile.com/898a0f61c8ca1356c74b.png'
    }
  },

  bindRegionChange: function (e) {
    const page = this;
    let pups = [];
    page.data.pups.forEach( (pup) => {
      if (pup.location.includes(e.detail.value[2])) {
        pups.push(pup);
      }
      return pups;
    });
    page.setData({ 
      pups: pups 
    });
    // console.log('picker发送选择改变，携带值为', e.detail.value)
  },
  bindPickerChange: function (e) {
    // if e,detal.value[2] 
    // console.log(this.data)
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      currentPriceRangeIndex: parseInt(e.detail.value) + 1
    })
  },
  fetchPups: function () {
    const page = this
    wx.request({
      url: "http://pups-wx.herokuapp.com/api/v1/pups",
      method: 'GET',
      success(res) {
        page.setData({ pups: res.data.pups });
      },
      complete () {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    });
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    console.log("pulled down!");
    this.fetchPups();
    this.setData({
      currentRating: 0,
      currentPriceRangeIndex: 0
    })
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})