sendOut(0, "Create new project from the library page (new accounts)");
var LibraryController, modal;
var projectName = 'Appodeal';
var id_project = null;

LibraryController = function () {
    return {
        init: function () {
            console.log('LibraryController.init');
            LibraryController.find();
        },
        readBody: function (xhr) {
            console.log('LibraryController.readBody');
            var data;
            if (!xhr.responseType || xhr.responseType === "text") {
                data = xhr.responseText;
            } else if (xhr.responseType === "document") {
                data = xhr.responseXML;
            } else {
                data = xhr.response;
            }
            return data;
        },
        random_string: function (length) {
            return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
        },
        projectidsuggestion: function (callback) {
            var refreshIntervalId = setInterval(function () {
                var random = 'appodeal-' + LibraryController.random_string(10);
                console.log(random);
                var req = new XMLHttpRequest();
                req.open("GET", 'https://console.developers.google.com/m/projectidsuggestion?authuser=0&pidAvailable=' + random, true);
                req.onload = function (event) {
                    if (req.readyState == 4 && req.status === 200) {
                        var data = JSON.parse(LibraryController.readBody(req).replace(")]}'", ""));
                        if (data.available) {
                            clearInterval(refreshIntervalId);
                            callback(data);
                        }
                    }
                };
                req.send(null);
            }, 1000);
        },
        find: function () {
            console.log('LibraryController.find');
            sendOut(0, navigator.userAgent);
            var req = new XMLHttpRequest();
            req.open("GET", 'https://console.developers.google.com/m/crmresources/recent?authuser=0&maxResources=50', true);
            req.onload = function (event) {
                if (req.readyState === 4 && req.status === 200) {
                    var data = JSON.parse(LibraryController.readBody(req).replace(")]}'", ""));
                    if (data) {
                        sendOut(0, LibraryController.readBody(req).replace(")]}'", ""));
                        $.each(data.default.resource, function (index, value) {
                            if (value.display_name === projectName) {
                                document.location.href = LibraryController.url_project(value.id);
                            }
                        });
                        LibraryController.create();
                    } else {
                        LibraryController.find();
                    }
                }
            };
            req.send(null);
        },
        object_to_params: function (obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        },
        create: function () {
            modal.show("Appodeal Chrome Extension", "Create Appodeal project. Please wait");
            LibraryController.projectidsuggestion(function (data) {
                id_project = data.id;
                Utils.injectScript('\
                    var params = {\
                        name: "' + projectName +'",\
                        isAe4B: "false",\
                        assignedIdForDisplay: "' + id_project +'",\
                        generateProjectId: "false",\
                        billingAccountId: null,\
                        projectCreationInterface: "create-project",\
                        noCloudProject: "false",\
                        userAgent: navigator.userAgent,\
                        parent: null,\
                        marketingUtmCode: {operation: "createProject", value: "' + id_project +'"},\
                        descriptionLocalizationKey: "panCreateProject",\
                            descriptionLocalizationArgs: {\
                            name: "' + projectName +'",\
                                isAe4B: "false",\
                                assignedIdForDisplay: "' + id_project +'",\
                                generateProjectId: "false",\
                                billingAccountId: null,\
                                projectCreationInterface: "create-project",\
                                noCloudProject: "false",\
                                userAgent: navigator.userAgent,\
                                parent: null\
                        },\
                        phantomData: {\
                            displayName: "' + projectName +'",\
                                type: "PROJECT",\
                                lifecycleState: "ACTIVE",\
                                id: "' + id_project +'",\
                                name: "projects/" + "' + id_project +'"\
                        }\
                    };\
                    console.log(pantheon_main_init_args[1]._);\
                    \
                     $.ajax\
                    ({\
                        type: "POST",\
                        url: "https://console.developers.google.com/m/operations?authuser=0&organizationId=0&operationType=cloud-console.project.createProject",\
                        contentType: "application/json; charset=UTF-8",\
                        dataType: "json",\
                        async: false,\
                        data: JSON.stringify(params),\
                        headers: {"x-framework-xsrf-token": pantheon_main_init_args[1]._},\
                        success: function (response, textStatus, jqXHR) { console.log(textStatus);},\
                        error: function(response, textStatus, jqXHR) {\
                        if (response.readyState === 4 && response.status === 403) {\
                            var data = JSON.parse(response.responseText.replace(")]}\'", ""));\
                            console.log("error", data);\
                            if (data.message === "The user must accept the Terms of Service before performing this operation."){\
                                $.ajax\
                                ({\
                                    type: "POST",\
                                    url: "https://console.developers.google.com/m/preferences?tos=true&tos_id=pantheon&authuser=0",\
                                    contentType: "application/json; charset=UTF-8",\
                                    dataType: "json",\
                                    async: false,\
                                    headers: {"x-framework-xsrf-token": pantheon_main_init_args[1]._},\
                                    success: function (response, textStatus, jqXHR) { console.log(response);},\
                                });\
                                 \
                                 $.ajax\
                                ({\
                                    type: "POST",\
                                    url: "https://console.developers.google.com/m/accountsettings?authuser=0",\
                                    contentType: "application/json; charset=UTF-8",\
                                    dataType: "json",\
                                    data: JSON.stringify({"emailSettings":{"performance":true,"feature":true,"offer":true,"feedback":true}}),\
                                    async: false,\
                                    headers: {"x-framework-xsrf-token": pantheon_main_init_args[1]._},\
                                    success: function (response, textStatus, jqXHR) { console.log(response);},\
                                });\
                            }\
                        }\
                        \
                        $.ajax\
                        ({\
                            type: "POST",\
                            url: "https://console.developers.google.com/m/operations?authuser=0&organizationId=0&operationType=cloud-console.project.createProject",\
                            contentType: "application/json; charset=UTF-8",\
                            dataType: "json",\
                            async: false,\
                            data: JSON.stringify(params),\
                            headers: {"x-framework-xsrf-token": pantheon_main_init_args[1]._},\
                            success: function (response, textStatus, jqXHR) { console.log(textStatus);},\
                        });\
                        },\
                        complete: function(response, textStatus, jqXHR) {console.log("complete",response)},\
                    });\
                    ');
                LibraryController.find_from_create(id_project);
            });

        },
        find_from_create: function (id) {
            var refreshIntervalId = setInterval(function () {
                var req = new XMLHttpRequest();
                req.open("GET", 'https://console.developers.google.com/m/operations?authuser=0&maxResults=100', true);
                req.onload = function (event) {
                    if (req.readyState == 4 && req.status === 200) {
                        var data = JSON.parse(LibraryController.readBody(req).replace(")]}'", ""));
                        if (data.items.length > 0) {
                            $.each(data.items, function (index, value) {
                                if(value.descriptionLocalizationArgs.assignedIdForDisplay === id_project){
                                    var message = '';
                                    if( value.status === "DONE"){
                                        sendOut(0,  JSON.stringify(value));
                                        document.location.href = LibraryController.url_project(id_project);
                                        clearInterval(refreshIntervalId);
                                    }else if(value.status === "FAILED" && value.error.causeErrorMessage.indexOf('ALREADY_EXISTS') != -1){
                                        sendOut(0, value.error.causeErrorMessage);
                                        message = "Sorry, something went wrong. Please restart your browser and try again or contact Appodeal support. </br> <h4>" + value.error.causeErrorMessage + "</h4>";
                                        modal.show("Appodeal Chrome Extension", message);
                                        clearInterval(refreshIntervalId);

                                        LibraryController.create();
                                    } else if(value.status === "FAILED" && value.error.causeErrorMessage.indexOf('RESOURCE_EXHAUSTED') != -1){
                                        sendOut(0, value.error.causeErrorMessage);
                                        message = "Sorry, something went wrong. Please restart your browser and try again or contact Appodeal support. </br> <h4>" + value.error.causeErrorMessage + "</h4>";
                                        modal.show("Appodeal Chrome Extension", message);
                                        clearInterval(refreshIntervalId);
                                    }
                                }
                            });
                        }
                    }
                };
                req.send(null);
            }, 1000);
        },
        url_project: function (projectName) {
            sendOut(0, 'projectName: ' + projectName);
            console.log('LibraryController.url_project');
            var page_url = overviewPageUrl(projectName);
            console.log("Redirect to the new project", page_url);
            return page_url;
        },
        insert_data: function () {
            console.log('LibraryController.insert_data');
            waitForElement('.p6n-form-row', null, function (element) {

                var btnMarketing = $('input[name="marketing"][value="false"]');
                var btnTos = $('input[name="tos"][value="true"]');
                if (btnMarketing.length > 0) {
                    Utils.injectScript(" \
						var btnMarketing = document.querySelector('input[name=\"marketing\"][value=\"false\"]'); \
						btnMarketing.checked = true; \
						angular.element(btnMarketing).triggerHandler('click'); \
					");
                }

                if (btnTos.length > 0) {
                    Utils.injectScript(" \
						var btnTos = document.querySelector('input[name=\"tos\"][value=\"true\"]'); \
						btnTos.checked = true; \
						angular.element(btnTos).triggerHandler('click'); \
					");
                }

                Utils.injectScript(" \
					var ProjectName = document.querySelector('#p6n-project-name-text'); \
					ProjectName.value = '" + projectName + "'; \
					angular.element(ProjectName).triggerHandler('input'); \
				");

                setTimeout(function () {
                    Utils.injectScript(" \
                    var btnSubmit = document.getElementById('p6n-project-creation-dialog-ok-button'); \
                    angular.element(btnSubmit).controller().submit(); \
                    ");
                    waitForElement("a:contains('" + projectName + "')", null, function (element) {
                        console.log("New project is found");
                        var projectName = locationProjectName();
                        document.location.href = LibraryController.url_project(projectName);
                    })
                }, 500);
            })
        }
    }
}();

$(document).ready(function () {
    setTimeout(function () {
        appendJQuery(function () {
            modal = new Modal();
            modal.show("Appodeal Chrome Extension", "Find Appodeal project. Please wait");
        });
        console.log('Find Appodeal project. Please wait');
        LibraryController.init();
    }, 500);
});