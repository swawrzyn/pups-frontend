Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    // Check if it is authorized
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // Authorized. "getUserInfo" can be directly called to retrieve profile photo/nickname
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
  }
})
