// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-pxtorem": {
      "rootValue": 50,  //rootValue为1rem对应px值   为了兼容高清方案，你需要对该UI库里凡是应用px的地方做相应处理，即： a px => a*0.02 rem
      "propList": ["*"],  //所有属性都转换
      "minPixelValue": 2  //小于2px不会转换
    }
  }
}
