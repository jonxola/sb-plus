function getInstructors() {
    // select professor elements
    const containers = document.querySelectorAll('.panel-body > .table-responsive td:nth-of-type(4)');
    // extract unique names
    const names = [];
    containers.forEach(container => {
        const name = container.innerText.trim();
        if (!names.includes(name) && name !== 'None listed.') {
            names.push(name);
        }
    });
    return names;
}

function getCourseInfo() {
    // expected course page url path: /explore/[TERM]/[SUBJECT]/[NUMBER]/
    const { pathname } = window.location;
    const paths = pathname.substring(1, pathname.length - 1).split('/');

    return {
        subject: paths[2],
        number: paths[3],
        instructors: getInstructors()
    };
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (message === 'course-info') {
        info = getCourseInfo();
        respond(info);
    }
});