const BASE_URL = 'http://localhost:8000'



window.onload = async () => {
   await loadData()
}

const loadData = async () => {
     console.log('loaded')

    //1. Load user ทั้งหทด

    const response =  await axios.get(`${BASE_URL}/users`)

    console.log(response.data)

    //2. เอา user ใส่ html
    const userDOM = document.getElementById('user')

    let htmlData = '<div>'

    for (let i=0; i < response.data.length; i++) {
        let user = response.data[i]
        htmlData += `<div>
            ${user.firstname}
            ${user.lastname}
            <a href='index.html?id=${user.id}'><button>Edit</button></a>
            <button class='delete' data-id='${user.id}'>Delete</button>
        </div>`
    }

    htmlData += '</div>'

    userDOM.innerHTML = htmlData

    // button class='delete'
    const deleteDOMs = document.getElementsByClassName('delete')
    // console.log(deleteDOMs)

    for (let i=0; i < deleteDOMs.length; i++) {
        deleteDOMs[i].addEventListener('click', async (event) => {
            //ดึง id ออกมา
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData()
            } catch (error) {
                console.log('error', error)
            }
        })
    }
}