module.exports={
    HOST : 'localhost',
    USER:"postgres",
    PASSWORD:"postgresql",
    db :'ecommerce',
    dialect:'postgresql',
    pool:{
        min:5,
        min:0,
        acquire:300000,
        idle:10000
    }
}