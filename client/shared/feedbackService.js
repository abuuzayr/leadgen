(function() {
    'use strict';


    app.service('feedbackServices', feedbackServices);

    feedbackServices.$inject = ['$q', '$timeout'];

    function feedbackServices($q, $timeout) {

        this.errorFeedback = function(errData, domElementId) {
            var errMsg = '';
            if ((typeof errData) === 'string') {
                errMsg = errData;
            } else {
                errMsg = errData ? errData.description : "Connection error with server";
            }
            var feedback = {
                message: errMsg,
                timeout: 5000
            }

            var snackbarContainer = document.querySelector(domElementId);
            console.log(snackbarContainer);
            snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
            return $q.defer().promise;
        }

        this.successFeedback = function(msg, domElementId, timeout) {
            var feedback = {
                message: msg,
                timeout: timeout ? timeout : 5000
            }

            var snackbarContainer = document.querySelector(domElementId);
            console.log(snackbarContainer);

            snackbarContainer.MaterialSnackbar.showSnackbar(feedback);
            return $q.defer().promise;
        }

        this.hideFeedback = function(domElementId) {
            var snackbarContainer = document.querySelector(domElementId);
            snackbarContainer.classList.remove("mdl-snackbar--active");
            if (snackbarContainer.MaterialSnackbar) {
                snackbarContainer.MaterialSnackbar.active = false;
            }
            return $q.defer().promise;
        }
    }
}());