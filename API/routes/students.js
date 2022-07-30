const express = require("express");
const Student = require("../models/student");
const router = express.Router();
const bcryptjs = require('bcryptjs');
const student = require("../models/student");
const { body, validationResult } = require("express-validator");

//Creating one student (WEBSITE)
router.post("/register", [body('email').isEmail(),body('password').isLength({min: 8})], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }
    let lvl = {
      time: [],
      score: [],
      incat: []
    };
    const studentNew = new Student({
      _id: req.body.username,
      password: (await bcryptjs.hash(req.body.password, 10)).toString(),
      email: req.body.email,
      fullname: req.body.fullname
    });

    for(let i=0;i<7;i++){
      studentNew.level.push(lvl);
    }

    try{
        const newStudent = await studentNew.save();
        res.status(201).json(newStudent);
    } catch (err){
        res.status(400).json({ message: err.message});
    }
});

//>>>CHECK CRASHING<<<
//Login (WEBSITE AND UNITY)
router.post("/login", async (req, res) => {
  try{
    const student = await Student.findById(req.body.username).clone();
    if(student == null){
      return res.status(404).json({message: "Cannot find student"});
    }
    
    bcryptjs.compare(req.body.password, student.password, (err, valid) =>{
      if(!valid){
        res.status(401).json({message: "Incorrect password"})
      }
      res.send(student)
      if(err){
        res.status(501).json({message: err.message})
      }
    })
  } catch(err) {
    res.status(500).json({message: err.message});
  }
})

//Get particular lvl for a particular student
router.get("/:username/:lvl", async(req, res)=>{
  try{
    const student1 = await Student.findById(req.params.username).clone();
    if(student1 == null){
      return res.status(404).json({message: "Cannot find student"});
    }

    res.send(student1.level[req.params.lvl-1])
  } catch(err) {
   res.status(500).json({message: err.message}) 
  }
})

//UPDATE FROM UNITY
router.post("/:username/:lvl", async(req, res)=>{
  try{
    const student1 = await Student.findById(req.params.username).clone();
    if(student1 == null){
      return res.status(404).json({message: "Cannot find student"});
    }

    student1.level[req.params.lvl-1] = req.body.level
    const id = req.params.username
    const updatedData = student1.level
    const option = {new: true}

    const result = await Student.updateOne(
      {_id: id}, {$set: {level: updatedData}}, option
    )
    res.send(student1)
  } catch(err) {
   res.status(500).json({message: err.message}) 
  }
})

//Getting all students (WEBSITE)
router.get("/", async (req, res) => {
    try{
        const students = await Student.find().clone();
        res.json(students);
    } catch(err) {
        res.status(400).json({message: err.messages});
    }
}); 

//Getting one student (WEBSITE)
router.post("/getStudent", async(req, res)=>{
  const student = await Student.findById(req.body.username).clone()
  if(student == null){
    res.status(404).json({message: "Cannot find student"})
  }
  res.status(201).send(student)
})
  
module.exports = router;