const cl = console.log;
const card = document.getElementById(`card`)
const formControl = document.getElementById(`postform`)
const titleControl = document.getElementById(`title`)
const bodyControl = document.getElementById(`body`)
const UserIdControl = document.getElementById(`userid`)
const submit = document.getElementById(`submit`)
const update = document.getElementById(`update`)
const loaderr = document.getElementById(`loader`)

let BaseUrl = `https://crud-application-cdd06-default-rtdb.firebaseio.com/`

let post = `${BaseUrl}/posts.json`

let postArray = [];

const objToArr = obj => {
    let arr = [];
    for (const key in obj) {
        let postObj = obj[key]
        postObj.id = key;
        arr.push(postObj)
    }
    return arr
}
const apicall = (methodname, apiUrl, bodyMsg = null) => {
    loaderr.classList.remove(`d-none`)
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open(methodname, apiUrl, true)
        xhr.send(bodyMsg)
        xhr.onload = function () {
            loaderr.classList.add(`d-none`)
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.responseText)
            } else {
                reject(xhr.statusText)
            }
        }
        xhr.onerror = function(){
            loaderr.classList.remove(`d-none`)
        }

    })
}
apicall(`GET`, post)
    .then(res => {
        let data = JSON.parse(res)
        cl(data)
        let data2 = objToArr(data)
        cl(data2)
        tempalting2(data2)
    }).catch(err => {
        cl(err)
    })
const OnEdit = ele => {
    let editedId = ele.closest(`.card`).id
    localStorage.setItem(`getId`, editedId)
    let editUrl = `${BaseUrl}/posts/${editedId}.json`
    cl(editUrl)
    apicall(`GET`, editUrl)
        .then(res => {
            let post = JSON.parse(res)
            titleControl.value = post.title
            bodyControl.value = post.body
            UserIdControl.value = post.userId
            update.classList.remove(`d-none`)
            submit.classList.add(`d-none`)
        })
        .catch(err => {
            cl(err)
        })
}
const OnUpdate = ele => {
    let newObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: UserIdControl.value
    }
    let updatedID = localStorage.getItem(`getId`)
    let updateUrl = `${BaseUrl}/posts/${updatedID}.json`
    apicall(`PUT`, updateUrl, JSON.stringify(newObj))
        .then(res => {
            let data = JSON.parse(res)
            let getitem = document.getElementById(updatedID)
            cl(getitem)
            let cardchilren = [...getitem.children]
            cl(cardchilren)
            cardchilren[0].innerHTML = `<h2>${data.title}</h2>`
            cardchilren[1].innerHTML = `<p>${data.body}</p>`
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Successfully Updated!!!",
                showConfirmButton: false,
            });

        }).catch(err => {
            cl(err)
        })
        .finally(() => {
            update.classList.add(`d-none`)
            submit.classList.remove(`d-none`)
            formControl.reset()
        })

}
// let tempalting = (arr => {
//     let result = ``;
//     arr.forEach(ele => {
//         result += `  <div class="card mb-4" id= "${ele.id}">
//         <div class="card-header">
//             <h3>
//                 ${ele.title}
//             </h3>
//         </div>
//         <div class="card-body">
//             <p>
//                ${ele.body}
//         </div>
//         <div class="card-footer d-flex justify-content-between ">
//             <button class="btn btn-success" onClick="OnEdit(this)" > edit</button>
//             <button class="btn btn-danger" onClick="OnDelete(this)"> delete</button>
//         </div>
//     </div>`

//     });
//     card.innerHTML = result;
// })
const OnDelete = ele => {
   
    let deletedid = ele.closest(`.card`).id
    let deletedUrl = `${BaseUrl}/posts/${deletedid}.json`
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            apicall(`DELETE`, deletedUrl)
            .then(res => {
                document.getElementById(deletedid).remove()
            })
            .catch(err => {
                cl(err)
            })
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
            });

        }
    })
   
        .finally(() => {
            formControl.reset()
        })
}
const CreateCard = ele => {
    ele.preventDefault()
    let postObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: UserIdControl.value
    }
    apicall(`POST`, post, JSON.stringify(postObj))
        .then(res => {
            let createId = JSON.parse(res)
            postObj.id = createId.id
            createCardTemp(postObj)
            Swal.fire({
                position: "top-center",
                icon: "success",
                title: "New Card Created Successfully!!!",
                showConfirmButton: false,
            });
        })
        .catch(err=>{
            cl(err)
        })
        .finally(()=>{
            formControl.reset()
        })
    // let cardId = JSON.parse(ele)
    // let cardUrl = `${BaseUrl}/posts/${cardId}.json`
    // apicall(`POST`,cardUrl,JSON.stringify(postObj))
    // .then(res=>{
    //     let post = postObj;
    //     post.id = JSON.parse(res).name
    //     // let cardId = JSON.parse(ele)
    //     // cl(cardId)
    //     // postObj.id = cardId.id
    //     let card = document.createElement(`div`)
    //     card.className =`card mb-4`
    //     card.id = post.id
    //     card.innerHTML =`
    //     <div class="card-header">
    //     <h2 class="m-0">${postObj.title}</h2>
    //     </div>
    //     <div class="card-body">
    //     <p class="m-0">
    //     ${postObj.body}
    //     </p>
    //     </div>
    //     `
    // })
    // .catch(err=>{
    //     cl(err)
    // })
}
let tempalting2 = ele => {
    ele.forEach(elem => {
      createCardTemp(elem)
    });

}
let createCardTemp = ele => {
    let card1 = document.createElement(`div`)
    card1.className = `card mb-4 cd2 background`
    card1.id = ele.id
    card1.innerHTML = `
    <div class="card-header">
    <h3>
        ${ele.title}
    </h3>   
</div>
<div class="card-body">
    <p>
       ${ele.body}
</div>
<div class="card-footer d-flex justify-content-between ">
    <button class="btn btn-success" onClick="OnEdit(this)" > edit</button>
    <button class="btn btn-danger" onClick="OnDelete(this)"> delete</button>
</div>
    `
    card.append(card1)
}

update.addEventListener(`click`, OnUpdate)
formControl.addEventListener(`submit`, CreateCard)