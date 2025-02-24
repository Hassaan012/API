const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/test-users")
.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    jobtitle:{
        type: String,
    },
    gender:{
        type: String,
    },
    phone:{
        type: Number,
    }
});

const User = mongoose.model("user", userSchema) 

app.post("/api/users", async(req, res)=> {
    const body = req.body;

    if(!body || !body.name || !body.email || !body.jobtitle || !body.gender || !body.phone){
        return res.status(400).json({msg: "All feilds are required"})
    }

    const result = await User.create({
        name: body.name,
        email: body.email,
        jobtitle: body.jobtitle,
        gender: body.gender,
        phone: body.phone
    });

    console.log("result", result);
    return res.status(201).json({msg: "sucess"});
});

app.get("/", async (req, res)=>{
    const allDbUsers = await User.find({});
    const html = `
    <ol>
    ${allDbUsers.map((user)=> `<li>${user.name} - ${user.email} - ${user.jobtitle}</li>`).join("")}
    </ol>`;
    res.send(html);
});

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});