var moment=require('moment')
var generateMsg=(from,text)=>
{
    return{
        from,
        text,
        time: moment().format('LT')
    }
}
module.exports=generateMsg
