const BASE_URL = 'http://localhost:8000'

let mode = 'CREATE' //default
let selectedId = ''

window.onload = async() => {
    // นำ parameter ทั้งหมดมาใส่ตัวแปร urlParams
    const urlParams = new URLSearchParams(window.location.search)
    // ดึง id ออกมาจาก parameter
    const id = urlParams.get('id')
    // console.log('id', id)
    if (id) {
        mode = 'EDIT'
        selectedId = id

        // 1. ดึงข้อมูลเก่ากลับมา
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`)
            const user = response.data

             // 2. นำข้อมูลใหม่ใส่ input เข้าไป
            let firstnameDOM = document.querySelector('input[name=firstname]')
            let lastnameDOM = document.querySelector('input[name=lastname]')
            let ageDOM = document.querySelector('input[name=age]')
            let descriptionDOM = document.querySelector('textarea[name=description]')
            
            firstnameDOM.value = user.firstname
            lastnameDOM.value = user.lastname
            ageDOM.value = user.age
            descriptionDOM.value = user.description

            let genderDOM = document.querySelectorAll('input[name=gender]')
            let interestDOMs = document.querySelectorAll('input[name=interests]')

            for (let i=0; i < genderDOM.length; i++) {
                if (genderDOM[i].value == user.gender){
                    genderDOM[i].checked = true
                }
            }

            for (let i=0; i < interestDOMs.length; i++) {
                if (user.interests.includes(interestDOMs[i].value)) {
                    interestDOMs[i].checked = true
                }
            }

        } catch (error) {
            console.log('eror', error)
        }




    }
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

const submitData = async () => {
    let firstnameDOM = document.querySelector('input[name=firstname]')
    let lastnameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')
    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interests]:checked') || {}
    let descriptionDOM = document.querySelector('textarea[name=description]')
    let messageDOM = document.getElementById('message')

    try {
        let interest = ''
        // interestDOMs.forEach((i, index) => {
        //     interest += i.value
        //     if (index !== interestDOMs.length - 1) {
        //         interest += ', '
        //     }
        // })
        for (let i = 0; i < interestDOMs.length; i++) {
            interest += interestDOMs[i].value
            if (i != interestDOMs.length - 1) {
                interest += ', '
            }
        }


        let userData = {
            firstname: firstnameDOM.value,
            lastname: lastnameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            interests: interest,
            description: descriptionDOM.value
        }

        console.log('submit data', userData)

        const errors = validateData(userData)

        if (errors.length > 0){
            // มี error เกินขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }

        let message = 'บันทึกข้อมูลเรียบร้อย'
        
        if (mode == 'CREATE'){
            const response = await axios.post(`${BASE_URL}/users`, userData)
            console.log('response', response.data)
        } else {
            const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData)
            message = 'แก้ไขข้อมูลเรียบร้อยแล้ว'
            console.log('response', response.data)
        }
        // console.log('response', response.data)
        messageDOM.innerText = message
        messageDOM.className = 'message success'
    } catch (error) {
        console.log('error message', error.message)
        console.log('error in array', error.errors)
        if (error.response) {
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }

        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'
        for (let i=0; i < error.errors.length; i++){
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</ul>'
        htmlData += '</div>'
        

        messageDOM.innerHTML= htmlData
        messageDOM.className = 'message danger'
    }


}