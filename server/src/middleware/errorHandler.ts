import {ErrorRequestHandler} from 'express'
const errorHandler:ErrorRequestHandler = (error,req,res,next)=>{
  if(error.code){
     res.status(409).json({error:error})
  }
  else if(error.status){
    res.status(error.status).json({error:error.message})
  }
  else {
    res.status(500).json({error:error})
  }
}
export default errorHandler