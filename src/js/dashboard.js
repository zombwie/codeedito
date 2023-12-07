// new project button
async function newproject() {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const response = await fetch('/api/newproject', options);
    const json = await response.json();
    console.log(json);
    let projectid = json.id;
    window.location.href = `/editor?id=${projectid}`;
}

// load project and display preview

async function loadproject() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const response = await fetch('/api/getprojects', options);
    const json = await response.json();
    console.log(json);

    // get projects info and display it
    let projects = json.projects;
    console.log(projects);

    projects.forEach(project => {
        // fetch project info
        let projectid = project.ProsjektId;
        loadprojectinfo(projectid);
    });

}
loadproject();

// laster inn prosjektet og viser det i dashboard
async function loadprojectinfo(projectid) {
    let projectlist = document.getElementById('projectlist');
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: projectid })
    };
    const response = await fetch('/api/loadproject', options);
    const json = await response.json();
    console.log(json);
    let pojecthtml = json.html;
    let projectcss = "<style>" + json.css + "</style>";
    let projectjs = "<script>" + json.js + "</script>";

    // create project preview
    let projectpreview = document.createElement('div');
    projectpreview.classList.add('prosjekt');
    // add iframe
    let projectiframe = document.createElement('iframe');
    projectpreview.id = projectid;
    projectiframe.id = projectid;
    projectiframe.srcdoc = pojecthtml + projectcss + projectjs;
    projectpreview.appendChild(projectiframe);
    // add buttons to project preview
    let projectbuttons = document.createElement('div');
    projectbuttons.classList.add('prosjektbuttons');
    // add edit button
    let editbutton = document.createElement('button');
    editbutton.classList.add('mainbtn');
    editbutton.innerHTML = 'Edit';
    editbutton.onclick = function () {
        window.location.href = `/editor?id=${projectid}`;
    }
    projectbuttons.appendChild(editbutton);
    // add delete button
    let deletebutton = document.createElement('button');
    deletebutton.classList.add('mainbtn');
    deletebutton.innerHTML = 'Delete';
    deletebutton.onclick = function () {
        deleteproject(projectid);
    }
    projectbuttons.appendChild(deletebutton);
    projectpreview.appendChild(projectbuttons);
    // add to projectlist
    projectlist.appendChild(projectpreview);
}

// delete project
async function deleteproject(projectid) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: projectid })
    };
    const response = await fetch('/api/deleteproject', options);
    const json = await response.json();
    console.log(json);
    window.location.href = '/dashboard';
}

// faq 

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.nextElementSibling;
  const icon = item.querySelector('i');

  item.addEventListener('click', () => {
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        const otherAnswer = otherItem.nextElementSibling;
        const otherIcon = otherItem.querySelector('i');

        otherAnswer.classList.remove('active');
        otherIcon.classList.remove('active');
        otherAnswer.style.maxHeight = "0";
      }
    });

    answer.classList.toggle('active');
    icon.classList.toggle('active');
    if (answer.classList.contains('active')) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = "0";
    }
  });
});