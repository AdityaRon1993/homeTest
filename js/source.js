let dept = '';
let flag = true;
let job_Dept = {};
let job_Dept_List = []
var request, request2;
let department_to_show;
let data_dept;
let data2 = {};
let data_dept_job_description_current = new Array;
let table = document.querySelector('.main');
let active_pill;
let row, ele;
var job_list_data;
let attribute_keys_div = ["class", "data-toggle", "data-target", "aria-expanded", "aria-controls"];
let attribute_values_div = ["panel-heading", "collapse", "#collapseExample", "false", "collapseExample"];
let attribute_keys_innerdiv = ["class", "id"];
let attribute_values_innerdiv = ["collapse", "collapseExample"];
let job_description_key = ["designation", "description", "experience", "employee_type", "location"]




function job_data_list() {
    request = new XMLHttpRequest()
    request.open('GET', 'https://uat-pl-android-api.incred.com/v2/corporate/job/list', true)
    request.onload = function () {
        // Begin accessing JSON data here
        data = JSON.parse(this.response)
        get_department(data.response)
    }
    request.send()

}

function get_department(data_list) {

    data_list.forEach(ele => {
        if (!job_Dept[ele.department]) {
            job_Dept[ele.department] = ele.department;
        }
    });
    // console.log(job_Dept)
    job_Dept_List = Object.keys(job_Dept);
    // console.log(job_Dept_List)

    create_jobList_Dom(job_Dept_List)

}
function create_jobList_Dom(job_list) {
    let block = document.querySelector('.job_list');
    job_list.forEach((ele, i) => {
        let anchor = document.createElement('option');
        anchor.innerHTML = ele;
        anchor.value = ele
        // i == 0 ? anchor.setAttribute('class', 'nav-link active') : anchor.setAttribute('class', 'nav-link')
        // active_pill = document.querySelector('.nav-list,.active')
        // anchor.setAttribute('onclick', 'show_job_details(event)');
        // anchor.setAttribute('style', 'cursor:pointer');

        block.appendChild(anchor);
    })

}
function show_job_details(event) {
    // console.log(event.target.value)
    data_dept_job_description_current = [];
    // active_pill.classList.toggle('active');
    // event.path[0].classList.add('active');

    active_pill = event.target;
    // department_to_show = event.target.innerHTML;
    department_to_show = event.target.value;

    data_dept = data.response.filter(ele => {
        return ele.department == department_to_show
    })
    // console.log(department_to_show);
    // console.log(data_dept)
    data_dept.forEach((ele, i) => {
        // console.log(ele.job_id);
        request2 = new XMLHttpRequest();
        let url = 'https://uat-pl-android-api.incred.com/v2/corporate/job/details/' + ele.job_id;
        // console.log(url);
        request2.open('GET', url, true);
        
        request2.onload = function () {
            data2 = JSON.parse(this.response)
            // console.log(data2.response)
            data_dept_job_description_current.push([data2.response,ele.job_id]); //change sending job id to the apply button to read
            show_DOM_data();
            
            // console.log(data_dept_job_description_current[i])

        }
        request2.send();


    })
    // console.log(data_dept_job_description_current)
}
function show_DOM_data() {
    // console.log('show_DOM_data')
    show_division = document.querySelector('.job_details');
    
    show_division.innerHTML = '';
    data_dept_job_description_current.forEach((ele, j) => {
        // console.log(ele)
        let outer_div = document.createElement('div');
        attribute_keys_div.forEach((key, i) => {
            i == 2 || i == 4 ? outer_div.setAttribute(key, attribute_values_div[i] + '' + j) : outer_div.setAttribute(key, attribute_values_div[i]);
        })
        // adding according to incred site
        let positionDiv=document.createElement('div')
        positionDiv.setAttribute('class','customPosition')
        positionDiv.setAttribute('onclick','rotate(event)')
        let h4=document.createElement('h4')
        h4.setAttribute('class','panel-title')
        let plus=document.createElement('h1');
        plus.innerHTML='+';
        plus.setAttribute('class','toRotate')
        
        h4.innerHTML=ele[0].title;

        
        positionDiv.appendChild(h4)
        positionDiv.appendChild(plus)

        outer_div.appendChild(positionDiv)
        // outer_div.innerHTML = ele[0].title;
        outer_div.setAttribute('style','cursor : pointer') // changing cursor status to pointer
        let innerDiv = document.createElement('div');
        attribute_keys_innerdiv.forEach((key, i) => {
            i == 0 ? innerDiv.setAttribute(key, attribute_values_innerdiv[i] + ' ' + attribute_values_innerdiv[i] + j) : innerDiv.setAttribute(key, attribute_values_innerdiv[i] + '' + j);

        })

        let contentDiv = document.createElement('div');
        contentDiv.setAttribute('class', "panel-body")
        let newbutton = document.createElement('button')
        newbutton.setAttribute('class', 'chcke-rate')
        newbutton.setAttribute('id', ele[1])//applying job id to the apply button to read latter
        newbutton.setAttribute('onclick', 'transfer(event)')
        newbutton.innerText = 'Apply';

        let unorderedList = document.createElement('ul');
        job_description_key.forEach(key => {
            let list = document.createElement('li');
            list.innerHTML = '<b>' + key.toUpperCase() + '</b> <br>' + ele[0][key] + '<br><br>';
            list.setAttribute('style','color : black')
            unorderedList.appendChild(list)
        })

        contentDiv.appendChild(unorderedList)
        contentDiv.appendChild(newbutton)
        innerDiv.appendChild(contentDiv)
        show_division.appendChild(outer_div);
        show_division.appendChild(innerDiv);


        // create_para.innerText='designation -->' + ele.designation +' title --> ' + ele.title;
        // show_division.appendChild(create_para);


    })
    // sub_divison=document.createElement('div')
}
function transfer(event) {
    // console.log(event.target.id)
    window.localStorage.setItem("Incred_job_id",event.target.id)
    window.location.href='./apply.html'

}

job_data_list();
function rotate(evt){
    console.log(evt.target.nextElementSibling)
    evt.target.nextElementSibling.classList.toggle('rotate');
}
