const messageModel = require("../model/messageModel") ;

module.exports.addMessage = async(req, res, next) => {

  console.log(req) ;
    try {
      const {from, to, message} = req.body ;
  
      if (!from || !to || !message) {
        return res.status(400).json({ msg: "All fields are required." });
      }

      const data = await messageModel.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      });
  
      if (data) {
        console.log(data) ;
        return res.json({ msg: "Message added successfully." });
      }
  
      return res.status(500).json({ msg: "Failed to add message to the database." });
    } catch (ex) {
      next(ex);
    }
  };
  

module.exports.getAllMessage = async(req,res,next) => {
    try{  
      const { from, to } = req.body ;
      const messages = await messageModel.find({
        users: {
          $all : [from, to],
        }
      }).sort({updatedAt : 1}) ;

      const ProjectMessages = messages.map((msg) => {
        return {
          fromSelf : msg.sender.toString() === from,
          message: msg.message.text ,
        }
      })
      res.json(ProjectMessages) ;
    }catch(ex){
        next(ex) ;
    }
}