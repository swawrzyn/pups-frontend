// pups/new/new.js
Page({
  userInput: function (e) {
    //...
    console.log(e.detail.value);
    let pup = e.detail.value;
    pup["user_id"] = 10;

    // Get api data
    wx.request({
      url: `http://localhost:3000/api/v1/pups`,
      method: 'POST',
      data: pup,
      success() {
        // set data on index page and show
        wx.switchTab({
          url: '/pups/index/index'
        });
      }
    });
  }


  /**
   * Page initial data
   */
//   data: {
  
//   },

//   /**
//    * Lifecycle function--Called when page load
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * Lifecycle function--Called when page is initially rendered
//    */
//   onReady: function () {

//   },

//   /**
//    * Lifecycle function--Called when page show
//    */
//   onShow: function () {

//   },

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

//   }
 })