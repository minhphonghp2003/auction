module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? 'vuehost' // Thay tên repository của các bạn vào đây nhé
      : '/'
  }