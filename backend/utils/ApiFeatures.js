
class ApiFeatures{
    constructor(query,querystr){
        this.query = query;
        this.querystr=querystr;
    }
    
    search(){
        let keyword = this.querystr.keyword ?{
            name:{
                $regex: this.querystr.keyword,
                $options: 'i', // Case-insensitive search
            },
        }:{}
        this.query.find({...keyword})
        return this;
    }

    filter(){
        const querystrcopy = {...this.querystr}
        
        let removefield = ['keyword','limit','page']
        removefield.map(field =>delete querystrcopy[field])

        let querstr = JSON.stringify(querystrcopy)
        querstr = querstr.replace(/\b(gt|gte|lt|lte)/g,match =>`$${match}`)

        console.log('querstr',querstr)
        this.query.find(JSON.parse(querstr))
        return this
    }
    paginate(resperpage){
        
        const currentpage = Number(this.querystr.page)|| 1
        const skip = resperpage * (currentpage-1)
        console.log('skip',skip)
        this.query.limit(resperpage).skip(skip)
        return this
    }
}

module.exports = ApiFeatures