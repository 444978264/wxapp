export default {
    data:{
        sourceOfPop: null,
        titleOfPop: '',
        rich: null,
        winner: null
    },
    _removePop(e){
        this.setData({
            sourceOfPop:null
        })
    },
    getRich() {
        if (this.data.rich != null) {
            this.setData({
                sourceOfPop: this.data.rich,
                titleOfPop: "今日土豪榜TOP10"
            })
            return
        }
        this.$http.rich().then(sourceOfPop => {
            if (!sourceOfPop) return
            this.setData({
                sourceOfPop,
                rich: sourceOfPop,
                titleOfPop: "今日土豪榜TOP10"
            })
            console.log(sourceOfPop)
        })
    },
    getWinner() {
        if (this.data.winner != null) {
            this.setData({
                sourceOfPop: this.data.winner,
                titleOfPop: "今日手气最佳TOP10"
            })
            return
        }
        this.$http.winner().then(sourceOfPop => {
            if (!sourceOfPop) return
            this.setData({
                sourceOfPop,
                winner: sourceOfPop,
                titleOfPop: "今日手气最佳TOP10"
            })
            console.log(sourceOfPop)
        })
    },
}