const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql2/promise')

const port = 8000

app.use(bodyparser.json())
app.use(cors())

let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tutorials'
  })
}

const validateData = (userData) => {
  let errors = []

  if (!userData.firstname){
      errors.push('กรุณากรอกชื่อจริง')
  }

  if (!userData.lastname){
      errors.push('กรุณากรอกนามสกุล')
  }

  if (!userData.age){
      errors.push('กรุณากรอกอายุ')
  }

  if (!userData.age){
      errors.push('กรุณากรอกเพศ')
  }

  if (!userData.interests){
      errors.push('กรุณาเลือกความสนใจ')
  }

  if (!userData.description){
      errors.push('กรุณากรอกคำอธิบาย')
  }

  return errors
}


//1. GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async (req, res) => {
  const results = await conn.query('SELECT * FROM users')
  res.json(results[0])
})

//2. POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
  try {
    let user = req.body

    const errors = validateData(user)
    if (errors.length > 0){
      throw {
        message: 'กรอกข้อมูลไม่ครบ',
        errors: errors
      }
    }
    const results = await conn.query('INSERT INTO users SET ?', user)
    res.json({
      message: 'insert ok',
      data: results[0]
    })
  } catch (error) {
    const errorMessage = error.message || 'something wrong'
    const errors = error.errors || []
    console.log('error message', error.message)
    res.status(500).json({
      message: errorMessage,
      errors : errors
    })
  }


})

//3. GET /users/:id สำหรับการดึง users รายคนออกม
app.get('/users/:id', async (req, res) => {
  try {
    let id = req.params.id
    const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
    if (results[0].length == 0){
      throw { statusCode: 404, message: 'หาไม่เจอ'}
    } 
    res.json(results[0][0])
 
  } catch (error) {
    console.log(error.message)
    let statusCode = error.statusCode || 500
    res.status(statusCode).json({
      message: 'something wrong',
      errorMessage : error.message
    })
  }
  
})

app.put('/users/:id', async (req, res) => {
  let id = req.params.id
  let updateUser = req.body

  try {
    const results = await conn.query(
      'UPDATE users SET ? WHERE id = ?', 
      [updateUser, id])
    res.json({
      message: 'update ok',
      data: results[0]
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'something wrong'
    })
  }
})


app.delete('/users/:id', async (req, res) => {
  let id = req.params.id
  try {
    const results = await conn.query(
      'DELETE FROM users WHERE id = ?', id)
    res.json({
      message: 'delete completed',
      data: results[0]
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: 'something wrong'
    })
  }
})

app.listen(port, async (req, res) => {
  await initMySQL()
  console.log('http server run at ' + port)
})
