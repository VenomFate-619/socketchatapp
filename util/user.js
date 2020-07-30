// [{
//     id:'',
//     usr:'',
//     room:''
// }]
class Member{
    constructor()
    {
        this.users=[]
    }
 addUser(id,name,room)
 {
    let newUser={id,name,room}
    this.users.push(newUser)
    return newUser
 }
 getUserList(room)
 {
    let part=this.users.filter((i)=> i.room==room)
    let nameArray=part.map((i)=> i.name )
    return nameArray;

 }
 getUser(id)
 {
    return this.users.filter((i)=>i.id==id)[0]
 }
 removeUser(id)
 {
    let part=this.getUser(id);
    if(part){
        this.users = this.users.filter((i)=>i.id!==id)
    }
    return part
 }
}
module.exports=Member