// pups/new/new.js
const app = getApp();
const AV = require('../../utils/av-weapp-min.js');
var QQMapWX = require('../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  userInput: function (e) {
    //...
    console.log(app.globalData.userId);
    let pup = e.detail.value;
    pup["user_id"] = app.globalData.userId;
    pup["images"] = this.data.images;
    // Get api data
    wx.request({
      url: `http://pups-wx.herokuapp.com/api/v1/pups`,
      method: 'POST',
      data: pup,
      success() {
        // set data on index page and show
        wx.switchTab({
          url: '/pups/index/index'
        });
      }
    });
  },


  /**
   * Page initial data
   */
   data: {
     images: [],
     imagesLength: 0,
     address: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
  },

  search: function (e) {
    let that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({address: res.address})
      }
    })
  },
  
//   /**
//    * Lifecycle function--Called when page is initially rendered
//    */
//   onReady: function () {

//   },

//   /**
//    * Lifecycle function--Called when page show
//    */
  // onShow: function () {
  
  // },

//   /**
//    * Lifecycle function--Called when page hide
//    */
//   onHide: function () {

//   },

//   /**
//    * Lifecycle function--Called when page unload
//    */
//   onUnload: function () {

//   },

//   /**
//    * Page event handler function--Called when user drop down
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * Called when page reach bottom
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * Called when user click on the top right corner to share
//    */
//   onShareAppMessage: function () {

//   },
takePhoto: function () {
  const page = this;
    wx.chooseImage({
      count: (5 - page.data.imagesLength),
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;

        res.tempFilePaths.forEach((filePath) => {
          new AV.File('file-name', {
            blob: {
              uri: filePath,
            },
          }).save().then(
            file => page.setData({
              imagesLength: page.data.imagesLength + 1,
              images: page.data.images.concat([file.url()])
              
            })
            ).catch(console.error);
        });
      }
    })
}})