var express = require('express')
var Sequelize =require('sequelize')
var cors = require('cors')
var db = require('./db.config')
var nodemailer = require("nodemailer");

var app = express()
app.use(express.json())
app.use(cors())


//Db Connection
var sequelize = new Sequelize(db.db,db.USER,db.PASSWORD,{
    host:db.HOST,
    dialect:db.dialect,
    pool:{
        max:db.pool.max,
        min:db.pool.min,
        acquire:db.pool.acquire,
        idle:db.pool.idle,
    }
})

sequelize.authenticate()
.then(()=>console.log("--connected to db"))
.catch(err => console.log(err))


//creating products table
let productsTable  =  sequelize.define('productsTable',{
    id:{
        primaryKey : true,
        type:Sequelize.INTEGER
    },
    title  : Sequelize.STRING,
    price : Sequelize.FLOAT,
    description : Sequelize.STRING(1024),
    category : Sequelize.STRING,
    image : Sequelize.STRING,
    rate:Sequelize.FLOAT,
    count:Sequelize.INTEGER
   
},{
    timestamps : false,
    freezeTableName : true
})

productsTable.sync()
.then(()=> console.log("--table created -- "))
.catch ( err => console.log(err))

app.get("/",(req,res)=>{
    res.send("hello")
})
app.get('/getAllProducts',(req,res)=>{
    productsTable.findAll({raw:true})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))

})
app.get("/getById/:ID",(req,res)=>{
    var {ID} = req.params
    productsTable.findByPk(ID)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})
app.get("/getMen",(req,res)=>{
   
    productsTable.findAll({where : {category : "men's clothing"}})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})
app.get("/getWomen",(req,res)=>{
   
    productsTable.findAll({where : {category : "women's clothing"}})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})
app.get("/getAccessories",(req,res)=>{
   
    productsTable.findAll({where : {category : "jewelery"}})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})
app.get("/getElectronics",(req,res)=>{
   
    productsTable.findAll({where : {category : "electronics"}})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})

app.post('/getWithinPrice',(req,res)=>{
    var obj = req.body

    productsTable.findAll({where :{
        
            price: {
              [Op.and]: {
                [Op.lt]: obj.high,
                [Op.gt]: obj.low
              }
            
          }    },raw :true})
    .then (data => res.send(data).status(200))
    .catch(err => res.status(400).send(err))

   
})
app.post('/getWithinRating',(req,res)=>{
    var obj = req.body
    productsTable.findAll({where :{
        
        rate: {
          [Op.and]: {
            [Op.lt]: obj.high,
            [Op.gt]: obj.low
          }
        
      }    },raw :true})
    .then (data => res.send(data).status(200))
    .catch(err => res.status(400).send(err))
})

//creating cart table to store the items that are added to cart

let cartTable  =  sequelize.define('cartTable',{
    id :{
        primaryKey : true,
        type :Sequelize.INTEGER,
        autoIncrement: true
    },   
    userId : Sequelize.INTEGER,
    productId:{
        type:Sequelize.INTEGER
    },
    title  : Sequelize.STRING,
    price : Sequelize.FLOAT,
    description : Sequelize.STRING(1024),
    category : Sequelize.STRING,
    image : Sequelize.STRING,
    rate:Sequelize.FLOAT,
    count:Sequelize.INTEGER,
    quantity : Sequelize.INTEGER
   
},{
    timestamps : false,
    freezeTableName : true
})

cartTable.sync()
.then(()=> console.log("--cart table created --"))
.catch(e => console.log(e))



app.post("/addToCart",(req,res)=>{
    var {id,obj} = req.body
    obj.productId = obj.id
    delete obj.id
    cartObj = {
        "userId":id,
        ...obj
    }
    cartTable.findAll({where :{[Op.and] :[{'userId' : id},{'productId' : obj.productId}]},raw :true})
    .then(data =>{
        if(data.length == 1 ){
            updateobj = data[0].quantity
            cartTable.update({quantity : updateobj +1 }, {where :{[Op.and] :[{'userId' : id},{'productId' :obj.productId}]}})
            .then(data => res.status(200).send(data))
            .catch(err => res.status(400).send(err))
        }else{

            cartTable.create(cartObj)
            .then(data => res.status(200).send(data)  )
            .catch(err=> res.status(400).send(err))
        }
    })
    .catch(err => res.status(400).send(err))
   
})

app.get('/getCartItems/:userId',(req,res)=>{
    var {userId} = req.params
    cartTable.findAll({where :{userId : userId} ,raw:true})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})
app.delete("/deleteCartItem/:userId/:productId",(req,res)=>{
    var {userId,productId} = req.params
    cartTable.destroy({where:{[Op.and] :[{'userId' : userId},{'productId' : productId}]}})
    .then(data => res.status(200).send("Deleted " + id))
    .catch(err => res.status(400).send(err))
})
app.post('/incQuan',(req,res)=>{
    var {userId,productId} = req.body
    console.log(req.body);
    let updateobj = 0
    cartTable.findAll({where :{[Op.and] :[{'userId' : userId},{'productId' :productId}]},raw:true})
    .then(data => {
        updateobj = data[0].quantity
        cartTable.update({quantity : updateobj +1 }, {where :{[Op.and] :[{'userId' : userId},{'productId' :productId}]}})
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send(err))
    })
    .catch(err => console.log(err)) 

    
})
app.post('/decQuan',(req,res)=>{
    var {userId,productId} = req.body
    let updateobj = 0
    cartTable.findAll({where :{[Op.and] :[{'userId' : userId},{'productId' :productId}]},raw:true})
    .then(data => {
        updateobj = data[0].quantity
        if(updateobj <= 1){
            cartTable.destroy({where:{[Op.and] :[{'userId' : userId},{'productId' :productId}]}})
            .then(data => res.status(200).send("Deleted " + userId))
            .catch(err => res.status(400).send(err))
        }else{
            cartTable.update({quantity : updateobj - 1 }, {where :{[Op.and] :[{'userId' : userId},{'productId' :productId}]}})
            .then(data => res.status(200).send(data))
            .catch(err => res.status(400).send(err))
        }
    })
    .catch(err => console.log(err))  
})


let userTable  =  sequelize.define('userTable',{
    email  : Sequelize.STRING,
    userName :Sequelize.STRING,
    password:Sequelize.STRING,
    phone : Sequelize.STRING,
},{
    timestamps : false,
    freezeTableName : true
})

userTable.sync()
.then(()=> console.log("--user table created --"))
.catch(e => console.log(e))


var {Op} = Sequelize
app.post("/searchUser",(req,res)=>{
    let obj = req.body
    userTable.findAll(
        {where : {[Op.and]:[{'email': obj.userEmail},{'password':obj.userPassword}]}},
        {raw:true}
    )
    .then(data => {
        console.log(JSON.stringify(data[0]));
        data.length == 1 
        ? res.status(200).send(JSON.stringify(data[0])) 
        : res.status(404).send("User not found")
    })
    .catch(err => res.status(400).send(err))
})

app.post('/register',(req,res)=>{
    let obj = req.body
    console.log(obj);
    userTable.create({
        "email":obj.regEmail,
        "userName" :obj.regUserName,
        "phone":obj.regPhone,
        "password":obj.regPassword,
    })
    .then(data => res.status(200).send("User Added"))
    .catch(err => res.status(400).send(err))
})


// nodemailer Youtube link Reference
// https://www.youtube.com/watch?v=NB71vyCj2X4


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '', //in brackets, give your 'From' email id which is a google account
      pass: '' //in brackets, give your google account password
    }
  });
app.post("/sendEmail",(req,res)=>{
    var obj = req.body
    var mailOptions = {
      from: 'sharguru06@gmail.com',
      to: 'sharguru06@gmail.com',
      subject: 'Uraban Stock! Confirmation for your purchase',
      text: `Dear ${obj.name},
      
      This is to confirm that your Purchase order from Urban Stock with a Subtotal of ${obj.total} dollars.
      Now go ahead and place the order!


      Thanks for shopping with us!
      Stay Safe


      Regards,
      URBAN STOCK
      
      `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(400).send(error)

      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send(info.response)
      }
    });

})


//orders table

let ordersTable  =  sequelize.define('ordersTable',{
    id :{
        primaryKey : true,
        type :Sequelize.INTEGER,
        autoIncrement: true
    },   
    userId : Sequelize.INTEGER,
    productId:{
        type:Sequelize.INTEGER
    },
    title  : Sequelize.STRING,
    price : Sequelize.FLOAT,
    description : Sequelize.STRING(1024),
    category : Sequelize.STRING,
    image : Sequelize.STRING,
    rate:Sequelize.FLOAT,
    count:Sequelize.INTEGER,
    quantity : Sequelize.INTEGER,
    dateOfOrder : Sequelize.DATEONLY
   
},{
    timestamps : false,
    freezeTableName : true
})


ordersTable.sync({force:true})
.then(()=> console.log("--orders table created --"))
.catch(e => console.log(e))

app.post("/placeOrder",(req,res)=>{
    var obj = req.body
    cartTable.findAll({where:{'userId':obj.userId},raw:true})
    .then(data => 
        {

            data.map(obj => {
                ordersTable.create({
                    ...obj,
                    dateOfOrder : `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`
                }).then(data =>{
                    console.log('added to orders')
                    cartTable.destroy({where :{[Op.and] :[{'userId' : obj.userId},{'productId' :obj.productId}]}})
                    .then(data => console.log("Deleted cart .because its added top orders"))
                    .catch(err=>console.log(err))
                })
                .catch(err => console.log(err))
            })
            
            res.status(200).send("Order placed")
        })
    .catch(err => res.status(400).send(err))

})

app.get("/getAllOrders/:userId",(req,res)=>{
    var {userId} = req.params
    ordersTable.findAll({where : {'userId' : userId} , raw :true})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})

app.listen(8080,()=>console.log("Listening on port 8080"))