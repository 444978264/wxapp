import { serialize } from './util';

class Router {
    // 防止同时触发多个页面跳转引起报错
    constructor(props) {
        this.loading = false;
        this.lazyChange = () => {
            setTimeout(() => {
                this.loading = false;
            }, 1000)
        }
    }
    //跳转页面---保留当前页面，跳转到应用内的某个页面，
    push(path, params) {
        if (this.loading) return
        this.loading = true;
        let str = this.serialize(params);
        wx.navigateTo({
            url: `/pages/${path}/${path}${str}`,
            complete: () => {
                this.lazyChange();
            }
        })
    }
    //跳转页面---关闭当前页面，跳转到应用内的某个页面，
    redirect(path, params) {
        if (this.loading) return
        this.loading = true;
        let str = this.serialize(params);
        wx.redirectTo({
            url: `/pages/${path}/${path}${str}`,
            complete: () => {
                this.lazyChange();
            }
        })
    }
    //跳转页面---关闭所有页面，跳转到应用内的某个页面，
    reLaunch(path, params) {
        if (this.loading) return
        this.loading = true;
        let str = this.serialize(params);
        wx.reLaunch({
            url: `/pages/${path}/${path}${str}`,
            complete: () => {
                this.lazyChange();
            }
        })
    }
    serialize(params) {
        return serialize(params)
    }
};
const $router = new Router();

export default $router