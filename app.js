//app.js
const AV = require('/utils/av-weapp-min.js')
const config = require('/.lc-key')
// Initialization of the app

AV.init({
  appId: config.appId,
  appKey: config.appSecret,
});



App({
  onLaunch: function () {
    const userId = wx.getStorageSync('userId');
    if (userId) {
      this.globalData.userId = userId;
    } else {
      const host = 'https://pups-wx.herokuapp.com/'
      wx.login({
        success: (res) => {
          console.log(res)
          wx.request({
            url: host + 'login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: (res) => {
              this.globalData.userId = res.data.userId;
              wx.setStorageSync('userId', res.data.userId);
            }
          })
        }
      });
    }
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {}
})
