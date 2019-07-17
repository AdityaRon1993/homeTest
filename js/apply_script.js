const job_id = window.localStorage.getItem('Incred_job_id')

request2 = new XMLHttpRequest();
// https://uat-pl-android-api.incred.com
let url = 'https://uat-pl-android-api.incred.com/v2/corporate/job/details/' + job_id;
// console.log(url);
request2.open('GET', url, true);
let form_fields, form_fields_array = []
request2.onload = function () {
    data2 = JSON.parse(this.response)
    // console.log(data2)
    document.querySelector('.l2').innerHTML = data2.response.designation;
    // console.log(data2.response.applicant_fields)
    form_fields = data2.response.applicant_fields;
    let keys = Object.keys(form_fields);
    keys.sort((a, b) => {
        a.order - b.order
    })
    // console.log(keys)
    keys.forEach(ele => {
        form_fields_array.push([ele, form_fields[ele]])
    })
    // console.log(form_fields_array)

    produce_dynamic_form(form_fields_array)


}
request2.send();

function produce_dynamic_form(forms_array) {
    let form_tag = document.getElementById('data');

    let outer_div_job_id = document.createElement('div');//bootstrap div
    outer_div_job_id.setAttribute('class', 'form-group label-floating');

    let label_job_id = document.createElement('label');
    label_job_id.innerHTML = 'job_id';
    label_job_id.setAttribute('for', 'job_id');

    let job_id_input = document.createElement('input');
    job_id_input.setAttribute('name', 'job_id');
    job_id_input.setAttribute('value', job_id);
    // job_id_input.setAttribute('class', 'form-control')
    job_id_input.setAttribute('id', 'job_id')
    job_id_input.hidden = true;

    let job_id_input_fake = document.createElement('input');
    job_id_input_fake.setAttribute('name', 'job_id');
    job_id_input_fake.setAttribute('value', job_id);
    job_id_input_fake.setAttribute('class', 'form-control')
    job_id_input_fake.setAttribute('id', 'job_id')
    job_id_input_fake.disabled = true;

    outer_div_job_id.appendChild(label_job_id);
    outer_div_job_id.appendChild(job_id_input);
    outer_div_job_id.appendChild(job_id_input_fake);


    form_tag.appendChild(outer_div_job_id);
    forms_array.forEach(ele => {
        let id = ele[0];

        let outer_div = document.createElement('div');//bootstrap div
        outer_div.setAttribute('class', 'form-group'); // bootstrap class

        let label = document.createElement('label');
        label.innerHTML = ele[1].name;
        label.setAttribute('for', id);

        let input_field = document.createElement('input');
        input_field.setAttribute('name', ele[0]);
        input_field.setAttribute('type', ele[1].type);
        input_field.setAttribute('id', id);
        if (ele[1].required) {
            input_field.required = true;
        }
        else {
            input_field.required = false;
        }
        input_field.setAttribute('class', 'form-control'); //bootstrap class

        outer_div.appendChild(label);
        outer_div.appendChild(input_field);
        form_tag.appendChild(outer_div)
    })
    let submit_button = document.createElement('button');
    submit_button.innerHTML = 'Submit';
    submit_button.setAttribute('class', 'chcke-rate');

    form_tag.appendChild(submit_button);
}

$("form#data").submit(function (e) {
    e.preventDefault();
    // console.log(this)
    var formData = new FormData(this);
    // console.log(formData)

    $.ajax({
        url: "https://uat-pl-android-api.incred.com/v2/corporate/job/application/submit",
        type: 'POST',
        data: formData,
        success: function (data) {
            // alert(JSON.stringify(data));
            alert('YOU HAVE SUCESSFULLY SUMBITTED THE FORM');
            window.location.href='./index.html';
            // console.log(JSON.stringify(data));
        },
        error: function(error){
            document.querySelector('.error').innerHTML= "Error - "+ error.responseJSON.response.error.message
            console.log(error.responseJSON)

        },
        cache: false,
        contentType: false,
        processData: false
    });
});



