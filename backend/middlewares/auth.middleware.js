import jwt from 'jsonwebtoken'
import redisClient from '../services/redis.service.js'

export async function authUser(req,res,next){
    try{
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])
        if(!token){
            return res.status(401).send({error: "Unauthorized user"})
        }
        const isBlackListed = await redisClient.get(token)
        if(isBlackListed){
            res.cookies('token','')
            return res.status(401).send({error:"Unauthorized user"})
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        res.status(401).send({error:"Unauthorized user"})
    }
}