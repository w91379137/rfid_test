

const LocalStorage = require('node-localstorage').LocalStorage;
const storage = new LocalStorage('./localStorage');
export { storage }

// 不知道為何 直接將 storage 命名為 localStorage 會有 bug