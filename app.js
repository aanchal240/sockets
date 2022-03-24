const express=require('express')
const app=express();
const socket=require('socket.io')
const mongoose=require('mongoose')
const PORT=5000

mongoose.connect('mongodb://127.0.0.1:27017/socketTask',{
    useNewUrlParser:true
})
const Message=require('./message')
const driver=require('./driver')
const user=require('./user')

const room_id="1234"

const {addUser,getUser,removeUser}=require('./util')

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    //console.log(`http://localhost:${PORT}`);
  });
// run()
//  async function run()
//  {
//      const user1=user.create({
//          userName:"user1"
//      })
//      const user2=user.create({
//          userName:"user2"
//      })
//  } 

const io=socket(server)

io.on('connection',(socket)=>{
    try{
        console.log('a user is connected'+socket.id)
        //console.log(socket.adapter.rooms[socket.to])
        socket.on('join',({user_id,room_id})=>{
            const {error,user}=addUser({
                socket_id:socket.id,
                room_id,
                user_id
            })
            socket.join(room_id)
            if(error)
            {
                console.log('join error',error)
            }
            else{
                console.log('join user',user)
            }
        })
        socket.on('sendMessage', (message) => {
            const user = getUser(socket.id);
            const msgToStore = {
                //name: user.name,
                //user_id: user.user_id,
                room_id,
                text: message
            }
            console.log('message', msgToStore)
            const msg = new Message(msgToStore);
            msg.save().then(result => {
                io.to(room_id).emit('message', result);
                //callback()
            })
      
        })
        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
        })
    }
    catch(err)
    {
        console.log(err.message)
    }
})