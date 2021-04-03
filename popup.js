const linkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
const rmpLogo = '<img class="dot-img" src="icons/ratemyprofessors.png" alt="rmp logo">';

document.querySelector('.close').onclick = () => window.close();

function createInstructor(name) {
    const instructor = document.createElement('a');
    instructor.classList.add('block');
    instructor.href = `https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(name)}`;
    instructor.target = '_blank';
    instructor.textContent = name;
    instructor.insertAdjacentHTML('afterbegin', rmpLogo);
    instructor.insertAdjacentHTML('beforeend', linkIcon);
    return instructor;
}

function showInfo(info) {
    document.querySelector('.course__name').innerText = `${info.subject} ${info.number}`;
    document.querySelector('.course__gopher-grades').href = `https://gophergrades.com/?c=Courses&q=${info.subject + info.number}`;
    document.querySelector('.course__subreddit').href = `https://www.reddit.com/r/uofmn/search?q=${info.subject}%20${info.number}&restrict_sr=1`;

    const instructors = document.querySelector('.course__instructors');
    for (const name of info.instructors) {
        const instructor = createInstructor(name);
        instructors.appendChild(instructor);
    }
}

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    // check if we're on a schedule builder course page: /explore/[TERM]/[SUBJECT]/[NUMBER]/
    const courseUrl = /https:\/\/schedulebuilder.umn.edu\/explore\/\w+\/\w+\/\w+/;
    if (courseUrl.test(tab.url)) {
        document.querySelector('.course').classList.remove('hidden');
        // inject a script and ask for course info
        chrome.scripting.executeScript(
            { target: { tabId: tab.id }, files: ['script.js']},
            () => chrome.tabs.sendMessage(tab.id, 'course-info', showInfo)
        );
    } else {
        document.querySelector('.no-course').classList.remove('hidden');
    }
});